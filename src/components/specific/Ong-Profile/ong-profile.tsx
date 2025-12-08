"use client";

import { MapPin, Award, Users, Heart, Building } from "lucide-react";
import { motion } from "framer-motion"
import { useState } from "react";

export default function OngProfilePage() {

  {/* Imagem Perfil de ONG */}
  const [ongProfileImage, setOngProfileImage] = useState<File | null>(null);
const [ongProfileImageURL, setOngProfileImageURL] = useState<string | null>(null);

function handleOngProfileImageChange(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  setOngProfileImage(file);

  const previewURL = URL.createObjectURL(file);
  setOngProfileImageURL(previewURL);
}
  {/* Fim Imagem Perfil de ONG */}


  const [descricao, setDescricao] = useState("");
  const [textoSalvo, setTextoSalvo] = useState("");
  const [editando, setEditando] = useState(false);

  const [missao, setMissao] = useState("");
  const [missaoSalva, setMissaoSalva] = useState("");
  const [editandoMissao, setEditandoMissao] = useState(false);

  {/* Modal */}
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-10">

      {/* Banner */}
      <div className="relative w-full h-[340px]">
        <img 
        src={"#"} 
        alt="banner" 
        className="absolute w-full h-full object-cover object-top z-0 bg-[#6b21a8]">
        </img>

       <input 
        type="file" 
        accept="image/*" 
        className="absolute -bottom-12 left-6 z-50 w-36 h-36 rounded-2xl overflow-hidden border-4 border-white"
        onChange={handleOngProfileImageChange}
      />

      {ongProfileImageURL && (
        <img src={ongProfileImageURL} 
        alt="perfil" 
        className="absolute -bottom-12 left-6 z-50 w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl" />
        )}
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
              autoFocus
              className="mt-3 w-full border border-gray-200 rounded-lg p2"
              placeholder="Descreva sua ONG aqui..."
              />
            ):(
              <p className={'mt-3 text-lg leading-relaxed ${textoSalvo === "" ? "text-gray-400 italic" : "text-gray-700"}'}
              onClick={() => {
                setDescricao(textoSalvo);
                setEditando(true);
              }}
              >
                {textoSalvo === "" ? "Descreva sua ONG aqui..." : textoSalvo}
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
              autoFocus
              className="mt-2 w-full border border-gray-200 rounded-lg p2"
              placeholder="Descreva o objetivo da ONG..."
              />
            ):(
              <p className={'mt-3 text-lg ${missaoSalva === "" ? "text-gray-400 italic" : "text-gray-700"}'} 
              onClick={() => {
                setMissao(missaoSalva);
                setEditandoMissao(true);
              }}
              >
                {missaoSalva === "" ? "Descreva o objetivo da ONG..." : missaoSalva}
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
              <button onClick={() => setModalAberto(true)} className="flex-1 p-3 rounded-lg bg-gray-50 text-center border border-gray-200">
                <Heart size={20} className="mx-auto text-pink-500"/>
                <p className="mt-2 text-lg font-bold">0</p>
                <p className="text-base text-gray-600">Doações</p>
              </button>

              <div className="flex-1 p-3 rounded-lg bg-gray-50 text-center border border-gray-200">
                <Building size={20} className="mx-auto mt-4"/>
                <p className="text-base text-gray-600">Informações da Instituição</p>
              </div>

              <div className="flex-1 p-3 rounded-lg bg-gray-50 text-center border border-gray-200">
                <p className="mt-2 text-lg font-bold">7</p>
                <p className="text-base text-gray-600">Anos</p>
              </div>
            </div>
          </motion.div>
        </div>

         {modalAberto && (
                <div className="fixed inset-0 flex bg-white z-[9999]">

                  <div className="px-6 py-5 w-full ">

                    <div className="relative flex flex-row justify-center">
                      <button className="absolute left-0 flex border border-gray-200 rounded-[100] p-2" onClick={() => setModalAberto(false)}>
                        <p>X</p>
                      </button>
                    <h1 className="flex text-3xl font-extrabold text-[#6b21a8]">Histórico</h1>
                    </div>

                    <div className="flex flex-row w-full mb-4 mt-6">
                      <motion.div 
                      initial={{ opacity: 0, y: 12}}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-l-2xl bg-white shadow-md border border-gray-100 text-center w-[50%]">
                        <h1 className="text-3xl font-extrabold text-gray-900">21</h1>
                        <p>Doadores</p>
                      </motion.div>

                      <motion.div 
                      initial={{ opacity: 0, y: 12}}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-r-2xl bg-white shadow-md border border-gray-100 text-center w-[50%]">
                        <h1 className="text-3xl font-extrabold text-gray-900">1.000</h1>
                      <p>Doações</p>
                      </motion.div>
                    </div>

                    {/* Doadores */}
                    <div className="flex flex-col w-full">
                        <div className="relative flex flex-row rounded-10 bg-[#FDFDFD] w-full border border-gray-200">
                          <img src="#" 
                          alt="" 
                          className="mt-2 mb-2 ml-5 border border-gray-100 w-10 h-10 rounded-[50%]" />
                          <div className="flex flex-col ml-4">
                            <h2 className="font-extrabold mt-1 text-[#6b21a8]">Dinheiro</h2>
                            <p>Antônio Luiz</p>
                          </div>
                          <div className="absolute flex flex-col right-5 font-extrabold text-gray-900 items-center">
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                          </div>

                        </div>
                      </div>
                      {/* Fim Doadores */}
                      {/* Doadores */}
                    <div className="flex flex-col w-full">
                        <div className="relative flex flex-row rounded-10 bg-[#FDFDFD] w-full border border-gray-200">
                          <img src="#" 
                          alt="" 
                          className="mt-2 mb-2 ml-5 border border-gray-100 w-10 h-10 rounded-[50%]" />
                          <div className="flex flex-col ml-4">
                            <h2 className="font-extrabold text-[#6b21a8] mt-1">Ração</h2>
                            <p>Antônio Luiz</p>
                          </div>
                          <div className="absolute flex flex-col right-5 font-extrabold text-gray-900 items-center">
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                          </div>

                        </div>
                      </div>
                      {/* Fim Doadores */}
                      {/* Doadores */}
                    <div className="flex flex-col w-full">
                        <div className="relative flex flex-row rounded-10 bg-[#FDFDFD] w-full border border-gray-200">
                          <img src="#" 
                          alt="" 
                          className="mt-2 mb-2 ml-5 border border-gray-100 w-10 h-10 rounded-[50%]" />
                          <div className="flex flex-col ml-4">
                            <h2 className="font-extrabold text-[#6b21a8] mt-1">Dinheiro</h2>
                            <p>Antônio Luiz</p>
                          </div>
                          <div className="absolute flex flex-col right-5 font-extrabold text-gray-900 items-center">
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                          </div>

                        </div>
                      </div>
                      {/* Fim Doadores */}
                      {/* Doadores */}
                    <div className="flex flex-col w-full">
                        <div className="relative flex flex-row rounded-10 bg-[#FDFDFD] w-full border border-gray-200">
                          <img src="#" 
                          alt="" 
                          className="mt-2 mb-2 ml-5 border border-gray-100 w-10 h-10 rounded-[50%]" />
                          <div className="flex flex-col ml-4">
                            <h2 className="font-extrabold text-[#6b21a8] mt-1">Coleira</h2>
                            <p>Antônio Luiz</p>
                          </div>
                          <div className="absolute flex flex-col right-5 font-extrabold text-gray-900 items-center">
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                          </div>

                        </div>
                      </div>
                      {/* Fim Doadores */}
                      {/* Doadores */}
                    <div className="flex flex-col w-full">
                        <div className="relative flex flex-row rounded-10 bg-[#FDFDFD] w-full border border-gray-200">
                          <img src="#" 
                          alt="" 
                          className="mt-2 mb-2 ml-5 border border-gray-100 w-10 h-10 rounded-[50%]" />
                          <div className="flex flex-col ml-4">
                            <h2 className="font-extrabold text-[#6b21a8] mt-1">Dinheiro</h2>
                            <p>Antônio Luiz</p>
                          </div>
                          <div className="absolute flex flex-col right-5 font-extrabold text-gray-900 items-center">
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                          </div>

                        </div>
                      </div>
                      {/* Fim Doadores */}
                      {/* Doadores */}
                    <div className="flex flex-col w-full">
                        <div className="relative flex flex-row rounded-10 bg-[#FDFDFD] w-full border border-gray-200">
                          <img src="#" 
                          alt="" 
                          className="mt-2 mb-2 ml-5 border border-gray-100 w-10 h-10 rounded-[50%]" />
                          <div className="flex flex-col ml-4">
                            <h2 className="font-extrabold text-[#6b21a8] mt-1">Dinheiro</h2>
                            <p>Antônio Luiz</p>
                          </div>
                          <div className="absolute flex flex-col right-5 font-extrabold text-gray-900 items-center">
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                          </div>

                        </div>
                      </div>
                      {/* Fim Doadores */}
                      {/* Doadores */}
                    <div className="flex flex-col w-full">
                        <div className="relative flex flex-row rounded-10 bg-[#FDFDFD] w-full border border-gray-200">
                          <img src="#" 
                          alt="" 
                          className="mt-2 mb-2 ml-5 border border-gray-100 w-10 h-10 rounded-[50%]" />
                          <div className="flex flex-col ml-4">
                            <h2 className="font-extrabold text-[#6b21a8] mt-1">Dinheiro</h2>
                            <p>Antônio Luiz</p>
                          </div>
                          <div className="absolute flex flex-col right-5 font-extrabold text-gray-900 items-center">
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                            <span className="h-2">.</span>
                          </div>

                        </div>
                      </div>
                      {/* Fim Doadores */}
                  </div>

                </div>
              )}

      </div>
      
    </div>
  );
}
