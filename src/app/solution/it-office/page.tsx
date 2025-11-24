import { Metadata } from 'next';
import SolutionOffice from "@/components/SolutionOffice";

export const metadata: Metadata = {
  title: 'IT Office Solutions - Huawei eKit UAE',
  description: 'Transform your workplace with Huawei eKit UAE IT office solutions. Discover smart office technology, networking solutions, and digital workspace tools tailored for UAE businesses.',
  keywords: 'IT office solutions,Huawei Ekit,Ekit, smart office technology, digital workplace, office networking, Huawei office solutions, business IT UAE, Huawei eKit UAE',
  openGraph: {
    title: 'IT Office Solutions - Huawei eKit UAE',
    description: 'Transform your workplace with Huawei eKit UAE IT office solutions. Discover smart office technology, networking solutions, and digital workspace tools tailored for UAE businesses.',
    type: 'website',
    url: 'https://huawei-uae.com/solution/it-office',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SolutionsiT() {
  return (
    <>
      <SolutionOffice/>
    </>
  )
}