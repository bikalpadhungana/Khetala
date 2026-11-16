'use client';

import { useState } from 'react';
import { LuBell, LuCheck, LuDollarSign, LuFileText, LuInfo, LuTriangleAlert } from 'react-icons/lu';
import PageHeader from '@/app/components/common/PageHeader';
import Button from '@/app/components/common/Button';
import Card, { CardContent } from '@/app/components/common/Card';
import { timeAgo } from '@/app/lib/utils';
import { cn } from '@/app/lib/utils';
import api from '@/app/api/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Skeleton from '@/app/components/common/Skeleton';

const iconMap = {
  commission: { icon: LuDollarSign, color: 'text-success bg-success-light' },
  lead: { icon: LuFileText, color: 'text-info bg-info-light' },
  system: { icon: LuInfo, color: 'text-warning bg-warning-light' },

  // DB NotificationType mapping
  success: { icon: LuCheck, color: 'text-success bg-success-light' },
  error: { icon: LuTriangleAlert, color: 'text-destructive bg-destructive-light bg-red-500/10' },
  warning: { icon: LuTriangleAlert, color: 'text-warning bg-warning-light' },
  info: { icon: LuInfo, color: 'text-info bg-info-light' },
};

export default function NotificationsClient() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications'),
    onError: () => toast.error('Failed to load notifications'),
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications-unread-count']);
    },
    onError: () => toast.error('Failed to mark notification as read'),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications-unread-count']);
      toast.success('All notifications marked as read');
    },
    onError: () => toast.error('Failed to mark all as read'),
  });

  const rawNotifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  const notifications = rawNotifications.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    read: n.isRead,
    date: n.createdAt,
  }));

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const handleMarkRead = (id) => {
    markReadMutation.mutate(id);
  };

  const getFilterType = (itemType) => {
    if (itemType === 'success') return 'commission';
    if (itemType === 'info') return 'lead';
    return 'system';
  };

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => getFilterType(n.type) === filter);

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Notifications"
        description={`You have ${unreadCount} unread messages.`}
        actions={
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <LuCheck className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        }
      />

      <Card>
        <div className="p-4 border-b border-border flex gap-2 overflow-x-auto hide-scrollbar">
          {['all', 'lead', 'commission', 'system'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize whitespace-nowrap',
                filter === f
                  ? 'bg-accent text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <CardContent className="p-0 divide-y divide-border">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-14 w-full" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <LuBell className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p>No notifications found.</p>
            </div>
          ) : (
            filtered.map((notification) => {
              const { icon: Icon, color } = iconMap[notification.type] || iconMap.system;

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'p-5 flex gap-4 transition-colors cursor-pointer',
                    !notification.read ? 'bg-accent/5' : 'hover:bg-secondary/30'
                  )}
                  onClick={() => !notification.read && handleMarkRead(notification.id)}
                >
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1', color)}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h4 className={cn('text-sm', !notification.read ? 'font-bold text-foreground' : 'font-medium text-foreground')}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {timeAgo(notification.date)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notification.message}
                    </p>
                  </div>

                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
