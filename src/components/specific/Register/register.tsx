import Image from "next/image";
import Link from "next/link"; // Importe Link para ser consistente

export default function Register() {
    return (

        <div className="min-h-screen flex flex-col items-center justify-center bg-[#6B39A7] text-white font-sans px-6 py-12">
            
            <div className="w-full max-w-xs flex flex-col items-center"> 

                <div className="mb-4">
                    <Image
                        src="/logo.svg"
                        alt="DoeCerto"
                        width={120}
                        height={120}
                        priority
                    />
                </div>


                <h1 className="text-4xl -mt-2 font-bold mb-8 text-center">
                    Cadastre-se
                </h1>


                <form className="w-full flex flex-col gap-4"> 
                    
                    <div className="flex flex-col">
                        <label htmlFor="nome" className="text-base font-bold mb-1">Nome</label>
                        <input
                            id="nome"
                            type="text"

                            className="bg-white p-2 rounded-md text-black text-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>


                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-base font-bold mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="bg-white p-2 rounded-md text-black text-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>


                    <div className="flex flex-col">
                        <label htmlFor="senha" className="text-base font-bold mb-1">Senha</label>
                        <input
                            id="senha"
                            type="password"
                            className="bg-white p-2 rounded-md text-black text-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="confirmarSenha" className="text-base font-bold mb-1">Confirmar Senha</label>
                        <input
                            id="confirmarSenha"
                            type="password"
                            className="bg-white p-2 rounded-md text-black text-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
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