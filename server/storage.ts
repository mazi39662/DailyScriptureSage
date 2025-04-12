import { users, type User, type InsertUser, verses, type Verse, type InsertVerse, userVerses, type UserVerse, type InsertUserVerse } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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

// In-memory storage implementation
export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private versesMap: Map<number, Verse>;
  private userVersesMap: Map<number, UserVerse>;
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private verseIdCounter: number;
  private userVerseIdCounter: number;

  constructor() {
    this.usersMap = new Map();
    this.versesMap = new Map();
    this.userVersesMap = new Map();
    this.userIdCounter = 1;
    this.verseIdCounter = 1;
    this.userVerseIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.usersMap.set(id, user);
    return user;
  }
  
  async updateUserSubscription(id: number, isSubscribed: boolean): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, isSubscribed };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }
  
  async getSubscribedUsers(): Promise<User[]> {
    return Array.from(this.usersMap.values()).filter(user => user.isSubscribed);
  }
  
  // Verse methods
  async getVerse(id: number): Promise<Verse | undefined> {
    return this.versesMap.get(id);
  }
  
  async getVerseByReference(reference: string): Promise<Verse | undefined> {
    return Array.from(this.versesMap.values()).find(
      (verse) => verse.reference === reference
    );
  }
  
  async createVerse(insertVerse: InsertVerse): Promise<Verse> {
    const id = this.verseIdCounter++;
    const now = new Date();
    const verse: Verse = { 
      ...insertVerse, 
      id,
      createdAt: now
    };
    this.versesMap.set(id, verse);
    return verse;
  }
  
  // UserVerse methods
  async getUserVerse(userId: number, verseId: number): Promise<UserVerse | undefined> {
    return Array.from(this.userVersesMap.values()).find(
      (uv) => uv.userId === userId && uv.verseId === verseId
    );
  }
  
  async createUserVerse(insertUserVerse: InsertUserVerse): Promise<UserVerse> {
    const id = this.userVerseIdCounter++;
    const now = new Date();
    const userVerse: UserVerse = { 
      ...insertUserVerse, 
      id,
      sentAt: now
    };
    this.userVersesMap.set(id, userVerse);
    return userVerse;
  }
}

// Create and export the storage instance
export const storage = new MemStorage();
