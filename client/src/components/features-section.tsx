import { Card, CardContent } from "@/components/ui/card";
import { Book, Lightbulb, Heart } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Book className="h-6 w-6 text-primary" />,
    title: "Daily Inspiration",
    description: "Start each morning with Scripture to center your day around God's wisdom."
  },
  {
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
    title: "Practical Understanding",
    description: "Gain insight into Scripture with clear explanations of each verse's context."
  },
  {
    icon: <Heart className="h-6 w-6 text-primary" />,
    title: "Life Application",
    description: "Learn how to apply Biblical truths to your everyday life and challenges."
  }
];

export function FeaturesSection() {
  return (
    <div className="mt-16">
      <h2 className="font-heading text-3xl font-bold text-center mb-10">Why Subscribe to Daily Verses?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="bg-white shadow-md">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
