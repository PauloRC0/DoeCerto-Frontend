interface OngMaterialDonationCardProps {
  items: { name: string; qty: string }[];
}

export function OngMaterialDonationCard({ items }: OngMaterialDonationCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 space-y-1">
      {items.map((item, idx) => (
        <div key={idx} className="flex justify-between">
          <span className="text-gray-600">{item.name}</span>
          <span className="font-bold">{item.qty}</span>
        </div>
      ))}
    </div>
  );
}