'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { FaDownload, FaChevronLeft, FaChevronRight, FaExpand, FaWhatsapp, FaTwitter, FaFacebookF, FaLink, FaRulerCombined, FaWeight, FaBox } from 'react-icons/fa';
import { ChatBubbleLeftRightIcon, DocumentArrowDownIcon, CubeIcon, TagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Variants } from 'framer-motion';

interface ProductData {
    _id: string;
    name: string;
    slug: string;
    description: string;
    keyFeatures: string[];
    image1: string;
    image2?: string;
    image3?: string;
    image4?: string;
    navbarCategory: {
        name: string;
        slug: string;
    };
    category: {
        name: string;
        slug: string;
    };
    subcategory: {
        name: string;
        slug: string;
    };
    catalogFile?: string;
    longDescription?: string;
    shortFeatures?: string[];
    packaging?: {
        dimensions?: {
            length?: string;
            width?: string;
            height?: string;
            unit?: string;
        };
        weight?: {
            net?: string;
            gross?: string;
            unit?: string;
        };
        material?: string;
        type?: string;
        quantity?: string;
        notes?: string;
    };
}

interface ProductDetailClientProps {
    product: ProductData;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState(product.image1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [copied, setCopied] = useState(false);

    const router = useRouter();


    // Get all product images
    const productImages = [product.image1, product.image2, product.image3, product.image4].filter((img): img is string => Boolean(img));
    const allImages = productImages;

    // Social share links
    const shareLinks = {
        whatsapp: `https://wa.me/?text=Check out this product: ${product.name} - ${window.location.href}`,
        twitter: `https://twitter.com/intent/tweet?text=Check out this product: ${product.name}&url=${window.location.href}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
        setSelectedImage(allImages[(selectedImageIndex + 1) % allImages.length]);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        setSelectedImage(allImages[(selectedImageIndex - 1 + allImages.length) % allImages.length]);
    };

    // Helper function to convert image URL to data URL
    const getImageDataUrl = async (url: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const dataUrl = reader.result as string;
                        resolve(dataUrl);
                    };
                    reader.onerror = () => {
                        reject(new Error('Failed to convert image to data URL'));
                    };
                    reader.readAsDataURL(blob);
                })
                .catch(() => {
                    // Fallback to proxy if direct fetch fails
                    fetch(`https://cors-anywhere.herokuapp.com/${url}`)
                        .then(response => response.blob())
                        .then(blob => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                const dataUrl = reader.result as string;
                                resolve(dataUrl);
                            };
                            reader.onerror = () => {
                                reject(new Error('Failed to convert image to data URL'));
                            };
                            reader.readAsDataURL(blob);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
        });
    };

    // PDF Generation Function
    const downloadProductInfo = async () => {
        setIsDownloading(true);
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const contentWidth = pageWidth - (2 * margin);
            let yPosition = margin;

            // Helper function to check if new page is needed
            const checkNewPage = (requiredSpace: number) => {
                if (yPosition > pageHeight - requiredSpace - margin) {
                    pdf.addPage();
                    yPosition = margin;
                    return true;
                }
                return false;
            };

            // Add header with brand styling
            pdf.setFillColor("firebrick")
            // Dark gray (0.27*255 ≈ 69, but using 45 for better contrast)
            pdf.rect(0, 0, pageWidth, 35, 'F');

            // Add Huawei logo
            try {
                const logoData = await getImageDataUrl('/huaweilogo-new.png');
                const logoWidth = 40;
                const logoHeight = 15;
                const logoX = margin;
                const logoY = 10; // Centered in 35px header
                pdf.addImage(logoData, 'PNG', logoX, logoY, logoWidth, logoHeight);
            } catch (logoError) {
                console.warn('Failed to add logo to PDF:', logoError);
            }

            // Add title next to logo
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Product Specification', pageWidth / 2 + 15, 21, { align: 'center' });

            yPosition = 50;

            // Add all product images in a grid layout
            const imagesPerRow = 2;
            const imgWidth = (contentWidth - 10) / imagesPerRow;
            const imgHeight = imgWidth;
            let imageCol = 0;

            for (let i = 0; i < allImages.length; i++) {
                try {
                    const imgData = await getImageDataUrl(allImages[i]);
                    const imgX = margin + (imageCol * (imgWidth + 10));

                    // Check if we need a new page
                    checkNewPage(imgHeight + 20);

                    try {
                        pdf.addImage(imgData, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
                    } catch (imageError) {
                        console.warn(`Failed to add image ${i + 1} to PDF:`, imageError);
                        // Draw placeholder box
                        pdf.setDrawColor(229, 231, 235);
                        pdf.setLineWidth(1);
                        pdf.rect(imgX, yPosition, imgWidth, imgHeight);
                        pdf.setTextColor(156, 163, 175);
                        pdf.setFontSize(9);
                        pdf.setFont('helvetica', 'italic');
                        pdf.text(`Image ${i + 1}`, imgX + imgWidth / 2, yPosition + imgHeight / 2, {
                            align: 'center'
                        });
                        pdf.text('not available', imgX + imgWidth / 2, yPosition + imgHeight / 2 + 5, {
                            align: 'center'
                        });
                    }

                    imageCol++;
                    if (imageCol >= imagesPerRow) {
                        imageCol = 0;
                        yPosition += imgHeight + 10;
                    }
                } catch (error) {
                    console.error(`Error loading image ${i + 1}:`, error);
                }
            }

            // Move to next line if images didn't fill the row
            if (imageCol > 0) {
                yPosition += imgHeight + 10;
            }

            yPosition += 10;

            // Add product title
            checkNewPage(30);
            pdf.setTextColor(31, 41, 55);
            pdf.setFontSize(20);
            pdf.setFont('helvetica', 'bold');
            const titleLines = pdf.splitTextToSize(product.name, contentWidth);
            pdf.text(titleLines, margin, yPosition);
            yPosition += (titleLines.length * 8) + 8;

            // Add separator line
            pdf.setDrawColor(229, 231, 235);
            pdf.setLineWidth(0.5);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 12;

            // Add description section
            checkNewPage(40);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(239, 68, 68);
            pdf.text('Description', margin, yPosition);
            yPosition += 10;

            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(55, 65, 81);
            pdf.setFontSize(11);
            const descLines: string[] = pdf.splitTextToSize(product.description, contentWidth);

            // Handle description across pages if needed
            descLines.forEach((line: string, index: number) => {
                if (checkNewPage(15)) {
                    // If new page, add section title again
                    pdf.setFontSize(14);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(239, 68, 68);
                    pdf.text('Description (continued)', margin, yPosition);
                    yPosition += 10;
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(55, 65, 81);
                    pdf.setFontSize(11);
                }
                pdf.text(line, margin, yPosition);
                yPosition += 6;
            });

            yPosition += 8;

            // Add key features section
            if (product.keyFeatures && product.keyFeatures.length > 0) {
                checkNewPage(30);

                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(239, 68, 68);
                pdf.text('Key Features', margin, yPosition);
                yPosition += 10;

                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(31, 41, 55);
                pdf.setFontSize(11);

                product.keyFeatures.forEach((feature, index) => {
                    const featureLines = pdf.splitTextToSize(feature, contentWidth - 10);
                    const featureHeight = featureLines.length * 6 + 4;

                    if (checkNewPage(featureHeight + 10)) {
                        // Add section title on new page
                        pdf.setFontSize(14);
                        pdf.setFont('helvetica', 'bold');
                        pdf.setTextColor(239, 68, 68);
                        pdf.text('Key Features (continued)', margin, yPosition);
                        yPosition += 10;
                        pdf.setFont('helvetica', 'normal');
                        pdf.setTextColor(31, 41, 55);
                        pdf.setFontSize(11);
                    }

                    // Add bullet point
                    pdf.setFillColor(31, 41, 55);
                    pdf.circle(margin + 2, yPosition - 1.5, 1.2, 'F');

                    // Add feature text
                    pdf.text(featureLines, margin + 10, yPosition);
                    yPosition += featureLines.length * 6 + 4;
                });

                yPosition += 8;
            }

            // Add category information
            checkNewPage(30);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(239, 68, 68);
            pdf.text('Product Category', margin, yPosition);
            yPosition += 10;

            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(55, 65, 81);
            pdf.setFontSize(11);
            const categoryText = `${product.navbarCategory.name} › ${product.category.name} › ${product.subcategory.name}`;
            pdf.text(categoryText, margin, yPosition);
            yPosition += 12;

            // Add product code/SKU if available
            if (product.slug) {
                pdf.setFontSize(9);
                pdf.setTextColor(107, 114, 128);
                pdf.text(`Product Code: ${product.slug}`, margin, yPosition);
            }

            // Add footer to all pages
            const totalPages = pdf.internal.pages.length - 1;
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                const footerY = pageHeight - 12;

                pdf.setDrawColor(229, 231, 235);
                pdf.setLineWidth(0.3);
                pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

                pdf.setFontSize(8);
                pdf.setTextColor(156, 163, 175);
                pdf.text('Generated from Product Catalog', margin, footerY);
                pdf.text(new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }), pageWidth / 2, footerY, { align: 'center' });
                pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });
            }

            // Save the PDF with sanitized filename
            const sanitizedName = product.slug.replace(/[^a-z0-9-]/gi, '_');
            pdf.save(`${sanitizedName}-specification.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    // Contact Modal Component
    const ContactModal = () => {
        if (!isContactModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                    className="bg-white rounded-2xl p-8 max-w-md w-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                >
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
                    <p className="text-gray-600 mb-6">
                        Get in touch with us for more information about {product.name}. Our team will respond within 24 hours.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                rows={4}
                                placeholder={`I'm interested in ${product.name}. Please provide more details.`}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsContactModalOpen(false)}
                                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Handle contact form submission
                                    setIsContactModalOpen(false);
                                    alert('Your message has been sent! We will get back to you soon.');
                                }}
                                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    // Image Modal Component
    const ImageModal = () => {
        if (!isImageModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
                    <button
                        onClick={() => setIsImageModalOpen(false)}
                        className="absolute top-4 right-4 text-white text-2xl z-10 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                    >
                        ×
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl z-10 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors"
                    >
                        <FaChevronLeft />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl z-10 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors"
                    >
                        <FaChevronRight />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                            src={allImages[selectedImageIndex] || '/placeholder-product.jpg'}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="90vw"
                        />
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {allImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setSelectedImageIndex(idx);
                                    setSelectedImage(allImages[idx]);
                                }}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${selectedImageIndex === idx
                                    ? "bg-white"
                                    : "bg-white/50 hover:bg-white/70"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className=" bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <motion.nav
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-wrap items-center space-x-1 sm:space-x-2 text-[10px] sm:text-xs text-gray-600">
                        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
                        <span className="text-gray-400">→</span>
                        <Link href="/products" className="hover:text-red-600 transition-colors">Products</Link>
                        
                        <span className="text-gray-400">→</span>
                        <Link
                            href={`/products/${product.category.slug}`}
                            className="hover:text-red-600 transition-colors"
                        >
                            {product.category.name} 
                        </Link>
                        <span className="text-gray-400">→</span>
                        <Link
                            href={`/products/${product.category.slug}/${product.subcategory.slug}`}
                            className="hover:text-red-600 transition-colors"
                        >
                             {product.subcategory.name}
                        </Link>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-900 font-semibold">{product.name}</span>
                    </div>


                </motion.nav>

                <div className="container mx-auto px-6 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left: Enhanced Image Gallery */}
                        <div className="space-y-4">
                            <motion.div
                                className="relative aspect-[4/3] w-full max-w-[500px] mx-auto bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group cursor-pointer"
                                onHoverStart={() => setIsHovered(true)}
                                onHoverEnd={() => setIsHovered(false)}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <div className="relative w-full h-full">
                                    {/* Main Image */}
                                    <Image
                                        src={
                                            allImages[selectedImageIndex] ||
                                            selectedImage ||
                                            "/placeholder-product.jpg"
                                        }
                                        alt={product.name}
                                        fill
                                        className="object-contain p-5 transition-transform duration-300"
                                        sizes="(min-width:1024px) 500px, 100vw"
                                        priority
                                    />

                                    {/* Centered Watermark */}

                                </div>

                                {/* Navigation arrows */}
                                {allImages.length > 1 && (
                                    <>
                                        <motion.button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 text-gray-700 border border-gray-200 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{
                                                opacity: isHovered ? 1 : 0,
                                                x: isHovered ? 0 : -10,
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <FaChevronLeft size={16} />
                                        </motion.button>
                                        <motion.button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 text-gray-700 border border-gray-200 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{
                                                opacity: isHovered ? 1 : 0,
                                                x: isHovered ? 0 : 10,
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <FaChevronRight size={16} />
                                        </motion.button>
                                    </>
                                )}

                                {/* Expand button */}
                                <motion.button
                                    onClick={() => setIsImageModalOpen(true)}
                                    className="absolute top-4 right-4 bg-white/95 text-gray-700 border border-gray-200 px-3 py-2.5 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: isHovered ? 1 : 0.7,
                                        scale: isHovered ? 1 : 0.9,
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaExpand size={14} />
                                </motion.button>

                                {/* Image indicator */}
                                {allImages.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {allImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedImageIndex(idx);
                                                    setSelectedImage(allImages[idx]);
                                                }}
                                                className={`w-2 h-2 rounded-full transition-all duration-200 ${selectedImageIndex === idx
                                                    ? "bg-red-600 w-6"
                                                    : "bg-white/70 hover:bg-white"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Enhanced Thumbnail Gallery */}
                            {allImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
                                    {allImages.map((img, idx) => (
                                        <motion.button
                                            key={idx}
                                            onClick={() => {
                                                setSelectedImageIndex(idx);
                                                setSelectedImage(img);
                                            }}
                                            className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${selectedImageIndex === idx
                                                ? "border-red-600 shadow-lg ring-2 ring-blue-100"
                                                : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                                                }`}
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.name} ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                            {selectedImageIndex === idx && (
                                                <motion.div
                                                    className="absolute inset-0 bg-blue-600/10"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            )}

                            {/* Social Share Section */}
                            <motion.div
                                className="flex items-center gap-3 pt-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                            >
                                <span className="text-gray-800 mr-2 font-medium">Share:</span>
                                <motion.a
                                    href={shareLinks.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-green-500 hover:bg-green-500 hover:border-green-400 hover:text-white transition-all duration-300 shadow-lg shadow-green-500/20"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaWhatsapp size={16} />
                                </motion.a>
                                <motion.a
                                    href={shareLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:border-blue-400 hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/20"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaTwitter size={16} />
                                </motion.a>
                                <motion.a
                                    href={shareLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all duration-300 shadow-lg shadow-blue-600/20"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaFacebookF size={16} />
                                </motion.a>
                                <motion.button
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(window.location.href);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-purple-500 hover:bg-purple-500 hover:border-purple-400 hover:text-white transition-all duration-300 shadow-lg shadow-purple-500/20 relative"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaLink size={14} />
                                    {copied && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl border border-gray-700"
                                        >
                                            Copied!
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                        </motion.div>
                                    )}
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Right: Product Information */}
                        <div className="space-y-4">
                            {/* Product Description Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
                                    {product.name}
                                </h1>
                                <div className="h-1.5 w-16 bg-red-600 rounded mt-2"></div>
                                {product.description && (
                                    <h2 className="text-base md:text-lg text-gray-600 mt-2">
                                        {product.description}
                                    </h2>
                                )}
                            </motion.div>

                            {/* Key Features */}
                            {/* Key Features - Compact Design */}
                            {product.keyFeatures.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start gap-1.5 px-1 rounded-lg hover:bg-gray-50 transition-colors"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 + 0.3 }}
                                >
                                    <div className="flex-shrink-0 w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                                    <span className="text-gray-700 leading-tight text-sm flex-1">{feature}</span>
                                </motion.div>
                            ))}

                            {/* Packaging Information Section */}
                            {product.packaging && (
                                <motion.div
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <CubeIcon className="w-6 h-6 mr-2 text-blue-600" />
                                        Packaging Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {product.packaging.dimensions && (
                                            <div className="bg-white rounded-xl p-4 border border-blue-200">
                                                <div className="flex items-center mb-2">
                                                    <FaRulerCombined className="text-blue-600 mr-2" />
                                                    <h4 className="font-medium text-gray-900">
                                                        Dimensions
                                                    </h4>
                                                </div>
                                                <p className="text-gray-600">
                                                    {product.packaging.dimensions.length || "N/A"} ×{" "}
                                                    {product.packaging.dimensions.width || "N/A"} ×{" "}
                                                    {product.packaging.dimensions.height || "N/A"}{" "}
                                                    {product.packaging.dimensions.unit || ""}
                                                </p>
                                            </div>
                                        )}
                                        {product.packaging.weight && (
                                            <div className="bg-white rounded-xl p-4 border border-blue-200">
                                                <div className="flex items-center mb-2">
                                                    <FaWeight className="text-blue-600 mr-2" />
                                                    <h4 className="font-medium text-gray-900">Weight</h4>
                                                </div>
                                                <p className="text-gray-600">
                                                    Net: {product.packaging.weight.net || "N/A"}{" "}
                                                    {product.packaging.weight.unit || ""}
                                                </p>
                                                <p className="text-gray-600">
                                                    Gross: {product.packaging.weight.gross || "N/A"}{" "}
                                                    {product.packaging.weight.unit || ""}
                                                </p>
                                            </div>
                                        )}
                                        {product.packaging.material && (
                                            <div className="bg-white rounded-xl p-4 border border-blue-200">
                                                <div className="flex items-center mb-2">
                                                    <FaBox className="text-blue-600 mr-2" />
                                                    <h4 className="font-medium text-gray-900">Material</h4>
                                                </div>
                                                <p className="text-gray-600">
                                                    {product.packaging.material}
                                                </p>
                                            </div>
                                        )}
                                        {product.packaging.type && (
                                            <div className="bg-white rounded-xl p-4 border border-blue-200">
                                                <div className="flex items-center mb-2">
                                                    <TagIcon className="w-5 h-5 text-blue-600 mr-2" />
                                                    <h4 className="font-medium text-gray-900">
                                                        Package Type
                                                    </h4>
                                                </div>
                                                <p className="text-gray-600">{product.packaging.type}</p>
                                            </div>
                                        )}
                                        {product.packaging.quantity && (
                                            <div className="bg-white rounded-xl p-4 border border-blue-200 md:col-span-2">
                                                <div className="flex items-center mb-2">
                                                    <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-2" />
                                                    <h4 className="font-medium text-gray-900">
                                                        Quantity per Package
                                                    </h4>
                                                </div>
                                                <p className="text-gray-600">
                                                    {product.packaging.quantity} units
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {product.packaging.notes && (
                                        <div className="mt-4 bg-blue-100 rounded-lg p-3 border-l-4 border-blue-600">
                                            <p className="text-sm text-blue-800">
                                                <strong>Note:</strong> {product.packaging.notes}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            <div className="bottom-0 left-0 w-full h-px bg-gray-300"></div>

                            {/* Enhanced Download Section */}
                            <motion.div
                                className="space-y-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Enhanced Download Button */}
                                    <motion.button
                                        onClick={downloadProductInfo}
                                        disabled={isDownloading}
                                        className="border border-blue-600 text-blue-600 py-1 px-3 rounded-md text-xs font-medium transition-all duration-300 flex items-center justify-center hover:bg-blue-600 hover:text-white"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isDownloading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-2"></div>
                                                <span>Preparing Download...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaDownload className="mr-2" />
                                                <span>Download Complete Info</span>
                                            </>
                                        )}
                                    </motion.button>

                                    {/* Contact Us Button */}
                                    <motion.button
                                        onClick={() => router.push('/contact')}
                                        className="border border-green-600 text-green-600 py-1 px-3 rounded-md text-xs font-medium transition-all duration-300 flex items-center justify-center hover:bg-green-600 hover:text-white"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                                        <span>Contact Us</span>
                                    </motion.button>

                                    {/* PDF Catalog Button */}
                                    {product.catalogFile && (
                                        <motion.a
                                            href={product.catalogFile}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                                            <span>PDF Catalog</span>
                                        </motion.a>
                                    )}
                                </div>

                                {/* Download Info */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">
                                        Complete info includes: Product details, specifications,
                                        packaging info, and all images
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Contact Modal */}
                <ContactModal />

                {/* Image Modal */}
                <ImageModal />
            </div>
        </div>
    );
}
