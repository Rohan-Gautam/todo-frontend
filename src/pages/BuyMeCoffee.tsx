import React, { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Coffee, Heart, Sparkles } from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const BuyMeCoffee: React.FC = () => {
    const [selectedPreset, setSelectedPreset] = useState<number | null>(1);
    const [customAmount, setCustomAmount] = useState<string>("50");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const pricePerCoffee = 50;

    // --- 3D Mouse Tracking Setup ---
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    // Map mouse position to tilt angles
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // --- Razorpay Logic ---
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
                handler: async function (response: any) {
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
                    } catch (error) {
                        alert("Payment verification failed.");
                    }
                },
                prefill: { name: "Awesome Supporter", email: "supporter@example.com" },
                theme: { color: "#8B5A2B" },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment initialization failed:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Array for floating background particles
    const floatingElements = Array.from({ length: 12 });

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden relative"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop')" }}
        >
            {/* Dark Cinematic Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Ambient Floating Elements */}
            {floatingElements.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-white/5 pointer-events-none"
                    initial={{
                        // eslint-disable-next-line react-hooks/purity
                        y: Math.random() * window.innerHeight,
                        // eslint-disable-next-line react-hooks/purity
                        x: Math.random() * window.innerWidth,
                        rotate: 0,
                        // eslint-disable-next-line react-hooks/purity
                        scale: Math.random() * 1.5 + 0.5,
                    }}
                    animate={{
                        // eslint-disable-next-line react-hooks/purity
                        y: [null, Math.random() * -800],
                        // eslint-disable-next-line react-hooks/purity
                        rotate: [0, Math.random() * 360 > 180 ? 360 : -360],
                    }}
                    transition={{
                        // eslint-disable-next-line react-hooks/purity
                        duration: Math.random() * 20 + 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {i % 2 === 0 ? <Coffee size={40} /> : <Heart size={30} />}
                </motion.div>
            ))}

            {/* 3D Parallax Container */}
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ perspective: 1200 }}
                className="relative z-10 w-full max-w-md p-4 flex justify-center"
            >
                {/* The Tilt Card */}
                <motion.div
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl w-full text-center flex flex-col items-center"
                >
                    {/* Levitating Icon */}
                    <motion.div
                        style={{ translateZ: 80 }}
                        className="relative mb-6"
                    >
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="bg-gradient-to-br from-[#8B5A2B] to-[#5C3A21] p-5 rounded-full shadow-[0_0_30px_rgba(139,90,43,0.5)] relative"
                        >
                            <Coffee size={45} className="text-white" />
                            <Sparkles size={20} className="absolute -top-2 -right-2 text-yellow-300 animate-pulse" />
                        </motion.div>
                    </motion.div>

                    {/* Popping Text */}
                    <motion.div style={{ translateZ: 50 }} className="mb-8 w-full">
                        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Fuel the Code</h1>
                        <p className="text-white/70 text-sm leading-relaxed">
                            If you enjoy my work, consider supporting me! It keeps the caffeine flowing and the bugs away.
                        </p>
                    </motion.div>

                    {/* 3D Presets */}
                    <motion.div style={{ translateZ: 60 }} className="flex justify-center gap-3 mb-6 w-full">
                        {[1, 2, 3].map((num) => (
                            <motion.button
                                key={num}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setSelectedPreset(num);
                                    setCustomAmount((num * pricePerCoffee).toString());
                                }}
                                className={`flex-1 py-3 rounded-2xl flex flex-col items-center justify-center transition-colors duration-300 border ${
                                    selectedPreset === num
                                        ? "bg-gradient-to-br from-[#8B5A2B] to-[#5C3A21] border-[#8B5A2B] text-white shadow-lg shadow-[#8B5A2B]/40"
                                        : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                                }`}
                            >
                                <span className="font-bold text-lg">₹{num * pricePerCoffee}</span>
                                <span className="text-[10px] opacity-70 uppercase tracking-wider">{num} Cup{num > 1 ? 's' : ''}</span>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Custom Amount Field */}
                    <motion.div style={{ translateZ: 40 }} className="w-full relative mb-8">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-white/50 font-bold">₹</span>
                        </div>
                        <input
                            type="number"
                            value={customAmount}
                            min="1"
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setSelectedPreset(null);
                            }}
                            className="w-full pl-8 pr-4 py-3 rounded-xl bg-black/20 text-white font-semibold border border-white/10 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] transition-all backdrop-blur-md shadow-inner"
                            placeholder="Custom amount"
                        />
                    </motion.div>

                    {/* Master Action Button */}
                    <motion.button
                        style={{ translateZ: 70 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#8B5A2B] to-[#704822] text-white py-4 rounded-xl font-extrabold text-lg transition-all duration-300 shadow-[0_10px_20px_rgba(139,90,43,0.4)] hover:shadow-[0_15px_30px_rgba(139,90,43,0.6)] disabled:opacity-50 flex items-center justify-center gap-2 overflow-hidden relative group"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        {loading ? (
                            <span className="animate-pulse">Brewing...</span>
                        ) : (
                            <>
                                <Heart size={20} className="text-red-400 fill-red-400" />
                                Support ₹{customAmount || "0"}
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Required for the button shimmer effect */}
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default BuyMeCoffee;