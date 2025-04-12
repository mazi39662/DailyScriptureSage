import { users, type User, type InsertUser, verses, type Verse, type InsertVerse, userVerses, type UserVerse, type InsertUserVerse } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { eq, and } from "drizzle-orm";
import { db, pool } from "./db";

const PostgresSessionStore = connectPg(session);

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSubscription(id: number, isSubscribed: boolean): Promise<User>;
  getSubscribedUsers(): Promise<User[]>;
  
  // Verse operations
  getVerse(id: number): Promise<Verse | undefined>;
  getVerseByReference(reference: string): Promise<Verse | undefined>;
  createVerse(verse: InsertVerse): Promise<Verse>;
  
  // User-Verse operations
  getUserVerse(userId: number, verseId: number): Promise<UserVerse | undefined>;
  createUserVerse(userVerse: InsertUserVerse): Promise<UserVerse>;
  
  // Session store
  sessionStore: session.SessionStore;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Case-insensitive search using lowercase comparison
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    // Case-insensitive search using lowercase comparison
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async updateUserSubscription(id: number, isSubscribed: boolean): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ isSubscribed })
      .where(eq(users.id, id))
      .returning();
      
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }
  
  async getSubscribedUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.isSubscribed, true));
  }
  
  // Verse methods
  async getVerse(id: number): Promise<Verse | undefined> {
    const [verse] = await db
      .select()
      .from(verses)
      .where(eq(verses.id, id));
    return verse;
  }
  
  async getVerseByReference(reference: string): Promise<Verse | undefined> {
    const [verse] = await db
      .select()
      .from(verses)
      .where(eq(verses.reference, reference));
    return verse;
  }
  
  async createVerse(insertVerse: InsertVerse): Promise<Verse> {
    const [existingVerse] = await db
      .select()
      .from(verses)
      .where(eq(verses.reference, insertVerse.reference));

    // If the verse already exists, return it instead of creating a duplicate
    if (existingVerse) {
      return existingVerse;
    }
      
    const [verse] = await db
      .insert(verses)
      .values(insertVerse)
      .returning();
    return verse;
  }
  
  // UserVerse methods
  async getUserVerse(userId: number, verseId: number): Promise<UserVerse | undefined> {
    const [userVerse] = await db
      .select()
      .from(userVerses)
      .where(
        and(
          eq(userVerses.userId, userId),
          eq(userVerses.verseId, verseId)
        )
      );
    return userVerse;
  }
  
  async createUserVerse(insertUserVerse: InsertUserVerse): Promise<UserVerse> {
    const [userVerse] = await db
      .insert(userVerses)
      .values(insertUserVerse)
      .returning();
    return userVerse;
  }
}

// Create and export the storage instance
export const storage = new DatabaseStorage();
