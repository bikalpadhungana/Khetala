'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import PageHeader from '@/app/components/common/PageHeader';
import Card from '@/app/components/common/Card';
import Button from '@/app/components/common/Button';
import DataTable from '@/app/components/common/DataTable';
import StatusBadge from '@/app/components/common/StatusBadge';
import Modal from '@/app/components/common/Modal';
import Select from '@/app/components/common/Select';
import { SearchBox, FilterTabs, Pager } from '@/app/components/admin/ListControls';
import { formatDate, formatNumber } from '@/app/lib/utils';
import api from '@/app/api/api';

const PAGE_SIZE = 15;

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'converted', label: 'Converted' },
  { value: 'rejected', label: 'Rejected' },
];

// Mirrors REFERRAL_TRANSITIONS in backend/src/config/enums.js.
// 'assigned' is reached through the Assign action (it needs a business), not a plain status change.
const NEXT_STATUSES = {
  pending: ['rejected'],
  assigned: ['contacted', 'rejected'],
  contacted: ['converted', 'rejected'],
  converted: [],
  rejected: [],
};
const STATUS_ACTION_LABEL = {
  contacted: 'Mark contacted',
  converted: 'Mark converted',
  rejected: 'Reject',
};
const canAssign = (lead) => lead.status === 'pending' || lead.status === 'assigned';

