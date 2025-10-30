"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone } from 'lucide-react';
import { Variants } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log('Submitting form data:', formData);

      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('API response:', result);

      if (result.success) {
        alert(result.message || 'Thank you for your message! We will get back to you within 24 hours.');
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          subject: '',
          message: ''
        });
      } else {
        alert(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants for consistent timing
  const slideUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuad
      }
    }
  };

  const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const slideInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const MapSection = () => {
    return (
      <section className="bg-white py-20">
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Visit Our <span className='text-red-600'>Office</span>
            </h2>
            <p className="text-lg text-gray-600">
              Find us at 25th St - Naif - Dubai - United Arab Emirates
            </p>
          </div>

          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1486.8524251489728!2d55.307987002385616!3d25.273703424847543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f432649d77a05%3A0x329bece680652a9d!2sDigital%20Link%20Technology%20LLC%20-%20UNV%20National%20Distributor%20in%20Dubai%2C%20UAE!5e1!3m2!1sen!2sin!4v1758793163694!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      </section>
    );
  };

  return (
    <>
      {/* Your existing contact form section */}
      <div className="relative min-h-screen">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('/Contact.png')`,
            filter: 'brightness(0.8)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-red-900/90"></div>
                          <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      
                          }}></div>
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side */}
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              animate="visible"
              className="text-white"
            >
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                <br />
                HUAWEI<span className="text-red-600"> eKit</span> UAE <br />
                 Join the Distribution Network
              </h1>
              <p className="text-xl text-red-100">
                Fill out the form and we will reach out to discuss how we can collaborate.
              </p>

            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              className="w-full max-w-md mx-auto"
            >
              <div className="backdrop-blur-lg bg-white/15 rounded-2xl p-8 border border-white/25">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    name="fullName"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/15 rounded-xl text-white placeholder-white/80 resize-none border border-transparent focus:border-red-400 focus:outline-none transition-colors duration-300"
                    required
                  />

                  {/* Email */}
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/15 rounded-xl text-white placeholder-white/80 resize-none border border-transparent focus:border-red-400 focus:outline-none transition-colors duration-300"
                    required
                  />

                  {/* Phone */}
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/15 rounded-xl text-white placeholder-white/80 resize-none border border-transparent focus:border-red-400 focus:outline-none transition-colors duration-300"
                  />

                  {/* Company */}
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/15 rounded-xl text-white placeholder-white/80 resize-none border border-transparent focus:border-red-400 focus:outline-none transition-colors duration-300"
                  />

                  {/* Service */}
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/15 rounded-xl text-white border border-transparent focus:border-red-400 focus:outline-none transition-colors duration-300"
                    required
                  >
                    <option value="" disabled className="bg-gray-800 text-gray-300">Select Service *</option>
                    <option value="Network Infrastructure" className="bg-gray-800 text-white">Network Infrastructure</option>
                    <option value="Wireless Solutions" className="bg-gray-800 text-white">Wireless Solutions</option>
                    <option value="Security Systems" className="bg-gray-800 text-white">Security Systems</option>
                    <option value="Cloud Services" className="bg-gray-800 text-white">Cloud Services</option>
                    <option value="Technical Support" className="bg-gray-800 text-white">Technical Support</option>
                    <option value="Partnership" className="bg-gray-800 text-white">Partnership</option>
                    <option value="Other" className="bg-gray-800 text-white">Other</option>
                  </motion.select>

                  {/* Subject */}
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    name="subject"
                    placeholder="Subject *"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/15 rounded-xl text-white placeholder-white/80 resize-none border border-transparent focus:border-red-400 focus:outline-none transition-colors duration-300"
                    required
                  />

                  {/* Message */}
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    name="message"
                    placeholder="Tell us about your project requirements... *"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/15 rounded-xl text-white placeholder-white/80 resize-none border border-transparent focus:border-red-400 focus:outline-none transition-colors duration-300"
                    required
                  />

                  {/* Response Time Notice */}
                  <div className="text-center text-white/80 text-sm">
                    We'll respond within 24 hours
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{
                      scale: isSubmitting ? 1 : 1.05,
                      backgroundColor: "#dc2626",
                      color: "#ffffff",
                      borderColor: "#dc2626"
                    }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                    transition={{ duration: 0.3 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="mx-auto block bg-transparent border border-red-400 text-white/80 font-semibold py-2 px-8 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Contact Info */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="mt-16 grid md:grid-cols-3 gap-8 text-white text-center"
          >
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="transition-transform duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-bold mb-2">Office Address</h3>
              <a
                href="https://maps.app.goo.gl/v8L9XJ9t6rRzYUDJ7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-gray-300 hover:text-red-200 transition-colors duration-300"
              >
                <MapPin className="w-5 h-5 mr-2 text-gray-300 mt-1" />
                <span>
                  25th St - Naif - Dubai
                  <br />
                  United Arab Emirates
                </span>
              </a>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="transition-transform duration-300"
            >
              <h3 className="text-xl font-bold mb-2">Business Hours</h3>
              <p className="text-gray-300">
                Monday - Saturday:<br />
                9:30 AM - 5:30 PM
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="transition-transform duration-300 space-y-2"
            >
              <h3 className="text-xl font-bold mb-2">Contact</h3>
              <a
                href="tel:+00971509664956"
                className="block text-gray-300 hover:text-red-200 transition-colors duration-300"
              >
                <Phone className="w-5 h-5 inline-block mr-2 text-gray-300" />
                +0097150966 4956
              </a>
              <a
                href="mailto:mail@ekit-huawei-uae.com"
                className="flex items-center justify-center gap-2 text-gray-300 hover:text-red-200 transition-colors duration-300"
              >
                <Mail className="w-4 h-4" />
                mail@ekit-huawei-uae.com
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Add the Map Section */}
      <MapSection />
    </>
  );
}