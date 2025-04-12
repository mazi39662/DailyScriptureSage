import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { VerseCard } from "@/components/verse-card";
import { getRandomVerse } from "@/lib/bible-api";
import { Verse } from "@/interfaces/verse";
import { Loader2, Mail, Heart, CalendarDays, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

interface UserSettingsForm {
  isSubscribed: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verse, setVerse] = useState<Verse | null>(null);
  const [isVerseLoading, setIsVerseLoading] = useState(false);
  
  const form = useForm<UserSettingsForm>({
    defaultValues: {
      isSubscribed: user?.isSubscribed || true,
    },
  });
  
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: UserSettingsForm) => {
      const res = await apiRequest("PATCH", "/api/user/settings", data);
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Settings updated",
        description: "Your subscription preferences have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: UserSettingsForm) => {
    updateSettingsMutation.mutate(data);
  };
  
  const handleGetVerse = async () => {
    setIsVerseLoading(true);
    try {
      const newVerse = await getRandomVerse();
      setVerse(newVerse);
    } catch (error) {
      toast({
        title: "Error fetching verse",
        description: "Unable to retrieve a Bible verse at this time. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsVerseLoading(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-heading text-3xl font-bold text-gray-800 mb-6">Welcome, {user.fullName}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Daily Verse</CardTitle>
              <CardDescription>Get inspired</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-primary mr-2" />
                <span>Wisdom for today</span>
              </div>
              <Button 
                onClick={handleGetVerse} 
                className="w-full mt-4"
                disabled={isVerseLoading}
              >
                {isVerseLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : "Get Verse"}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Subscription</CardTitle>
              <CardDescription>Email delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span>{user.isSubscribed ? "Active" : "Inactive"}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {user.isSubscribed 
                  ? "You will receive daily verses to your email" 
                  : "You are not subscribed to daily emails"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Member Since</CardTitle>
              <CardDescription>Your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 text-primary mr-2" />
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Continuing your spiritual growth
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Verse display section */}
        {verse && <VerseCard verse={verse} isVisible={true} />}
        
        {/* Settings Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Subscription Settings</CardTitle>
            <CardDescription>
              Manage your email preferences for daily Bible verses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="isSubscribed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Daily Verse Emails
                        </FormLabel>
                        <FormDescription>
                          Receive a daily Bible verse with explanation and application in your inbox
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="mt-6"
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Save Settings"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
