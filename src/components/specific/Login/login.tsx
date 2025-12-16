"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const savedUser = localStorage.getItem("fakeUser");

    if (!savedUser) {
      toast.error("Nenhum usuário cadastrado");
      return;
    }

    const { email: savedEmail, senha: savedSenha } = JSON.parse(savedUser);

    if (email === savedEmail && password === savedSenha) {
      toast.success("Login realizado com sucesso!");

      localStorage.setItem("isAuthenticated", "true");

      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } else {
      toast.error("Email ou senha inválidos");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-700 text-white px-6">

      <Toaster position="top-center" />

      <div className="w-full max-w-xs flex flex-col items-center">
        <div className="mb-4">
          <Image src="/logo.svg" alt="DoeCerto" width={120} height={120} priority />
        </div>

        <h1 className="text-4xl -mt-2 font-bold mb-10 text-center">
          Faça seu login!
        </h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-bold mb-0">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white p-2 rounded-md text-black text-xl placeholder:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div className="flex flex-col mt-1">
            <label htmlFor="password" className="text-lg font-bold mb-0">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white p-2 rounded-md text-black text-xl placeholder:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <p className="text-base font-bold text-right -mt-4 mb-4">
            Ainda não possui conta?{" "}
            <Link href="/register-choice" className="text-[#E0C4FF] font-bold">
              Cadastre-se
            </Link>
          </p>

          <button
            type="submit"
            className="w-3/4 mx-auto mt-4 text-center text-2xl bg-white text-[#6B39A7] font-bold py-2 rounded-md active:scale-95 transition-transform"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
