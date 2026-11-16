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
import { SearchBox, FilterTabs, Pager } from '@/app/components/admin/ListControls';
import { formatDate, formatNumber } from '@/app/lib/utils';
import api from '@/app/api/api';

const PAGE_SIZE = 15;

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function AdminAffiliatesClient() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null); // affiliate shown in the details modal
  const [rejecting, setRejecting] = useState(null); // affiliate being rejected
  const [reason, setReason] = useState('');


  // Any filter change starts again from page 1
  const changeStatusFilter = (v) => { setStatus(v); setPage(1); };
  const changeSearch = useCallback((v) => { setSearch(v); setPage(1); }, []);

  const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);

  const list = useQuery({
    queryKey: ['admin-affiliates', status, search, page],
    queryFn: () => api.get(`/admin/affiliates?${params}`),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (list.error) toast.error(list.error?.message || 'Failed to load affiliates');
  }, [list.error]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-affiliates'] });
    queryClient.invalidateQueries({ queryKey: ['admin-pending-affiliates'] });
    queryClient.invalidateQueries({ queryKey: ['admin-totals'] });
  };

  const decide = useMutation({
    mutationFn: ({ id, action, reason }) =>
      api.patch(`/admin/affiliates/${id}/${action}`, action === 'reject' ? { reason } : {}),
    onSuccess: (res) => {
      toast.success(res?.message || 'Updated');
      setSelected(null);
      setRejecting(null);
      setReason('');
      refresh();
    },
    onError: (err) => toast.error(err?.message || 'Action failed'),
  });

  const busyId = decide.isPending ? decide.variables?.id : null;

  const actionsFor = (a) => (
    <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
      {a.status !== 'approved' && (
        <Button
          size="sm"
          loading={busyId === a.id && decide.variables?.action === 'approve'}
          disabled={busyId === a.id}
          onClick={() => decide.mutate({ id: a.id, action: 'approve' })}
        >
          Approve
        </Button>
      )}
      {a.status !== 'rejected' && (
        <Button
          size="sm"
          variant="outline"
          disabled={busyId === a.id}
          onClick={() => {
            setReason('');
            setRejecting(a);
          }}
        >
          Reject
        </Button>
      )}
    </div>
  );

  const columns = [
    {
      key: 'name',
      header: 'Affiliate',
      render: (a) => (
        <div className="min-w-0">
          <div className="font-medium text-foreground truncate">{a.name}</div>
          <div className="text-xs text-muted-foreground truncate">{a.email}</div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (a) => a.phone || '—' },
    { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
    {
      key: 'credits',
      header: 'Credits',
      render: (a) => (
        <span className="text-xs text-muted-foreground">
          {formatNumber(a.availableCredits ?? 0)} available · {formatNumber(a.escrowCredits ?? 0)} escrow
        </span>
      ),
    },
    { key: 'createdAt', header: 'Joined', render: (a) => formatDate(a.createdAt) },
    { key: 'actions', header: '', className: 'text-right', render: actionsFor },
  ];

  const rows = list.data?.data || [];

  return (
    <div>
      <PageHeader title="Affiliates" description="Review, approve and manage affiliate partners." />

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:px-5 border-b border-border">
          <FilterTabs options={STATUS_FILTERS} value={status} onChange={changeStatusFilter} />
          <SearchBox placeholder="Search name or email" onSearch={changeSearch} />
        </div>

        {list.isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            emptyMessage={search || status ? 'No affiliates match these filters.' : 'No affiliates yet.'}
            onRowClick={setSelected}
          />
        )}
        <Pager pagination={list.data?.pagination} onPage={setPage} />
      </Card>

      {/* ── Details ─────────────────────────────────────────── */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="space-y-4">
            <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-foreground break-all">{selected.email}</dd>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="text-foreground">{selected.phone || '—'}</dd>
              <dt className="text-muted-foreground">Address</dt>
              <dd className="text-foreground">{selected.address || '—'}</dd>
              <dt className="text-muted-foreground">Status</dt>
              <dd><StatusBadge status={selected.status} /></dd>
              {selected.rejectionReason && (
                <>
                  <dt className="text-muted-foreground">Rejection reason</dt>
                  <dd className="text-foreground">{selected.rejectionReason}</dd>
                </>
              )}
              <dt className="text-muted-foreground">Credits</dt>
              <dd className="text-foreground">
                {formatNumber(selected.availableCredits ?? 0)} available · {formatNumber(selected.escrowCredits ?? 0)} escrow
              </dd>
              <dt className="text-muted-foreground">Joined</dt>
              <dd className="text-foreground">{formatDate(selected.createdAt)}</dd>
              <dt className="text-muted-foreground">Last login</dt>
              <dd className="text-foreground">{selected.lastLoginAt ? formatDate(selected.lastLoginAt) : 'Never'}</dd>
            </dl>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>Close</Button>
              {actionsFor(selected)}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Reject with reason ──────────────────────────────── */}
      <Modal open={!!rejecting} onClose={() => setRejecting(null)} title={`Reject ${rejecting?.name ?? ''}`}>
        <div className="space-y-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">Reason (optional, shown to the affiliate)</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setRejecting(null)}>Cancel</Button>
            <Button
              size="sm"
              variant="destructive"
              loading={decide.isPending}
              onClick={() => decide.mutate({ id: rejecting.id, action: 'reject', reason: reason.trim() || undefined })}
            >
              Reject affiliate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
