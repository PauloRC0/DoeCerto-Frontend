"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera, Maximize2, X, Check } from "lucide-react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

interface ImageUploaderProps {
  image: string;
  onImageChange: (file: File) => void;
  variant: "banner" | "logo";
  label?: string;
}

export function ImageUploader({ image, onImageChange, variant, label }: ImageUploaderProps) {
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [objectPos, setObjectPos] = useState({ x: 50, y: 50 });

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageChange(file);
      if (variant === "banner") {
        dragX.set(0);
        dragY.set(0);
        setObjectPos({ x: 50, y: 50 });
        setEditing(true);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const finalizeEditing = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    // Divisores ajustados para manter a proporção do arraste com a % da imagem
    const divisorX = isMobile ? 8 : 12;
    const divisorY = isMobile ? 4 : 6;

    const moveX = 50 - (dragX.get() / divisorX);
    const moveY = 50 - (dragY.get() / divisorY);

    setObjectPos({
      x: Math.max(0, Math.min(100, moveX)),
      y: Math.max(0, Math.min(100, moveY))
    });
    setEditing(false);
  };

  if (variant === "banner") {
    return (
      <>
        {/* SEU LAYOUT ORIGINAL DE BANNER - SEM ALTERAÇÕES */}
        <div className="relative w-full h-[220px] sm:h-[360px] bg-gray-100 border-b border-purple-100 overflow-hidden">
          {(preview || image) ? (
            <>
              <img
                src={preview || image}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
                style={{ objectPosition: `${objectPos.x}% ${objectPos.y}%` }}
              />
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-lg hover:bg-white transition-all text-purple-600 border border-white/50"
              >
                <Maximize2 size={20} />
              </button>
            </>
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
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleInternalChange} accept="image/*" />
          </label>
        </div>

        {/* MODAL COM AJUSTE DE PRECISÃO MOBILE/PC */}
        <AnimatePresence>
          {editing && (preview || image) && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[999] flex flex-col items-center justify-center p-4 backdrop-blur-md"
            >
              <div className="w-full max-w-5xl flex flex-col gap-6">
                <div className="text-center">
                  <h2 className="text-white text-xl font-black uppercase tracking-widest mb-1">Ajustar Enquadramento</h2>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Arraste a imagem para focar na área clara</p>
                </div>

                {/* Aspect Ratio adaptável para Mobile (video) e PC (3/1) para precisão real */}
                <div className="relative w-full aspect-video sm:aspect-[3/1] bg-[#111] overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <motion.img
                    src={preview || image}
                    drag
                    dragConstraints={{ left: -1000, right: 1000, top: -600, bottom: 600 }}
                    style={{ x: dragX, y: dragY, scale: 1.5 }}
                    className="absolute inset-0 w-full h-full object-contain cursor-grab active:cursor-grabbing touch-none"
                  />
                  {/* Máscara adaptável para Mobile e PC */}
                  <div className="absolute inset-0 pointer-events-none border-[30px] sm:border-[80px] border-black/70 flex items-center justify-center">
                    <div className="w-full h-full border border-white/20 rounded-sm" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => setEditing(false)} className="px-6 py-4 text-white/40 hover:text-white font-black text-[10px] uppercase tracking-widest">
                    Cancelar
                  </button>
                  <button onClick={finalizeEditing} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all">
                    CONFIRMAR AJUSTE
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
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
        <input type="file" className="hidden" onChange={handleInternalChange} accept="image/*" />
      </label>
    </div>
  );
}