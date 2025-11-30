"use client";

import { MapPin, Award, Users, Heart } from "lucide-react";
import { motion } from "framer-motion"
import { useState } from "react";

export default function OngProfilePage() {

  const [descricao, setDescricao] = useState("");
  const [textoSalvo, setTextoSalvo] = useState("");
  const [editando, setEditando] = useState(false);

  const [missao, setMissao] = useState("");
  const [missaoSalva, setMissaoSalva] = useState("");
  const [editandoMissao, setEditandoMissao] = useState(false);

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
          className="p-5 rounded-2xl bg-white shadow-md border border-gray-100 mb-4">
            <h2 className="text-base font-semibold text-[#4a1d7a]">Sobre</h2>
            {editando ? (
              <input value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setTextoSalvo(descricao);
                  setEditando(false);
                }
              }}
              className="mt-3 w-full border rounded-lg p2"
              />
            ):(
              <p className="mt-3 text-lg leading-relaxed text-gray-700 h-5" onClick={() => {
                setDescricao(textoSalvo);
                setEditando(true);
              }}
              >
                {textoSalvo}
              </p>
            )}
          </motion.div>

          {/* Mission + Impact */}
          <div className="grid grid-cols-2 gap-4">

            {/* Mission */}
            <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-white shadow-md border border-gray-100">
              <h3 className="text-base font-semibold text-[#4a1d7a]">Missão</h3>
              {editandoMissao ? (
              <input value={missao}
              onChange={(e) => setMissao(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setMissaoSalva(missao);
                  setEditandoMissao(false);
                }
              }}
              className="mt-2 w-full border rounded-lg p2"
              />
            ):(
              <p className="mt-2 text-lg text-gray-700 h-5" onClick={() => {
                setMissao(missaoSalva);
                setEditandoMissao(true);
              }}
              >
                {missaoSalva}
              </p>
            )}
            </motion.div>

            {/* Impact */}
            <motion.div 
            initial={{ opacity: 0, y: 12}}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-white shadow-md border border-gray-100 text-center">
              <Users size={22} className="mx-auto text-[#4a1d7a]"/>
              <p className="mt-2 text-2xl font-bold text-gray-900">0</p>
              <p className="text-base text-gray-600">
                Pessoas Impactadas
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white shadow-md border border-gray-100 mt-4">
            <h3 className="text-base font-semibold text-[#4a1d7a] mb-4">Estatísticas</h3>
            <div className="mt-4 flex gap-4">
              <div className="flex-1 p-3 rounded-lg bg-gray-50 text-center border border-gray-200">
                <Heart size={20} className="mx-auto text-pink-500"/>
                <p className="mt-2 text-lg font-bold">0</p>
                <p className="text-base text-gray-600">Doações</p>
              </div>

              <div className="flex-1 p-3 rounded-lg bg-gray-50 text-center border border-gray-200">
                <p className="mt-2 text-lg font-bold">7</p>
                <p className="text-base text-gray-600">Anos</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
    </div>
  );
}
