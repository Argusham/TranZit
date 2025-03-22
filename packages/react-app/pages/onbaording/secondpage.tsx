import { motion } from "framer-motion";
import { Clock, Lock, AlertTriangle } from "lucide-react";

const ProblemCard = ({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="glass-card p-4 rounded-xl mb-4"
  >
    <div className="flex items-start">
      <div className="mr-4 p-2 bg-white/5 rounded-lg">{icon}</div>
      <div>
        <h3 className="font-medium text-white mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  </motion.div>
);

const Onboarding2 = () => {
  return (
    <div className="flex flex-col items-center min-h-[80vh] py-6">
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 px-4"
      >
        <div className="inline-block glass-card px-3 py-1 rounded-full text-xs font-medium text-neon-pink mb-4">
          CURRENT CHALLENGES
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          The Problem with{" "}
          <span className="text-gradient">Traditional Transport</span>
        </h2>
        <p className="text-gray-300 text-sm md:text-base max-w-md mx-auto">
          transportation systems face critical issues that impact both drivers
          and commuters
        </p>
      </motion.div>

      {/* Split screen design for problems */}
      <div className="w-full max-w-md px-4">
        {/* Left side (dark) */}
        <div className="bg-app-darker/80 rounded-t-xl p-4">
          <ProblemCard
            icon={<Clock className="text-neon-blue" size={20} />}
            title="Delayed Payments"
            description="Drivers often wait days or weeks to receive payment for their services"
            delay={0.2}
          />
        </div>

        {/* Right side (lighter) */}
        <div className="bg-black/30 rounded-b-xl p-4">
          <ProblemCard
            icon={<Lock className="text-neon-purple" size={20} />}
            title="Trust Issues"
            description="Lack of trust between passengers and drivers creates friction"
            delay={0.4}
          />

          <ProblemCard
            icon={<AlertTriangle className="text-neon-pink" size={20} />}
            title="Lack of Transparency"
            description="Hidden fees and opaque pricing models frustrate users"
            delay={0.6}
          />
        </div>
      </div>

      {/* Visual illustration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative w-full max-w-md h-40 mt-8"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="220"
            height="120"
            viewBox="0 0 220 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10,60 C10,30 50,10 110,10 C170,10 210,30 210,60 C210,90 170,110 110,110 C50,110 10,90 10,60 Z"
              stroke="url(#paint0_linear)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle cx="110" cy="10" r="4" fill="#4FACFE" />
            <circle cx="110" cy="110" r="4" fill="#7E57C2" />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="10"
                y1="60"
                x2="210"
                y2="60"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4FACFE" />
                <stop offset="1" stopColor="#7E57C2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Animated dots */}
          <motion.div
            className="absolute left-[80px] top-[60px] w-2 h-2 rounded-full bg-white"
            animate={{
              x: [0, 40, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[80px] top-[60px] w-2 h-2 rounded-full bg-white"
            animate={{
              x: [0, -40, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding2;
