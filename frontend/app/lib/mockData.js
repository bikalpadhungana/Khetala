import { SERVICE_DEPARTMENTS } from './constants';

const leadSeeds = [
  ['LD-001', 'Sita Sharma', 'sita.sharma@gmail.com', '+977-9841234567', 'Kathmandu', 'abroad-study-services', 'university-application', 'Converted', 'High', 150000, '2026-05-28', 'Planning MBA intake in Australia with scholarship support.', 'Qualified', 86],
  ['LD-002', 'Ram Bahadur Thapa', 'ram.thapa@outlook.com', '+977-9856789012', 'Pokhara', 'tourism-travel-services', 'international-tours', 'Proposal Sent', 'Medium', 80000, '2026-05-30', 'Family trip to Thailand for four members.', 'Contact Verified', 64],
  ['LD-003', 'Anita Gurung', 'anita.g@gmail.com', '+977-9812345678', 'Lalitpur', 'it-digital-services', 'ecommerce-management', 'Assigned', 'High', 250000, '2026-05-25', 'E-commerce platform for a clothing store with payment integration.', 'Qualified', 72],
  ['LD-004', 'Bijay Khatri', 'bijay.k@yahoo.com', '+977-9867890123', 'Bhaktapur', 'writing-services', 'research-writing', 'In Progress', 'Medium', 25000, '2026-05-21', 'Research proposal support for a PhD application in Canada.', 'Documents Pending', 58],
  ['LD-005', 'Deepa Acharya', 'deepa.acharya@gmail.com', '+977-9823456789', 'Chitwan', 'automobile-services', 'vehicle-financing-support', 'Converted', 'Low', 3500000, '2026-05-18', 'Looking for Hyundai Creta financing options.', 'Qualified', 91],
  ['LD-006', 'Prakash Shrestha', 'prakash.s@gmail.com', '+977-9845678901', 'Lalitpur', 'real-estate-services', 'property-buying', 'In Progress', 'High', 8500000, '2026-05-16', 'Searching for a 2BHK apartment near Imadol.', 'Contact Verified', 69],
  ['LD-007', 'Kiran Paudel', 'kiran.p@gmail.com', '+977-9801234567', 'Morang', 'abroad-study-services', 'visa-documentation', 'Closed', 'Low', 120000, '2026-05-12', 'Student visa consultation for the UK.', 'Rejected', 18],
  ['LD-008', 'Meena Rai', 'meena.rai@gmail.com', '+977-9876543210', 'Kathmandu', 'tourism-travel-services', 'hotel-booking', 'New', 'High', 175000, '2026-06-02', 'Business class flight to Dubai with hotel requirements.', 'Unverified', 42],
  ['LD-009', 'Niraj Kc', 'niraj.kc@gmail.com', '+977-9840001234', 'Rupandehi', 'accounting-financial-services', 'tax-filing', 'Verified', 'Medium', 95000, '2026-06-01', 'Tax filing and statutory compliance for a growing retail firm.', 'Qualified', 76],
  ['LD-010', 'Asmita Lama', 'asmita.lama@gmail.com', '+977-9861112233', 'Kaski', 'it-digital-services', 'ui-ux-design', 'Proposal Sent', 'High', 180000, '2026-05-29', 'UX redesign for a travel booking web app.', 'Contact Verified', 67],
  ['LD-011', 'Milan Adhikari', 'milan.adhikari@gmail.com', '+977-9819988776', 'Jhapa', 'real-estate-services', 'property-selling', 'Assigned', 'Medium', 6200000, '2026-05-24', 'Listing and buyer qualification for a residential land parcel.', 'Documents Pending', 51],
  ['LD-012', 'Puja Maharjan', 'puja.m@example.com', '+977-9844477000', 'Kathmandu', 'others', 'custom-consulting', 'New', 'Low', 65000, '2026-06-03', 'Custom operational consulting request for a boutique brand.', 'Unverified', 39],
];

function findDepartment(slug) {
  return SERVICE_DEPARTMENTS.find((department) => department.slug === slug);
}

function findSubService(department, slug) {
  return department?.subServices.find((service) => service.slug === slug);
}

function activityFor(status, date) {
  const items = [
    { title: 'Lead submitted', body: 'Lead entered the affiliate intake queue.', date },
    { title: 'Client contact checked', body: 'Phone and email were reviewed for completeness.', date: '2026-06-01T10:15:00' },
  ];
  if (['Assigned', 'In Progress', 'Proposal Sent', 'Converted'].includes(status)) {
    items.push({ title: 'Department assigned', body: 'Lead routed to the assigned service team.', date: '2026-06-01T14:30:00' });
  }
  if (['Proposal Sent', 'Converted'].includes(status)) {
    items.push({ title: 'Commercial proposal prepared', body: 'Estimated value and commission were validated.', date: '2026-06-02T11:00:00' });
  }
  if (status === 'Converted') {
    items.push({ title: 'Lead converted', body: 'Commission moved to pending payout.', date: '2026-06-03T16:45:00' });
  }
  return items;
}

