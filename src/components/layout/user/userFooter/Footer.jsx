'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa'
import { FaCcVisa } from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";
import { FaPaypal } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";

const iconVariants = {
  hover: { scale: 1.2, rotate: 5 }
}

const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const FooterSection = ({ title, items }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
  >
    <h3 className="font-semibold mb-4 text-lg">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={listItemVariants}
          className="hover:text-gray-300 cursor-pointer"
        >
          {item}
        </motion.li>
      ))}
    </ul>
  </motion.div>
)

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white mt-10 py-12 px-4">
      <div className="container text-center mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <FooterSection
          title="Contact"
          items={['Home', 'Contact us', 'About us', 'Store locator']}
        />
        <FooterSection
          title="Customer Service"
          items={['FAQ', 'Shipping and Returns', 'Order Tracking', 'Size guide']}
        />
        <FooterSection
          title="Information"
          items={['Privacy Policy', 'Terms & Conditions', 'Return Policy', 'Payment Methods']}
        />
        <div>
          <h3 className="font-semibold mb-4 text-lg">Follow Us</h3>
          <div className="flex justify-center space-x-4">
            {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, index) => (
              <motion.div key={index} whileHover="hover" variants={iconVariants}>
                <Icon className="text-2xl cursor-pointer" />
              </motion.div>
            ))}
          </div>
          <h3 className="font-semibold my-4 text-lg">Digital Partners</h3>
          <div className="flex justify-center space-x-4">
          {[FaCcVisa, SiRazorpay, FaPaypal, FaCcMastercard].map((Icon, index) => (
              <motion.div key={index} whileHover="hover" variants={iconVariants}>
                <Icon className="text-2xl cursor-pointer " />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="container mx-auto text-center mt-12 border-t border-gray-700 pt-8"
      >
        <div className="flex justify-center mb-4">
          <img
            src="/logo_white.png"
            alt="Logo"
            className="h-16 w-auto"
          />
        </div>
        <p className="text-sm">© {new Date().getFullYear()} FootballShoeStore.com - All rights reserved</p>
      </motion.div>
    </footer>
  )
}
