'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LuArrowLeft,
  LuArrowRight,
  LuCircleCheck,
  LuClipboardList,
  LuMail,
  LuMapPin,
  LuUser,
} from 'react-icons/lu';
import PageHeader from '@/app/components/common/PageHeader';
import Button from '@/app/components/common/Button';
import Input from '@/app/components/common/Input';
import Select from '@/app/components/common/Select';
import CustomDropdown from '@/app/components/common/CustomDropdown';
import Card, { CardContent, CardHeader, CardTitle } from '@/app/components/common/Card';
import { NEPAL_DISTRICTS, PRIORITIES, SERVICE_DEPARTMENTS } from '@/app/lib/constants';
import { cn, formatNPR } from '@/app/lib/utils';
import api from '@/app/api/api';
import { toast } from 'react-hot-toast';

const steps = [
  { label: 'Client Info' },
  { label: 'Service Details' },
  { label: 'Additional Info' },
  { label: 'Review' },
];

const timelineOptions = [
  { label: '0-7 days', value: '0-7 days' },
  { label: '2-4 weeks', value: '2-4 weeks' },
  { label: '30+ days', value: '30+ days' },
];

export default function SubmitLeadClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    district: '',
    address: '',
    sector: '',
    subService: '',
    priority: 'Medium',
    value: '',
    timeline: '2-4 weeks',
    notes: '',
  });

  const selectedDepartment = useMemo(
    () => SERVICE_DEPARTMENTS.find((department) => department.slug === formData.sector),
    [formData.sector]
  );

  const selectedSubService = useMemo(
    () => selectedDepartment?.subServices.find((service) => service.slug === formData.subService),
    [selectedDepartment, formData.subService]
  );

  const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email);

  const canContinue =
    step !== 1 || Boolean(formData.sector && formData.subService);

  const activeSubServices = selectedDepartment?.subServices
    .filter((service) => service.status === 'active')
    .map((service) => ({ label: service.title, value: service.slug })) || [];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSectorChange = (value) => {
    setFormData((prev) => ({ ...prev, sector: value, subService: '' }));
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      email: '',
      phone: '',
      district: '',
      address: '',
      sector: '',
      subService: '',
      priority: 'Medium',
      value: '',
      timeline: '2-4 weeks',
      notes: '',
    });
    setStep(0);
    setSuccess(false);
  };

  const nextStep = () => setStep((current) => Math.min(current + 1, steps.length - 1));
  const previousStep = () => setStep((current) => Math.max(current - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step < steps.length - 1) {
      nextStep();
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        address: formData.district ? `${formData.address}, ${formData.district}` : formData.address,
        description: `Sub-Service: ${formData.subService}\nPriority: ${formData.priority}\nTimeline: ${formData.timeline}\nEstimated Value: ${formData.value}\n\nNotes: ${formData.notes}`,
        sector: formData.sector,
      };

      await api.post('/affiliate/referrals', payload);
      toast.success('Lead Submitted Successfully!');
      setSuccess(true);
    } catch (error) {
      console.error('Lead submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-success-light text-success flex items-center justify-center mx-auto mb-6">
          <LuCircleCheck className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Lead Submitted Successfully!</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Your lead for {formData.clientName} has been routed to {selectedDepartment?.team || 'the respective department'}.
          You can track its status in the My Leads section.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" onClick={() => router.push('/affiliate/my-leads')}>
            View My Leads
          </Button>
          <Button onClick={resetForm}>Submit Another Lead</Button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Input
              id="clientName"
              label="Full Name"
              placeholder="e.g. Ramesh Sharma"
              value={formData.clientName}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="+977 98XXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Input
            id="address"
            label="Address"
            placeholder="e.g. Baneshwor, Kathmandu"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <div className="flex flex-col">
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="client@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {formData.email && !isEmailValid && (
              <p className="text-xs text-danger mt-1.5 ml-1">
                Please enter a valid email address format.
              </p>
            )}
          </div>
          <Select
            id="district"
            label="District"
            placeholder="Select a district"
            options={NEPAL_DISTRICTS.map((district) => ({ label: district, value: district }))}
            value={formData.district}
            onChange={handleChange}
            required
          />
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="space-y-5">
          <CustomDropdown
            label="Department / Sector"
            value={formData.sector}
            onChange={handleSectorChange}
            placeholder="Select department for this lead"
          />



          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Select
                id="subService"
                label="Specific Service Required"
                placeholder={selectedDepartment ? 'Select a sub-service' : 'Select department first'}
                options={activeSubServices}
                value={formData.subService}
                onChange={handleChange}
                disabled={!selectedDepartment}
                required
              />
            </div>
            <Select
              id="priority"
              label="Priority Level"
              options={PRIORITIES.map((priority) => ({ label: priority, value: priority }))}
              value={formData.priority}
              onChange={handleChange}
              required
            />
            <Input
              id="value"
              type="number"
              label="Estimated Value (NPR)"
              placeholder="e.g. 50000"
              value={formData.value}
              onChange={handleChange}
            />
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-5">
          <Select
            id="timeline"
            label="Expected Visit"
            options={timelineOptions}
            value={formData.timeline}
            onChange={handleChange}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-sm font-medium text-foreground">
              Additional Notes
            </label>
            <textarea
              id="notes"
              rows={5}
              className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-y"
              placeholder="Provide specific requirements, client readiness, budget context, documents available, or follow-up instructions..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <ReviewBlock
          title="Client"
          items={[
            ['Name', formData.clientName],
            ['Phone', formData.phone],
            ['Email', formData.email],
            ['Location', [formData.address, formData.district].filter(Boolean).join(', ')],
          ]}
        />
        <ReviewBlock
          title="Service"
          items={[
            ['Department', selectedDepartment?.title],
            ['Sub-service', selectedSubService?.title],
            ['Priority', formData.priority],
            ['Estimated value', formData.value ? formatNPR(Number(formData.value)) : 'Not provided'],
            ['Timeline', formData.timeline],
          ]}
        />
        <ReviewBlock title="Notes" items={[['Context', formData.notes || 'No additional notes provided']]} />
      </div>
    );
  };

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Submit New Lead"
        description="Provide detailed client information to ensure accurate department routing."
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => router.push('/affiliate/dashboard') },
          { label: 'Submit Lead' },
        ]}
      />

      <Stepper currentStep={step} />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="py-5">
            <CardTitle className="text-xl">
              {step + 1}. {steps[step].label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {renderStep()}

            <div className="border-t border-border pt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={previousStep} disabled={step === 0}>
                <LuArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button type="submit" loading={loading} className="w-full sm:w-auto" disabled={!canContinue || (step === 0 && formData.email && !isEmailValid)}>
                {step === steps.length - 1 ? 'Submit Lead' : 'Next Step'}
                {step < steps.length - 1 && <LuArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

function Stepper({ currentStep }) {
  return (
    <div className="mb-6 sm:mb-10">
      <div className="grid grid-cols-4 gap-2 relative">
        <div className="absolute left-[12.5%] right-[12.5%] top-4 sm:top-6 h-1 bg-border rounded-full" />
        <div
          className="absolute left-[12.5%] top-4 sm:top-6 h-1 bg-accent rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 75}%` }}
        />
        {steps.map((item, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;
          return (
            <div key={item.label} className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 bg-background flex items-center justify-center text-xs sm:text-sm font-bold transition-all',
                  isActive && 'bg-accent border-accent text-white shadow-md shadow-accent/20',
                  isComplete && 'bg-success border-success text-white',
                  !isActive && !isComplete && 'border-border text-muted-foreground'
                )}
              >
                {isComplete ? <LuCircleCheck className="w-4 h-4 sm:w-5 sm:h-5" /> : index + 1}
              </div>
              <span className={cn('text-[10px] sm:text-sm text-center leading-tight', isActive ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewBlock({ title, items }) {
  const iconMap = {
    Client: LuUser,
    Service: LuClipboardList,
    Notes: LuMail,
  };
  const Icon = iconMap[title] || LuMapPin;

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-accent" />
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground mt-1">{value || 'Not provided'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
