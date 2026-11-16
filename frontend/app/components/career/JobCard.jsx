'use client';

import { LuBriefcase, LuMapPin, LuBuilding2 } from 'react-icons/lu';
import Link from 'next/link';

export default function JobCard({ job, onApply }) {
  return (
    <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 flex flex-col h-full hover-lift shadow-sm transition-all duration-300 hover:border-accent/40 group">
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
          <LuBriefcase className="w-6 h-6" />
        </div>
        <span className="px-3 py-1 bg-surface-2 text-ink-2 text-xs font-semibold rounded-full border border-border">
          {job.type}
        </span>
      </div>

      <h3 className="text-xl font-display font-bold text-ink mb-3 group-hover:text-accent transition-colors">
        {job.title}
      </h3>
      
      <p className="text-sm text-ink-2 mb-6 line-clamp-3 flex-1">
        {job.description}
      </p>

      <div className="space-y-2 mb-8">
        <div className="flex items-center text-sm text-ink-2">
          <LuBuilding2 className="w-4 h-4 mr-2 opacity-70" />
          <span>{job.department}</span>
        </div>
        <div className="flex items-center text-sm text-ink-2">
          <LuMapPin className="w-4 h-4 mr-2 opacity-70" />
          <span>{job.location}</span>
        </div>
      </div>

      <Link 
        href={`/info/careers/${job.id}`}
        className="w-full py-3 rounded-xl bg-surface-2 text-ink font-semibold hover:bg-accent hover:text-white transition-colors duration-300 border border-border hover:border-accent text-center block"
      >
        View Details & Apply
      </Link>
    </div>
  );
}
