import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NotificationCenter } from "@/components/NotificationCenter";

export default function Notifications() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your orders and activities
            </p>
          </div>
          <NotificationCenter />
        </div>
      </div>
      <Footer />
    </>
  );
}
