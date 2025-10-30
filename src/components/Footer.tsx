'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
}

const Footer = () => {
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch navbar categories from API
  const fetchNavbarCategories = useCallback(async () => {
    try {
      // Use public API endpoint instead of admin endpoint
      const response = await fetch('/api/navbar-categories');
      const data = await response.json();

      console.log('Footer Navbar API response:', data);
      console.log('Footer Categories received:', data.data);

      if (data.success && data.data && data.data.length > 0) {
        // Sort categories by order (all categories from public API are already active)
        const sortedCategories = [...data.data]
          .sort((a, b) => a.order - b.order);

        setNavbarCategories(sortedCategories);
      }
    } catch (error) {
      console.error('Error fetching navbar categories in footer:', error);
    }
  }, []);

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    if (mounted) {
      fetchNavbarCategories();
    }
  }, [mounted, fetchNavbarCategories]);

  const contactInfo = [
    {
      icon: <MapPin className="w-3.5 h-3.5" />,
      value: "25th St - Naif - Dubai - United Arab Emirates",
      url: "https://maps.app.goo.gl/v8L9XJ9t6rRzYUDJ7"
    },
    {
      icon: <Mail className="w-3.5 h-3.5" />,
      value: "mail@ekit-huawei-uae.com",
      url: "mailto:mail@ekit-huawei-uae.com"
    },
    {
      icon: <Phone className="w-3.5 h-3.5" />,
      value: "+0097150966 4956",
      url: "tel:+00971509664956"
    }
  ];

  // Generate dynamic product links from categories - All Products will be last
  const dynamicProductLinks = navbarCategories.map((category) => ({
    name: category.name,
    href: `/products/${category.slug}`
  }));

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "Products",
      links: [
        ...dynamicProductLinks, // Dynamic categories first
        { name: "All Products", href: "/products" } // All Products last
      ]
    },
    {
      title: "Contact",
      isContact: true
    }
  ];

  const handleInternalLink = (href: string) => {
    console.log(`Navigating to: ${href}`);
    window.location.href = href;
  };

  const handleExternalLink = (url: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!mounted) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Section */}
            <div className="space-y-4">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleInternalLink("/")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleInternalLink("/");
                  }
                }}
              >
                <div className=" justify-center w-full h-10  rounded-md p-2">
                  <Image
                    src="/huaweilogo-new.png"
                    alt="Huawei Logo"
                    width={120}
                    height={40}
                    priority
                    className="object-contain transition-all duration-300 hover:scale-105"
                  />
                </div>

              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                UAE Distributor for innovative Huawei eKit solutions and enterprise digital transformation.
              </p>

              {/* Social Media Icons */}

            </div>

            {/* Footer Sections */}
            {footerSections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  {section.title}
                </h3>

                {section.isContact ? (
                  <div className="space-y-3">
                    {contactInfo.map((contact, contactIndex) => (
                      <div key={contactIndex} className="flex items-start">
                        <div className="text-red-600 mr-2 flex-shrink-0 mt-0.5">
                          {contact.icon}
                        </div>
                        <a
                          href={contact.url}
                          className="text-sm text-gray-600 hover:text-red-600 transition-colors duration-200 break-words"
                          onClick={(e) => {
                            if (contact.url.startsWith('http')) {
                              handleExternalLink(contact.url, e);
                            }
                          }}
                        >
                          {contact.value}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {section.links?.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <button
                          onClick={() => handleInternalLink(link.href)}
                          className="text-sm text-gray-600 hover:text-red-600 cursor-pointer transition-colors duration-200 text-left w-full"
                          type="button"
                        >
                          {link.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-100 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left space-y-2 sm:space-y-0">
            <p className="text-xs text-gray-500">
              © 2025 Huawei eKit UAE. All Rights Reserved.
            </p>

            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3 text-xs ">
              <button
                onClick={() => handleInternalLink('/terms-of-service')}
                className="text-gray-500 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                type="button"
              >
                Terms of Service
              </button>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => handleInternalLink('/privacy-policy')}
                className="text-gray-500 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                type="button"
              >
                Privacy Policy
              </button>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => handleInternalLink('/cookie-policy')}
                className="text-gray-500 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                type="button"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;