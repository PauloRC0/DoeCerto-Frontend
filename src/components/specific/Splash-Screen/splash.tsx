"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Splash() {
  
  const router = useRouter()
  
  useEffect(() => {
    setTimeout(() => {
      router.push("/login")
    }, 3000)
  }, [router])
  
  return (
    <div className="flex justify-center items-center h-screen bg-[#6B39A7]">
      <Image src="/logo.svg" alt="Logo" width={160} height={48} />
    </div>
  )
}