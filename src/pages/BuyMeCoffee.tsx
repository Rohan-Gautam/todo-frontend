import React, { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Coffee, Heart, Sparkles, Star } from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BuyMeCoffee: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPreset, setSelectedPreset] = useState<number | null>(1);
    const [customAmount, setCustomAmount] = useState<string>("50");
    const [loading, setLoading] = useState<boolean>(false);

    // Username for Navbar
    const [displayName] = useState(localStorage.getItem("name") ?? "User");
    const pricePerCoffee = 50;

    // --- 3D Mouse Tracking Setup ---
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // --- Razorpay Logic (Preserved exactly) ---
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const amount = parseInt(customAmount, 10);
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setLoading(true);
        const isLoaded = await loadRazorpayScript();

        if (!isLoaded) {
            alert("Razorpay failed to load. Check your connection.");
            setLoading(false);
            return;
        }

        try {
            const orderResponse = await api.post(`/buy-me-a-coffee/create-order?amount=${amount}`);
            // Fix ESLint: Explicitly check the type of orderResponse.data without 'any'
            const orderData = typeof orderResponse.data === 'string' ? JSON.parse(orderResponse.data) : orderResponse.data;
            const keyResponse = await api.post("/buy-me-a-coffee/get-key");
            const razorpayKey = keyResponse.data;

            const options = {
                key: razorpayKey,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Support My Work",
                description: `Fueling the code with ₹${amount}`,
                image: "https://cdn-icons-png.flaticon.com/512/3061/3061341.png",
                order_id: orderData.id,
                // Fix ESLint: Removed 'any' type definition and unused parameter
                handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }) {
                    try {
                        const verify = await api.post("/buy-me-a-coffee/payment-callback", null, {
                            params: {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                        });
                        if (verify.data === "Success") {
                            navigate(`/success?orderId=${response.razorpay_order_id}`);
                        }
                    } catch { // Fix ESLint: Removed unused 'error' variable
                        alert("Payment verification failed.");
                    }
                },
                prefill: { name: "Awesome Supporter", email: "supporter@example.com" },
                theme: { color: "#8B5A2B" },
            };

            // Fix ESLint: Replaced 'any' with a generic unknown type cast to access Razorpay
            const paymentObject = new (window as unknown as { Razorpay: new (options: unknown) => { open: () => void } }).Razorpay(options);
            paymentObject.open();
        } catch { // Fix ESLint: Removed unused 'error' variable
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Ambient floating doodles array
    const floatingElements = Array.from({ length: 25 });

    // Fume lines array
    const fumeLines = Array.from({ length: 3 });

    return (
        // Math Notebook Grid Background + Kalam Font globally applied. flex flex-col to root
        <div
            className="min-h-screen flex flex-col font-['Kalam',_cursive] text-slate-800 bg-[#fcfbf9] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]"
        >
            {/* Header */}
            <Navbar name={displayName} />

            {/* Main Interactive Parallax Container - Centered within flex-grow */}
            <div className="relative flex-grow flex items-center justify-center p-6 flex-col overflow-hidden">

                {/* --- Decorative Coffee Ring Stains (Aged Desk feel over grid) --- */}
                <div className="absolute top-20 left-10 w-64 h-64 border-[12px] border-[#8b5a2b]/10 rounded-full pointer-events-none transform -rotate-12 z-0"></div>
                <div className="absolute bottom-20 right-10 w-48 h-48 border-[8px] border-[#8b5a2b]/5 rounded-full pointer-events-none z-0"></div>

                {/* --- Mugs with Fume sitting on the "desk" corners --- */}
                {[ { top: '80%', left: '15%', rotate: -15 }, { top: '15%', left: '80%', rotate: 10 }, { top: '75%', left: '75%', rotate: 5 } ].map((pos, idx) => (
                    <div
                        key={idx}
                        className="absolute pointer-events-none flex flex-col items-center justify-center transform group hover:scale-110 transition-transform"
                        style={{ top: pos.top, left: pos.left, transform: `rotate(${pos.rotate}deg)`, zIndex: 0 }}
                    >
                        {/* Animated Rising Fume lines */}
                        <div className="flex gap-1 mb-1">
                            {fumeLines.map((_, fumeIdx) => (
                                <motion.div
                                    key={fumeIdx}
                                    animate={{
                                        y: [0, -30],
                                        opacity: [0, 0.8, 0],
                                        scale: [0.8, 1.1, 1.3],
                                        x: [0, fumeIdx % 2 === 0 ? 5 : -5, 0]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: fumeIdx * 0.3 + idx * 0.5, ease: "easeOut" }}
                                    className="w-0.5 h-6 bg-slate-300 rounded-full blur-[2px]"
                                />
                            ))}
                        </div>
                        <div className="bg-amber-100/50 border-2 border-slate-800 p-2.5 rounded-full shadow-[2px_2px_0_#1e293b] scale-75">
                            <Coffee size={24} className="text-[#8B5A2B]/70" />
                        </div>
                    </div>
                ))}

                {/* --- Additional Sketched Desk Props Doodles (Static) --- */}
                <div className="absolute top-[20%] left-[10%] text-[#8b5a2b]/30 font-bold text-lg rotate-[10deg] z-0">Pencil Doodles ✏️</div>
                <div className="absolute bottom-[30%] left-[5%] text-[#8b5a2b]/10 font-bold text-lg -rotate-[10deg] z-0">Scribbled Idea 💡</div>

                {/* --- Ambient Floating Doodles (Coffee, Heart, Star) --- */}
                {floatingElements.map((_, i) => {
                    const isStar = i % 3 === 0;
                    const isHeart = i % 3 === 1;
                    return (
                        <motion.div
                            key={i}
                            className={`absolute pointer-events-none ${isHeart ? 'text-rose-300' : isStar ? 'text-amber-300' : 'text-[#8b5a2b]/30'}`}
                            style={{ zIndex: 0 }}
                            initial={{
                                // eslint-disable-next-line react-hooks/purity
                                y: Math.random() * window.innerHeight + 100,
                                // eslint-disable-next-line react-hooks/purity
                                x: Math.random() * window.innerWidth,
                                // eslint-disable-next-line react-hooks/purity
                                rotate: Math.random() * 360,
                                // eslint-disable-next-line react-hooks/purity
                                scale: Math.random() * 0.8 + 0.4,
                            }}
                            animate={{
                                y: [null, -100],
                                // eslint-disable-next-line react-hooks/purity
                                x: (Math.random() - 0.5) * 200 + (Math.random() * window.innerWidth),
                                // eslint-disable-next-line react-hooks/purity
                                rotate: [null, Math.random() * 360],
                            }}
                            transition={{
                                // eslint-disable-next-line react-hooks/purity
                                duration: Math.random() * 15 + 15,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            {isHeart ? <Heart fill="currentColor" size={24} /> : isStar ? <Star fill="currentColor" size={20} /> : <Coffee size={28} strokeWidth={1.5} />}
                        </motion.div>
                    );
                })}

                {/* --- Main Interactive 3D Card Area --- */}
                <motion.div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ perspective: 1200 }}
                    className="relative z-10 w-full max-w-md p-6 flex justify-center"
                >
                    {/* The Sketched Polaroid Support Card */}
                    <motion.div
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d",
                        }}
                        initial={{ opacity: 0, y: 50, rotate: -2 }}
                        animate={{ opacity: 1, y: 0, rotate: -2 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                        className="bg-[#fff9ed] border-4 border-slate-800 p-8 pt-12 rounded-xl shadow-[16px_16px_0_#1e293b] w-full text-center flex flex-col items-center relative"
                    >
                        {/* Washi Tape */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-rose-300/80 border border-slate-800/20 backdrop-blur-sm transform rotate-3 shadow-sm z-10"></div>
                        <div className="absolute -top-3 left-[40%] -translate-x-1/2 w-16 h-8 bg-amber-200/80 border border-slate-800/20 backdrop-blur-sm transform -rotate-6 shadow-sm z-20"></div>

                        {/* Animated Coffee Mug with Smoke */}
                        <motion.div
                            style={{ translateZ: 80 }}
                            className="relative mb-6 flex flex-col items-center justify-center"
                        >
                            {/* Rising Steam Lines */}
                            <div className="absolute -top-12 flex gap-2">
                                {fumeLines.map((_, idx) => (
                                    <motion.div
                                        key={idx}
                                        animate={{
                                            y: [0, -30],
                                            opacity: [0, 0.8, 0],
                                            scale: [0.8, 1.2, 1.5],
                                            x: [0, idx % 2 === 0 ? 10 : -10, 0]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3, ease: "easeOut" }}
                                        className="w-1 h-8 bg-slate-300 rounded-full blur-[2px]"
                                    />
                                ))}
                            </div>

                            <div className="bg-amber-100 border-4 border-slate-800 p-5 rounded-full shadow-[6px_6px_0_#1e293b] relative transform hover:scale-110 transition-transform">
                                <Coffee size={40} className="text-[#8B5A2B]" />
                                <Sparkles size={20} className="absolute -top-2 -right-2 text-amber-500 animate-pulse" />
                            </div>
                        </motion.div>

                        {/* Sketched Title */}
                        <motion.div style={{ translateZ: 50 }} className="mb-8 w-full">
                            <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-wide underline decoration-wavy decoration-rose-400 decoration-4 underline-offset-8">
                                Fuel the Code
                            </h1>
                            <p className="text-slate-600 text-xl font-bold leading-relaxed mt-4">
                                Keep the caffeine flowing and the bugs away! ☕✨
                            </p>
                        </motion.div>

                        {/* Cafe Punch Card Presets */}
                        <motion.div style={{ translateZ: 60 }} className="flex justify-center gap-3 mb-8 w-full">
                            {[1, 3, 5].map((num) => (
                                <motion.button
                                    key={num}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedPreset(num);
                                        setCustomAmount((num * pricePerCoffee).toString());
                                    }}
                                    className={`flex-1 py-3 rounded-lg flex flex-col items-center justify-center transition-all duration-300 border-4 shadow-[4px_4px_0_#1e293b] ${
                                        selectedPreset === num
                                            ? "bg-amber-300 border-slate-800 text-slate-900 transform -rotate-2 scale-105"
                                            : "bg-white border-slate-800 text-slate-700 hover:bg-amber-100"
                                    }`}
                                >
                                    <span className="font-extrabold text-2xl">₹{num * pricePerCoffee}</span>
                                    <span className="text-sm font-bold opacity-80 uppercase">{num} Cup{num > 1 ? 's' : ''}</span>
                                </motion.button>
                            ))}
                        </motion.div>

                        {/* Sketched Custom Amount Field */}
                        <motion.div style={{ translateZ: 40 }} className="w-full relative mb-8">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <span className="text-slate-500 font-bold text-2xl">₹</span>
                            </div>
                            <input
                                type="number"
                                value={customAmount}
                                min="1"
                                onChange={(e) => {
                                    setCustomAmount(e.target.value);
                                    setSelectedPreset(null);
                                }}
                                className="w-full pl-10 pr-4 py-4 rounded-xl bg-white text-slate-800 font-bold text-2xl border-4 border-slate-800 focus:outline-none focus:bg-amber-50 transition-all shadow-[inset_4px_4px_0_rgba(0,0,0,0.05)]"
                                placeholder="Custom amount"
                            />
                        </motion.div>

                        {/* Sketched CTA Button */}
                        <motion.button
                            style={{ translateZ: 70 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98, x: 6, y: 6, boxShadow: "0px 0px 0 #1e293b" }}
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full bg-[#8B5A2B] text-white py-4 rounded-xl font-extrabold text-2xl transition-all duration-200 border-4 border-slate-800 shadow-[8px_8px_0_#1e293b] disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                            {loading ? (
                                <span className="animate-pulse">Brewing... ♨️</span>
                            ) : (
                                <>
                                    <Heart size={24} className="text-rose-400 fill-rose-400" />
                                    Buy {customAmount || "0"} Coffee
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="flex flex-col justify-start w-full bg-white border-t-4 border-slate-800 z-20">
                <Footer />
            </div>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default BuyMeCoffee;