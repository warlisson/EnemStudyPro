import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Type for JSON fields
export type Json = Record<string, any>;

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

// Flash Cards table
export const flashCards = pgTable("flash_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subject: text("subject").notNull(),
  front: text("front").notNull(),
  back: text("back").notNull(),
  difficulty: integer("difficulty").default(3), // 1-5 (Muito fácil a Muito difícil)
  nextReviewDate: timestamp("next_review_date").defaultNow(),
  reviewCount: integer("review_count").default(0),
  lastInterval: integer("last_interval").default(1), // em dias
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  tags: jsonb("tags").default([]),
  imageUrl: text("image_url"),
  customMetadata: jsonb("custom_metadata"),
});

export const insertFlashCardSchema = createInsertSchema(flashCards).pick({
  userId: true,
  subject: true,
  front: true,
  back: true,
  difficulty: true,
  nextReviewDate: true,
  tags: true,
  imageUrl: true,
  customMetadata: true,
});

// Flash Card Decks table
export const flashCardDecks = pgTable("flash_card_decks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  subject: text("subject"),
  isPublic: boolean("is_public").default(false),
  cardCount: integer("card_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  coverImage: text("cover_image"),
  tags: jsonb("tags").default([]),
});

export const insertFlashCardDeckSchema = createInsertSchema(flashCardDecks).pick({
  userId: true,
  name: true,
  description: true,
  subject: true,
  isPublic: true,
  coverImage: true,
  tags: true,
});

// Flash Card Deck Cards Relation table
export const deckCards = pgTable("deck_cards", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").notNull(),
  cardId: integer("card_id").notNull(),
  order: integer("order").default(0),
});

export const insertDeckCardSchema = createInsertSchema(deckCards).pick({
  deckId: true,
  cardId: true,
  order: true,
});

// Exams table
export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // em minutos
  questionCount: integer("question_count").default(0),
  subjects: jsonb("subjects").default([]),
  difficulty: integer("difficulty").default(2), // 1-5
  isPublic: boolean("is_public").default(false),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  instructions: text("instructions"),
  passingScore: integer("passing_score"),
});

export const insertExamSchema = createInsertSchema(exams).pick({
  title: true,
  description: true,
  duration: true,
  subjects: true,
  difficulty: true,
  isPublic: true,
  createdBy: true,
  instructions: true,
  passingScore: true,
});

// Exam Questions table
export const examQuestions = pgTable("exam_questions", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull(),
  questionId: integer("question_id").notNull(),
  order: integer("order").default(0),
  points: integer("points").default(1),
});

export const insertExamQuestionSchema = createInsertSchema(examQuestions).pick({
  examId: true,
  questionId: true,
  order: true,
  points: true,
});

// Exam Attempts table
export const examAttempts = pgTable("exam_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  examId: integer("exam_id").notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  score: integer("score"),
  timeSpent: integer("time_spent"), // em segundos
  answers: jsonb("answers"), // Armazena as respostas do usuário
  status: text("status").default("in_progress"), // in_progress, completed, abandoned
});

export const insertExamAttemptSchema = createInsertSchema(examAttempts).pick({
  userId: true,
  examId: true,
  startedAt: true,
  completedAt: true,
  score: true,
  timeSpent: true,
  answers: true,
  status: true,
});

// Forums table
export const forums = pgTable("forums", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  subject: text("subject"), // Pode ser null para fóruns gerais
  icon: text("icon"),
  color: text("color"),
  threadCount: integer("thread_count").default(0),
  postCount: integer("post_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertForumSchema = createInsertSchema(forums).pick({
  name: true,
  description: true,
  subject: true,
  icon: true,
  color: true,
});

// Forum Threads table
export const forumThreads = pgTable("forum_threads", {
  id: serial("id").primaryKey(),
  forumId: integer("forum_id").notNull(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  replyCount: integer("reply_count").default(0),
  lastReplyAt: timestamp("last_reply_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  tags: jsonb("tags").default([]),
});

export const insertForumThreadSchema = createInsertSchema(forumThreads).pick({
  forumId: true,
  userId: true,
  title: true,
  content: true,
  isPinned: true,
  isLocked: true,
  tags: true,
});

// Forum Posts table
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  isAnswer: boolean("is_answer").default(false),
  parentId: integer("parent_id"), // Para respostas a outros posts
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertForumPostSchema = createInsertSchema(forumPosts).pick({
  threadId: true,
  userId: true,
  content: true,
  isAnswer: true,
  parentId: true,
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

export type InsertFlashCard = z.infer<typeof insertFlashCardSchema>;
export type FlashCard = typeof flashCards.$inferSelect;

export type InsertFlashCardDeck = z.infer<typeof insertFlashCardDeckSchema>;
export type FlashCardDeck = typeof flashCardDecks.$inferSelect;

export type InsertDeckCard = z.infer<typeof insertDeckCardSchema>;
export type DeckCard = typeof deckCards.$inferSelect;

export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof exams.$inferSelect;

export type InsertExamQuestion = z.infer<typeof insertExamQuestionSchema>;
export type ExamQuestion = typeof examQuestions.$inferSelect;

export type InsertExamAttempt = z.infer<typeof insertExamAttemptSchema>;
export type ExamAttempt = typeof examAttempts.$inferSelect;

export type InsertForum = z.infer<typeof insertForumSchema>;
export type Forum = typeof forums.$inferSelect;

export type InsertForumThread = z.infer<typeof insertForumThreadSchema>;
export type ForumThread = typeof forumThreads.$inferSelect;

export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
