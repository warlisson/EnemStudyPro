import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real } from "drizzle-orm/pg-core";
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

// Video Lessons table
export const videoLessons = pgTable("video_lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  subject: text("subject").notNull(), // References the subject code
  professor: text("professor").notNull(), 
  duration: integer("duration").notNull(), // in seconds
  level: integer("level").default(1), // 1-Básico, 2-Intermediário, 3-Avançado
  orderInSeries: integer("order_in_series"), // Para sequência de aulas
  seriesId: integer("series_id"), // Para agrupar aulas em séries
  topics: jsonb("topics").notNull(),
  viewCount: integer("view_count").default(0),
  attachments: jsonb("attachments"), // Materiais complementares em JSON
  publishedAt: timestamp("published_at").defaultNow(),
});

export const insertVideoLessonSchema = createInsertSchema(videoLessons).pick({
  title: true,
  description: true,
  videoUrl: true,
  thumbnailUrl: true,
  subject: true,
  professor: true,
  duration: true,
  level: true,
  orderInSeries: true,
  seriesId: true,
  topics: true,
  attachments: true,
});

// Video Progress table (para acompanhar progresso do usuário em cada vídeo)
export const videoProgress = pgTable("video_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  videoId: integer("video_id").notNull(),
  progress: real("progress").default(0), // Porcentagem (0.0 - 1.0)
  watched: boolean("watched").default(false),
  favorite: boolean("favorite").default(false),
  lastWatched: timestamp("last_watched").defaultNow(),
});

export const insertVideoProgressSchema = createInsertSchema(videoProgress).pick({
  userId: true,
  videoId: true,
  progress: true,
  watched: true,
  favorite: true,
});

// Video Ratings table
export const videoRatings = pgTable("video_ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  videoId: integer("video_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVideoRatingSchema = createInsertSchema(videoRatings).pick({
  userId: true,
  videoId: true,
  rating: true,
  comment: true,
});

// Video Comments table (para comentários e dúvidas)
export const videoComments = pgTable("video_comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  videoId: integer("video_id").notNull(),
  content: text("content").notNull(),
  parentId: integer("parent_id"), // Para respostas a comentários
  createdAt: timestamp("created_at").defaultNow(),
  isQuestion: boolean("is_question").default(false), // Se é uma dúvida
  isProfessorResponse: boolean("is_professor_response").default(false),
});

export const insertVideoCommentSchema = createInsertSchema(videoComments).pick({
  userId: true,
  videoId: true,
  content: true,
  parentId: true,
  isQuestion: true,
  isProfessorResponse: true,
});

// Categories table (para agrupar vídeos por categoria além das disciplinas)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  subject: text("subject"), // Pode estar vinculada a uma disciplina ou ser genérica
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  icon: true,
  color: true,
  subject: true,
});

// Video-Category Relation table (um vídeo pode pertencer a várias categorias)
export const videoCategoryRelations = pgTable("video_category_relations", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull(),
  categoryId: integer("category_id").notNull(),
});

export const insertVideoCategoryRelationSchema = createInsertSchema(videoCategoryRelations).pick({
  videoId: true,
  categoryId: true,
});

// Video Exercises table (exercícios associados aos vídeos)
export const videoExercises = pgTable("video_exercises", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull(),
  questionId: integer("question_id").notNull(), // Referência à tabela de perguntas
  orderInVideo: integer("order_in_video").default(1), // Ordem de exibição dos exercícios
});

export const insertVideoExerciseSchema = createInsertSchema(videoExercises).pick({
  videoId: true,
  questionId: true,
  orderInVideo: true,
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

export type InsertVideoLesson = z.infer<typeof insertVideoLessonSchema>;
export type VideoLesson = typeof videoLessons.$inferSelect;

export type InsertVideoProgress = z.infer<typeof insertVideoProgressSchema>;
export type VideoProgress = typeof videoProgress.$inferSelect;

export type InsertVideoRating = z.infer<typeof insertVideoRatingSchema>;
export type VideoRating = typeof videoRatings.$inferSelect;

export type InsertVideoComment = z.infer<typeof insertVideoCommentSchema>;
export type VideoComment = typeof videoComments.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertVideoCategoryRelation = z.infer<typeof insertVideoCategoryRelationSchema>;
export type VideoCategoryRelation = typeof videoCategoryRelations.$inferSelect;

export type InsertVideoExercise = z.infer<typeof insertVideoExerciseSchema>;
export type VideoExercise = typeof videoExercises.$inferSelect;
