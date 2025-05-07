import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  questionCount: integer("question_count").default(0),
});

export const insertSubjectSchema = createInsertSchema(subjects).pick({
  code: true,
  name: true,
  description: true,
  icon: true,
  color: true,
  questionCount: true,
});

// Questions table
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  examYear: text("exam_year"),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  options: jsonb("options").notNull(),
  answer: text("answer"),
  explanation: text("explanation"),
  hasStepByStep: boolean("has_step_by_step").default(false),
  hasVideo: boolean("has_video").default(false),
  difficulty: integer("difficulty").default(2), // 1-5 scale
  topics: jsonb("topics").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  examYear: true,
  subject: true,
  content: true,
  options: true,
  answer: true,
  explanation: true,
  hasStepByStep: true,
  hasVideo: true,
  difficulty: true,
  topics: true,
});

// Study Materials table
export const studyMaterials = pgTable("study_materials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  subject: text("subject").notNull(),
  topics: jsonb("topics").notNull(),
  image: text("image"),
  readTime: integer("read_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStudyMaterialSchema = createInsertSchema(studyMaterials).pick({
  title: true,
  description: true,
  content: true,
  subject: true,
  topics: true,
  image: true,
  readTime: true,
});

// User Performance table
export const userPerformance = pgTable("user_performance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  questionId: integer("question_id").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeTaken: integer("time_taken"), // in seconds
  attemptDate: timestamp("attempt_date").defaultNow(),
});

export const insertUserPerformanceSchema = createInsertSchema(userPerformance).pick({
  userId: true,
  questionId: true,
  isCorrect: true,
  timeTaken: true,
});

// News / Updates table
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  image: text("image"),
  publishedAt: timestamp("published_at").defaultNow(),
});

export const insertNewsSchema = createInsertSchema(news).pick({
  title: true,
  description: true,
  content: true,
  category: true,
  image: true,
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

export type InsertStudyMaterial = z.infer<typeof insertStudyMaterialSchema>;
export type StudyMaterial = typeof studyMaterials.$inferSelect;

export type InsertUserPerformance = z.infer<typeof insertUserPerformanceSchema>;
export type UserPerformance = typeof userPerformance.$inferSelect;

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;
