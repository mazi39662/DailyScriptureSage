import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";

// Simplified version to debug
function App() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Just to confirm hooks are working
    setLoaded(true);
  }, []);
  
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Daily Bible Verse</h1>
        <p className="text-gray-600">
          Simplified app for testing purposes
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p className="text-blue-800">
            This is a test to check if the basic React rendering is working.
          </p>
          <p className="mt-2 text-green-600">
            Component {loaded ? "has loaded" : "is loading"}...
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
