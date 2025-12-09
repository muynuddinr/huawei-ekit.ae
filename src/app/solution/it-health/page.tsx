import { Metadata } from 'next';
import SolutionHealth from "@/components/SolutionHealth";

export const metadata: Metadata = {
  title: 'Healthcare IT Solutions - Huawei eKit UAE',
  description: 'Advanced healthcare IT solutions from Huawei eKit UAE. Discover innovative medical technology, healthcare networking, and digital health solutions designed for UAE healthcare facilities.',
  keywords: 'healthcare IT solutions,Huawei Ekit,Ekit, medical technology, digital health, hospital networking, Huawei healthcare solutions, medical IT UAE, Huawei eKit UAE',
  openGraph: {
    title: 'Healthcare IT Solutions - Huawei eKit UAE',
    description: 'Advanced healthcare IT solutions from Huawei eKit UAE. Discover innovative medical technology, healthcare networking, and digital health solutions designed for UAE healthcare facilities.',
    type: 'website',
    url: 'https://huawei-uae.com/solution/it-health',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Solutions() {
  return (
    <>
      <SolutionHealth/>
    </>
  )
}