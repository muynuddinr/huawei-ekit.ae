import { Metadata } from 'next';  
import About from "@/components/About";

export const metadata: Metadata = {
  title: 'About Us - Huawei eKit UAE',
  description: 'Explore Huawei eKit UAE products and solutions. Premium educational equipment, testing instruments, and digital solutions from Huawei.',
  keywords: 'Huawei eKit, Huawei UAE, Huawei products, eKit solutions, educational equipment, testing instruments, digital solutions, Huawei technology',
  openGraph: {
    title: 'About Us - Huawei eKit UAE',
    description: 'Explore Huawei eKit UAE products and solutions. Premium educational equipment, testing instruments, and digital solutions from Huawei.',
    type: 'website',
    url: 'https://huawei-ekit-uae.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Huawei eKit UAE',
    description: 'Explore Huawei eKit UAE products and solutions. Premium educational equipment, testing instruments, and digital solutions from Huawei.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <>
      <About/>
    </>
  )
}