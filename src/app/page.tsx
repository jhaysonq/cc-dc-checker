import CardChecker from "@/components/card-checker";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Credit/Debit Card Checker</h1>
      <CardChecker />
    </main>
  );
}
