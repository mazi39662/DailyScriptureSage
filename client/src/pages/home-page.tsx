import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { VerseCard } from "@/components/verse-card";
import { FeaturesSection } from "@/components/features-section";
import { CTASection } from "@/components/cta-section";
import { Verse } from "../interfaces/verse";
import { getRandomVerse } from "../lib/bible-api";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [isVerseVisible, setIsVerseVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetVerse = async () => {
    setIsLoading(true);
    try {
      const newVerse = await getRandomVerse();
      setVerse(newVerse);
      setIsVerseVisible(true);
    } catch (error) {
      toast({
        title: "Error fetching verse",
        description: "Unable to retrieve a Bible verse at this time. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero Section */}
        <div className="text-center py-12 md:py-20">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Your Daily Spiritual Nourishment
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-600">
            Receive inspirational Bible verses with thoughtful explanations to guide your day.
          </p>
          
          <Button 
            onClick={handleGetVerse}
            className="bg-primary hover:bg-opacity-90 text-white font-semibold py-6 px-8 rounded-md text-lg shadow-md hover:scale-105 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Verse...
              </>
            ) : "Get Today's Verse"}
          </Button>
        </div>
        
        {/* Verse Display */}
        <VerseCard verse={verse} isVisible={isVerseVisible} />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
