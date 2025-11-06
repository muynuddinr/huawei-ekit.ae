import { Metadata } from 'next';  
import { MainPages } from '@/components/Home'

export const metadata: Metadata = {
  title: 'Huawei eKit UAE - Premium Educational Equipment & Digital Solutions',
  description: 'Huawei eKit UAE offers premium educational equipment, testing instruments, and innovative digital solutions. Explore our cutting-edge technology products and services.',
  keywords: 'Huawei eKit UAE, Huawei educational equipment, digital solutions UAE, testing instruments, Huawei technology, eKit solutions, educational technology',
  openGraph: {
    title: 'Huawei eKit UAE - Premium Educational Equipment & Digital Solutions',
    description: 'Huawei eKit UAE offers premium educational equipment, testing instruments, and innovative digital solutions. Explore our cutting-edge technology products and services.',
    type: 'website',
    url: 'https://huawei-uae.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Huawei eKit UAE - Premium Educational Equipment & Digital Solutions',
    description: 'Huawei eKit UAE offers premium educational equipment, testing instruments, and innovative digital solutions. Explore our cutting-edge technology products and services.',
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