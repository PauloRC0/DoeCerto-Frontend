"use client";

import { MapPin, Award } from "lucide-react";
import { motion } from "framer-motion"

export default function OngProfilePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 pb-32">

      {/* Banner */}
      <div className="relative w-full h-[340px]">
        <img 
        src={"#"} 
        alt="banner" 
        className="absolute w-full h-full object-cover object-top z-0 bg-[#6b21a8]">
        </img>

        <img src="#" alt="perfil" className="absolute -bottom-12 left-6 z-50 w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl" />
      </div>

      {/* Content */}
      <div className="px-6 mt-20">
        <h1 className="text-3xl font-extrabold text-gray-900">SOS Gatinhos</h1>
        <p className="text-gray-600 text-base mt-2 flex gap-4 items-center">
          <span className="flex items-center gap-1">
            <MapPin size={15}/>
          </span>
          <span className="flex items-center gap-1">
            <Award size={15}/>years
          </span>
        </p>

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 gap4">

          {/* About */}
          <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white shadow-md border border-gray-100">
            <h2 className="p-5 rounded-2xl bg-white shadow-md border border-gray-100"></h2>
          </motion.div>
        </div>
      </div>
      
    </div>
  );
}
