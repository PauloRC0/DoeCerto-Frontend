"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface CustomSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function CustomSelect({ label, value, options, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2 relative">
      <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">
        {label}
      </label>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between text-gray-700 font-bold hover:border-purple-200 transition-all shadow-sm"
      >
        {value}
        <ChevronDown size={18} className={`text-purple-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-[110] top-[85px] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden"
            >
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className="w-full p-4 text-left hover:bg-purple-50 flex items-center justify-between group transition-colors"
                >
                  <span className={`font-bold ${value === option ? 'text-purple-600' : 'text-gray-600'}`}>
                    {option}
                  </span>
                  {value === option && <Check size={16} className="text-purple-600" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}