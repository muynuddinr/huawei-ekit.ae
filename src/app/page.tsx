import { Metadata } from 'next';  
import { MainPages } from '@/components/Home'

export const metadata: Metadata = {
  title:
    'Huawei eKit UAE – Authorised Distributor Network Products | SME Network, Mini-FTTO Fiber, Enterprise Storage, Wi-Fi 6 & ICT Systems',

  description:
    'Huawei eKit UAE is the authorised distributor for Huawei network products in the UAE, offering complete SME network and ICT solutions including Mini-FTTO fiber systems, Wi-Fi 6 access points, enterprise switches, security gateways, NVMe storage, eKitStor SSDs, encrypted portable drives, and digital transformation tools.',

  keywords:
    'ekit, Ekit, Huawei, eKit Huawei, Huawei eKit UAE authorised distributor network products, Huawei authorised distributor UAE, SME Network UAE, Mini FTTO UAE, Mini-FTTO UAE, Huawei storage UAE, eKitStor UAE, NVMe SSD UAE, ICT solutions UAE, WiFi 6 UAE, Huawei switches UAE, Huawei gateways UAE, enterprise networking UAE, smart office UAE',

  openGraph: {
    title:
      'Huawei eKit UAE – Authorised Distributor Network Products | SME Network, Mini-FTTO Fiber & Enterprise Storage',
    description:
      'Huawei eKit UAE, the authorised distributor in the UAE, supplies Huawei network products, SME networking solutions, Mini-FTTO fiber, Wi-Fi 6 access points, enterprise switches, gateways, NVMe storage and secure ICT systems.',
    type: 'website',
    url: 'https://huawei-uae.com',
    siteName: 'Huawei eKit UAE - Authorised Distributor',
    images: [
      {
        url: '/Huawei.png',
        width: 1200,
        height: 630,
        alt: 'Huawei eKit UAE - Authorised Distributor',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title:
      'Huawei eKit UAE – Authorised Distributor Network Products | Mini-FTTO, Wi-Fi 6, Storage & ICT Solutions',
    description:
      'Huawei eKit UAE provides authorised Huawei network products including SME networking, Mini-FTTO fiber systems, Wi-Fi 6, switches, gateways, and enterprise storage.',
    images: ['/Huawei.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <MainPages></MainPages>
  )
}
