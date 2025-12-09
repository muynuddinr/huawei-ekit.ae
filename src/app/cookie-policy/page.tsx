import { Metadata } from 'next';  

export const metadata: Metadata = {
  title: 'Cookie Policy | Huawei eKit UAE',
  description:
    'Understand how Huawei eKit UAE uses cookies to improve website performance, security, and user experience. Learn about cookie categories, data usage, and how to manage your preferences in compliance with UAE data protection standards.',
  keywords:
    'Huawei eKit UAE cookie policy, Huawei ekit UAE,Ekit,Huawei,website cookies UAE, privacy and cookies, cookie settings, data protection UAE, Huawei UAE cookies, tracking technologies, user privacy',

  openGraph: {
    title: 'Cookie Policy | Huawei eKit UAE',
    description:
      'Detailed information on how Huawei eKit UAE uses cookies to optimize performance, enhance security, and comply with UAE privacy regulations.',
    url: 'https://huawei-uae.com/cookie-policy',
    siteName: 'Huawei eKit UAE',
    locale: 'en_US',
    type: 'website',

    images: [
      {
        url: '/Huawei.png',
        width: 1200,
        height: 630,
        alt: 'Huawei eKit UAE Cookie Policy',
      },
      {
        url: '/Huawei.pngg',
        width: 800,
        height: 800,
        alt: 'Huawei eKit UAE Logo',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy | Huawei eKit UAE',
    description:
      'Learn how Huawei eKit UAE uses cookies to enhance security, performance, and user experience.',
    images: ['/Huawei.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://huawei-ekit.ae/cookie-policy',
  },
};
export default function Home() {
  return (
   <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-black">
          Cookie Policy
        </h1>

        <div className="bg-gray-50 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">What Are Cookies?</h2>
            <p className="text-gray-700">
              Cookies are small text files that are placed on your device when you visit our website.
              They help us provide you with a better experience by remembering your preferences,
              analyzing site usage, and assisting with our marketing efforts in compliance with UAE data protection regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">How We Use Cookies</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li>
                <span className="font-semibold text-gray-800">Essential Cookies:</span> Required for the website to function properly, including authentication and security features necessary for our services in the UAE.
              </li>
              <li>
                <span className="font-semibold text-gray-800">Performance Cookies:</span> Help us understand how visitors interact with our website by collecting anonymous information to improve user experience.
              </li>
              <li>
                <span className="font-semibold text-gray-800">Functionality Cookies:</span> Remember your preferences and choices to enhance your browsing experience across our platform.
              </li>
              <li>
                <span className="font-semibold text-gray-800">Marketing Cookies:</span> Used to track visitors across websites to display relevant advertisements for Huawei products and services in the UAE region.
              </li>
              <li>
                <span className="font-semibold text-gray-800">Analytics Cookies:</span> Help us analyze website traffic and user behavior to optimize our content and services.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Cookie Consent</h2>
            <p className="text-gray-700 mb-4">
              In accordance with UAE data protection regulations, we obtain your consent before placing non-essential cookies on your device. 
              You can manage your cookie preferences at any time through our cookie consent banner or your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Managing Cookies</h2>
            <p className="text-gray-700 mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li>Delete all cookies from your browser</li>
              <li>Block cookies from being set</li>
              <li>Allow only certain types of cookies</li>
              <li>Browse in private/incognito mode</li>
              <li>Use our cookie preference center to customize your settings</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Please note that blocking some types of cookies may impact your experience on our website and certain features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700">
              We may use third-party services that set cookies on our website for analytics, advertising, 
              and functionality purposes. These third parties are required to comply with UAE data protection 
              laws and our privacy standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Updates to This Policy</h2>
            <p className="text-gray-700">
              We may update this Cookie Policy from time to time to reflect changes in technology, 
              legal requirements, or our services. Any changes will be posted on this page with an 
              updated revision date. Please check back periodically to stay informed about our use of cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Your Rights</h2>
            <p className="text-gray-700">
              Under UAE data protection regulations, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
              <li>Withdraw your cookie consent at any time</li>
              <li>Access information about the cookies we use</li>
              <li>Request deletion of cookie data</li>
              <li>Object to certain types of cookie processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about our Cookie Policy or cookie practices, please contact us at:{' '} <br />
              <a href="mailto:info@huawei-ekit.ae" className="text-black hover:text-gray-600 transition-colors">
                mail@ekit-huawei-uae.com
              </a>
              <br />
              
            </p>
            <p className="text-gray-700">
              <a href="tel:+971800123456" className="text-black hover:text-gray-600 transition-colors">
               +0097150966 4956
              </a>
              <br />
              
            </p>
            <p className="text-gray-700 mt-2">
              25th St - Naif - Dubai - United Arab Emirates
            </p>
          </section>

          <section className="pt-4 border-t border-gray-300">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
