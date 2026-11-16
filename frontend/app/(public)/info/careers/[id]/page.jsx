'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LuArrowLeft, LuBriefcase, LuMapPin, LuBuilding2, LuCircleCheck, LuUpload, LuFileText, LuX } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/app/api/api';

export default function JobApplicationPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    coverLetter: '',
    resumeUrl: '', // In a real app, this would be an S3 link from an uploaded file
  });

  // Simulated file upload state for high-grade UI
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/career/jobs/${id}`);
      if (response.data && response.data.data) {
        setJob(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch job', err);
      // Fallback for demo purposes if backend isn't seeded
      if (id === '1') {
        setJob({
          id: '1',
          title: 'Senior Frontend Developer',
          department: 'IT & Digital Services',
          location: 'Remote',
          type: 'Full-time',
          description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building highly interactive and polished user interfaces using React and Next.js.',
        });
      } else if (id === '2') {
        setJob({
          id: '2',
          title: 'Content Writer',
          department: 'Writing Services',
          location: 'Kathmandu, Nepal',
          type: 'Freelance',
          description: 'Seeking a creative content writer for tech blogs and marketing copy.',
        });
      } else {
        router.push('/info/careers');
      }
    } finally {
      setLoadingJob(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      simulateFileUpload(file);
    }
  };

  const simulateFileUpload = (file) => {
    setUploadingFile(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadingFile(false);
          // Mocking the uploaded URL
          setFormData((prevData) => ({ ...prevData, resumeUrl: `https://storage.thinktank.com/resumes/${file.name}` }));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setFormData({ ...formData, resumeUrl: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resumeUrl && !selectedFile) {
      setError('Please provide a resume link or upload a file.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/career/apply', {
        ...formData,
        jobId: job.id,
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-bg">
        <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-24">

        {/* Top Navigation */}


        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* Left Column: Job Info */}
          <div className="lg:w-1/3 flex flex-col gap-8">
            <div className="sticky top-32">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-accent shadow-sm mb-6">
                  <LuBriefcase className="w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-ink mb-4 leading-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="inline-flex items-center px-3 py-1.5 bg-surface border border-border text-ink-2 text-sm font-semibold rounded-full">
                    <LuBuilding2 className="w-4 h-4 mr-2" />
                    {job.department}
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 bg-surface border border-border text-ink-2 text-sm font-semibold rounded-full">
                    <LuMapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 bg-surface border border-border text-ink-2 text-sm font-semibold rounded-full">
                    <LuBriefcase className="w-4 h-4 mr-2" />
                    {job.type}
                  </span>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-bold text-ink mb-3">About the Role</h3>
                <p className="text-ink-2 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="mt-10 p-6 bg-surface border border-border rounded-2xl">
                <h4 className="font-bold text-ink mb-2">Questions?</h4>
                <p className="text-sm text-ink-2 mb-4">If you have any questions regarding this position, please reach out to our team.</p>
                <Link href="/contact" className="text-sm font-semibold text-accent hover:underline">Contact HR &rarr;</Link>
              </div>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface border border-border rounded-3xl p-10 md:p-16 shadow-xl flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-success-light text-success rounded-full flex items-center justify-center mb-8">
                    <LuCircleCheck className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-ink mb-4">Application Submitted!</h2>
                  <p className="text-lg text-ink-2 max-w-md mx-auto mb-10 leading-relaxed">
                    Thank you for applying for the <strong>{job.title}</strong> position. Our HR team will review your application and get back to you shortly.
                  </p>
                  <Link
                    href="/info/careers"
                    className="px-8 py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                  >
                    View More Openings
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface border border-border rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden"
                >
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                  <div className="mb-10 relative z-10">
                    <h2 className="text-2xl font-display font-bold text-ink mb-2">Submit Your Application</h2>
                    <p className="text-ink-2">Please complete the form below to apply for this position.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    {error && (
                      <div className="p-4 bg-danger-light text-danger rounded-xl text-sm border border-danger/20 font-medium">
                        {error}
                      </div>
                    )}

                    {/* Personal Information */}
                    <div className="space-y-6">
                      <h3 className="text-sm font-bold text-ink tracking-wider uppercase border-b border-border pb-2">Personal Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-ink-2">Full Name *</label>
                          <input
                            required
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-xl border border-border bg-bg text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-ink-3 font-medium"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-ink-2">Email Address *</label>
                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-xl border border-border bg-bg text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-ink-3 font-medium"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-ink-2">Phone Number *</label>
                          <input
                            required
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-xl border border-border bg-bg text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-ink-3 font-medium"
                            placeholder="+977 98xxxxxxxx"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-ink-2">LinkedIn URL</label>
                          <input
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-xl border border-border bg-bg text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-ink-3 font-medium"
                            placeholder="https://linkedin.com/in/johndoe"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Resume / Portfolio */}
                    <div className="space-y-6 pt-4">
                      <h3 className="text-sm font-bold text-ink tracking-wider uppercase border-b border-border pb-2">Resume & Portfolio</h3>

                      {/* Premium Drag & Drop Upload UI */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-ink-2">Upload Resume *</label>

                        {!selectedFile ? (
                          <div className="relative border-2 border-dashed border-border hover:border-accent rounded-2xl p-10 bg-bg transition-colors group cursor-pointer text-center">
                            <input
                              type="file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                            />
                            <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-accent group-hover:text-accent transition-all duration-300">
                              <LuUpload className="w-8 h-8 text-ink-2 group-hover:text-accent" />
                            </div>
                            <h4 className="text-lg font-bold text-ink mb-1 group-hover:text-accent transition-colors">Click to upload or drag and drop</h4>
                            <p className="text-sm text-ink-2">PDF, DOC, or DOCX (Max 5MB)</p>
                          </div>
                        ) : (
                          <div className="border border-border rounded-2xl p-6 bg-bg flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                                <LuFileText className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-semibold text-ink truncate max-w-[200px] md:max-w-xs">{selectedFile.name}</span>
                                  <span className="text-xs text-ink-2 font-medium">{uploadProgress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-accent transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            {!uploadingFile && (
                              <button
                                type="button"
                                onClick={removeFile}
                                className="ml-6 p-2 rounded-lg text-ink-2 hover:bg-danger-light hover:text-danger transition-colors"
                              >
                                <LuX className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-4 py-2">
                          <div className="h-px bg-border flex-1" />
                          <span className="text-xs text-ink-3 font-bold uppercase tracking-wider">OR</span>
                          <div className="h-px bg-border flex-1" />
                        </div>

                        <input
                          name="resumeUrl"
                          value={formData.resumeUrl}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-xl border border-border bg-bg text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-ink-3 font-medium"
                          placeholder="Link to your Google Drive or Portfolio"
                          disabled={!!selectedFile}
                        />
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-6 pt-4">
                      <h3 className="text-sm font-bold text-ink tracking-wider uppercase border-b border-border pb-2">Additional Information</h3>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-ink-2">Cover Letter</label>
                        <textarea
                          name="coverLetter"
                          value={formData.coverLetter}
                          onChange={handleChange}
                          rows={5}
                          className="w-full px-5 py-4 rounded-xl border border-border bg-bg text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none placeholder:text-ink-3 font-medium"
                          placeholder="Tell us why you are a great fit for this role..."
                        />
                      </div>
                    </div>

                    <div className="pt-8 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading || uploadingFile}
                        className="w-full md:w-auto px-10 py-4 rounded-xl font-bold text-white bg-accent hover:bg-accent-hover transition-colors disabled:opacity-70 shadow-lg shadow-accent/20"
                      >
                        {loading ? 'Submitting Application...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
