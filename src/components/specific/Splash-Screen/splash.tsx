"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Splash() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login")
    }, 3000)
    
    return () => clearTimeout(timer) 
  }, [router])

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#6B39A7] gap-8">

      <Image src="/logo.svg" alt="Logo" width={160} height={48} priority />

      
      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
    </div>
  )
}