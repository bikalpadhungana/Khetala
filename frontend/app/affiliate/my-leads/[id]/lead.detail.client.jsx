
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  LuActivity, LuArrowLeft, LuBuilding2, LuCalendarClock,
  LuCircleDollarSign, LuClipboardCheck, LuClock3, LuFileText,
  LuMail, LuMapPin, LuMessageSquare, LuPhone, LuShieldCheck,
  LuTarget, LuUser,
} from 'react-icons/lu';
import StatusBadge from '@/app/components/common/StatusBadge';
import Button from '@/app/components/common/Button';
import Skeleton from '@/app/components/common/Skeleton';
import DepartmentBadge from '@/app/(public)/features/leads/components/DepartmentBadge';
import { formatNPR, formatDate } from '@/app/lib/utils';
import api from '@/app/api/api';
import { toast } from 'react-hot-toast';

const PIPELINE = ['pending', 'assigned', 'contacted', 'converted'];

export default function LeadDetailClient() {
  const { id } = useParams();  // reads [id] segment — always sync, no prop drilling needed
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['affiliate-referral', id],
    queryFn: () => api.get(`/affiliate/referrals/${id}`),
    enabled: !!id,
  });

  useEffect(() => {
    if (error) toast.error('Failed to load lead details');
  }, [error]);

  const lead = data?.data?.referral ?? data?.data ?? null;

  if (isLoading) return <LeadDetailSkeleton />;

  if (error || !lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground text-sm">Lead not found or failed to load.</p>
        <Button variant="outline" onClick={() => router.push('/affiliate/my-leads')}>
          <LuArrowLeft className="w-4 h-4 mr-2" />
          Back to leads
        </Button>
      </div>
    );
  }

  const isRejected = lead.status?.toLowerCase() === 'rejected';
  const pipelineIdx = isRejected ? -1 : PIPELINE.indexOf(lead.status?.toLowerCase());
  const conversionPct =
    lead.creditStatus === 'released' ? 100 :
    lead.creditStatus === 'cancelled' ? 0 : 50;

  return (
    <div className="space-y-5 pb-12">

      {/* Sticky breadcrumb */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/affiliate/my-leads" className="shrink-0 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LuArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">My Leads</span>
            </Link>
            <span className="text-muted-foreground hidden sm:inline">/</span>
            <p className="text-sm font-semibold text-foreground truncate">{lead.name}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={lead.status} />
            {lead.verificationState && <StatusBadge status={lead.verificationState} />}
          </div>
        </div>
      </div>

      {/* Hero card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 sm:px-6 py-5 sm:py-6">
          <p className="text-xs font-mono tracking-[0.2em] text-muted-foreground uppercase mb-2">{lead.id}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-1.5">{lead.name}</h1>
          <p className="text-sm text-muted-foreground">
            Submitted {formatDate(lead.createdAt)}
            {lead.assignedTo?.name && (
              <> &middot; Routed to <span className="font-medium text-foreground">{lead.assignedTo.name}</span></>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-border divide-border divide-x divide-y sm:divide-y-0">
          <HeroMetric label="Lead Credits"  value={lead.totalCredits ? formatNPR(lead.totalCredits) : '—'} icon={LuCircleDollarSign} />
          <HeroMetric label="Credit Status" value={lead.creditStatus || 'Escrow'}         icon={LuTarget}       capitalize />
          <HeroMetric label="Assigned To"   value={lead.assignedTo?.name || 'Pending'}     icon={LuBuilding2} />
          <HeroMetric label="Submitted"     value={formatDate(lead.createdAt)}             icon={LuCalendarClock} />
        </div>

        {/* Pipeline stepper */}
        <div className="px-5 sm:px-6 py-4 border-t border-border bg-secondary/30">
          {isRejected ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                {PIPELINE.map((step, i) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-border" />
                      <span className="text-[10px] font-medium text-muted-foreground capitalize hidden sm:block">{step}</span>
                    </div>
                    {i < PIPELINE.length - 1 && <div className="flex-1 h-px mx-2 mb-3.5 bg-border" />}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-border">
                <div className="h-2 w-2 rounded-full bg-destructive/70" />
                <span className="text-xs font-semibold text-destructive">Rejected</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              {PIPELINE.map((step, i) => {
                const done = i < pipelineIdx, active = i === pipelineIdx, isLast = i === PIPELINE.length - 1;
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`h-2.5 w-2.5 rounded-full shrink-0 transition-colors ${done || active ? 'bg-accent' : 'bg-border'} ${active ? 'ring-[3px] ring-accent/25' : ''}`} />
                      <span className={`text-[10px] font-medium capitalize hidden sm:block ${done || active ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</span>
                    </div>
                    {!isLast && <div className={`flex-1 h-px mx-2 mb-3.5 ${done ? 'bg-accent' : 'bg-border'}`} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="space-y-5">
          <Section title="Client Profile" icon={LuUser}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full Name" value={lead.name}    icon={LuUser} />
              <Field label="Email"     value={lead.email}   icon={LuMail} />
              <Field label="Phone"     value={lead.phone}   icon={LuPhone} />
              <Field label="Address"   value={lead.address} icon={LuMapPin} />
            </div>
          </Section>

          <Section title="Service Routing" icon={LuClipboardCheck}>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <DepartmentBadge departmentSlug={lead.departmentSlug || lead.sector} />
              {lead.priority && <StatusBadge status={lead.priority} />}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Sector"            value={lead.sector?.name} />
              <Field label="Assigned Business" value={lead.assignedTo?.name || 'Pending assignment'} icon={LuBuilding2} />
              <Field label="Expected Timeline" value="Not specified"                                 icon={LuClock3} />
              <Field label="Last Activity"     value={lead.updatedAt ? formatDate(lead.updatedAt) : 'No activity yet'} icon={LuActivity} />
            </div>
          </Section>

          {lead.description && (
            <Section title="Requirement Notes" icon={LuMessageSquare}>
              <p className="text-sm text-foreground leading-relaxed rounded-lg bg-secondary/50 border border-border p-4">
                {lead.description}
              </p>
            </Section>
          )}
        </div>

        <div className="space-y-5">
          <Section title="Commercial Snapshot" icon={LuCircleDollarSign}>
            <div className="space-y-4">
              <Field label="Total Credits" value={lead.totalCredits ? formatNPR(lead.totalCredits) : 'Not specified'} />
              <Field label="Credit Status" value={lead.creditStatus || 'Pending'} />
            </div>
          </Section>

          {/* <Section title="Qualification" icon={LuShieldCheck}>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
                  <span>Conversion probability</span>
                  <span className="tabular-nums">{conversionPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${conversionPct}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {lead.verificationState && <StatusBadge status={lead.verificationState} />}
                {lead.priority         && <StatusBadge status={lead.priority} />}
              </div>
            </div>
          </Section> */}

          {(lead.statusHistory || []).length > 0 && (
            <Section title="Recent Activity" icon={LuActivity}>
              <div className="space-y-4">
                {[...(lead.statusHistory)].reverse().slice(0, 3).map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-accent shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground capitalize">Status → {item.status}</p>
                      {item.note && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{item.note}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(item.changedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section title="Activity Timeline" icon={LuActivity}>
          {(lead.statusHistory || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
          ) : (
            <div className="space-y-5">
              {(lead.statusHistory).map((item, i, arr) => (
                <div key={i} className="relative pl-7">
                  <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-background" />
                  {i < arr.length - 1 && <div className="absolute left-[5px] top-5 bottom-0 w-px bg-border" />}
                  <p className="text-sm font-semibold text-foreground capitalize">Status changed to {item.status}</p>
                  {item.note && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.note}</p>}
                  <p className="text-xs text-muted-foreground mt-1.5">{formatDate(item.changedAt)}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <div className="space-y-5">
          <Section title="Documents" icon={LuFileText}>
            {(lead.uploadedDocuments || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents attached.</p>
            ) : (
              <div className="space-y-2">
                {(lead.uploadedDocuments).map((doc, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <LuFileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">{doc}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-3 shrink-0">Attached</span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Communication Logs" icon={LuMessageSquare}>
            {(lead.communicationLogs || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No communication logs yet.</p>
            ) : (
              <div className="space-y-3">
                {(lead.communicationLogs).map((log, i) => (
                  <div key={i} className="rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">{log.channel}</p>
                      <p className="text-xs text-muted-foreground shrink-0">{formatDate(log.date)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{log.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

function HeroMetric({ label, value, icon: Icon, capitalize }) {
  return (
    <div className="flex flex-col gap-1.5 px-5 py-4">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        <Icon className="w-3.5 h-3.5 shrink-0" /><span>{label}</span>
      </div>
      <p className={`text-base font-bold text-foreground leading-snug ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-secondary/20">
        <Icon className="w-4 h-4 text-accent shrink-0" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, value, icon: Icon }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}{label}
      </div>
      <p className="text-sm font-semibold text-foreground break-words">{value || 'Not provided'}</p>
    </div>
  );
}

function LeadDetailSkeleton() {
  return (
    <div className="space-y-5 pb-12">
      <div className="h-12 border-b border-border" />
      <Skeleton className="h-52 rounded-xl" />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="space-y-5">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-52 rounded-xl" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-64 rounded-xl" />
        <div className="space-y-5">
          <Skeleton className="h-32 rounded-xl" /><Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}