import { Metadata } from 'next';
import SolutionEducation from "@/components/SolutionEductaion"

export const metadata: Metadata = {
  title: 'Education IT Solutions - Huawei eKit UAE',
  description: 'Enhance learning environments with Huawei eKit UAE education IT solutions. Discover smart classroom technology, campus networking, and digital learning tools designed for UAE educational institutions.',
  keywords: 'education IT solutions, smart classroom, campus technology, educational networking, Huawei education solutions, school IT UAE, Huawei eKit UAE',
  openGraph: {
    title: 'Education IT Solutions - Huawei eKit UAE',
    description: 'Enhance learning environments with Huawei eKit UAE education IT solutions. Discover smart classroom technology, campus networking, and digital learning tools designed for UAE educational institutions.',
    type: 'website',
    url: 'https://huawei-uae.com/solution/it-education',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Solutions() {
  return (
    <>
      <SolutionEducation/>
    </>
  )
}