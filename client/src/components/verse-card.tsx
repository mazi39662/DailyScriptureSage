import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Verse } from "../interfaces/verse";
import { 
  Facebook, 
  Twitter, 
  Link as LinkIcon,
  Share2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerseCardProps {
  verse: Verse | null;
  isVisible: boolean;
}

export function VerseCard({ verse, isVisible }: VerseCardProps) {
  const { toast } = useToast();
  
  if (!verse) return null;
  
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(`"${verse.text}" - ${verse.reference}`)}`;
    window.open(url, '_blank');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${verse.text}" - ${verse.reference} via Daily Dose of Bible Verse`)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`"${verse.text}" - ${verse.reference} via Daily Dose of Bible Verse ${window.location.href}`)}`;
    window.open(url, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`"${verse.text}" - ${verse.reference} ${window.location.href}`)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "The verse has been copied to your clipboard."
        });
      })
      .catch(err => {
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard.",
          variant: "destructive"
        });
      });
  };

  return (
    <Card className={`bg-white shadow-md mb-8 transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 max-h-0 overflow-hidden'}`}>
      <CardContent className="p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-2">Today's Verse</h2>
          <div className="flex justify-center">
            <div className="h-1 w-16 bg-accent rounded"></div>
          </div>
        </div>
        
        <blockquote className="font-heading text-xl md:text-2xl text-center mb-4 italic leading-relaxed">
          "{verse.text}"
        </blockquote>
        
        <p className="text-right font-heading font-semibold mb-6 text-gray-700">- {verse.reference}</p>
        
        <div className="flex justify-center space-x-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-accent hover:bg-gray-100 rounded-full" 
            onClick={shareOnFacebook}
            title="Share on Facebook"
          >
            <Facebook className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-accent hover:bg-gray-100 rounded-full" 
            onClick={shareOnTwitter}
            title="Share on Twitter"
          >
            <Twitter className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-accent hover:bg-gray-100 rounded-full" 
            onClick={shareViaWhatsApp}
            title="Share on WhatsApp"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-accent hover:bg-gray-100 rounded-full" 
            onClick={copyLink}
            title="Copy Link"
          >
            <LinkIcon className="h-5 w-5" />
          </Button>
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="font-heading text-xl font-semibold text-gray-800 mb-3">Understanding</h3>
          <p className="mb-6 text-gray-700">{verse.explanation}</p>
          
          <h3 className="font-heading text-xl font-semibold text-gray-800 mb-3">Today's Application</h3>
          <p className="text-gray-700">{verse.application}</p>
        </div>
      </CardContent>
    </Card>
  );
}
