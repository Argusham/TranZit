import { motion } from 'framer-motion';
import { Zap, Shield, Repeat, ChevronRight } from 'lucide-react';

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0 
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
      <div className="mr-4 p-2 bg-white/5 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-white mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  </motion.div>
);

const Onboarding3 = () => {


  return (

      <div className="flex flex-col items-center min-h-[80vh] py-6">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 px-4"
        >
          <div className="inline-block glass-card px-3 py-1 rounded-full text-xs font-medium text-neon-blue mb-4">
            BLOCKCHAIN INNOVATION
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            The <span className="text-gradient">Future</span> of Transportation is Here
          </h2>
          <p className="text-gray-300 text-sm md:text-base max-w-md mx-auto">
            Smart contracts and blockchain technology revolutionize how you travel
          </p>
        </motion.div>

        {/* Solution Features */}
        <div className="w-full max-w-md px-4">
          <FeatureCard
            icon={<Zap className="text-neon-blue" size={20} />}
            title="Instant Payments"
            description="Receive and send payments immediately with secure blockchain transactions"
            delay={0.2}
          />
          
          <FeatureCard
            icon={<Shield className="text-neon-purple" size={20} />}
            title="Secure Smart Contracts"
            description="Automated agreements ensure both parties fulfill obligations"
            delay={0.4}
          />
          
          <FeatureCard
            icon={<Repeat className="text-neon-pink" size={20} />}
            title="Decentralized Reputation"
            description="Build trust based on transparent, immutable review history"
            delay={0.6}
          />
        </div>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-full max-w-md px-4 mt-8"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
          
            className="w-full bg-gradient-blue-purple p-4 rounded-xl font-medium text-white mb-4 flex items-center justify-center"
          >
            Get Started
            <ChevronRight size={18} className="ml-2" />
          </motion.button>
          
          <p className="text-gray-400 text-xs text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
        
        {/* Floating blockchain elements */}
        <motion.div 
          className="w-full max-w-md h-40 relative mt-4"
        >
          <motion.div
            className="absolute top-10 left-12 w-10 h-10 bg-neon-blue/20 backdrop-blur-sm rounded-lg glass-card"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[80px] right-24 w-14 h-14 bg-neon-purple/20 backdrop-blur-sm rounded-lg glass-card rotate-12"
            animate={{ y: [0, 10, 0], rotate: [12, 17, 12] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute top-20 right-16 w-8 h-8 bg-neon-pink/20 backdrop-blur-sm rounded-lg glass-card -rotate-12"
            animate={{ y: [0, -8, 0], rotate: [-12, -5, -12] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>
      </div>

  );
};

export default Onboarding3;