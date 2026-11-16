'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuMail, LuArrowLeft, LuKey, LuLock, LuCheck } from 'react-icons/lu';
import AuthLayout from '@/app/components/common/AuthLayout';
import Input from '@/app/components/common/Input';
import Button from '@/app/components/common/Button';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordClient() {
  const router = useRouter();
  const { forgotPassword, resetPassword } = useAuth();
  
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP & New Password
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  
  const isLengthValid = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isPasswordValid = isLengthValid && hasUpperCase && hasLowerCase && hasNumber;
  const passwordsMatch = newPassword && newPassword === confirmPassword;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setStep(2);
    } else {
      toast.error(result.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    const result = await resetPassword(email, otp, newPassword);
    setLoading(false);

    if (result.success) {
      toast.success('Password successfully reset! Please sign in.');
      router.push('/login');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={step === 1 ? "Enter your email address and we'll send you an OTP to reset your password." : "Check your email for the OTP and enter your new password."}
    >
      <div className="mb-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <LuArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {step === 1 ? 'Forgot Password' : 'Reset Password'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {step === 1 ? "No worries, we'll send you reset instructions." : `OTP sent to ${email}`}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-5 animate-fade-in">
          <div className="relative">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
            <LuMail className="absolute left-3.5 top-[2.4rem] w-4 h-4 text-muted-foreground pointer-events-none" />
            {email && !isEmailValid && (
              <p className="text-xs text-danger mt-1.5 ml-1">
                Please enter a valid email address format.
              </p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 text-base mt-2" loading={loading} disabled={email && !isEmailValid}>
            Send OTP
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in">
          <div className="relative">
            <Input
              label="6-Digit OTP"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              className="pl-10 tracking-widest text-lg"
            />
            <LuKey className="absolute left-3.5 top-[2.4rem] w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="pl-10"
            />
            <LuLock className="absolute left-3.5 top-[2.4rem] w-4 h-4 text-muted-foreground pointer-events-none" />
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

          <div className="relative">
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-10"
            />
            <LuLock className="absolute left-3.5 top-[2.4rem] w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          <Button type="submit" className="w-full h-12 text-base mt-2" loading={loading} disabled={!isPasswordValid || !passwordsMatch || otp.length !== 6}>
            Reset Password
          </Button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              Didn't receive the OTP? Resend
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
