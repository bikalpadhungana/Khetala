export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://ttfreelancinghub.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/affiliate/dashboard', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
