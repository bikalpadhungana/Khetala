'use client';

import { PLATFORM_STATS } from '@/app/lib/constants';
import { LuBadgeCheck, LuBuilding2, LuShieldCheck, LuGlobe } from 'react-icons/lu';

export default function TrustBarSection() {
  return (
    <section className="bg-card py-12 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">Trusted ecosystem</p>
          <h2 className="text-xl font-medium text-foreground">Built for Nepal's multi-service economy</h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {PLATFORM_STATS.map((stat, i) => {
            const IconMap = {
              LuBadgeCheck,
              LuBuilding2,
              LuShieldCheck,
              LuGlobe,
            };
            const Icon = IconMap[stat.icon];
            
            return (
              <div key={i} className="rounded-2xl border border-border bg-card/80 p-5 flex items-center gap-4 hover:border-accent/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
