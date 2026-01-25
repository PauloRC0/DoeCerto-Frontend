"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Heart, Award, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Ong } from "@/data/ongs";
import DonateModal from "@/components/specific/DonateModal";

type Props = {
  ong: Ong;
};

export default function OngPublicProfile({ ong }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-32">

      {/* Banner */}
      <div className="relative w-full h-[340px]">
        <motion.img
          src={ong.banner}
          alt={`${ong.name} banner`}
          className="absolute inset-0 w-full h-full object-cover object-top z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-gray-900 z-50"
        >
          ←
        </button>

        {/* BOTÃO EDITAR PERFIL */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
    absolute top-4 right-4 z-50

    md:top-6 md:right-8
    lg:top-8 lg:right-12

    flex items-center gap-2 
    bg-white border-2 border-[#4a1d7a] 

    px-4 py-2 text-sm
    md:px-6 md:py-3 md:text-base

    rounded-xl 
    font-bold text-[#4a1d7a]
    shadow-sm active:bg-purple-50 
    transition-colors
  "
        >
          <Pencil size={18} className="md:size-20" />
          Editar Perfil
        </motion.button>

        {/* Avatar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 140 }}
          className="
            absolute -bottom-12 left-6
            z-50
            w-36 h-36
            rounded-2xl overflow-hidden
            border-4 border-white shadow-2xl
          "
        >
          <img
            src={ong.logo}
            alt={`${ong.name} logo`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-6 mt-20">
        <h1 className="text-3xl font-extrabold text-gray-900">{ong.name}</h1>

        <p className="text-gray-600 text-base mt-2 flex gap-4 items-center">
          <span className="flex items-center gap-1">
            <MapPin size={15} /> {ong.distance}
          </span>
          <span className="flex items-center gap-1">
            <Award size={15} /> {ong.years} years
          </span>
        </p>

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-white shadow-md border border-gray-100"
          >
            <h2 className="text-base font-semibold text-[#4a1d7a]">Sobre</h2>
            <p className="mt-3 text-lg leading-relaxed text-gray-700">
              {ong.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white shadow-md border border-gray-100"
            >
              <h3 className="text-base font-semibold text-[#4a1d7a]">Missão</h3>
              <p className="mt-2 text-lg text-gray-700">
                {ong.mission || "—"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white shadow-md border border-gray-100 text-center"
            >
              <Users size={22} className="mx-auto text-[#4a1d7a]" />
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {ong.impactedPeople ?? "—"}
              </p>
              <p className="text-base text-gray-600">Pessoas Impactadas</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-white shadow-md border border-gray-100"
          >
            <h3 className="text-base font-semibold text-[#4a1d7a]">Estatísticas</h3>

            <div className="mt-4 flex gap-4">
              <div className="flex-1 p-3 rounded-lg bg-gray-50 text-center border border-gray-200">
                <Heart size={20} className="mx-auto text-pink-500" />
                <p className="mt-2 text-lg font-bold">{ong.donations}</p>
                <p className="text-base text-gray-600">Doações</p>
              </div>

              <div className="flex-1 p-3 rounded-lg bg-gray-50 text-center border border-gray-200">
                <p className="mt-2 text-lg font-bold">{ong.years}</p>
                <p className="text-base text-gray-600">Anos</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-4 left-0 right-0 px-6"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-xl"
        >
          Doar para esta ONG
        </button>
      </motion.div>

      {isModalOpen && (
        <DonateModal
          onClose={() => setIsModalOpen(false)}
          onDonateMoney={() => router.push(`/pix?id=${ong.id}`)}
          onDonateItems={() =>
            router.push(
              `/donation?ongId=${ong.id}&ong=${encodeURIComponent(ong.name)}`
            )
          }
        />
      )}
    </div>
  );
}
