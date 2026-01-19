"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { registerDonor } from "@/services/register.service";

export default function Register() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !cpf || !email || !senha || !confirmarSenha) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      await registerDonor({
        name: nome,
        email,
        password: senha,
        cpf,
      });

      toast.success("Cadastro realizado com sucesso!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      toast.error("Erro ao realizar cadastro");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-700 text-white font-sans px-6 py-12">

      <Toaster position="top-center" />

      <div className="w-full max-w-xs flex flex-col items-center">

        <div className="mb-4">
          <Image src="/logo.svg" alt="DoeCerto" width={120} height={120} priority />
        </div>

        <h1 className="text-4xl -mt-2 font-bold mb-8 text-center">
          Cadastre-se
        </h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

          <div className="flex flex-col">
            <label htmlFor="nome" className="text-base font-bold mb-1">Nome</label>
            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-white p-2 rounded-md text-black text-xl placeholder:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="cpf" className="text-base font-bold mb-1">CPF</label>
            <input
              id="cpf"
              type="text"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="bg-white p-2 rounded-md text-black text-xl placeholder:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-base font-bold mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white p-2 rounded-md text-black text-xl placeholder:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="senha" className="text-base font-bold mb-1">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="bg-white p-2 rounded-md text-black text-xl placeholder:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmarSenha" className="text-base font-bold mb-1">Confirmar Senha</label>
            <input
              id="confirmarSenha"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="bg-white p-2 rounded-md text-black text-xl placeholder:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <p className="text-base text-right font-bold -mt-4 mb-4">
            Já possui conta?{" "}
            <Link href="/login" className="font-bold text-[#E0C4FF]">
              Fazer Login
            </Link>
          </p>

          <button
            type="submit"
            className="w-3/4 mx-auto text-center text-xl bg-white text-purple-700 font-bold py-2 rounded-md active:scale-95 transition-transform"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
