import { Metadata } from 'next';
import About from "@/components/About";

export const metadata: Metadata = {
  title: 'About Us - Huawei eKit UAE | Leading ICT & Smart Business Solutions',
  description:
    'Learn about Huawei eKit UAE—your trusted provider of ICT solutions, SME networking, WiFi 6, Mini-FTTO fiber, storage, security, and smart business technologies designed for UAE enterprises and institutions.',
  keywords:
    'Huawei eKit UAE, Huawei UAE,Huawei Ekit,Ekit, Huawei networking UAE, eKit solutions UAE, ICT solutions UAE, WiFi 6 UAE, Mini FTTO UAE, SME networking solutions, Huawei technology UAE, enterprise IT UAE, educational equipment UAE',

  openGraph: {
    title: 'About Huawei eKit UAE | ICT, Networking & Smart Solutions',
    description:
      'Discover Huawei eKit UAE’s mission, vision, and commitment to delivering advanced ICT solutions including WiFi 6, Mini-FTTO fiber, security gateways, switches, storage, and enterprise networking.',
    type: 'website',
    url: 'https://huawei-uae.com/about',
    siteName: 'Huawei eKit UAE',
    images: [
      {
        url: '/Huawei.png',
        width: 1200,
        height: 630,
        alt: 'About Huawei eKit UAE Banner',
      }

    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'About Huawei eKit UAE | Empowering UAE Businesses with ICT Solutions',
    description:
      'Learn about Huawei eKit UAE’s advanced ICT and smart business technologies delivering seamless connectivity and digital transformation across UAE industries.',
    images: ['https://huawei-ekit.ae/images/og/about-banner.jpg'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return <About />;
}
