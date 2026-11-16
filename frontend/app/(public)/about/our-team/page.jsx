'use client';

import React from 'react';
import { LuLinkedin, LuMail } from 'react-icons/lu';
const LEADERSHIP_TEAM = [
  {
    id: 1,
    name: 'Pradip Timsina',
    role: 'Founder & Executive Director',
    image: '/images/team/Pradip_Timsina.jpg',
    linkedin: 'https://www.linkedin.com/in/pradiptimsina/',
    email: 'mailto:thinktanktimsinapradip1@gmail.com'
  },
  {
    id: 2,
    name: 'Bikalpa Dhungana',
    role: 'Chief Executive Officer',
    image: 'https://ui-avatars.com/api/?name=Bikalpa+Dhungana&background=0D8ABC&color=fff&size=512',
    linkedin: 'https://www.linkedin.com/in/bikalpadhungana/',
    email: '#'
  },
  {
    id: 3,
    name: 'Khadananda Poudel',
    role: 'Chief Administrative Officer',
    image: 'https://ui-avatars.com/api/?name=Khadananda+Poudel&background=0D8ABC&color=fff&size=512',
    linkedin: '#',
    email: '#'
  },

  {
    id: 4,
    name: 'Ananta Wagle',
    role: 'Chief Technical Officer',
    image: 'https://ui-avatars.com/api/?name=Ananta+Wagle&background=0D8ABC&color=fff&size=512',
    linkedin: 'https://np.linkedin.com/in/ananta-wagle-44b148193',
    email: 'mailto:wagle99ananta@gmail.com'
  },
  {
    id: 5,
    name: 'Udaya Shankhi',
    role: 'Chief Information Officer',
    image: '/images/team/Udaya Shankhi.jpeg',
    linkedin: 'https://www.linkedin.com/in/udaya-shankhi-729b821b3/',
    email: 'mailto:udayashankhi123@gmail.com',
    objectPosition: 'center 25%'
  },


  {
    id: 6,
    name: 'Naresh Acharya',
    role: 'Chief Strategy Officer',
    image: '/images/team/Naresh_Acharya.jpeg',
    linkedin: '#',
    email: '#'
  },
  {
    id: 7,
    name: 'Jaya Sharma',
    role: 'Chief Financial Officer',
    image: 'https://ui-avatars.com/api/?name=Jaya+Sharma&background=0D8ABC&color=fff&size=512',
    linkedin: '#',
    email: '#'
  }
];

const TeamMemberCard = ({ member }) => (
  <div className="group bg-card rounded-3xl shadow-md border border-border/60 overflow-hidden hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
    <div className="aspect-[4/3] sm:aspect-square md:aspect-[4/3] relative w-full bg-gradient-to-br from-secondary/80 to-secondary/30 overflow-hidden">
      <img
        src={member.image}
        alt={member.name}
        style={{ objectPosition: member.objectPosition || 'top' }}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
    <div className="p-6 xl:p-8 flex-1 flex flex-col relative bg-card z-10">
      <h3 className="text-xl xl:text-2xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
        {member.name}
      </h3>
      <p className="text-[10px] xl:text-xs font-bold text-accent mb-4 uppercase tracking-widest flex-1">
        {member.role}
      </p>
      <div className="flex items-center gap-4 pt-6 border-t border-border/60 mt-auto">
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground hover:bg-[#0A66C2] hover:text-white transition-all hover:scale-110 hover:shadow-md shrink-0" aria-label="LinkedIn">
          <LuLinkedin className="w-4 h-4" />
        </a>
        <a href={member.email} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-white transition-all hover:scale-110 hover:shadow-md shrink-0" aria-label="Email">
          <LuMail className="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
);

export default function OurTeamPage() {
  const coreTeam = LEADERSHIP_TEAM.filter(m => m.id <= 5);
  const planningTeam = LEADERSHIP_TEAM.filter(m => m.id === 6);
  const financeTeam = LEADERSHIP_TEAM.filter(m => m.id === 7);

  const cardSizingClass = "w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(20%-1.6rem)]";

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 bg-gray-50/50 dark:bg-background pt-32 md:pt-40 pb-20">
        <div className="max-w-[90rem] mx-auto px-6">
          {/* Core Team */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-[#014c9f]">Leadership</span> <span className="text-green-600">Team</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                The brilliant minds behind our success
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 xl:gap-8 mx-auto">
              {coreTeam.map((member) => (
                <div key={member.id} className={cardSizingClass}>
                  <TeamMemberCard member={member} />
                </div>
              ))}
            </div>
          </div>

          {/* Planning and Strategy Department */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-[#014c9f]">Planning & Strategy</span> <span className="text-green-600">Department</span>
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-6 xl:gap-8 mx-auto">
              {planningTeam.map((member) => (
                <div key={member.id} className={cardSizingClass}>
                  <TeamMemberCard member={member} />
                </div>
              ))}
            </div>
          </div>

          {/* Finance Department */}
          <div>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-[#014c9f]">Finance</span> <span className="text-green-600">Department</span>
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-6 xl:gap-8 mx-auto">
              {financeTeam.map((member) => (
                <div key={member.id} className={cardSizingClass}>
                  <TeamMemberCard member={member} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
