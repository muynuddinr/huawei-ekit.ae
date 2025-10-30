import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Huawei eKit UAE',
  description: 'Learn about how Huawei eKit UAE uses cookies to enhance your browsing experience. Our cookie policy explains the types of cookies we use and how you can manage them in compliance with UAE regulations.',
  keywords: 'cookie policy, cookies, privacy, website cookies, Huawei eKit UAE, Huawei UAE, data protection UAE',
  openGraph: {
    title: 'Cookie Policy | Huawei eKit UAE',
    description: 'Understanding how we use cookies to improve your experience in compliance with UAE data protection laws',
    url: 'https://huawei-ekit.ae/cookie-policy',
    siteName: 'Huawei eKit UAE',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://huawei-ekit.ae/cookie-policy'
  }
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}1