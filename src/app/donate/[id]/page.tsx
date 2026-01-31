import DonateContent from "./donate-content";

export function generateStaticParams() {
  return Array.from({ length: 50 }, (_, i) => ({ id: String(i + 1) }));
}

export default function DonatePage({ params }: { params: Promise<{ id: string }> }) {
  return <DonateContent params={params} />;
}