export const mockLeads = leadSeeds.map((seed, index) => {
  const [id, clientName, email, phone, district, departmentSlug, subServiceSlug, status, priority, value, date, notes, verificationState, probability] = seed;
  const department = findDepartment(departmentSlug);
  const subService = findSubService(department, subServiceSlug);
  const commissionRate = department?.commissionRate || 0.05;

  return {
    id,
    clientName,
    email,
    phone,
    district,
    departmentId: department?.id,
    departmentSlug,
    departmentTitle: department?.title,
    departmentColor: department?.color,
    service: departmentSlug,
    serviceLabel: department?.title,
    sector: departmentSlug,
    sectorLabel: department?.title,
    subServiceId: subService?.id,
    subServiceSlug,
    subServiceTitle: subService?.title,
    category: department?.title,
    status,
    priority,
    date,
    submittedDate: date,
    lastActivity: activityFor(status, date).at(-1).date,
    assignedTeam: department?.team,
    value,
    revenuePotential: value,
    commissionRate,
    commission: Math.round(value * commissionRate),
    commissionStatus: status === 'Converted' ? 'Pending' : 'Projected',
    timeline: index % 3 === 0 ? '0-7 days' : index % 3 === 1 ? '2-4 weeks' : '30+ days',
    verificationState,
    conversionProbability: probability,
    notes,
    internalNotes: [
      'Affiliate submitted complete first-contact context.',
      priority === 'High' ? 'Prioritize within same business day.' : 'Review during standard queue.',
    ],
    uploadedDocuments: index % 2 === 0 ? ['Client brief.pdf', 'Identity document.jpg'] : ['Requirement notes.docx'],
    activityHistory: activityFor(status, date),
    communicationLogs: [
      { channel: 'Phone', summary: 'Introductory qualification call logged.', date: '2026-06-01T09:20:00' },
      { channel: 'Email', summary: 'Service expectations and next steps shared.', date: '2026-06-02T13:10:00' },
    ],
  };
});

export const mockAffiliates = [
  {
    id: 'AF-001',
    name: 'Hari Prasad Oli',
    email: 'hari@partner.np',
    phone: '+977-9841111111',
    district: 'Kathmandu',
    status: 'Approved',
    sector: 'abroad-study-services',
    totalLeads: 42,
    converted: 18,
    earnings: 285000,
    joinDate: '2025-09-15',
  },
  {
    id: 'AF-002',
    name: 'Laxmi Devi Kc',
    email: 'laxmi@partner.np',
    phone: '+977-9852222222',
    district: 'Pokhara',
    status: 'Approved',
    sector: 'tourism-travel-services',
    totalLeads: 67,
    converted: 31,
    earnings: 412000,
    joinDate: '2025-07-22',
  },
  {
    id: 'AF-003',
    name: 'Sunil Tamang',
    email: 'sunil@partner.np',
    phone: '+977-9813333333',
    district: 'Lalitpur',
    status: 'Pending',
    sector: 'it-digital-services',
    totalLeads: 0,
    converted: 0,
    earnings: 0,
    joinDate: '2026-05-30',
  },
  {
    id: 'AF-004',
    name: 'Puja Maharjan',
    email: 'puja@partner.np',
    phone: '+977-9864444444',
    district: 'Bhaktapur',
    status: 'Approved',
    sector: 'real-estate-services',
    totalLeads: 23,
    converted: 8,
    earnings: 195000,
    joinDate: '2025-11-10',
  },
];

export const mockTransactions = [
  { id: 'TX-001', date: '2026-06-01', description: 'Commission - LD-005 (Automobile Services)', amount: 175000, type: 'credit', status: 'Completed' },
  { id: 'TX-002', date: '2026-05-28', description: 'Withdrawal to eSewa', amount: -50000, type: 'debit', status: 'Completed' },
  { id: 'TX-003', date: '2026-05-25', description: 'Commission - LD-003 (IT & Digital Services)', amount: 30000, type: 'credit', status: 'Completed' },
  { id: 'TX-004', date: '2026-05-20', description: 'Commission - LD-001 (Abroad Study Services)', amount: 15000, type: 'credit', status: 'Pending' },
];

export const mockNotifications = [
  { id: 'N-001', title: 'Lead LD-005 Converted', message: 'Your lead for Deepa Acharya has converted. Commission of NPR 175,000 is pending payout.', type: 'commission', read: false, date: '2026-06-01T10:30:00' },
  { id: 'N-002', title: 'New Lead Assigned', message: 'Lead LD-003 has been assigned to the Digital Delivery Unit.', type: 'lead', read: false, date: '2026-05-28T14:15:00' },
  { id: 'N-003', title: 'Withdrawal Processed', message: 'Your withdrawal of NPR 50,000 has been processed to your eSewa account.', type: 'commission', read: true, date: '2026-05-25T09:00:00' },
];

export const mockFaq = [
  {
    question: 'How do I earn commissions?',
    answer: 'Submit qualified leads through the platform. Once a lead converts into a paying customer, you earn a commission based on the department rate.',
  },
  {
    question: 'How long does lead verification take?',
    answer: 'Most leads are verified within 24-48 hours. High-priority leads are reviewed within the same business day.',
  },
  {
    question: 'Can I submit leads for multiple departments?',
    answer: 'Yes. The service registry drives all active departments and sub-services available in the lead intake form.',
  },
];
