import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <FaGithub size={24} />, href: "https://github.com/Rohan-Gautam", label: "GitHub" },
        { icon: <FaLinkedin size={24} />, href: "https://www.linkedin.com/in/rohan-gautam-b33695250/", label: "LinkedIn" },
        { icon: <FaInstagram size={24} />, href: "https://www.instagram.com/rohangautammm", label: "Instagram" },
    ];

    return (
        // Added the Kalam font, a thick top border, and a slight paper texture background
        <footer className="w-full bg-amber-50 border-t-4 border-slate-800 mt-auto relative font-['Kalam',_cursive]">

            {/* A piece of tape to hold the footer down */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 border border-slate-800/20 backdrop-blur-sm transform rotate-2 shadow-sm z-10"></div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* Left: Branding & Copyright */}
                    <div className="flex flex-col items-center md:items-start transform -rotate-1">
                        <span className="text-3xl font-extrabold text-slate-800 tracking-wide underline decoration-wavy decoration-blue-400 decoration-2 underline-offset-4">
                            TaskSketch
                        </span>
                        <p className="text-lg text-slate-600 mt-2 font-bold">
                            © {currentYear} All rights reserved.
                        </p>
                    </div>

                    {/* Center: Made with Love */}
                    <div className="flex items-center gap-2 text-xl font-bold text-slate-700 bg-white border-2 border-slate-800 px-4 py-2 rounded-md shadow-[4px_4px_0_#1e293b] transform rotate-1">
                        Built with
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                            className="text-red-500"
                        >
                            ❤️
                        </motion.div>
                        and too much ☕.
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
                                whileHover={{ y: -4, scale: 1.1, rotate: index % 2 === 0 ? 3 : -3 }}
                                whileTap={{ scale: 0.95 }}
                                // Brutalist styling for the social buttons
                                className="text-slate-800 bg-white p-3 rounded-md border-2 border-slate-800 shadow-[4px_4px_0_#1e293b] hover:bg-amber-200 transition-colors"
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