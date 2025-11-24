import { Metadata } from 'next';  
import Contact from '@/components/Contact';

export const metadata: Metadata = {
  title: 'Contact Huawei eKit UAE - Authorised Distributor | Support & Sales Inquiries',

  description:
    'Get in touch with Huawei eKit UAE, the authorised distributor in the UAE for SME Network solutions, Mini-FTTO fiber systems, Wi-Fi 6 devices, enterprise switches, gateways, and eKitStor storage. Contact our team for sales inquiries, technical support, product information, and business partnerships.',

  keywords:
    'Contact Huawei eKit UAE,Huawei,eKit,Huawei Ekit, Huawei authorised distributor UAE, Huawei eKit support UAE, Huawei sales UAE, Mini FTTO UAE contact, SME Network UAE contact, Huawei WiFi 6 UAE contact, Huawei storage UAE contact, Huawei eKitStor UAE, ICT solutions UAE, business networking UAE',

  openGraph: {
    title: 'Contact Huawei eKit UAE - Authorised Distributor | Sales & Support',
    description:
      'Reach out to Huawei eKit UAE for product inquiries, support, SME network solutions, Mini-FTTO fiber, Wi-Fi 6 devices, enterprise switches, gateways, and storage solutions.',
    type: 'website',
    url: 'https://huawei-uae.com/contact',
    images: [
      {
        url: '/Huawei.png',
        width: 1200,
        height: 630,
        alt: 'Contact Huawei eKit UAE - Authorised Distributor',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Contact Huawei eKit UAE - Authorised Distributor | Support & Inquiries',
    description:
      'Contact Huawei eKit UAE for support, sales inquiries, Mini-FTTO fiber solutions, SME network equipment, Wi-Fi 6, switches, gateways, and storage products.',
    images: ['/assets/seo/huawei-ekit-uae-contact-banner.jpg'],
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