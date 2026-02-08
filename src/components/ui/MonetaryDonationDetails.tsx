interface MonetaryDonationDetailsProps {
  amount: string;
}

export function MonetaryDonationDetails({ amount }: MonetaryDonationDetailsProps) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-sm text-gray-600">Valor doado</p>
      <p className="text-xl font-bold text-green-600">
        {amount}
      </p>
    </div>
  );
}
