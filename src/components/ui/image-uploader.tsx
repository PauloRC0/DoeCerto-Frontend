"use client";

import React from "react";
import { Camera } from "lucide-react";

interface ImageUploaderProps {
  image: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  variant: "banner" | "logo";
  label?: string;
}

export function ImageUploader({ image, onImageChange, variant, label }: ImageUploaderProps) {
  if (variant === "banner") {
    return (
      <div className="relative w-full h-[340px] bg-gradient-to-tr from-purple-100 via-violet-50 to-pink-100 border-b border-purple-100">
        {image && (
          <img src={image} className="absolute inset-0 w-full h-full object-cover object-top" alt="Banner" />
        )}
        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-all group">
          <Camera className="text-purple-600/70 mb-2 group-hover:scale-110 transition-transform" size={32} />
          <span className="text-[#4a1d7a] font-black text-xs uppercase tracking-widest drop-shadow-sm px-4 text-center">
            {label || "Adicionar Foto de Capa"}
          </span>
          <input type="file" className="hidden" onChange={onImageChange} accept="image/*" />
        </label>
      </div>
    );
  }

  return (
    <div className="absolute -bottom-12 left-6 z-50 w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-tr from-purple-100 via-violet-50 to-pink-100 flex items-center justify-center">
      {image ? (
        <img src={image} className="w-full h-full object-cover" alt="Logo" />
      ) : (
        <div className="flex flex-col items-center text-purple-600/70">
          <Camera size={30} />
          <span className="text-[10px] font-bold uppercase mt-1">{label || "Logo"}</span>
        </div>
      )}
      <label className="absolute inset-0 flex items-center justify-center bg-purple-600/10 cursor-pointer opacity-0 hover:opacity-100 transition-opacity backdrop-blur-[2px]">
        <Camera className="text-purple-600" size={24} />
        <input type="file" className="hidden" onChange={onImageChange} accept="image/*" />
      </label>
    </div>
  );
}