'use client';

import { useState, useEffect } from 'react';
import { LuHeadphones, LuMail, LuPhone, LuMessageSquare, LuChevronDown, LuClock, LuCheck, LuLoader, LuX, LuArrowRight } from 'react-icons/lu';
import PageHeader from '@/app/components/common/PageHeader';
import Button from '@/app/components/common/Button';
import Input from '@/app/components/common/Input';
import Select from '@/app/components/common/Select';
import Card, { CardHeader, CardTitle, CardContent } from '@/app/components/common/Card';
import { mockFaq } from '@/app/lib/mockData';
import { cn } from '@/app/lib/utils';
import toast from 'react-hot-toast';
import api from '@/app/api/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/* ── Status helpers ────────────────────────────────────────────── */

const statusConfig = {
  open: { label: 'Open', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: LuClock },
  in_progress: { label: 'In Progress', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', icon: LuLoader },
  resolved: { label: 'Resolved', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: LuCheck },
  closed: { label: 'Closed', color: 'bg-red-500/15 text-red-400 border-red-500/30', icon: LuX },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.open;
  const Icon = config.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', config.color)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

const categoryLabels = {
  lead: 'Lead Status',
  commission: 'Commission / Payout',
  account: 'Account Settings',
  bug: 'Platform Bug',
  other: 'Other',
};

/* ── Parse admin replies from adminNotes field ─────────────────── */

function parseAdminReplies(adminNotes) {
  if (!adminNotes) return [];
  const regex = /\[ADMIN_REPLY\]\[([^\]]+)\]\s*([\s\S]*?)(?=\n\n\[ADMIN_REPLY\]|$)/g;
  const replies = [];
  let match;
  while ((match = regex.exec(adminNotes)) !== null) {
    replies.push({
      timestamp: match[1],
      message: match[2].trim(),
    });
  }
  return replies;
}

export default function SupportClient() {
  const [openFaq, setOpenFaq] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState(null);

  const queryClient = useQueryClient();

  /* ── Fetch my tickets ──────────────────────────────────────── */

  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['myTickets'],
    queryFn: () => api.get('/support/tickets?limit=50'),
  });

  const tickets = ticketsData?.data || [];

  /* ── Submit ticket mutation ────────────────────────────────── */

  const submitMutation = useMutation({
    mutationFn: (formData) => api.post('/support/tickets', formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['myTickets']);
      toast.success("Ticket submitted successfully! Our team will review it shortly.");
    },
    onError: (err) => {
      const errorMsg = err?.message || 'Failed to submit ticket. Please try again.';
      toast.error(errorMsg);
    },
  });

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const category = form.elements['category']?.value;
    const subject = form.elements['subject']?.value;
    const message = form.elements['message']?.value;

    if (!category || !message) {
      toast.error("Please fill in category and message.");
      return;
    }

    submitMutation.mutate({ category, subject, message });
    form.reset();
  };

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title="Support & Help Center"
        description="Find answers to common questions or reach out to our dedicated affiliate support team."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: FAQ (Appears second on mobile) */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <Card>
            <CardHeader className="py-5 border-b border-border">
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {mockFaq.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="bg-card">
                      <button
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                        className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none focus:bg-secondary/30 transition-colors hover:bg-secondary/30"
                      >
                        <span className="font-semibold text-foreground">{faq.question}</span>
                        <LuChevronDown
                          className={cn(
                            'w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-4',
                            isOpen && 'rotate-180 text-accent'
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          'overflow-hidden transition-all duration-300 ease-in-out',
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        )}
                      >
                        <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Contact & Ticket (Appears first on mobile) */}
        <div className="space-y-6 order-1 lg:order-2">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                <LuHeadphones className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Need direct help?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Our support team is available Monday to Friday, 9am - 6pm NPT.
              </p>

              <div className="space-y-4">
                <a href="mailto:info@thinktank.com.np" className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-accent transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10">
                    <LuMail className="w-4 h-4" />
                  </div>
                  info@thinktank.com
                </a>

                <a href="tel:+977014567890" className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-accent transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10">
                    <LuPhone className="w-4 h-4" />
                  </div>
                  +977-985-6017621
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-base">
                <LuMessageSquare className="w-4 h-4" />
                Submit a Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <Select
                  label="Category"
                  name="category"
                  options={[
                    { label: 'Lead Status Inquiry', value: 'lead' },
                    { label: 'Commission / Payout Issue', value: 'commission' },
                    { label: 'Account Settings', value: 'account' },
                    { label: 'Platform Bug', value: 'bug' },
                    { label: 'Other', value: 'other' },
                  ]}
                  required
                />

                <Input
                  label="Subject (Optional)"
                  name="subject"
                  placeholder="Brief description of your issue"
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-y"
                    placeholder="Describe your issue in detail..."
                  />
                </div>

                <Button type="submit" className="w-full mt-2" loading={submitMutation.isPending}>
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── My Tickets Section ────────────────────────────────────── */}
      <Card>
        <CardHeader className="py-5 border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <LuMessageSquare className="w-5 h-5 text-accent" />
            My Tickets
            {tickets.length > 0 && (
              <span className="ml-2 text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {tickets.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {ticketsLoading ? (
            <div className="flex items-center justify-center py-12">
              <LuLoader className="w-6 h-6 text-accent animate-spin" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <LuMessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No tickets submitted yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Use the form above to submit your first support ticket.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {tickets.map((ticket) => {
                const isExpanded = expandedTicket === ticket.id;
                const replies = parseAdminReplies(ticket.adminNotes);
                const hasReplies = replies.length > 0;

                return (
                  <div key={ticket.id} className="bg-card hover:bg-secondary/20 transition-colors">
                    <button
                      onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                      className="w-full text-left px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-3 sm:gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">
                            {categoryLabels[ticket.category] || ticket.category}
                          </span>
                          <StatusBadge status={ticket.status} />
                          {hasReplies && (
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-foreground truncate">
                          {ticket.subject || ticket.message.substring(0, 80)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(ticket.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                      <LuChevronDown
                        className={cn(
                          'w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0',
                          isExpanded && 'rotate-180 text-accent'
                        )}
                      />
                    </button>

                    {/* Expanded ticket detail */}
                    <div
                      className={cn(
                        'overflow-hidden transition-all duration-300 ease-in-out',
                        isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                      )}
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-5 space-y-4">
                        {/* Original message */}
                        <div className="rounded-lg bg-secondary/50 border border-border p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Your Message
                          </p>
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                            {ticket.message}
                          </p>
                        </div>

                        {/* Admin Replies */}
                        {hasReplies && (
                          <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Admin Responses
                            </p>
                            {replies.map((reply, idx) => (
                              <div key={idx} className="rounded-lg bg-accent/5 border border-accent/20 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                                    <LuHeadphones className="w-3 h-3" />
                                  </div>
                                  <span className="text-xs font-semibold text-accent">Support Team</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(reply.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                  {reply.message}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* No reply yet message */}
                        {!hasReplies && (ticket.status === 'open' || ticket.status === 'in_progress') && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 rounded-lg px-4 py-3">
                            <LuClock className="w-4 h-4 flex-shrink-0" />
                            <span>Awaiting admin response. You will be notified when a reply is received.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
