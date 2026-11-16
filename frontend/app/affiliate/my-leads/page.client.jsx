'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { LuPlus, LuSearch } from 'react-icons/lu';
import PageHeader from '@/app/components/common/PageHeader';
import Button from '@/app/components/common/Button';
import DataTable from '@/app/components/common/DataTable';
import StatusBadge from '@/app/components/common/StatusBadge';
import Input from '@/app/components/common/Input';
import Card, { CardContent } from '@/app/components/common/Card';
import Skeleton from '@/app/components/common/Skeleton';
import { formatNPR, formatDate } from '@/app/lib/utils';
import { LEAD_STATUSES } from '@/app/lib/constants';
import api from '@/app/api/api';
import { toast } from 'react-hot-toast';

export default function MyLeadsClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data, isLoading, error } = useQuery({
    queryKey: ['affiliate-referrals'],
    queryFn: () => api.get('/affiliate/referrals'),
    // onError removed — TanStack Query v5 dropped this option
  });

  useEffect(() => {
    if (error) toast.error('Failed to load leads');
  }, [error]);

  const leads = data?.data?.referrals || [];

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.name         || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.id           || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.sector?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ||
      lead.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'id',
      header: 'Lead ID',
      className: 'font-mono text-muted-foreground',
      render: (row) => row.id.substring(0, 8),
    },
    {
      key: 'client',
      header: 'Client',
      render: (lead) => (
        <div>
          <div className="font-medium text-foreground">{lead.name}</div>
          <div className="text-xs text-muted-foreground">{lead.email || lead.phone}</div>
        </div>
      ),
    },
    { key: 'service_category', header: 'Sector',  render: (lead) => lead.sector?.name || 'N/A' },
    { key: 'status',           header: 'Status',  render: (lead) => <StatusBadge status={lead.status} /> },
    { key: 'credits',          header: 'Credits', render: (lead) => lead.totalCredits ? formatNPR(lead.totalCredits) : '-' },
    {
      key: 'created_at',
      header: 'Submitted',
      render: (lead) => <span className="text-muted-foreground">{formatDate(lead.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Leads"
        description="Track the status and progress of all leads you've submitted."
        actions={
          <Button onClick={() => router.push('/affiliate/submit-lead')}>
            <LuPlus className="w-4 h-4 mr-2" />
            Submit New Lead
          </Button>
        }
      />

      <Card>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto min-w-0">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar scroll-fade-right pr-4">
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  statusFilter === 'All'
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                All Leads
              </button>
              {LEAD_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    statusFilter === status
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 sm:h-9"
            />
            <LuSearch className="absolute left-3 top-3 sm:top-2.5 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredLeads}
              onRowClick={(lead) => router.push(`/affiliate/my-leads/${lead.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}