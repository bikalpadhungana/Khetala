'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LuArrowLeft, LuCheck } from 'react-icons/lu';
import AuthLayout from '@/app/components/common/AuthLayout';
import Input from '@/app/components/common/Input';
import Button from '@/app/components/common/Button';
import { cn } from '@/app/lib/utils';

import { useAuth } from '@/app/contexts/AuthContext';

const DISTRICTS = [
  "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke", "Bara", "Bardiya", "Bhaktapur",
  "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh", "Dang", "Darchula", "Dhading", "Dhankuta", "Dhanusha", "Dolakha",
  "Dolpa", "Doti", "Eastern Rukum", "Gorkha", "Gulmi", "Humla", "Ilam", "Jajarkot", "Jhapa", "Jumla", "Kailali",
  "Kalikot", "Kanchanpur", "Kapilvastu", "Kaski", "Kathmandu", "Kavrepalanchok", "Khotang", "Lalitpur", "Lamjung",
  "Mahottari", "Makwanpur", "Manang", "Morang", "Mugu", "Mustang", "Myagdi", "Nawalpur", "Nuwakot", "Okhaldhunga",
  "Palpa", "Panchthar", "Parasi", "Parbat", "Parsa", "Pyuthan", "Ramechhap", "Rasuwa", "Rautahat", "Rolpa", "Rupandehi",
  "Salyan", "Sankhuwasabha", "Saptari", "Sarlahi", "Sindhuli", "Sindhupalchok", "Siraha", "Solukhumbu", "Sunsari",
  "Surkhet", "Syangja", "Tanahun", "Taplejung", "Terhathum", "Udayapur", "Western Rukum"
].sort();

export default function RegisterClient() {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    businessName: '',
    pan: '',
    experience: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const nextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const isLengthValid = formData.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasLowerCase = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const isPasswordValid = isLengthValid && hasUpperCase && hasLowerCase && hasNumber;
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;
  
  const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
    };

    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Join our network and start earning commissions."
        showFeatures
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-success-light text-success flex items-center justify-center mx-auto mb-6">
            <LuCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for applying to the Think Tank Affiliate Program. Our team will review your application and get back to you within 24-48 hours.
          </p>
          <Link href="/">
            <Button className="w-full">Return to Home</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Join our network and start earning commissions."
      showFeatures
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Create Account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Apply to become a verified affiliate partner
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 text-sm font-medium text-danger bg-danger-light border border-danger-border rounded-lg animate-fade-in">
          {error}
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center justify-between relative mb-10">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-border -z-10" />
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
              step === num
                ? 'bg-accent text-white ring-4 ring-accent/20'
                : step > num
                ? 'bg-accent text-white'
                : 'bg-card border-2 border-border text-muted-foreground'
            )}
          >
            {step > num ? <LuCheck className="w-4 h-4" /> : num}
          </div>
        ))}
      </div>

      <form onSubmit={step === 3 ? handleSubmit : nextStep} className="space-y-5">
        {step === 1 && (
          <div className="animate-fade-in space-y-5">
            <Input
              id="name"
              label="Full Name"
              placeholder="Ram Bahadur"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div>
              <Input
                id="email"
                type="email"
                label="Email Address"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email) && (
                <p className="text-xs text-danger mt-1.5 ml-1">
                  Please enter a valid email address format.
                </p>
              )}
            </div>
            <Input
              id="phone"
              type="tel"
              label="Phone Number"
              placeholder="+977-9800000000"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="address" className="text-sm font-medium text-foreground">
                Address (District)
              </label>
              <select
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                required
              >
                <option value="">Select district</option>
                {DISTRICTS.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-5">
            <Input
              id="businessName"
              label="Business/Agency Name (Optional)"
              placeholder="XYZ Consultancy"
              value={formData.businessName}
              onChange={handleChange}
            />
         
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Years of Experience
              </label>
              <select
                id="experience"
                value={formData.experience}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                required
              >
                <option value="">Select experience</option>
                <option value="0-1">0-1 Years</option>
                <option value="1-3">1-3 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in space-y-5">
            <div>
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="mt-2.5 space-y-1.5 ml-1">
                <div className={`text-xs flex items-center gap-1.5 transition-colors ${isLengthValid ? 'text-success' : 'text-muted-foreground'}`}>
                  {isLengthValid ? <LuCheck className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 ml-1 rounded-full bg-muted-foreground/40" />}
                  <span className={isLengthValid ? 'font-medium' : ''}>At least 8 characters</span>
                </div>
                <div className={`text-xs flex items-center gap-1.5 transition-colors ${hasUpperCase ? 'text-success' : 'text-muted-foreground'}`}>
                  {hasUpperCase ? <LuCheck className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 ml-1 rounded-full bg-muted-foreground/40" />}
                  <span className={hasUpperCase ? 'font-medium' : ''}>One uppercase letter</span>
                </div>
                <div className={`text-xs flex items-center gap-1.5 transition-colors ${hasLowerCase ? 'text-success' : 'text-muted-foreground'}`}>
                  {hasLowerCase ? <LuCheck className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 ml-1 rounded-full bg-muted-foreground/40" />}
                  <span className={hasLowerCase ? 'font-medium' : ''}>One lowercase letter</span>
                </div>
                <div className={`text-xs flex items-center gap-1.5 transition-colors ${hasNumber ? 'text-success' : 'text-muted-foreground'}`}>
                  {hasNumber ? <LuCheck className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 ml-1 rounded-full bg-muted-foreground/40" />}
                  <span className={hasNumber ? 'font-medium' : ''}>One number</span>
                </div>
              </div>
            </div>
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label className="flex items-start gap-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
              />
              <span className="text-sm text-muted-foreground leading-snug">
                I agree to the{' '}
                <Link href="/info/terms" className="text-foreground font-medium hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/info/privacy" className="text-foreground font-medium hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="px-4"
            >
              <LuArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <Button 
            type="submit" 
            className="flex-1 h-12" 
            loading={loading}
            disabled={
              (step === 1 && formData.email && !isEmailValid) ||
              (step === 3 && (!isPasswordValid || !passwordsMatch))
            }
          >
            {step === 3 ? 'Submit Application' : 'Continue'}
          </Button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-foreground hover:text-accent transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
