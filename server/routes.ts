import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { sendDailyVerseToAllUsers } from "./email";
import { getRandomVerse } from "../client/src/lib/bible-api";
import { insertVerseSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Get random verse
  app.get("/api/verses/random", async (req, res) => {
    try {
      const verse = await getRandomVerse();
      
      // Store the verse in database if needed
      const savedVerse = await storage.createVerse({
        text: verse.text,
        reference: verse.reference,
        explanation: verse.explanation,
        application: verse.application
      });
      
      res.json(verse);
    } catch (error) {
      console.error("Error fetching random verse:", error);
      res.status(500).json({ message: "Failed to fetch random verse" });
    }
  });

  // Admin-only endpoint to trigger sending daily verses to all users
  app.post("/api/admin/send-daily-verse", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const verse = await getRandomVerse();
      
      // Save the verse to the database
      const savedVerse = await storage.createVerse({
        text: verse.text,
        reference: verse.reference,
        explanation: verse.explanation,
        application: verse.application
      });
      
      // Send the verse to all subscribed users
      const result = await sendDailyVerseToAllUsers(savedVerse);
      
      res.json({ 
        success: true, 
        message: `Daily verse sent to ${result.sentCount} users`, 
        verse: savedVerse 
      });
    } catch (error) {
      console.error("Error sending daily verse:", error);
      res.status(500).json({ message: "Failed to send daily verse" });
    }
  });
  
  // Create a verse (mostly for testing)
  app.post("/api/verses", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const verseData = insertVerseSchema.parse(req.body);
      const verse = await storage.createVerse(verseData);
      res.status(201).json(verse);
    } catch (error) {
      console.error("Error creating verse:", error);
      res.status(400).json({ message: "Invalid verse data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
