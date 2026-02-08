interface MaterialDonationDetailsProps {
  items: string;
}

export function MaterialDonationDetails({ items }: MaterialDonationDetailsProps) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-sm text-gray-600 mb-1">Itens doados</p>
      <p className="text-gray-900">
        {items}
      </p>
    </div>
  );
}
