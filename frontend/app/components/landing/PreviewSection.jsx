'use client';

import Link from 'next/link';
import { LuLayoutDashboard, LuDollarSign, LuTrendingUp, LuActivity } from 'react-icons/lu';
import Button from '@/app/components/common/Button';
import Card from '@/app/components/common/Card';

export default function PreviewSection() {
  return (
    <section id="preview" className="py-24 max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">A dashboard built for professionals.</h2>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          Track every lead, monitor conversion statuses in real-time, and manage your earnings with our enterprise-grade affiliate portal.
        </p>
        
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <div className="w-10 h-10 rounded-lg bg-info-light text-info flex items-center justify-center mb-4">
              <LuLayoutDashboard className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Centralized View</h4>
            <p className="text-sm text-muted-foreground">All your data in one place.</p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-success-light text-success flex items-center justify-center mb-4">
              <LuDollarSign className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Fast Payouts</h4>
            <p className="text-sm text-muted-foreground">Request withdrawals instantly.</p>
          </div>
        </div>
        
       
      </div>
      
      {/* Abstract Dashboard UI */}
      <div className="grid grid-cols-2 gap-4 bg-secondary/50 p-6 rounded-3xl border border-border">
        <Card className="p-5 shadow-sm border-0">
          <div className="flex items-center gap-3 mb-4">
            <LuLayoutDashboard className="w-5 h-5 text-muted-foreground" />
            <div className="h-4 w-24 bg-secondary rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-8 w-16 bg-accent/20 rounded" />
            <div className="h-3 w-full bg-secondary rounded" />
            <div className="h-3 w-4/5 bg-secondary rounded" />
          </div>
        </Card>
        <Card className="p-5 shadow-sm border-0">
          <div className="flex items-center gap-3 mb-4">
            <LuTrendingUp className="w-5 h-5 text-muted-foreground" />
            <div className="h-4 w-20 bg-secondary rounded" />
          </div>
          <div className="flex items-end h-[68px] gap-2">
            <div className="w-full bg-secondary rounded-t h-1/3" />
            <div className="w-full bg-secondary rounded-t h-2/3" />
            <div className="w-full bg-accent/60 rounded-t h-full" />
            <div className="w-full bg-secondary rounded-t h-1/2" />
          </div>
        </Card>
        <Card className="p-5 shadow-sm border-0 col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <LuActivity className="w-5 h-5 text-muted-foreground" />
            <div className="h-4 w-32 bg-secondary rounded" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div className="h-3 w-32 bg-secondary rounded" />
              <div className="h-5 w-16 bg-success-light rounded-full" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-secondary rounded" />
              <div className="h-5 w-20 bg-warning-light rounded-full" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
