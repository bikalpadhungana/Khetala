'use client';

import { useState, useEffect } from 'react';
import RevealSection from '@/app/components/effects/RevealSection';
import JobCard from '@/app/components/career/JobCard';
import api from '@/app/api/api';

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // In a real implementation, this would fetch from /api/career/jobs
      // Since backend might not be fully seeded, we can use static placeholders or fetch if available
      const response = await api.get('/career/jobs');
      if (response.data && response.data.data) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch jobs', error);
      // Fallback placeholder data if API fails or is empty
      setJobs([
        {
          id: '1',
          title: 'Senior Frontend Developer',
          department: 'IT & Digital Services',
          location: 'Remote',
          type: 'Full-time',
          description: 'We are looking for an experienced Frontend Developer to join our team.',
        },
        {
          id: '2',
          title: 'Content Writer',
          department: 'Writing Services',
          location: 'Kathmandu, Nepal',
          type: 'Freelance',
          description: 'Seeking a creative content writer for tech blogs and marketing copy.',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-ink mb-6">
              Join Our <span className="text-accent">Team</span>
            </h1>
            <p className="text-lg text-ink-2 max-w-2xl mx-auto leading-relaxed">
              Discover opportunities to build a career in Nepal's premier freelancing and professional collaboration network.
            </p>
          </div>
        </RevealSection>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-border border-t-accent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.length > 0 ? (
              jobs.map((job, i) => (
                <RevealSection key={job.id} delay={i * 0.1}>
                  <JobCard job={job} />
                </RevealSection>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-ink-2">
                No open positions at the moment. Please check back later.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
