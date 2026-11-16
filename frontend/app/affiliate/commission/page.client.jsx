'use client';

import { LuClock } from 'react-icons/lu';
import PageHeader from '@/app/components/common/PageHeader';
import Card, { CardContent } from '@/app/components/common/Card';

export default function CommissionClient() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Commission & Payouts"
        description="This section is currently under development."
      />

      <Card className="border-dashed border-muted-foreground/30">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <LuClock className="w-8 h-8 text-muted-foreground" />
          </div>

          <h2 className="text-xl font-semibold text-foreground">
            Coming Soon
          </h2>

          <p className="text-muted-foreground mt-2 max-w-md">
            We are working on bringing you commission tracking, payout history,
            and withdrawal management. This feature will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}