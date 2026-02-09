"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";

interface ImageUploaderProps {
  image: string;
  onImageChange: (file: File) => void;
  variant: "banner" | "logo";
  label?: string;
}

export function ImageUploader({ image, onImageChange, variant, label }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageChange(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (variant === "banner") {
    return (
      <div className="relative w-full h-[220px] sm:h-[360px] bg-gray-100 border-b border-purple-100 overflow-hidden">
        {(preview || image) ? (
          <img
            src={preview || image}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
            alt="Banner Preview"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 via-violet-50 to-pink-100" />
        )}

        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-all group z-20">
          <div className="bg-white/90 p-3 rounded-full shadow-lg mb-2 group-hover:scale-110 transition-transform">
            <Camera className="text-purple-600" size={24} />
          </div>
          <span className="text-[#4a1d7a] font-black text-[10px] sm:text-xs uppercase tracking-widest bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/40">
            {(preview || image) ? "Alterar Capa" : (label || "Adicionar Capa")}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleInternalChange}
            accept="image/*"
          />
        </label>
      </div>
    );
  }

  return (
    <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-tr from-purple-100 via-violet-50 to-pink-100 flex items-center justify-center">
      {(preview || image) ? (
        <img src={preview || image} className="w-full h-full object-cover" alt="Logo" />
      ) : (
        <div className="flex flex-col items-center text-purple-600/70">
          <Camera size={28} />
          <span className="text-[10px] font-bold uppercase mt-1">{label || "Logo"}</span>
        </div>
      )}
      <label className="absolute inset-0 flex items-center justify-center bg-purple-600/10 cursor-pointer opacity-0 hover:opacity-100 transition-opacity backdrop-blur-[2px]">
        <Camera className="text-purple-600" size={24} />
        <input
          type="file"
          className="hidden"
          onChange={handleInternalChange}
          accept="image/*"
        />
      </label>
    </div>
  );
}