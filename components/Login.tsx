import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = usePrivy();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#836EF9] opacity-20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4ade80] opacity-10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-black/60 backdrop-blur-2xl border border-[#836EF9]/30 p-12 rounded-3xl shadow-[0_0_50px_rgba(131,110,249,0.2)] max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-[#836EF9] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(131,110,249,0.6)]">
           <Rocket className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-white font-['Rajdhani'] mb-2 tracking-wide">MONAD ODYSSEY</h1>
        <p className="text-gray-400 mb-8 font-light">Enter the portal to discover the ecosystem.</p>

        <button
          onClick={login}
          className="w-full py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition-all shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Connect Wallet
        </button>

        <p className="mt-6 text-xs text-gray-600 font-mono">
          Powered by Privy &bull; Secure Access
        </p>
      </motion.div>
    </div>
  );
};