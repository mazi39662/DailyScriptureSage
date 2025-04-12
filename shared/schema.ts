import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  isSubscribed: boolean("is_subscribed").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  userVerses: many(userVerses),
}));

export const verses = pgTable("verses", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  reference: text("reference").notNull(),
  explanation: text("explanation").notNull(),
  application: text("application").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const versesRelations = relations(verses, ({ many }) => ({
  userVerses: many(userVerses),
}));

export const userVerses = pgTable("user_verses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  verseId: integer("verse_id").notNull().references(() => verses.id, { onDelete: 'cascade' }),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const userVersesRelations = relations(userVerses, ({ one }) => ({
  user: one(users, {
    fields: [userVerses.userId],
    references: [users.id],
  }),
  verse: one(verses, {
    fields: [userVerses.verseId],
    references: [verses.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  isSubscribed: true,
});

export const insertVerseSchema = createInsertSchema(verses).pick({
  text: true,
  reference: true,
  explanation: true,
  application: true,
});

export const insertUserVerseSchema = createInsertSchema(userVerses).pick({
  userId: true,
  verseId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVerse = z.infer<typeof insertVerseSchema>;
export type Verse = typeof verses.$inferSelect;
export type InsertUserVerse = z.infer<typeof insertUserVerseSchema>;
export type UserVerse = typeof userVerses.$inferSelect;

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
