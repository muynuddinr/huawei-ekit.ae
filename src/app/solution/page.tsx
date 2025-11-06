import { Metadata } from 'next';
import Solution from "./Solution";

export const metadata: Metadata = {
  title: 'Solutions - Huawei eKit UAE',
  description: 'Explore Huawei eKit UAE solutions for enterprise, education, healthcare, and smart office environments. Find comprehensive IT solutions tailored for UAE businesses.',
  keywords: 'Huawei solutions, IT solutions UAE, enterprise solutions, education technology, healthcare IT, smart office, Huawei eKit UAE',
  openGraph: {
    title: 'Solutions - Huawei eKit UAE',
    description: 'Explore Huawei eKit UAE solutions for enterprise, education, healthcare, and smart office environments. Find comprehensive IT solutions tailored for UAE businesses.',
    type: 'website',
    url: 'https://huawei-uae.com/solution',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Solutions() {
  return (
    <Solution />
  )
}