export default function AdminLeadsClient() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [businessId, setBusinessId] = useState('');
  const [statusChange, setStatusChange] = useState(null); // { lead, status }
  const [note, setNote] = useState('');


  // Any filter change starts again from page 1
  const changeStatusFilter = (v) => { setStatus(v); setPage(1); };
  const changeSearch = useCallback((v) => { setSearch(v); setPage(1); }, []);

  const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);

  const list = useQuery({
    queryKey: ['admin-leads', status, search, page],
    queryFn: () => api.get(`/admin/referrals?${params}`),
    placeholderData: keepPreviousData,
  });

  const businesses = useQuery({
    queryKey: ['admin-active-businesses'],
    queryFn: () => api.get('/admin/businesses?isActive=true&limit=100'),
    enabled: !!assigning,
  });

  useEffect(() => {
    if (list.error) toast.error(list.error?.message || 'Failed to load leads');
  }, [list.error]);

  const afterChange = (res) => {
    toast.success(res?.message || 'Updated');
    setSelected(null);
    setAssigning(null);
    setStatusChange(null);
    setNote('');
    queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    queryClient.invalidateQueries({ queryKey: ['admin-totals'] });
  };
  const onError = (err) => toast.error(err?.message || 'Action failed');

  const assign = useMutation({
    mutationFn: ({ id, businessId, note }) =>
      api.patch(`/admin/referrals/${id}/assign`, { businessId, ...(note ? { note } : {}) }),
    onSuccess: afterChange,
    onError,
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, status, note }) =>
      api.patch(`/admin/referrals/${id}/status`, { status, ...(note ? { note } : {}) }),
    onSuccess: afterChange,
    onError,
  });

  const openAssign = (lead) => {
    setNote('');
    setBusinessId(lead.assignedTo?.id || '');
    setAssigning(lead);
  };
  const openStatusChange = (lead, next) => {
    setNote('');
    setStatusChange({ lead, status: next });
  };

  const actionsFor = (lead) => (
    <div className="flex gap-2 justify-end flex-wrap" onClick={(e) => e.stopPropagation()}>
      {canAssign(lead) && (
        <Button size="sm" onClick={() => openAssign(lead)}>
          {lead.status === 'assigned' ? 'Reassign' : 'Assign'}
        </Button>
      )}
      {NEXT_STATUSES[lead.status]?.map((next) => (
        <Button
          key={next}
          size="sm"
          variant={next === 'rejected' ? 'outline' : 'secondary'}
          onClick={() => openStatusChange(lead, next)}
        >
          {STATUS_ACTION_LABEL[next]}
        </Button>
      ))}
    </div>
  );

  const columns = [
    {
      key: 'name',
      header: 'Lead',
      render: (l) => (
        <div className="min-w-0">
          <div className="font-medium text-foreground truncate">{l.name}</div>
          <div className="text-xs text-muted-foreground truncate">{l.phone}{l.email ? ` · ${l.email}` : ''}</div>
        </div>
      ),
    },
    { key: 'sector', header: 'Sector', render: (l) => l.sector?.name || '—' },
    { key: 'submittedBy', header: 'Referred by', render: (l) => l.submittedBy?.name || '—' },
    { key: 'assignedTo', header: 'Business', render: (l) => l.assignedTo?.name || <span className="text-muted-foreground">Unassigned</span> },
    { key: 'status', header: 'Status', render: (l) => <StatusBadge status={l.status} /> },
    { key: 'createdAt', header: 'Submitted', render: (l) => formatDate(l.createdAt) },
    { key: 'actions', header: '', className: 'text-right', render: actionsFor },
  ];

  const rows = list.data?.data || [];
  const businessOptions = (businesses.data?.data || []).map((b) => ({ value: b.id, label: b.name }));

  return (
    <div>
      <PageHeader title="Leads" description="Every lead referred by affiliates. Assign them to businesses and track progress." />

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:px-5 border-b border-border">
          <FilterTabs options={STATUS_FILTERS} value={status} onChange={changeStatusFilter} />
          <SearchBox placeholder="Search lead, affiliate or sector" onSearch={changeSearch} />
        </div>

        {list.isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            emptyMessage={search || status ? 'No leads match these filters.' : 'No leads have been submitted yet.'}
            onRowClick={setSelected}
          />
        )}
        <Pager pagination={list.data?.pagination} onPage={setPage} />
      </Card>

      {/* ── Details ─────────────────────────────────────────── */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name} className="max-w-lg">
        {selected && (
          <div className="space-y-4">
            <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Status</dt>
              <dd><StatusBadge status={selected.status} /></dd>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="text-foreground">{selected.phone}</dd>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-foreground break-all">{selected.email || '—'}</dd>
              <dt className="text-muted-foreground">Address</dt>
              <dd className="text-foreground">{selected.address || '—'}</dd>
              <dt className="text-muted-foreground">Sector</dt>
              <dd className="text-foreground">{selected.sector?.name || '—'}</dd>
              <dt className="text-muted-foreground">Referred by</dt>
              <dd className="text-foreground">
                {selected.submittedBy?.name || '—'}
                {selected.submittedBy?.email && (
                  <span className="block text-xs text-muted-foreground break-all">{selected.submittedBy.email}</span>
                )}
              </dd>
              <dt className="text-muted-foreground">Business</dt>
              <dd className="text-foreground">{selected.assignedTo?.name || 'Unassigned'}</dd>
              <dt className="text-muted-foreground">Credits</dt>
              <dd className="text-foreground">{formatNumber(selected.totalCredits ?? 0)} ({selected.creditStatus})</dd>
              <dt className="text-muted-foreground">Submitted</dt>
              <dd className="text-foreground">{formatDate(selected.createdAt)}</dd>
            </dl>
            {selected.description && (
              <div className="text-sm">
                <div className="text-muted-foreground mb-1">Description</div>
                <p className="text-foreground whitespace-pre-wrap">{selected.description}</p>
              </div>
            )}
            {selected.adminNotes && (
              <div className="text-sm">
                <div className="text-muted-foreground mb-1">Admin notes</div>
                <p className="text-foreground whitespace-pre-wrap">{selected.adminNotes}</p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2 border-t border-border flex-wrap">
              <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>Close</Button>
              {actionsFor(selected)}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Assign to business ──────────────────────────────── */}
      <Modal open={!!assigning} onClose={() => setAssigning(null)} title={`Assign ${assigning?.name ?? ''}`}>
        <div className="space-y-4">
          {businesses.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading businesses…</p>
          ) : businessOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              There are no active businesses yet. Add a business before assigning leads.
            </p>
          ) : (
            <Select
              label="Business"
              placeholder="Choose a business"
              options={businessOptions}
              value={businessId}
              onChange={(e) => setBusinessId(e.target.value)}
            />
          )}
          <NoteField value={note} onChange={setNote} />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setAssigning(null)}>Cancel</Button>
            <Button
              size="sm"
              disabled={!businessId}
              loading={assign.isPending}
              onClick={() => assign.mutate({ id: assigning.id, businessId, note: note.trim() })}
            >
              Assign lead
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Status change ───────────────────────────────────── */}
      <Modal
        open={!!statusChange}
        onClose={() => setStatusChange(null)}
        title={statusChange ? `${STATUS_ACTION_LABEL[statusChange.status]}: ${statusChange.lead.name}` : ''}
      >
        {statusChange && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {statusChange.status === 'converted'
                ? "This marks the deal as won and releases the affiliate's commission. It can't be undone."
                : statusChange.status === 'rejected'
                  ? "This closes the lead and cancels the affiliate's pending commission. It can't be undone."
                  : 'The affiliate will be notified of the new status.'}
            </p>
            <NoteField value={note} onChange={setNote} />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setStatusChange(null)}>Cancel</Button>
              <Button
                size="sm"
                variant={statusChange.status === 'rejected' ? 'destructive' : 'primary'}
                loading={changeStatus.isPending}
                onClick={() =>
                  changeStatus.mutate({ id: statusChange.lead.id, status: statusChange.status, note: note.trim() })
                }
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function NoteField({ value, onChange }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">Note (optional)</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        maxLength={500}
        className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />
    </label>
  );
}
