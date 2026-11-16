import LeadDetailClient from "./lead.detail.client";

export const metadata = {
  title: 'Lead Details',
  description: 'View the details and status of your submitted lead.',
};

export default function LeadDetailPage() {
  return <LeadDetailClient/>;
}