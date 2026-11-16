// app/affiliate/my-leads/[id]/page.jsx
// No params needed — LeadDetailClient reads its own route segment via useParams()

import MyLeadsClient from "./page.client";

export default function LeadDetailPage() {
  return <MyLeadsClient />;
}