"use client";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full pt-[44px] px-[25px]">
      
      {/* DIV 1 */}
      <div className="w-full mb-[40px] flex items-center justify-between">
        <Image
          src="/logo_roxa.svg"
          alt="DoeCerto"
            width={120}
            height={120}
            priority
        />

        {/* Menu hambúrguer */}
        <div className="flex flex-col gap-1 cursor-pointer">
          <span className="block w-6 h-[3px] bg-black rounded"></span>
          <span className="block w-6 h-[3px] bg-black rounded"></span>
          <span className="block w-6 h-[3px] bg-black rounded"></span>
        </div>
      </div>

      {/* DIV 2 */}
      <div className="w-full mb-[40px]">
        <input
          type="text"
          placeholder="Digite algo..."
          className="w-full h-[33px] bg-[#F5F5F5] border border-[#999] rounded-[10px] px-3 outline-none"
        />
      </div>
    </div>
  );
}
