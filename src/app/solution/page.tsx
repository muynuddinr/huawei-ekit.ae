import { Metadata } from 'next';
import Solution from "./Solution";

export const metadata: Metadata = {
  title: 'Solutions - Huawei eKit UAE | Enterprise, SME & ICT Solutions',
  description:
    'Discover Huawei eKit UAE solutions for Enterprises, SMEs, Education, Healthcare, Hospitality, and Smart Offices. Advanced ICT, networking, Wi-Fi 6, Mini-FTTO fiber, storage, and security solutions tailored for UAE businesses.',
  keywords:
    'Huawei eKit solutions UAE, Huawei,ekit,Ekit,Huawei UAE,Huawei uae,enterprise ICT UAE, SME IT solutions UAE, Mini FTTO fiber UAE, WiFi 6 solutions UAE, education IT solutions UAE, healthcare networking UAE, smart office UAE, business networking solutions UAE',

  openGraph: {
    title: 'Huawei eKit UAE Solutions | ICT, Networking & Smart Business Systems',
    description:
      'Explore Huawei eKit UAE business solutions including fiber networks, WiFi 6, secure gateways, enterprise switching, storage, and digital transformation systems designed for UAE businesses.',
    type: 'website',
    url: 'https://huawei-uae.com/solution',
    siteName: 'Huawei eKit UAE',

    images: [
      {
        url: '/Huawei.png',
        width: 1200,
        height: 630,
        alt: 'Huawei eKit UAE Solutions Banner',
      },
      {
        url: '/Huawei.png',
        width: 800,
        height: 800,
        alt: 'Huawei eKit UAE Logo',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Huawei eKit UAE – Business & ICT Solutions',
    description:
      'Explore Huawei eKit UAE’s complete ICT solutions for enterprise, SME, education, healthcare, and smart workspaces.',
    images: ['/Huawei.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Solutions() {
  return <Solution />;
}
