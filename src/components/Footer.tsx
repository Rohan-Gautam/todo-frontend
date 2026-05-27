import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react"; // Keep Heart from Lucide
// Import the brand icons from react-icons (specifically the FontAwesome branch)
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <FaGithub size={20} />, href: "https://github.com", label: "GitHub" },
        { icon: <FaLinkedin size={20} />, href: "https://linkedin.com", label: "LinkedIn" },
        { icon: <FaTwitter size={20} />, href: "https://twitter.com", label: "Twitter" },
    ];

    return (
        <footer className="w-full bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Left: Branding & Copyright */}
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                            TaskMaster
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                            © {currentYear} All rights reserved.
                        </p>
                    </div>

                    {/* Center: Made with Love */}
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                        Built with
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                            <Heart size={16} className="text-red-500 fill-red-500" />
                        </motion.div>
                        and copious amounts of coffee.
                    </div>

                    {/* Right: Social Links */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                whileHover={{ y: -3, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-gray-400 hover:text-blue-600 transition-colors p-2 bg-gray-50 rounded-full border border-gray-100 hover:border-blue-100 hover:bg-blue-50"
                            >
                                {social.icon}
                            </motion.a>
                        ))}
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;