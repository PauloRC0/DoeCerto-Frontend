"use client";

import { Suspense } from "react";
import ResetPassword from "@/components/specific/Reset-Password/reset-password";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#6B39A7] text-white">
                <p>Carregando...</p>
            </div>
        }>
            <ResetPassword />
        </Suspense>
    );
}