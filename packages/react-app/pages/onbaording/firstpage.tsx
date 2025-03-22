import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Onboarding1 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-6">
      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm h-64 mb-8 relative"
      >
        <div className="w-full h-full overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-blue-purple opacity-30 z-10 rounded-2xl"></div>
          <div className="absolute inset-0 image-mask">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1546522072-7073de9c44ad?q=80&w=1000')] bg-cover bg-center rounded-2xl"></div>
          </div>
        </div>

        {/* Floating blockchain elements */}
        <motion.div
          className="absolute top-16 left-12 w-10 h-10 bg-neon-blue/20 backdrop-blur-sm rounded-lg glass-card z-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-16 w-8 h-8 bg-neon-purple/20 backdrop-blur-sm rounded-lg glass-card z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center px-6 max-w-md"
      >
        <div className="inline-block glass-card px-3 py-1 rounded-full text-xs font-medium text-neon-blue mb-4">
          THE FUTURE OF TRANSPORTATION
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
          <span className="text-gradient">Revolutionizing</span> Urban Mobility
          with Blockchain
        </h1>

        <p className="text-gray-300 text-sm md:text-base mb-8">
          Secure transactions, instant payments, and decentralized trust for a
          seamless transportation experience.
        </p>
      </motion.div>

      {/* Scroll prompt */}
      <motion.div
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2"
        animate={{ opacity: [0.4, 1, 0.4], y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="text-white/60" size={24} />
      </motion.div>
    </div>
  );
};

export default Onboarding1;
