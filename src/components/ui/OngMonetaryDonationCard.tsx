interface OngMonetaryDonationCardProps {
  value: string;
  date: string;
  status: "pending" | "confirmed";
}

export function OngMonetaryDonationCard({ value, date, status }: OngMonetaryDonationCardProps) {
  return (
    <>
      <p className="font-bold text-gray-900">Doação {value}</p>
      <p className="text-sm text-gray-400">{date}</p>

      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
        status === "confirmed"
          ? "bg-green-100 text-green-700"
          : "bg-amber-100 text-amber-700"
      }`}>
        {status === "confirmed" ? "Recebido" : "Pendente"}
      </span>
    </>
  );
}