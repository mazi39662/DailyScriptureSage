import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export function CTASection() {
  const [_, navigate] = useLocation();
  let user = null;
  
  // Safely try to use the auth hook, but fall back to default values if not available
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log("Auth context not available yet");
  }
  
  const handleCTAClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <div className="bg-primary text-white rounded-lg shadow-md p-8 md:p-12 mt-16 text-center">
      <h2 className="font-heading text-3xl font-bold mb-4">Get Daily Verses in Your Inbox</h2>
      <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
        Sign up to receive a daily Bible verse with explanation and application delivered to your email each morning.
      </p>
      <Button 
        className="bg-white text-primary hover:bg-accent hover:text-white transition-colors font-semibold py-6 px-8 rounded-md text-lg shadow-md hover:scale-105 transition duration-200"
        onClick={handleCTAClick}
      >
        {user ? "Manage Your Subscription" : "Start Your Spiritual Journey"}
      </Button>
    </div>
  );
}
