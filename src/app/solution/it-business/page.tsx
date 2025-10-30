import { Metadata } from 'next';
import SolutionBussiness from "@/components/SolutionBusiness";

export const metadata: Metadata = {
  title: 'Business IT Solutions - Huawei eKit UAE',
  description: 'Empower your business with Huawei eKit UAE enterprise IT solutions. Discover comprehensive business technology, enterprise networking, and digital transformation tools tailored for UAE enterprises.',
  keywords: 'business IT solutions, enterprise technology, digital transformation, business networking, Huawei enterprise solutions, corporate IT UAE, Huawei eKit UAE',
  openGraph: {
    title: 'Business IT Solutions - Huawei eKit UAE',
    description: 'Empower your business with Huawei eKit UAE enterprise IT solutions. Discover comprehensive business technology, enterprise networking, and digital transformation tools tailored for UAE enterprises.',
    type: 'website',
    url: 'https://huawei-ekit.ae/solution/it-business',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SolutionsiT() {
  return (
    <>
      <SolutionBussiness/>
    </>
  )
}