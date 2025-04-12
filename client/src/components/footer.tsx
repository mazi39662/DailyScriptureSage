import { Book } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Book className="h-5 w-5 text-primary mr-2" />
            <span className="font-heading font-bold text-lg text-darkText">Daily Dose of Bible Verse</span>
          </div>
          
          <div className="flex space-x-6">
            <Link href="/about">
              <a className="text-gray-500 hover:text-primary">About</a>
            </Link>
            <Link href="/privacy">
              <a className="text-gray-500 hover:text-primary">Privacy</a>
            </Link>
            <Link href="/terms">
              <a className="text-gray-500 hover:text-primary">Terms</a>
            </Link>
            <Link href="/contact">
              <a className="text-gray-500 hover:text-primary">Contact</a>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Daily Dose of Bible Verse. All rights reserved.</p>
          <p className="mt-2">Bible verses provided by Bible API. Not affiliated with any specific denomination.</p>
        </div>
      </div>
    </footer>
  );
}
