import InfoClient from './page.client';

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { slug: 'about' },
    { slug: 'contact' },
    { slug: 'careers' },
    { slug: 'affiliate-program' },
    { slug: 'privacy' },
    { slug: 'terms' },
    { slug: 'cookies' },
    { slug: 'linkedin' },
    { slug: 'facebook' },
    { slug: 'twitter' },
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${title} | Think Tank`,
  };
}


export default async function InfoPage({ params }) {
  const { slug } = await params;
  return <InfoClient slug={slug} />;
}
