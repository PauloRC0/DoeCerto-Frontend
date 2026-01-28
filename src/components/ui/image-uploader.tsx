"use client";

import React from "react";
import { Camera } from "lucide-react";

interface ImageUploaderProps {
  image: string;
  onImageChange: (file: File) => void; 
  variant: "banner" | "logo";
  label?: string;
}

export function ImageUploader({ image, onImageChange, variant, label }: ImageUploaderProps) {
  const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  if (variant === "banner") {
    return (
      <div className="relative w-full h-[200px] sm:h-[340px] bg-gradient-to-tr from-purple-100 via-violet-50 to-pink-100 border-b border-purple-100 overflow-hidden">
        {image && (
          <img src={image} className="absolute inset-0 w-full h-full object-cover object-center" alt="Banner" />
        )}
        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-all group z-10">
          <div className="bg-white/80 p-2 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
            <Camera className="text-purple-600" size={24} />
          </div>
          <span className="text-[#4a1d7a] font-black text-[10px] sm:text-xs uppercase tracking-widest drop-shadow-sm px-4 text-center bg-white/40 backdrop-blur-sm rounded py-1">
            {label || "Adicionar Foto de Capa"}
          </span>
          <input type="file" className="hidden" onChange={handleInternalChange} accept="image/*" />
        </label>
      </div>
    );
  }

  // Variante LOGO: Removi o absolute daqui para não bugar no mobile
  return (
    <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-tr from-purple-100 via-violet-50 to-pink-100 flex items-center justify-center">
      {image ? (
        <img src={image} className="w-full h-full object-cover" alt="Logo" />
      ) : (
        <div className="flex flex-col items-center text-purple-600/70">
          <Camera size={28} />
          <span className="text-[10px] font-bold uppercase mt-1">{label || "Logo"}</span>
        </div>
      )}
      <label className="absolute inset-0 flex items-center justify-center bg-purple-600/10 cursor-pointer opacity-0 hover:opacity-100 transition-opacity backdrop-blur-[2px]">
        <Camera className="text-purple-600" size={24} />
        <input type="file" className="hidden" onChange={handleInternalChange} accept="image/*" />
      </label>
    </div>
  );
}