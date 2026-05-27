import React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Coffee, CheckCircle, Sparkles } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Success: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get("orderId");

    // 3D Mouse Tracking Setup
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth out the mouse values for fluid movement
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    // Map mouse position to rotation angles (max tilt: 15 degrees)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

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

    // Array for floating background particles
    const floatingCoffees = Array.from({ length: 8 });

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden relative"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2000&auto=format&fit=crop')" }}
        >
            {/* Dark/Warm Overlay */}
            <div className="absolute inset-0 bg-[#3E2723]/70 backdrop-blur-sm"></div>

            {/* Floating Background Elements */}
            {floatingCoffees.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-white/10"
                    initial={{
                        // eslint-disable-next-line react-hooks/purity
                        y: Math.random() * window.innerHeight,
                        // eslint-disable-next-line react-hooks/purity
                        x: Math.random() * window.innerWidth,
                        rotate: 0,
                    }}
                    animate={{
                        // eslint-disable-next-line react-hooks/purity
                        y: [null, Math.random() * -500],
                        rotate: [0, 360],
                    }}
                    transition={{
                        // eslint-disable-next-line react-hooks/purity
                        duration: Math.random() * 10 + 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <Coffee size={
                        // eslint-disable-next-line react-hooks/purity
                        Math.random() * 40 + 20} />
                </motion.div>
            ))}

            {/* 3D Interactive Container */}
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ perspective: 1200 }} // Enables 3D space
                className="relative z-10 w-full max-w-md p-4 flex justify-center"
            >
                {/* The Card */}
                <motion.div
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d", // Allows children to pop out
                    }}
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                    className="bg-white/90 backdrop-blur-xl border border-white/40 p-10 rounded-[2rem] shadow-2xl w-full text-center flex flex-col items-center"
                >
                    {/* Popping Icon Wrapper */}
                    <motion.div
                        style={{ translateZ: 60 }} // Pushes the icon OUT of the screen
                        className="relative mb-8 mt-4"
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                rotateZ: [-2, 2, -2]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="bg-gradient-to-br from-[#8B5A2B] to-[#5C3A21] p-6 rounded-full shadow-xl relative"
                        >
                            <Coffee size={60} className="text-white" />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6, type: "spring", bounce: 0.6 }}
                                className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-white shadow-lg"
                            >
                                <CheckCircle size={24} className="text-white" />
                            </motion.div>

                            {/* Sparkles */}
                            <Sparkles size={24} className="absolute -top-4 -left-4 text-yellow-400 animate-pulse" />
                            <Sparkles size={20} className="absolute -bottom-2 -left-2 text-yellow-400 animate-bounce" />
                        </motion.div>
                    </motion.div>

                    {/* Popping Text */}
                    <motion.div style={{ translateZ: 40 }} className="flex flex-col items-center">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5A2B] to-[#5C3A21] mb-3">
                            You Are Awesome!
                        </h1>
                        <p className="text-gray-700 font-medium mb-6 leading-relaxed">
                            Payment successful. Thank you for fueling the late-night Spring-Boot & Debugging sessions and keeping the momentum alive. You're a legend! 🚀
                        </p>

                        {orderId && (
                            <div className="bg-gray-100/80 px-4 py-2 rounded-lg mb-8 border border-gray-200 shadow-inner">
                                <p className="text-xs text-gray-500 font-mono tracking-wider">
                                    ORDER_ID: <span className="font-bold text-gray-700">{orderId}</span>
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Popping Button */}
                    <motion.button
                        style={{ translateZ: 30 }}
                        whileHover={{ scale: 1.05, translateZ: 40 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-3.5 bg-gradient-to-r from-[#8B5A2B] to-[#704822] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#8B5A2B]/40 hover:shadow-[#8B5A2B]/60 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        Back to Dashboard
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Success;