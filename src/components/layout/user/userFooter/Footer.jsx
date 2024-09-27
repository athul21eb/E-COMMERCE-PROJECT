import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <ul>
            <li>Home</li>
            <li>Contact us</li>
            <li>About us</li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="font-semibold mb-4">Customer Service</h3>
          <ul>
            <li>FAQ</li>
            <li>Shipping and Returns</li>
            <li>Order Tracking</li>
            <li>Size guide</li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="font-semibold mb-4">Information</h3>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Return Policy</li>
            <li>Payment Methods</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-4">Newsletter</h3>
          <div className="flex items-center">
            <input
              type="email"
              placeholder="example@gmail.com"
              className="p-2 rounded-l-md w-full"
            />
            <button className="p-2 bg-blue-500 rounded-r-md hover:bg-blue-600">Subscribe</button>
          </div>
          <div className="flex space-x-4 mt-4">
            <FaWhatsapp className="text-2xl" />
            <FaInstagram className="text-2xl" />
            <FaFacebookF className="text-2xl" />
            <FaTwitter className="text-2xl" />
            <FaLinkedinIn className="text-2xl" />
          </div>
        </div>
      </div>
      <div className="container mx-auto text-center mt-8 border-t border-gray-700 pt-4">
        <div className="flex justify-center space-x-4">
          <img src="/visa.svg" alt="Visa" className="size-12" />
          <img src="/paypal.svg" alt="PayPal" className="w-24" />
          <img src="/mastercard.svg" alt="MasterCard" className="size-12" />
          <img src="/razorpay.svg" alt="RazorPay" className="w-24" />
        </div>
        <p className="mt-4">© 2024 fire.com</p>
      </div>
    </footer>
  );
};

export default Footer;
