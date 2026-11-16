'use client';

import { useState, useEffect } from 'react';
import { LuUser, LuPhone, LuMapPin } from 'react-icons/lu';
import PageHeader from '@/app/components/common/PageHeader';
import Button from '@/app/components/common/Button';
import Input from '@/app/components/common/Input';
import Card, { CardHeader, CardTitle, CardContent } from '@/app/components/common/Card';
import { getInitials } from '@/app/lib/utils';
import StatusBadge from '@/app/components/common/StatusBadge';
import { useAuth } from '@/app/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import api from '@/app/api/api';
import { toast } from 'react-hot-toast';

export default function ProfileClient() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: (payload) => api.put('/auth/me', payload),
    onSuccess: (res) => {
      if (res.success && res.data) {
        setUser(res.data);
        toast.success('Profile updated successfully');
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update profile');
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    updateProfileMutation.mutate({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    });
  };

  const status = user?.status || 'pending';

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Profile Settings"
        description="Manage your account details and update your contact information."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Status */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center text-center pt-8 pb-6">
              <div className="w-24 h-24 rounded-full bg-accent/20 text-accent flex items-center justify-center text-3xl font-bold mb-4 shadow-sm">
                {getInitials(formData.name || user?.name || 'U')}
              </div>
              <h2 className="text-xl font-bold text-foreground">{formData.name || user?.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
              <StatusBadge status={status} size="sm" />

              <div className="w-full mt-6 pt-6 border-t border-border text-left space-y-3">
                {formData.address && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <LuMapPin className="w-4 h-4 text-accent" /> {formData.address}
                  </div>
                )}
                {formData.phone && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <LuPhone className="w-4 h-4 text-accent" /> {formData.phone}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Personal Information Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave}>
            <Card className="mb-6">
              <CardHeader className="py-4 border-b border-border">
                <CardTitle className="flex items-center gap-2">
                  <LuUser className="w-5 h-5 text-muted-foreground" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    id="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    id="email"
                    type="email"
                    label="Email Address"
                    value={user?.email || ''}
                    disabled
                    helper="Contact support to change your email address"
                  />
                  <Input
                    id="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <Input
                    id="address"
                    label="Address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" loading={updateProfileMutation.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
