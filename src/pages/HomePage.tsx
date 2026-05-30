import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function HomePage() {
    const navigate = useNavigate();

    return (
        // Math Notebook Grid Background + Kalam Font globally applied!
        <div className="min-h-screen flex flex-col font-['Kalam',_cursive] text-slate-800 bg-[#fcfbf9] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]">

            {/* Main Content Area centered with flex-grow */}
            <div className="flex-grow flex items-center justify-center p-4">

                {/* Sketched Hero Card - The "Notebook Cover" */}
                <div className="relative bg-amber-50 p-10 sm:p-16 rounded-xl border-4 border-slate-800 shadow-[16px_16px_0_#1e293b] w-full max-w-2xl text-center transform -rotate-1">

                    {/* Big piece of Masking Tape */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/40 border border-slate-800/20 backdrop-blur-sm transform rotate-2 shadow-sm z-10"></div>

                    {/* Sketched Title */}
                    <h1 className="text-5xl sm:text-7xl font-bold text-slate-800 mb-6 tracking-wide underline decoration-wavy decoration-blue-400 decoration-4 underline-offset-8">
                        TaskSketch 📓
                    </h1>

                    <p className="text-2xl text-slate-600 mb-10 font-bold max-w-lg mx-auto leading-relaxed">
                        A messy, beautiful place to scribble down your plans, clear your head, and get things done.
                    </p>

                    {/* Call to Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button
                            onClick={() => navigate("/register")}
                            className="w-full sm:w-auto px-8 py-4 bg-blue-400 text-slate-900 border-4 border-slate-800 rounded-md text-2xl font-bold hover:bg-blue-500 transition-all shadow-[6px_6px_0_#1e293b] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transform -rotate-1"
                        >
                            Start Drawing! ✍️
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border-4 border-slate-800 rounded-md text-2xl font-bold hover:bg-slate-100 transition-all shadow-[6px_6px_0_#1e293b] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transform rotate-1"
                        >
                            Open Notebook 📖
                        </button>
                    </div>

                </div>
            </div>

            {/* Footer with white background to end the grid nicely */}
            <div className="flex flex-col justify-start w-full bg-white border-t-4 border-slate-800">
                <Footer />
            </div>

        </div>
    );
}

export default HomePage;