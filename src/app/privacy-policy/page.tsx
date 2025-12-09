import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Huawei eKit UAE',
  description:
    'Privacy Policy for Huawei eKit UAE – Understand how your personal information is collected, used, and protected in compliance with UAE data protection regulations.',
  keywords:
    'privacy policy, Huawei eKit UAE, data protection UAE,Huawei ekit UAE,Ekit,Huawei, personal information, data privacy, UAE regulations, Huawei UAE, data security',

  openGraph: {
    title: 'Privacy Policy - Huawei eKit UAE',
    description:
      'Learn how Huawei eKit UAE collects, protects, and manages your personal information according to UAE data protection laws.',
    type: 'website',
    url: 'https://huawei-uae.com/privacy-policy',

    images: [
      {
        url: '/Huawei.png',
        width: 1200,
        height: 630,
        alt: 'Huawei eKit UAE Privacy Policy',
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
    title: 'Privacy Policy - Huawei eKit UAE',
    description:
      'Understand how Huawei eKit UAE handles and protects your data as per UAE regulations.',
    images: ['/Huawei.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
};


export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-black mb-12">
          Privacy Policy
        </h1>

        <div className="space-y-8 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Introduction</h2>
            <p className="text-black leading-relaxed">
              At Huawei eKit UAE, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you visit our website or use our services in compliance with 
              UAE data protection regulations. Please read this privacy policy carefully. By using our services, you 
              consent to the data practices described in this statement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800">Personal Information</h3>
              <ul className="list-disc list-inside text-black space-y-2">
                <li>Name and contact information</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Business information and company details</li>
                <li>Information provided through contact forms</li>
                <li>VAT registration details (if applicable)</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800">Usage Data</h3>
              <ul className="list-disc list-inside text-black space-y-2">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Pages visited</li>
                <li>Time and date of visits</li>
                <li>Other diagnostic data</li>
                <li>Geographic location within UAE</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-black space-y-2">
              <li>To provide and maintain our services in the UAE region</li>
              <li>To notify you about changes to our services</li>
              <li>To provide customer support and technical assistance</li>
              <li>To gather analysis or valuable information to improve our services</li>
              <li>To monitor the usage of our services</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To comply with UAE legal and regulatory requirements</li>
              <li>To send you newsletters and marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Data Security</h2>
            <p className="text-black leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal 
              information from unauthorized access, disclosure, alteration, or destruction in accordance with 
              UAE data protection standards. However, please note that no method of transmission over the Internet 
              or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Data Retention</h2>
            <p className="text-black leading-relaxed">
              We will retain your personal information only for as long as is necessary for the purposes set out in this 
              Privacy Policy and to comply with UAE legal obligations. We will retain and use your information to the 
              extent necessary to comply with our legal requirements, resolve disputes, and enforce our policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Third-Party Services</h2>
            <p className="text-black leading-relaxed">
              We may employ third-party companies and individuals to facilitate our services, provide services 
              on our behalf, perform service-related services, or assist us in analyzing how our services are used. 
              These third parties have access to your personal information only to perform these tasks on our behalf 
              and are obligated not to disclose or use it for any other purpose. All third-party providers comply with 
              UAE data protection regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">International Data Transfers</h2>
            <p className="text-black leading-relaxed">
              Your information, including personal data, may be transferred to — and maintained on — computers located 
              outside of the UAE where the data protection laws may differ. We ensure that any international transfers 
              of your personal data comply with applicable data protection laws and provide adequate protection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Your Rights Under UAE Law</h2>
            <ul className="list-disc list-inside text-black space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate personal data</li>
              <li>Right to request deletion of your personal data</li>
              <li>Right to object to processing of your personal data</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent</li>
              <li>Right to lodge complaints with UAE data protection authorities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-black leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Contact Us</h2>
            <p className="text-black leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:{' '} <br/>
              <a href="mailto:mail@ekit-huawei-uae.com" className="text-black hover:text-gray-600">
                mail@ekit-huawei-uae.com
              </a>
              <br/>
             
            </p>
            <p className="text-black leading-relaxed">
             
       
              <a href="tel:+0097150966 4956
" className="text-black hover:text-gray-600">
                +0097150966 4956

              </a>
            </p>
            <p className="text-black leading-relaxed mt-2">
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