import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions - Huawei eKit UAE',
  description:
    'Official Terms and Conditions for Huawei eKit UAE – Understand service usage, legal policies, product guidelines, and user responsibilities in compliance with UAE regulations.',
  keywords:
    'Huawei eKit UAE terms and conditions, Huawei ekit UAE,Ekit,Huawei,Huawei UAE policies, terms of service, UAE legal terms, user agreement, service terms, ICT solutions UAE, networking equipment UAE',

  openGraph: {
    title: 'Terms and Conditions - Huawei eKit UAE',
    description:
      'Read the official Terms and Conditions for Huawei eKit UAE, covering service usage, responsibilities, legal compliance, product policies, and UAE regulations.',
    type: 'website',
    url: 'https://huawei-uae.com/terms-of-service',
    siteName: 'Huawei eKit UAE',

    images: [
      {
        url: '/Huawei.png',
        width: 1200,
        height: 630,
        alt: 'Huawei eKit UAE Terms and Conditions',
      },
      {
        url: '/Huawei.png',
        width: 800,
        height: 800,
        alt: 'Huawei eKit UAE Logo',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Terms and Conditions - Huawei eKit UAE',
    description:
      'Official Terms and Conditions for Huawei eKit UAE including service rules, legal policies, and UAE-compliant guidelines.',
    images: ['https://huawei-ekit.ae/images/og/terms-banner.jpg'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-black mb-12">
          Terms and Conditions
        </h1>

        <div className="space-y-8 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Introduction</h2>
            <p className="text-black leading-relaxed">
              Welcome to Huawei eKit UAE. By accessing and using our website and services, you accept and agree
              to be bound by the terms and conditions outlined below. Please read these terms carefully before using our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Use of Services</h2>
            <ul className="list-disc list-inside text-black space-y-2">
              <li>Services must be used in accordance with UAE laws and regulations</li>
              <li>Users must not engage in any unauthorized or illegal activities</li>
              <li>Access to services may be restricted or terminated for violations</li>
              <li>Users are responsible for maintaining account security</li>
              <li>Services are provided "as is" without warranties</li>
              <li>Proper use of Huawei networking equipment and software is required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Intellectual Property</h2>
            <p className="text-black leading-relaxed">
              All content, including but not limited to logos, designs, text, graphics, and software, is the property
              of Huawei eKit UAE and is protected by intellectual property laws. Huawei trademarks and product names are
              property of Huawei Technologies Co., Ltd. Users may not reproduce, distribute, or create derivative works without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Product and Service Terms</h2>
            <ul className="list-disc list-inside text-black space-y-2">
              <li>Product specifications are subject to change without notice</li>
              <li>Pricing may be modified at our discretion</li>
              <li>Warranty terms vary by product category and UAE regulations</li>
              <li>Service availability may depend on geographic location within UAE</li>
              <li>Custom orders may be subject to additional terms</li>
              <li>All products comply with UAE standards and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Payment and Billing</h2>
            <p className="text-black leading-relaxed">
              Payment terms are specified at the time of purchase. We accept various payment methods including AED currency
              and all transactions are secured according to UAE financial regulations. Refunds and cancellations are subject
              to our refund policy and UAE consumer protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Limitation of Liability</h2>
            <p className="text-black leading-relaxed">
              Huawei eKit UAE shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages arising from the use of our services or products. Our liability is limited to the
              amount paid for the specific product or service, in accordance with UAE commercial laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Governing Law</h2>
            <p className="text-black leading-relaxed">
              These terms and conditions shall be governed by and construed in accordance with the laws of the United Arab Emirates.
              Any disputes shall be subject to the exclusive jurisdiction of the courts of the UAE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Contact Information</h2>
            <p className="text-black leading-relaxed">
              For questions about these terms, please contact us at:{' '} <br />
              <a href="mailto:mail@ekit-huawei-uae.com" className="text-black hover:text-gray-600">
                mail@ekit-huawei-uae.com
              </a>
              <br />

            </p>
            <p className="text-black leading-relaxed mt-2">

              <a href="tel:+0097150966 4956
" className="text-black hover:text-gray-600">
                +0097150966 4956

              </a>
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
  );
}