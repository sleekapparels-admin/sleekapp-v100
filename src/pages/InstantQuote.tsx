import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InstantQuoteCalculator } from "@/components/InstantQuoteCalculator";
import { Helmet } from "react-helmet";

export default function InstantQuote() {
  return (
    <>
      <Helmet>
        <title>Instant Quote Calculator - Get Pricing in 30 Seconds | Sleek Apparels</title>
        <meta name="description" content="Get an instant preliminary quote for your apparel manufacturing order. AI-powered pricing estimates in 30 seconds. No signup required. MOQ from 50 pieces." />
        <meta name="keywords" content="instant quote, apparel pricing calculator, garment manufacturing quote, custom clothing price estimate, bulk order pricing" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <InstantQuoteCalculator />
      </main>

      <Footer />
    </>
  );
}
