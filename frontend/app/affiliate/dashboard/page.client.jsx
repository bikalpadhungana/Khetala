'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LuPlus, LuFileText, LuDollarSign, LuClock } from 'react-icons/lu';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/app/components/common/PageHeader';
import Button from '@/app/components/common/Button';
import KpiCard from '@/app/components/common/KpiCard';
import DataTable from '@/app/components/common/DataTable';
import StatusBadge from '@/app/components/common/StatusBadge';
import Card, { CardHeader, CardTitle, CardContent } from '@/app/components/common/Card';
import Skeleton from '@/app/components/common/Skeleton';
import { formatNPR, timeAgo } from '@/app/lib/utils';
import api from '@/app/api/api';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function DashboardClient() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: referralsData, isLoading: isLoadingReferrals, error: referralsError } = useQuery({
    queryKey: ['affiliate-referrals'],
    queryFn: () => api.get('/affiliate/referrals'),
  });

  const { data: creditsData, isLoading: isLoadingCredits, error: creditsError } = useQuery({
    queryKey: ['affiliate-credits'],
    queryFn: () => api.get('/affiliate/credits'),
  });

  // TanStack Query v5: onError was removed — useEffect is the correct replacement
  useEffect(() => {
    if (referralsError) toast.error('Failed to load recent leads');
  }, [referralsError]);

  useEffect(() => {
    if (creditsError) toast.error('Failed to load wallet summary');
  }, [creditsError]);

  const recentLeads = referralsData?.data?.referrals?.slice(0, 5) || [];
  const wallet      = creditsData?.data?.wallet || {};
  const walletStats = creditsData?.data?.stats  || {};

  const columns = [
    {
      key: 'id',
      header: 'Lead ID',
      className: 'font-mono text-muted-foreground',
      render: (row) => row.id.substring(0, 8),
    },
    {
      key: 'client',
      header: 'Client Details',
      render: (lead) => (
        <div>
          <div className="font-medium text-foreground">{lead.name}</div>
          <div className="text-xs text-muted-foreground">{lead.email}</div>
        </div>
      ),
    },
    { key: 'sectorLabel', header: 'Sector',    render: (lead) => lead.sector?.name || 'Unknown' },
    { key: 'status',      header: 'Status',    render: (lead) => <StatusBadge status={lead.status} /> },
    {
      key: 'created_at',
      header: 'Submitted',
      render: (lead) => <span className="text-muted-foreground">{timeAgo(lead.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Partner'} 👋`}
        description="Here's what's happening with your leads today."
        actions={
          <Button onClick={() => router.push('/affiliate/submit-lead')}>
            <LuPlus className="w-4 h-4 mr-2" />
            Submit New Lead
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KpiCard
          title="Total Leads Submitted"
          value={isLoadingReferrals ? '-' : (referralsData?.data?.stats?.total || 0)}
          trend="neutral" icon={LuFileText} iconColor="text-blue-500"
          isLoading={isLoadingReferrals}
        />
        <KpiCard
          title="Converted Leads"
          value={isLoadingReferrals ? '-' : (referralsData?.data?.stats?.converted || 0)}
          trend="up" icon={LuPlus} iconColor="text-success"
          isLoading={isLoadingReferrals}
        />
        <KpiCard
          title="Pending Commission"
          value={isLoadingCredits ? '-' : formatNPR(wallet.pending_balance || 0)}
          change={`${walletStats.pendingTransactionsCount || 0} pending`}
          trend="neutral" icon={LuClock} iconColor="text-warning"
          isLoading={isLoadingCredits}
        />
        <KpiCard
          title="Total Earnings"
          value={isLoadingCredits ? '-' : formatNPR(wallet.total_earned || 0)}
          trend="up" icon={LuDollarSign} iconColor="text-accent"
          isLoading={isLoadingCredits}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 py-4">
          <CardTitle>Recent Leads</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => router.push('/affiliate/my-leads')}>
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingReferrals ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : recentLeads.length > 0 ? (
            <DataTable
              columns={columns}
              data={recentLeads}
              onRowClick={(lead) => router.push(`/affiliate/my-leads/${lead.id}`)}
            />
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>No leads submitted yet. Start referring to earn commissions!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}