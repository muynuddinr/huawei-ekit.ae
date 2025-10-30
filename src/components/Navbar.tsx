'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDownIcon, MagnifyingGlassIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
}

interface NavigationItem {
  title: string;
  href: string;
  dropdownContent?: {
    sections: {
      title: string;
      items: Array<{
        title: string;
        href: string;
      }>;
    }[];
    links?: {
      name: string;
      href: string;
      external?: boolean;
    }[];
  } | null;
}

const Navbar = () => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Helper function to determine if a nav item is active
  const isNavItemActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  // Contact information data
  const contactInfo = {
    location: {
      name: 'Our Location',
      href: 'https://www.google.com/maps?ll=25.273502,55.30919&z=18&t=h&hl=en&gl=IN&mapclient=embed&cid=3646768798027295389',
      description: 'Find our office location',
      icon: MapPinIcon
    },
    phone: {
      name: 'Call Us',
      href: 'tel:+0097150966 4956',
      description: '+0097150966 4956',
      icon: PhoneIcon
    },
    email: {
      name: 'Email Us',
      href: 'mailto:mail@ekit-huawei-uae.com',
      description: 'mail@ekit-huawei-uae.com',
      icon: EnvelopeIcon
    }
  };

  // Static fallback navigation items
  const defaultNavigationItems: NavigationItem[] = [
    {
      title: 'Home',
      href: '/',
      dropdownContent: null
    },
    {
      title: 'About Us',
      href: '/about',
      dropdownContent: null
    },
    {
      title: 'Products',
      href: '/products',
      dropdownContent: {
        sections: [
          {
            title: 'Product Categories',
            items: []
          }
        ],
        links: [{ name: 'All Products', href: '/products', external: false }]
      }
    },
    {
      title: 'Contact Us',
      href: '/contact',
      dropdownContent: null
    },
  ];

  // Fetch categories from API for Products dropdown
  const fetchNavbarCategories = useCallback(async () => {
    try {
      // Fetch regular categories (not navbar categories) for the Products dropdown
      const response = await fetch('/api/categories');
      const data = await response.json();

      console.log('Categories API response:', data);
      console.log('Categories received:', data.data);

      if (data.success && data.data && data.data.length > 0) {
        // Group categories to remove duplicates and get unique category slugs
        const uniqueCategories = Array.from(
          new Map(data.data.map((cat: any) => [cat.slug, cat])).values()
        );

        // Sort categories by order if available, otherwise by name
        const sortedCategories = uniqueCategories.sort((a: any, b: any) => {
          if (a.order && b.order) return a.order - b.order;
          return a.name.localeCompare(b.name);
        });

        // Create dynamic product items from categories
        const dynamicProductItems = sortedCategories.map((category: any) => ({
          title: category.name,
          href: `/products/${category.slug}`
        }));

        // Create the Products dropdown with dynamic categories
        const productsDropdown: NavigationItem = {
          title: 'Products',
          href: '/products',
          dropdownContent: {
            sections: [
              {
                title: 'Product Categories',
                items: dynamicProductItems
              }
            ],
            links: [{ name: 'All Products', href: '/products', external: false }]
          }
        };

        // Create navigation items: Home + About + Products (with dynamic dropdown) + Contact Us
        const navigationItems: NavigationItem[] = [
          {
            title: 'Home',
            href: '/',
            dropdownContent: null
          },
          {
            title: 'About Us',
            href: '/about',
            dropdownContent: null
          },
          productsDropdown,
          {
            title: 'Contact Us',
            href: '/contact',
            dropdownContent: null
          },
        ];

        setNavigationItems(navigationItems);
      } else {
        // No categories found, use default navigation
        setNavigationItems(defaultNavigationItems);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Show basic navigation on error
      setNavigationItems(defaultNavigationItems);
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

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (activeDropdown && !target.closest('.dropdown-container') && !target.closest('.dropdown-menu')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleDropdownToggle = (title: string, event?: React.MouseEvent) => {
    if (isMobileMenuOpen) {
      // Mobile behavior - toggle on click
      setActiveDropdown(activeDropdown === title ? null : title);
    } else {
      // Desktop behavior - show immediately
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setActiveDropdown(title);

      // Calculate dropdown position for desktop
      if (event) {
        const button = event.currentTarget as HTMLElement;
        const rect = button.getBoundingClientRect();
        const navbar = button.closest('nav');
        if (navbar) {
          const navbarRect = navbar.getBoundingClientRect();
          setDropdownPosition({
            top: navbarRect.bottom,
            left: navbarRect.left,
            width: navbarRect.width
          });
        }
      }
    }
  };

  const handleDropdownMouseEnter = (title: string, event: React.MouseEvent) => {
    if (!isMobileMenuOpen) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setActiveDropdown(title);
      setHoveredItem(title);

      // Calculate dropdown position
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      const navbar = button.closest('nav');
      if (navbar) {
        const navbarRect = navbar.getBoundingClientRect();
        setDropdownPosition({
          top: navbarRect.bottom,
          left: navbarRect.left,
          width: navbarRect.width
        });
      }
    }
  };

  const handleDropdownMouseLeave = () => {
    if (!isMobileMenuOpen) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      const timeout = setTimeout(() => {
        setActiveDropdown(null);
        setHoveredItem(null);
      }, 300); // 0.3 second delay
      setHoverTimeout(timeout);
    }
  };

  const handleNavItemMouseEnter = (title: string) => {
    setHoveredItem(title);
  };

  const handleNavItemMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleNavItemClick = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    setMobileDropdownOpen(null);
  };

  const handleLogoClick = () => {
    setActiveDropdown(null);
    setMobileDropdownOpen(null);
  };

  const handleDropdownLinkClick = () => {
    setActiveDropdown(null);
    setMobileDropdownOpen(null);
    setIsMobileMenuOpen(false);
  };

  const handleMobileItemClick = (item: NavigationItem) => {
    if (item.dropdownContent) {
      setMobileDropdownOpen(mobileDropdownOpen === item.title ? null : item.title);
    } else {
      // For non-dropdown items, navigate immediately
      handleNavItemClick();
    }
  };

  const handleMobileLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileDropdownOpen(null);
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Top Navigation Bar - Always visible but hidden when scrolled */}
      <div className={`bg-gray-900 text-white text-sm transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden' : 'h-10'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-10">
            {/* Contact Information Section */}
            <div className="flex items-center space-x-6">
              {/* Location */}
              <a
                href={contactInfo.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-white hover:text-red-300 transition-colors duration-200 group"
              >
                <MapPinIcon className="w-4 h-4" />

              </a>

              {/* Phone */}
              <a
                href={contactInfo.phone.href}
                className="flex items-center space-x-1 text-white hover:text-red-300 transition-colors duration-200 group"
              >
                <PhoneIcon className="w-4 h-4" />

              </a>

              {/* Email */}
              <a
                href={contactInfo.email.href}
                className="flex items-center space-x-1 text-white hover:text-red-300 transition-colors duration-200 group"
              >
                <EnvelopeIcon className="w-4 h-4" />

              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Becomes fixed when scrolled */}
      <nav
        className={`w-full bg-white shadow-sm border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            {/* Logo - Simple Fix */}
            <div className="flex-shrink-0">
              <Link href="/" onClick={handleLogoClick}>
                <div className="relative">
                  <Image
                    src="/Huawei.png"
                    alt="Huawei Authorized Distributor in UAE"
                    width={200}          // Increased from 120
                    height={67}          // Increased from 40 to maintain aspect ratio
                    quality={100}        // Already at max quality
                    priority            // Already prioritized
                    className={`
                      object-contain transition-all duration-300
                      ${isScrolled ? 'h-8 w-auto' : 'h-10 w-auto'}`}
                    style={{            // Add style prop for image rendering
                      imageRendering: 'crisp-edges',
                      WebkitFontSmoothing: 'antialiased'
                    }}
                    unoptimized        // Add this to prevent Next.js optimization
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div key={item.title} className="relative dropdown-container">
                  {item.dropdownContent ? (
                    <button
                      onClick={(e) => handleDropdownToggle(item.title, e)}
                      onMouseEnter={(e) => handleDropdownMouseEnter(item.title, e)}
                      onMouseLeave={handleDropdownMouseLeave}
                      className={`navbar-item flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors duration-200 relative ${isNavItemActive(item.href) || activeDropdown === item.title || hoveredItem === item.title
                        ? 'text-red-600'
                        : 'text-gray-700 hover:text-red-600'
                        }`}
                    >
                      <span>{item.title}</span>
                      <ChevronDownIcon className="w-4 h-4" />
                      {/* Active/Hover Underline */}
                      <div
                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transition-all duration-200 ${isNavItemActive(item.href) || activeDropdown === item.title || hoveredItem === item.title
                          ? 'opacity-100 scale-x-100'
                          : 'opacity-0 scale-x-0'
                          }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={handleNavItemClick}
                      onMouseEnter={() => handleNavItemMouseEnter(item.title)}
                      onMouseLeave={handleNavItemMouseLeave}
                      className={`navbar-item flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors duration-200 relative ${isNavItemActive(item.href) || hoveredItem === item.title
                        ? 'text-red-600'
                        : 'text-gray-700 hover:text-red-600'
                        }`}
                    >
                      <span>{item.title}</span>
                      {/* Active/Hover Underline */}
                      <div
                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transition-all duration-200 ${isNavItemActive(item.href) || hoveredItem === item.title
                          ? 'opacity-100 scale-x-100'
                          : 'opacity-0 scale-x-0'
                          }`}
                      />
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {activeDropdown === item.title && item.dropdownContent && (
                    <div
                      className="dropdown-menu fixed bg-white shadow-xl z-50 border-t border-gray-200 dropdown-enter navbar-dropdown"
                      style={{
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width
                      }}
                      onMouseEnter={() => {
                        if (hoverTimeout) {
                          clearTimeout(hoverTimeout);
                          setHoverTimeout(null);
                        }
                      }}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {item.dropdownContent.sections.map((section, index) => (
                            <div key={index} className="space-y-4">
                              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                              <ul className="space-y-2">
                                {section.items.map((subItem, subIndex) => (
                                  <li key={subIndex}>
                                    <Link
                                      href={subItem.href}
                                      onClick={handleDropdownLinkClick}
                                      className="text-sm text-gray-600 hover:text-red-600 transition-colors duration-200 block py-2"
                                    >
                                      {subItem.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {item.dropdownContent.links && item.dropdownContent.links.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-wrap gap-6">
                              {item.dropdownContent.links.map((link, linkIndex) => (
                                <Link
                                  key={linkIndex}
                                  href={link.href}
                                  onClick={handleDropdownLinkClick}
                                  className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-all duration-300 ease-in-out group"
                                >
                                  {link.name}
                                  <svg
                                    className="w-4 h-4 ml-2 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                  </svg>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Search and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Search */}


              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setActiveDropdown(null);
                  setMobileDropdownOpen(null);
                }}
                className="lg:hidden p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className={`w-6 h-6 transform transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : 'rotate-0'
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto mobile-menu">
            <div className="px-4 py-2 space-y-2">
              {navigationItems.map((item) => (
                <div key={item.title} className="border-b border-gray-100 last:border-b-0">
                  {item.dropdownContent ? (
                    // Dropdown items - use button to toggle
                    <button
                      onClick={() => handleMobileItemClick(item)}
                      className={`w-full flex items-center justify-between py-3 text-sm font-medium transition-colors duration-200 relative ${isNavItemActive(item.href) ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
                        }`}
                    >
                      <span className="relative">
                        {item.title}
                        {/* Underline for active item */}
                        {isNavItemActive(item.href) && (
                          <div className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-red-600" />
                        )}
                      </span>
                      <ChevronDownIcon
                        className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${mobileDropdownOpen === item.title ? 'rotate-180' : 'rotate-0'
                          }`}
                      />
                    </button>
                  ) : (
                    // Non-dropdown items - use Link to navigate directly
                    <Link
                      href={item.href}
                      onClick={() => handleMobileLinkClick(item.href)}
                      className={`w-full flex items-center justify-between py-3 text-sm font-medium transition-colors duration-200 relative ${isNavItemActive(item.href) ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
                        }`}
                    >
                      <span className="relative">
                        {item.title}
                        {/* Underline for active item */}
                        {isNavItemActive(item.href) && (
                          <div className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-red-600" />
                        )}
                      </span>
                    </Link>
                  )}

                  {/* Mobile Dropdown Content */}
                  {item.dropdownContent && mobileDropdownOpen === item.title && (
                    <div className="pb-4 pl-4 space-y-3 bg-gray-50 rounded-lg mt-2">
                      {item.dropdownContent.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-900 mt-3 first:mt-1">
                            {section.title}
                          </h4>
                          <ul className="space-y-1 pl-2">
                            {section.items.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <Link
                                  href={subItem.href}
                                  onClick={() => handleMobileLinkClick(subItem.href)}
                                  className="text-sm text-gray-600 hover:text-red-600 transition-colors duration-200 block py-1"
                                >
                                  {subItem.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* Mobile Dropdown Bottom Links */}
                      {item.dropdownContent.links && item.dropdownContent.links.length > 0 && (
                        <div className="pt-3 border-t border-gray-200 mt-4">
                          {item.dropdownContent.links.map((link, linkIndex) => (
                            <Link
                              key={linkIndex}
                              href={link.href}
                              onClick={() => handleMobileLinkClick(link.href)}
                              className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-all duration-300 ease-in-out group"
                            >
                              {link.name}
                              <svg
                                className="w-4 h-4 ml-2 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed header */}
      {isScrolled && <div className="h-16" />}

      <style jsx global>{`
        /* Dropdown animation styles */
        .dropdown-enter {
          animation: dropdownEnter 0.3s ease-out forwards;
        }
        
        .navbar-dropdown {
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        @keyframes dropdownEnter {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Mobile menu animations */
        .mobile-menu {
          animation: mobileMenuEnter 0.3s ease-out;
        }
        
        @keyframes mobileMenuEnter {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Smooth transitions for all interactive elements */
        .navbar-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Hover effects */
        .group:hover .group-hover\:translate-x-1 {
          transform: translateX(0.25rem);
        }

        /* Arrow animation for dropdown links */
        .group:hover .group-hover\:translate-x-1 {
          transform: translateX(0.25rem);
        }

        /* Prevent body scroll when mobile menu is open */
        body.mobile-menu-open {
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Navbar;