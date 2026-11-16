import { SERVICE_SECTORS } from '@/app/lib/constants';
import ServicesClient from './page.client';

export async function generateStaticParams() {
  return SERVICE_SECTORS.map((sector) => ({
    sector: sector.value,
  }));
}

export async function generateMetadata({ params }) {
  const { sector } = await params;
  const sectorInfo = SERVICE_SECTORS.find(s => s.value === sector);
  return {
    title: `${sectorInfo ? sectorInfo.label : sector} Services`,
    description: sectorInfo ? sectorInfo.description : 'Explore our services.',
  };
}


export default async function ServicesPage({ params }) {
  const { sector } = await params;
  return <ServicesClient sector={sector} />;
}
