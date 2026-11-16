'use client';

import { useEffect } from 'react';
import { LuUsers, LuUserCheck, LuFileText, LuBriefcase } from 'react-icons/lu';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import PageHeader from '@/app/components/common/PageHeader';
import KpiCard from '@/app/components/common/KpiCard';
import Button from '@/app/components/common/Button';
import Card, { CardHeader } from '@/app/components/common/Card';
import { useAuth } from '@/app/contexts/AuthContext';
import { timeAgo } from '@/app/lib/utils';
import api from '@/app/api/api';

// Paginated admin endpoints return { data: [...], pagination: { total } }.
// limit=1 is enough when only the total is needed.
const fetchTotal = (url) => api.get(url).then((res) => res?.pagination?.total ?? 0);

export default function AdminDashboardClient() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const totals = useQuery({
    queryKey: ['admin-totals'],
    queryFn: async () => {
      const [affiliates, referrals, businesses] = await Promise.all([
        fetchTotal('/admin/affiliates?limit=1'),
        fetchTotal('/admin/referrals?limit=1'),
        fetchTotal('/admin/businesses?limit=1'),
      ]);
      return { affiliates, referrals, businesses };
    },
  });

  const pending = useQuery({
    queryKey: ['admin-pending-affiliates'],
    queryFn: () => api.get('/admin/affiliates?status=pending&limit=20'),
  });

  useEffect(() => {
    if (totals.error || pending.error) toast.error('Failed to load dashboard data');
  }, [totals.error, pending.error]);

  const decide = useMutation({
    mutationFn: ({ id, action }) => api.patch(`/admin/affiliates/${id}/${action}`, {}),
    onSuccess: (res) => {
      toast.success(res?.message || 'Updated');
      queryClient.invalidateQueries({ queryKey: ['admin-pending-affiliates'] });
      queryClient.invalidateQueries({ queryKey: ['admin-totals'] });
    },
    onError: (err) => toast.error(err?.message || 'Action failed'),
  });

  const pendingList = pending.data?.data || [];
  const pendingTotal = pending.data?.pagination?.total ?? pendingList.length;

  return (
    <div>
      <PageHeader
        title={`Welcome back${user?.name ? `, ${user.name}` : ''}`}
        description="Platform overview and affiliates waiting for approval."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard title="Pending approvals" value={pendingTotal} icon={LuUserCheck} isLoading={pending.isLoading} />
        <KpiCard title="Affiliates" value={totals.data?.affiliates ?? 0} icon={LuUsers} isLoading={totals.isLoading} />
        <KpiCard title="Referrals" value={totals.data?.referrals ?? 0} icon={LuFileText} isLoading={totals.isLoading} />
        <KpiCard title="Businesses" value={totals.data?.businesses ?? 0} icon={LuBriefcase} isLoading={totals.isLoading} />
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-foreground">Pending affiliate approvals</h2>
        </CardHeader>
        <div>
          {pending.isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading…</div>
          ) : pendingList.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No affiliates are waiting for approval.</div>
          ) : (
            <ul className="divide-y divide-border">
              {pendingList.map((a) => {
                const busy = decide.isPending && decide.variables?.id === a.id;
                return (
                  <li key={a.id} className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{a.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {a.email}{a.phone ? ` · ${a.phone}` : ''} · applied {timeAgo(a.createdAt)}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        loading={busy && decide.variables?.action === 'approve'}
                        disabled={busy}
                        onClick={() => decide.mutate({ id: a.id, action: 'approve' })}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        loading={busy && decide.variables?.action === 'reject'}
                        disabled={busy}
                        onClick={() => decide.mutate({ id: a.id, action: 'reject' })}
                      >
                        Reject
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
