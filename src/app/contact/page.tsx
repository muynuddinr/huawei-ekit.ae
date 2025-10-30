import { Metadata } from 'next';  
import Contact from '@/components/Contact';

export const metadata: Metadata = {
  title: 'Contact Huawei eKit UAE - Get in Touch',
  description: 'Contact Huawei eKit UAE for inquiries about our products, solutions, and services. Reach out to our team for premium educational equipment and digital solutions.',
  keywords: 'Contact Huawei eKit, Huawei UAE contact, Huawei support, eKit inquiries, educational equipment contact, Huawei technology support',
  openGraph: {
    title: 'Contact Huawei eKit UAE - Get in Touch',
    description: 'Contact Huawei eKit UAE for inquiries about our products, solutions, and services. Reach out to our team for premium educational equipment and digital solutions.',
    type: 'website',
    url: 'https://huawei-ekit-uae.com/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Huawei eKit UAE - Get in Touch',
    description: 'Contact Huawei eKit UAE for inquiries about our products, solutions, and services. Reach out to our team for premium educational equipment and digital solutions.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function COntactPage() {
  return (
    <>
      <Contact/>
    </>
  )
}