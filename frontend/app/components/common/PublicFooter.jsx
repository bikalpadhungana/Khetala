import Link from 'next/link';
import Logo from '@/app/components/common/Logo';
import { SERVICE_DEPARTMENTS } from '@/app/lib/constants';
import {
  LuMail,
  LuHeart,
  LuLinkedin,
  LuFacebook,
  LuPhone,
  LuMapPin
} from 'react-icons/lu';
import { FaTiktok, FaInstagram, FaXTwitter } from 'react-icons/fa6';

export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-gradient-to-br from-green-500/10 to-blue-500/10 dark:from-green-900/20 dark:to-blue-900/20 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Section: Newsletter Subscribe Box */}


        {/* Middle Section: Main Links Grid */}
        <div className="grid grid-cols-2 lg:flex lg:flex-row flex-wrap lg:flex-nowrap justify-between gap-x-6 gap-y-10 sm:gap-10 lg:gap-6 xl:gap-8">

          {/* Logo & Description */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-start lg:max-w-[340px] xl:max-w-[380px] shrink-0">
            <Logo variant="transparent" size="lg" className="mb-5" />
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              Think Tank Freelancing Hub is Nepal's premier multi-service platform connecting talented freelancers with high-value contracts and global opportunities.
            </p>
            <div className="flex items-center gap-2 text-sm text-foreground font-medium mb-6 bg-background/50 py-2 px-3 rounded-xl border border-border/40 shadow-sm w-fit">
              <span className="font-bold text-muted-foreground uppercase tracking-wider text-xs mr-1">Location:</span>
              <LuMapPin className="w-4 h-4 text-accent shrink-0" />
              <span className="leading-snug">Kathmandu, Nepal</span>
            </div>
          </div>

          {/* Dynamic Services List */}
          <div className="shrink-0">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Service Sectors</h4>
            <div className="flex flex-col space-y-3">
              {SERVICE_DEPARTMENTS.map((dept) => (
                <Link
                  key={dept.slug}
                  href={`/services/${dept.slug}`}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors line-clamp-1 leading-snug"
                >
                  {dept.title.replace(' Services', '')}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Number */}
          <div className="shrink-0">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Contact Number</h4>
            <ul className="space-y-3">
              {[
                '+977 9856017621',
                '+977 9845136730',
                '+977 9819120670',
                '+977 9802365432',
                '+977 9864378571',
              ].map((num) => (
                <li key={num}>
                  <a
                    href={`tel:${num.replace(/\s+/g, '')}`}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group whitespace-nowrap"
                  >
                    <LuPhone className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-accent transition-colors shrink-0" />
                    <span>{num}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* E-mail */}
          <div className="shrink-0">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">E-mail</h4>
            <ul className="space-y-4">
              {[
                'ttfreelancinghub@gmail.com',
                'info@ttfreelancinghub.com'
              ].map((email) => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <LuMail className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-accent transition-colors shrink-0" />
                    <span className="truncate max-w-[140px] sm:max-w-none">{email}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="shrink-0">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/info/about" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/info/careers" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/info/affiliate-program" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div className="shrink-0">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/info/privacy" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/info/terms" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us links */}


        </div>

        {/* Bottom Section: Footer Meta / Credits */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center gap-4 md:gap-10">
          <p className="text-xs text-muted-foreground text-center md:text-left text-balance">
            © {new Date().getFullYear()} Think Tank Freelancing Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/company/ttfreelancinghub"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent hover:bg-secondary/30 transition-all hover:scale-110"
              title="LinkedIn"
            >
              <LuLinkedin className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61590241028680"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent hover:bg-secondary/30 transition-all hover:scale-110"
              title="Facebook"
            >
              <LuFacebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/ttfreelancinghub/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent hover:bg-secondary/30 transition-all hover:scale-110"
              title="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/ttfreelancehub"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent hover:bg-secondary/30 transition-all hover:scale-110"
              title="X (Twitter)"
            >
              <FaXTwitter className="w-4 h-4" />
            </a>
            <a
              href="https://www.tiktok.com/@ttfreelancinghub"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent hover:bg-secondary/30 transition-all hover:scale-110"
              title="TikTok"
            >
              <FaTiktok className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
