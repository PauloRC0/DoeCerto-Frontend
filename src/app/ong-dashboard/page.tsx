"use client";


import OngDashboard from "@/components/specific/OngDashboard/ong-dashboard";
import { ongs } from "@/data/ongs"; 

export default function OngDashboardPage() {
    const myOng = ongs[0];

    if (!myOng) return <div>Carregando...</div>;

    return <OngDashboard ong={myOng} />;
}