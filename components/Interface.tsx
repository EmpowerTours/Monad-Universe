import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterType, Project } from '../types';
import { Search, Compass, Info, LogOut, Zap, ExternalLink, Rocket, X } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';

interface InterfaceProps {
  onFilterChange: (filter: FilterType) => void;
  onSearch: (term: string) => void;
  selectedProject: Project | null;
  onCloseModal: () => void;
  userAddress?: string;
}

const categories: FilterType[] = ['All', 'DeFi', 'NFT', 'Gaming', 'Infrastructure', 'Wallet', 'Social'];

export const Interface: React.FC<InterfaceProps> = ({ onFilterChange, onSearch, selectedProject, onCloseModal, userAddress }) => {
  const [activeCategory, setActiveCategory] = useState<FilterType>('All');
  const { logout } = usePrivy();

  const handleCategoryClick = (cat: FilterType) => {
    setActiveCategory(cat);
    onFilterChange(cat);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col">
      {/* Header / Top Bar */}
      <header className="flex justify-between items-center p-6 pointer-events-auto bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center space-x-3">
           <div className="w-10 h-10 bg-[#836EF9] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(131,110,249,0.5)]">
              <Rocket className="text-white w-6 h-6" />
           </div>
           <div>
             <h1 className="text-2xl font-bold tracking-widest text-white font-['Rajdhani'] uppercase">Monad Odyssey</h1>
             <p className="text-xs text-[#836EF9] tracking-widest">ECOSYSTEM DISCOVERY</p>
           </div>
        </div>

        <div className="flex items-center space-x-4">
           <div className="bg-gray-900/80 backdrop-blur-md border border-[#836EF9]/30 px-4 py-2 rounded-lg text-sm text-gray-300 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {userAddress ? `${userAddress.slice(0,6)}...${userAddress.slice(-4)}` : 'Connected'}
           </div>
           <button onClick={logout} className="p-2 hover:bg-red-500/20 rounded-full transition-colors border border-transparent hover:border-red-500/50 group">
              <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
           </button>
        </div>
      </header>

      {/* Main Search & Filter Bar */}
      <div className="flex-1 flex flex-col items-center mt-4 pointer-events-none">
         <div className="pointer-events-auto w-full max-w-2xl px-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search the Monadverse..." 
                className="w-full bg-black/50 backdrop-blur-xl border border-[#836EF9]/50 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#836EF9] focus:border-transparent transition-all shadow-[0_0_20px_rgba(131,110,249,0.2)]"
                onChange={(e) => onSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 text-[#836EF9] w-5 h-5" />
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold font-['Rajdhani'] tracking-wide transition-all border ${
                    activeCategory === cat 
                    ? 'bg-[#836EF9] text-white border-[#836EF9] shadow-[0_0_15px_rgba(131,110,249,0.6)]' 
                    : 'bg-black/40 text-gray-400 border-gray-700 hover:border-[#836EF9]/50 hover:text-white'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
         </div>
      </div>

      {/* Smart Recommendation & Stats Footer */}
      <div className="p-6 flex justify-between items-end pointer-events-none">
         <div className="pointer-events-auto bg-black/60 backdrop-blur-lg border border-[#836EF9]/30 rounded-2xl p-4 max-w-xs">
            <div className="flex items-center gap-2 mb-2 text-[#836EF9]">
               <Zap className="w-4 h-4" />
               <span className="text-xs font-bold uppercase tracking-wider">Smart Suggestion</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Based on trending activity, <strong>EmpowerTours</strong> is gaining traction in the Social sector.
            </p>
         </div>

         <div className="text-right pointer-events-auto">
            <p className="text-xs text-gray-500 font-mono">V 1.0.0 // MAINNET READY</p>
            <a href="https://github.com/portdeveloper/monad-ecosystem" target="_blank" rel="noopener noreferrer" className="text-xs text-[#836EF9] hover:underline flex justify-end items-center gap-1">
               Open Source <ExternalLink className="w-3 h-3"/>
            </a>
         </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-black/90 backdrop-blur-xl border-l border-[#836EF9]/30 p-8 z-50 pointer-events-auto flex flex-col shadow-2xl"
          >
            <button 
              onClick={onCloseModal}
              className="self-end p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors mb-8"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex-1">
              <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4 inline-block ${
                 selectedProject.category === 'DeFi' ? 'bg-green-900 text-green-300' :
                 selectedProject.category === 'NFT' ? 'bg-pink-900 text-pink-300' :
                 'bg-indigo-900 text-indigo-300'
              }`}>
                {selectedProject.category || 'Project'}
              </span>
              
              <h2 className="text-4xl font-bold text-white font-['Rajdhani'] mb-4">{selectedProject.name}</h2>
              
              <p className="text-gray-400 leading-relaxed mb-8">
                {selectedProject.description || "Explore this innovative project on the Monad blockchain. Connect your wallet to interact with the protocol directly."}
              </p>

              <div className="space-y-4">
                <a 
                  href={selectedProject.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-[#836EF9] hover:bg-[#6d56e8] text-white text-center font-bold tracking-widest uppercase rounded-lg transition-all shadow-[0_0_20px_rgba(131,110,249,0.4)] hover:shadow-[0_0_30px_rgba(131,110,249,0.6)] flex items-center justify-center gap-2"
                >
                  Launch App <ExternalLink className="w-4 h-4" />
                </a>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                   <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <span className="block text-xs text-gray-500 uppercase mb-1">Status</span>
                      <span className="block text-sm font-mono text-green-400">Active</span>
                   </div>
                   <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <span className="block text-xs text-gray-500 uppercase mb-1">Chain</span>
                      <span className="block text-sm font-mono text-[#836EF9]">Monad</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};