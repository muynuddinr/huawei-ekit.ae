"use client";
import React, { useState } from 'react';
import { 
    Smartphone, 
    MapPin, 
    Shield, 
    CheckCircle, 
    Building, 
    Headphones, 
    GraduationCap, 
    Globe, 
    Handshake, 
    ShoppingBag, 
    Settings, 
    Wrench, 
    Lock, 
    Signal, 
    Phone,
    ChevronDown,
    Cpu,
    Database,
    Cloud,
    Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Variants } from 'framer-motion';

const faqData = [
    {
        question: "What eKit products does Huawei offer in the UAE?",
        answer: "Huawei's eKit portfolio in the UAE includes enterprise-grade networking equipment, cloud infrastructure solutions, data center components, AI computing systems, and specialized industry solutions tailored for UAE businesses.",
        icon: <Cpu className="w-4 h-4 text-gray-600" />
    },
    {
        question: "Where can I get technical support for Huawei eKit products in the UAE?",
        answer: "Dedicated technical support for eKit products is available through our enterprise support hotline, authorized service partners, and direct account managers. We provide 24/7 critical issue support for enterprise clients.",
        icon: <Headphones className="w-4 h-4 text-gray-600" />
    },
    {
        question: "What warranty coverage do Huawei eKit products have in the UAE?",
        answer: "Huawei eKit products come with comprehensive warranty packages including 1-5 years depending on the product category, with optional extended warranty and premium support plans available for enterprise customers.",
        icon: <Shield className="w-4 h-4 text-gray-600" />
    },
    {
        question: "How can I verify the authenticity of Huawei eKit products?",
        answer: "All genuine Huawei eKit products feature unique serial numbers and security labels. You can verify authenticity through our enterprise portal or by contacting our UAE enterprise support team with your product details.",
        icon: <CheckCircle className="w-4 h-4 text-gray-600" />
    },
    {
        question: "What enterprise networking eKit solutions are available?",
        answer: "Our eKit networking portfolio includes switches, routers, wireless access points, firewalls, and SD-WAN solutions specifically designed for UAE enterprise environments and climate conditions.",
        icon: <Network className="w-4 h-4 text-gray-600" />
    },
    {
        question: "Does Huawei provide eKit training and certification in the UAE?",
        answer: "Yes, we offer comprehensive training programs for eKit products through Huawei Certified Network Professional (HCNP) and other certification tracks at our authorized training centers in Dubai and Abu Dhabi.",
        icon: <GraduationCap className="w-4 h-4 text-gray-600" />
    },
    {
        question: "What data center eKit solutions does Huawei offer?",
        answer: "Huawei eKit data center solutions include server racks, storage systems, backup power solutions, and cooling systems optimized for UAE's high-temperature environment and enterprise requirements.",
        icon: <Database className="w-4 h-4 text-gray-600" />
    },
    {
        question: "How can businesses become Huawei eKit partners in the UAE?",
        answer: "We welcome partnerships with qualified IT solution providers. Interested businesses can apply through our enterprise partner portal or contact our channel management team for partnership criteria and benefits.",
        icon: <Handshake className="w-4 h-4 text-gray-600" />
    },
    {
        question: "Where can I purchase genuine Huawei eKit products in the UAE?",
        answer: "Genuine eKit products are available through authorized distributors, enterprise solution providers, and direct sales channels. Contact our enterprise team for authorized dealer information.",
        icon: <ShoppingBag className="w-4 h-4 text-gray-600" />
    },
    {
        question: "What cloud eKit solutions are available for UAE enterprises?",
        answer: "Huawei offers hybrid cloud eKit solutions, private cloud infrastructure, and cloud management platforms designed to meet UAE data sovereignty requirements and enterprise security standards.",
        icon: <Cloud className="w-4 h-4 text-gray-600" />
    },
    {
        question: "What after-sales services are available for eKit products?",
        answer: "Our eKit after-sales services include proactive maintenance, firmware updates, technical consultations, spare parts management, and dedicated account support for enterprise customers.",
        icon: <Wrench className="w-4 h-4 text-gray-600" />
    },
    {
        question: "How does Huawei ensure eKit product security for UAE clients?",
        answer: "All eKit products undergo rigorous security testing and comply with UAE cybersecurity standards. We provide regular security patches and work closely with UAE regulatory bodies to ensure compliance.",
        icon: <Lock className="w-4 h-4 text-gray-600" />
    },
    {
        question: "What 5G eKit solutions does Huawei offer for enterprises?",
        answer: "Our 5G eKit portfolio includes private network solutions, industrial routers, and edge computing devices that leverage Huawei's 5G technology for UAE enterprise digital transformation.",
        icon: <Signal className="w-4 h-4 text-gray-600" />
    },
    {
        question: "Are there customized eKit solutions for specific UAE industries?",
        answer: "Yes, we develop customized eKit solutions for UAE sectors including government, finance, oil & gas, and smart cities, with localization for regional requirements and regulations.",
        icon: <Settings className="w-4 h-4 text-gray-600" />
    },
    {
        question: "How can I contact the Huawei eKit enterprise team in the UAE?",
        answer: "Our dedicated eKit enterprise team can be reached through the enterprise hotline, dedicated account managers, or by visiting our enterprise business offices in Dubai Internet City.",
        icon: <Phone className="w-4 h-4 text-gray-600" />
    }
];

const FAQ = () => {
  const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  // Animation variants for items
  const itemVariants : Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  // Animation variants for accordion content
  const accordionVariants: Variants = {
    collapsed: { 
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    },
    expanded: { 
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50">
      {/* FAQ Content */}
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Introduction */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Huawei <span className='text-red-600'>eKit</span> Products - UAE Support
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Comprehensive information about Huawei enterprise kit (eKit) products, including technical support, warranty, training, and enterprise solutions specifically for the UAE market.
            </p>
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            className="space-y-3"
          >
            {faqData.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <motion.button
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleItem(index)}
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                  whileTap={{ scale: 0.995 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <h3 className="text-base font-medium text-gray-800 pr-4">
                      {item.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <motion.div
                      animate={{ rotate: openItems[index] ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </motion.div>
                  </div>
                </motion.button>
                
                <AnimatePresence initial={false}>
                  {openItems[index] && (
                    <motion.div
                      variants={accordionVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1">
                        <div className="pl-7">
                          <motion.p 
                            className="text-gray-700 text-sm leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            {item.answer}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;