import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const [location] = useLocation();
  let user = null;
  let logoutMutation = { mutate: () => {}, isPending: false };
  
  // Safely try to use the auth hook, but fall back to default values if not available
  try {
    const auth = useAuth();
    user = auth.user;
    logoutMutation = auth.logoutMutation;
  } catch (error) {
    console.log("Auth context not available yet");
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <Book className="h-6 w-6 text-primary mr-2" />
                <span className="font-heading font-bold text-xl text-darkText">Daily Dose of Bible Verse</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <div className="text-primary hover:text-accent transition font-medium cursor-pointer">
                    Dashboard
                  </div>
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-accent hover:bg-secondary transition font-medium"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <div className="text-primary hover:text-accent transition font-medium cursor-pointer">
                    Login
                  </div>
                </Link>
                <Link href="/auth">
                  <Button className="bg-primary text-white hover:bg-opacity-90 transition font-medium">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
