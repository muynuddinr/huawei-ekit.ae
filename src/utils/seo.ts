import type { Metadata } from "next";

// ✅ Fully Optimized Metadata for Huawei eKit UAE
export const defaultMetadata: Metadata = {
  metadataBase: new URL("https://huawei-uae.com"),
  title: {
    default:
      "Huawei eKit UAE – Network Products, Smart Networking & ICT Solutions",
    template: "%s | Huawei eKit UAE",
  },
  description:
    "Huawei eKit UAE delivers enterprise networking solutions, MiniFTTI storage, Wi-Fi 7 access points, smart gateways, network products, and ICT solutions for SMEs, hospitality, retail, education, and office environments across the UAE.",

  keywords: [
    "Network Products UAE",
    "UAE Ekit",
    "Ekit UAE",
    "Huawei Networking UAE",
    "Ekit Distributor UAE",
    "Ekit",
    "Huawei eKit UAE",
    "Huawei UAE",
    "Huawei networking UAE",
    "Huawei eKit products",
    "WiFi 7 UAE",
    "MiniFTTI Storage UAE",
    "Huawei distributor UAE",
    "Huawei APs UAE",
    "Huawei switches UAE",
    "SME ICT solutions UAE",
    "Dubai networking equipment",
    "enterprise networking UAE",
    "storage solutions UAE",
  ],

  authors: [{ name: "Huawei eKit UAE" }],
  creator: "Huawei eKit UAE",
  publisher: "Huawei eKit UAE",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  icons: {
    icon: "/Huawei.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "mask-icon",
      url: "/safari-pinned-tab.svg",
      color: "#5bbad5",
    },
  },

  openGraph: {
    type: "website",
    siteName: "Huawei eKit UAE",
    locale: "en_US",
    url: "https://huawei-uae.com",
    title: "Huawei eKit UAE – Smart Networking & ICT Solutions",
    description:
      "Explore Huawei eKit UAE solutions including WiFi 7 APs, enterprise-grade switches, MiniFTTI storage, and SME cloud networking solutions.",
    images: [
      {
        url: "/Huawei.png",
        width: 1200,
        height: 630,
        alt: "Huawei eKit UAE – Networking Solutions",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Huawei eKit UAE – Smart Networking, WiFi 7 & Storage Solutions",
    description:
      "Huawei eKit UAE provides enterprise networking, storage, gateway, and cloud-managed ICT solutions for UAE businesses.",
    images: ["/Huawei.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://huawei-uae.com",
    languages: {
      "en-US": "https://huawei-uae.com/",
      "ar-AE": "https://huawei-uae.com/",
    },
  },

  verification: {
    google: "d5d0hadVynHlS0TJhezMaHBvlV78wzFjLqGdU6h1dSs",
  },

  other: {
    "google-site-verification": "d5d0hadVynHlS0TJhezMaHBvlV78wzFjLqGdU6h1dSs",
  },

  generator: "Huawei eKit UAE Website",
  applicationName: "Huawei eKit UAE",
  referrer: "origin-when-cross-origin",
  manifest: "/site.webmanifest",
};

// ✅ Organization Schema (JSON-LD)
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Huawei eKit UAE",
  description:
    "Huawei eKit UAE provides networking, WiFi 7, enterprise switches, MiniFTTI storage, and SME cloud solutions.",
  url: "https://huawei-uae.com",
  logo: "/Huawei.png",
  foundingDate: "2023-01-01",

  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+0097150966 4956",
    contactType: "Customer Support",
    email: "mail@ekit-huawei-uae.com",
    areaServed: "AE",
    availableLanguage: ["English", "Arabic"],
  },

  address: {
    "@type": "PostalAddress",
    streetAddress: "25th St, Naif",
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    postalCode: "00000",
    addressCountry: "AE",
  },

  sameAs: [
    "https://www.instagram.com/huaweiekit",
    "https://www.linkedin.com/company/huawei-ekit",
    "https://www.youtube.com/@huaweiekit",
  ],

  areaServed: {
    "@type": "Country",
    name: "United Arab Emirates",
  },
};

// ✅ Dynamic Content Schema (JSON-LD)
export const dynamicContentSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "WebPage",
        "@id": "https://huawei-uae.com/products",
        name: "Product Categories",
        description: "Explore Huawei eKit UAE networking and storage products.",
        url: "https://huawei-uae.com/products",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "CollectionPage",
        "@id": "https://huawei-uae.com/solution",
        name: "Solutions",
        description:
          "Complete ICT and networking solutions for UAE businesses.",
        url: "https://huawei-uae.com/solution",
      },
    },
  ],
};

// Helper to Generate Dynamic Metadata
export const generateDynamicMetadata = (
  type: "product" | "solution",
  data: any
): Metadata => {
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: data.images?.length
        ? data.images
        : ["/Huawei.png"],
      url: `https://huawei-uae.com/${type}/${data.slug}`,
    },
    alternates: {
      canonical: `https://huawei-uae.com/${type}/${data.slug}`,
    },
  };
};
