import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the ENEM study platform
  const apiRouter = app.route('/api');

  // User routes
  app.get('/api/users/me', (req, res) => {
    res.json({
      id: 1,
      username: "Warlisson Miranda",
      email: "warlisson@email.com"
    });
  });

  // Statistics routes
  app.get('/api/statistics', (req, res) => {
    res.json({
      questionsResolved: 248,
      correctPercentage: 76,
      hoursStudied: 42,
      streak: 8
    });
  });

  // Questions routes
  app.get('/api/questions', async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching questions" });
    }
  });

  app.get('/api/questions/:subject', async (req, res) => {
    try {
      const subject = req.params.subject;
      const questions = await storage.getQuestionsBySubject(subject);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching questions by subject" });
    }
  });

  // Study materials routes
  app.get('/api/materials/recent', async (req, res) => {
    try {
      const materials = await storage.getRecentMaterials();
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent materials" });
    }
  });
  
  app.get('/api/materials', async (req, res) => {
    try {
      const materials = await storage.getAllMaterials();
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching all materials" });
    }
  });
  
  app.get('/api/materials/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid material ID" });
      }
      const material = await storage.getMaterialById(id);
      if (!material) {
        return res.status(404).json({ message: "Material not found" });
      }
      res.json(material);
    } catch (error) {
      res.status(500).json({ message: "Error fetching material details" });
    }
  });

  app.get('/api/materials/subject/:subject', async (req, res) => {
    try {
      const subject = req.params.subject;
      const materials = await storage.getMaterialsBySubject(subject);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching materials by subject" });
    }
  });

  // News routes
  app.get('/api/news', async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
    }
  });

  // Subjects routes
  app.get('/api/subjects', async (req, res) => {
    try {
      const subjects = await storage.getAllSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching subjects" });
    }
  });

  app.get('/api/subjects/:subject', async (req, res) => {
    try {
      const subject = req.params.subject;
      const subjectDetails = await storage.getSubjectDetails(subject);
      res.json(subjectDetails);
    } catch (error) {
      res.status(500).json({ message: "Error fetching subject details" });
    }
  });

  // Performance routes
  app.get('/api/performance', async (req, res) => {
    try {
      const performance = await storage.getUserPerformance();
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Error fetching performance data" });
    }
  });

  app.get('/api/performance/:subject', async (req, res) => {
    try {
      const subject = req.params.subject;
      const performance = await storage.getUserPerformanceBySubject(subject);
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Error fetching subject performance data" });
    }
  });

  // Video Categories routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.get('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category" });
    }
  });

  app.get('/api/categories/subject/:subject', async (req, res) => {
    try {
      const subject = req.params.subject;
      const categories = await storage.getCategoriesBySubject(subject);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories by subject" });
    }
  });

  // Video Lessons routes
  app.get('/api/videos', async (req, res) => {
    try {
      const videos = await storage.getAllVideoLessons();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Error fetching videos" });
    }
  });

  app.get('/api/videos/recent', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const videos = await storage.getRecentVideoLessons(limit);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent videos" });
    }
  });

  app.get('/api/videos/subject/:subject', async (req, res) => {
    try {
      const subject = req.params.subject;
      const videos = await storage.getVideoLessonsBySubject(subject);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Error fetching videos by subject" });
    }
  });

  app.get('/api/videos/category/:categoryId', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const videos = await storage.getVideoLessonsByCategory(categoryId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Error fetching videos by category" });
    }
  });

  app.get('/api/videos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }
      const video = await storage.getVideoLessonById(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      // Incrementar visualizações
      await storage.incrementVideoViews(id);
      
      // Também buscar avaliação média, se existir
      const rating = await storage.getAverageVideoRating(id);
      
      res.json({
        ...video,
        averageRating: rating
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching video" });
    }
  });

  // Video Progress routes
  app.post('/api/videos/:id/progress', async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const { userId, progress } = z.object({
        userId: z.number(),
        progress: z.number().min(0).max(1)
      }).parse(req.body);
      
      const videoProgress = await storage.updateVideoProgress(userId, videoId, progress);
      res.json(videoProgress);
    } catch (error) {
      res.status(500).json({ message: "Error updating video progress" });
    }
  });

  app.post('/api/videos/:id/watched', async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const { userId, watched } = z.object({
        userId: z.number(),
        watched: z.boolean()
      }).parse(req.body);
      
      const videoProgress = await storage.setVideoWatched(userId, videoId, watched);
      res.json(videoProgress);
    } catch (error) {
      res.status(500).json({ message: "Error marking video as watched" });
    }
  });

  app.post('/api/videos/:id/favorite', async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const { userId } = z.object({
        userId: z.number()
      }).parse(req.body);
      
      const videoProgress = await storage.toggleVideoFavorite(userId, videoId);
      res.json(videoProgress);
    } catch (error) {
      res.status(500).json({ message: "Error toggling favorite" });
    }
  });

  app.get('/api/videos/:id/progress', async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const progress = await storage.getVideoProgress(userId, videoId);
      res.json(progress || { progress: 0, watched: false, favorite: false });
    } catch (error) {
      res.status(500).json({ message: "Error fetching video progress" });
    }
  });

  // Video Comments & Ratings routes
  app.get('/api/videos/:id/comments', async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const comments = await storage.getVideoComments(videoId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching video comments" });
    }
  });

  app.post('/api/videos/:id/comments', async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const commentData = z.object({
        userId: z.number(),
        content: z.string().min(1),
        parentId: z.number().optional().nullable(),
        isQuestion: z.boolean().optional(),
        isProfessorResponse: z.boolean().optional()
      }).parse(req.body);
      
      const comment = await storage.addVideoComment({
        ...commentData,
        videoId
      });
      
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: "Error adding comment" });
    }
  });

  app.get('/api/videos/:id/ratings', async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const ratings = await storage.getVideoRatings(videoId);
      const averageRating = await storage.getAverageVideoRating(videoId);
      
      res.json({
        ratings,
        average: averageRating,
        count: ratings.length
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching ratings" });
    }
  });

  app.post('/api/videos/:id/ratings', async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const ratingData = z.object({
        userId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional()
      }).parse(req.body);
      
      const rating = await storage.addVideoRating({
        ...ratingData,
        videoId
      });
      
      const averageRating = await storage.getAverageVideoRating(videoId);
      
      res.json({
        rating,
        average: averageRating
      });
    } catch (error) {
      res.status(500).json({ message: "Error adding rating" });
    }
  });

  // Video Exercises routes
  app.get('/api/videos/:id/exercises', async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const exercises = await storage.getVideoExercises(videoId);
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Error fetching video exercises" });
    }
  });

  // ===================================================
  // Flash Cards Routes
  // ===================================================
  
  // Get all flash cards for a user
  app.get('/api/flashcards', async (req, res) => {
    try {
      // Para o projeto de demonstração, usando userId fixo
      const userId = 1;
      const cards = await storage.getAllFlashCards(userId);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Error fetching flash cards" });
    }
  });
  
  // Get flash cards by subject
  app.get('/api/flashcards/subject/:subject', async (req, res) => {
    try {
      const userId = 1;
      const subject = req.params.subject;
      const cards = await storage.getFlashCardsBySubject(userId, subject);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Error fetching flash cards by subject" });
    }
  });
  
  // Get due flash cards (cards scheduled for review)
  app.get('/api/flashcards/due', async (req, res) => {
    try {
      const userId = 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const cards = await storage.getDueFlashCards(userId, limit);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Error fetching due flash cards" });
    }
  });
  
  // Get a specific flash card
  app.get('/api/flashcards/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid flash card ID" });
      }
      
      const card = await storage.getFlashCardById(id);
      if (!card) {
        return res.status(404).json({ message: "Flash card not found" });
      }
      
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Error fetching flash card" });
    }
  });
  
  // Create a new flash card
  app.post('/api/flashcards', async (req, res) => {
    try {
      const flashCardData = z.object({
        subject: z.string(),
        front: z.string(),
        back: z.string(),
        difficulty: z.number().min(1).max(5).optional(),
        tags: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        customMetadata: z.any().optional(),
      }).parse({
        ...req.body,
        userId: 1 // Fixado para o projeto de demonstração
      });
      
      const card = await storage.createFlashCard(flashCardData);
      res.status(201).json(card);
    } catch (error) {
      res.status(500).json({ message: "Error creating flash card" });
    }
  });
  
  // Update a flash card
  app.patch('/api/flashcards/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid flash card ID" });
      }
      
      const flashCardData = z.object({
        subject: z.string().optional(),
        front: z.string().optional(),
        back: z.string().optional(),
        difficulty: z.number().min(1).max(5).optional(),
        tags: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        customMetadata: z.any().optional(),
      }).parse(req.body);
      
      const updatedCard = await storage.updateFlashCard(id, flashCardData);
      res.json(updatedCard);
    } catch (error) {
      res.status(500).json({ message: "Error updating flash card" });
    }
  });
  
  // Delete a flash card
  app.delete('/api/flashcards/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid flash card ID" });
      }
      
      const success = await storage.deleteFlashCard(id);
      if (!success) {
        return res.status(404).json({ message: "Flash card not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting flash card" });
    }
  });
  
  // Update flash card review status
  app.post('/api/flashcards/:id/review', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid flash card ID" });
      }
      
      const reviewData = z.object({
        difficulty: z.number().min(1).max(5)
      }).parse(req.body);
      
      const updatedCard = await storage.updateFlashCardReviewStatus(id, reviewData.difficulty);
      res.json(updatedCard);
    } catch (error) {
      res.status(500).json({ message: "Error updating review status" });
    }
  });
  
  // Flash Card Decks routes
  app.get('/api/flashcarddecks', async (req, res) => {
    try {
      const userId = 1;
      const decks = await storage.getAllFlashCardDecks(userId);
      res.json(decks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching flash card decks" });
    }
  });
  
  app.get('/api/flashcarddecks/public', async (req, res) => {
    try {
      const decks = await storage.getPublicFlashCardDecks();
      res.json(decks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching public flash card decks" });
    }
  });
  
  app.get('/api/flashcarddecks/subject/:subject', async (req, res) => {
    try {
      const userId = 1;
      const subject = req.params.subject;
      const decks = await storage.getFlashCardDecksBySubject(userId, subject);
      res.json(decks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching flash card decks by subject" });
    }
  });
  
  app.get('/api/flashcarddecks/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid deck ID" });
      }
      
      const deck = await storage.getFlashCardDeckById(id);
      if (!deck) {
        return res.status(404).json({ message: "Flash card deck not found" });
      }
      
      res.json(deck);
    } catch (error) {
      res.status(500).json({ message: "Error fetching flash card deck" });
    }
  });
  
  app.post('/api/flashcarddecks', async (req, res) => {
    try {
      const deckData = z.object({
        name: z.string(),
        description: z.string().optional(),
        subject: z.string(),
        isPublic: z.boolean().optional(),
        coverImage: z.string().optional(),
        tags: z.array(z.string()).optional()
      }).parse({
        ...req.body,
        userId: 1 // Fixado para o projeto de demonstração
      });
      
      const deck = await storage.createFlashCardDeck(deckData);
      res.status(201).json(deck);
    } catch (error) {
      res.status(500).json({ message: "Error creating flash card deck" });
    }
  });
  
  app.patch('/api/flashcarddecks/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid deck ID" });
      }
      
      const deckData = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        subject: z.string().optional(),
        isPublic: z.boolean().optional(),
        coverImage: z.string().optional(),
        tags: z.array(z.string()).optional()
      }).parse(req.body);
      
      const updatedDeck = await storage.updateFlashCardDeck(id, deckData);
      res.json(updatedDeck);
    } catch (error) {
      res.status(500).json({ message: "Error updating flash card deck" });
    }
  });
  
  app.delete('/api/flashcarddecks/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid deck ID" });
      }
      
      const success = await storage.deleteFlashCardDeck(id);
      if (!success) {
        return res.status(404).json({ message: "Flash card deck not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting flash card deck" });
    }
  });
  
  // Deck Cards routes
  app.get('/api/flashcarddecks/:deckId/cards', async (req, res) => {
    try {
      const deckId = parseInt(req.params.deckId);
      if (isNaN(deckId)) {
        return res.status(400).json({ message: "Invalid deck ID" });
      }
      
      const cards = await storage.getFlashCardsFromDeck(deckId);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cards from deck" });
    }
  });
  
  app.post('/api/flashcarddecks/:deckId/cards', async (req, res) => {
    try {
      const deckId = parseInt(req.params.deckId);
      if (isNaN(deckId)) {
        return res.status(400).json({ message: "Invalid deck ID" });
      }
      
      const cardData = z.object({
        cardId: z.number(),
        order: z.number().optional()
      }).parse(req.body);
      
      const deckCard = await storage.addFlashCardToDeck(deckId, cardData.cardId, cardData.order);
      res.status(201).json(deckCard);
    } catch (error) {
      res.status(500).json({ message: "Error adding card to deck" });
    }
  });
  
  app.delete('/api/flashcarddecks/:deckId/cards/:cardId', async (req, res) => {
    try {
      const deckId = parseInt(req.params.deckId);
      const cardId = parseInt(req.params.cardId);
      if (isNaN(deckId) || isNaN(cardId)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const success = await storage.removeFlashCardFromDeck(deckId, cardId);
      if (!success) {
        return res.status(404).json({ message: "Card not found in deck" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing card from deck" });
    }
  });
  
  app.patch('/api/flashcarddecks/:deckId/cards/:cardId/order', async (req, res) => {
    try {
      const deckId = parseInt(req.params.deckId);
      const cardId = parseInt(req.params.cardId);
      if (isNaN(deckId) || isNaN(cardId)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const orderData = z.object({
        newOrder: z.number()
      }).parse(req.body);
      
      const success = await storage.reorderFlashCardInDeck(deckId, cardId, orderData.newOrder);
      if (!success) {
        return res.status(404).json({ message: "Card not found in deck" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error reordering card in deck" });
    }
  });

  // ===================================================
  // Exams Routes
  // ===================================================
  
  // Get all exams
  app.get('/api/exams', async (req, res) => {
  try {
    const exams = await storage.getAllExams();  // Chama o método para pegar todos os exames
    res.json(exams);  // Retorna os exames encontrados como JSON
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams", error: error.message });
  }
});
  
  // Get public exams
  app.get('/api/exams/public', async (req, res) => {
    try {
      const exams = await storage.getPublicExams();
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: "Error fetching public exams" });
    }
  });
  
  // Get exams by subject
  app.get('/api/exams/subject/:subject', async (req, res) => {
    try {
      const subject = req.params.subject;
      const exams = await storage.getExamsBySubject(subject);
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: "Error fetching exams by subject" });
    }
  });
  
  // Get a specific exam
  app.get('/api/exams/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }
      
      const exam = await storage.getExamById(id);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      
      res.json(exam);
    } catch (error) {
      res.status(500).json({ message: "Error fetching exam" });
    }
  });
  
  // Create a new exam
  app.post('/api/exams', async (req, res) => {
    try {
      const examData = z.object({
        title: z.string(),
        description: z.string(),
        duration: z.number(), // em minutos
        subjects: z.array(z.string()),
        difficulty: z.number().min(1).max(5).optional(),
        isPublic: z.boolean().optional(),
        instructions: z.string().optional(),
        passingScore: z.number().optional()
      }).parse({
        ...req.body,
        createdBy: 1 // Fixado para o projeto de demonstração
      });
      
      const exam = await storage.createExam(examData);
      res.status(201).json(exam);
    } catch (error) {
      res.status(500).json({ message: "Error creating exam" });
    }
  });
  
  // Update an exam
  app.patch('/api/exams/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }
      
      const examData = z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        duration: z.number().optional(),
        subjects: z.array(z.string()).optional(),
        difficulty: z.number().min(1).max(5).optional(),
        isPublic: z.boolean().optional(),
        instructions: z.string().optional(),
        passingScore: z.number().optional()
      }).parse(req.body);
      
      const updatedExam = await storage.updateExam(id, examData);
      res.json(updatedExam);
    } catch (error) {
      res.status(500).json({ message: "Error updating exam" });
    }
  });
  
  // Delete an exam
  app.delete('/api/exams/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }
      
      const success = await storage.deleteExam(id);
      if (!success) {
        return res.status(404).json({ message: "Exam not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting exam" });
    }
  });
  
  // Exam Questions routes
  app.get('/api/exams/:examId/questions', async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);
      if (isNaN(examId)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }
      
      const questions = await storage.getQuestionsFromExam(examId);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching questions from exam" });
    }
  });
  
  app.post('/api/exams/:examId/questions', async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);
      if (isNaN(examId)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }
      
      const questionData = z.object({
        questionId: z.number(),
        order: z.number().optional(),
        points: z.number().optional()
      }).parse({
        ...req.body,
        examId
      });
      
      const examQuestion = await storage.addQuestionToExam(questionData);
      res.status(201).json(examQuestion);
    } catch (error) {
      res.status(500).json({ message: "Error adding question to exam" });
    }
  });
  
  app.delete('/api/exams/:examId/questions/:questionId', async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);
      const questionId = parseInt(req.params.questionId);
      if (isNaN(examId) || isNaN(questionId)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const success = await storage.removeQuestionFromExam(examId, questionId);
      if (!success) {
        return res.status(404).json({ message: "Question not found in exam" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing question from exam" });
    }
  });
  
  // Exam Attempts routes
  app.get('/api/exam-attempts/user', async (req, res) => {
    try {
      const userId = 1; // Fixado para o projeto de demonstração
      const attempts = await storage.getExamAttemptsByUser(userId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching exam attempts" });
    }
  });
  
  app.get('/api/exam-attempts/exam/:examId', async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);
      if (isNaN(examId)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }
      
      const attempts = await storage.getExamAttemptsByExam(examId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching exam attempts" });
    }
  });
  
  app.get('/api/exam-attempts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid attempt ID" });
      }
      
      const attempt = await storage.getExamAttempt(id);
      if (!attempt) {
        return res.status(404).json({ message: "Exam attempt not found" });
      }
      
      res.json(attempt);
    } catch (error) {
      res.status(500).json({ message: "Error fetching exam attempt" });
    }
  });
  
  app.post('/api/exam-attempts', async (req, res) => {
    try {
      const attemptData = z.object({
        examId: z.number(),
        status: z.enum(["in_progress", "completed", "abandoned"]).optional()
      }).parse({
        ...req.body,
        userId: 1 // Fixado para o projeto de demonstração
      });
      
      const attempt = await storage.createExamAttempt(attemptData);
      res.status(201).json(attempt);
    } catch (error) {
      res.status(500).json({ message: "Error creating exam attempt" });
    }
  });
  
  app.patch('/api/exam-attempts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid attempt ID" });
      }
      
      const attemptData = z.object({
        score: z.number().optional(),
        timeSpent: z.number().optional(),
        answers: z.any().optional(),
        status: z.enum(["in_progress", "completed", "abandoned"]).optional(),
        completedAt: z.date().optional()
      }).parse(req.body);
      
      const updatedAttempt = await storage.updateExamAttempt(id, attemptData);
      res.json(updatedAttempt);
    } catch (error) {
      res.status(500).json({ message: "Error updating exam attempt" });
    }
  });

  // ===================================================
  // Forums Routes
  // ===================================================
  
  // Get all forums
  app.get('/api/forums', async (req, res) => {
    try {
      console.log("Tentando carregar os fóruns...");
      const forums = await storage.getAllForums();  // Certifique-se de que `storage` seja a instância correta de MemStorage
      console.log("Fóruns carregados com sucesso:", forums);
      res.status(200).json(forums);  // Retorna os dados dos fóruns
    } catch (error) {
      console.error("Erro ao carregar os fóruns:", error);
      res.status(500).json({ message: "Erro ao carregar os fóruns. Tente novamente mais tarde." });
    }
  });
  
  // Get forums by subject
  app.get('/api/forums/subject/:subject', async (req, res) => {
    try {
      const subject = req.params.subject;
      const forums = await storage.getForumsBySubject(subject);
      res.json(forums);
    } catch (error) {
      res.status(500).json({ message: "Error fetching forums by subject" });
    }
  });
  
  // Get a specific forum
  app.get('/api/forums/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid forum ID" });
      }
      
      const forum = await storage.getForumById(id);
      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }
      
      res.json(forum);
    } catch (error) {
      res.status(500).json({ message: "Error fetching forum" });
    }
  });
  
  // Create a new forum
  app.post('/api/forums', async (req, res) => {
    try {
      const forumData = z.object({
        name: z.string(),
        description: z.string().optional(),
        subject: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional()
      }).parse(req.body);
      
      const forum = await storage.createForum(forumData);
      res.status(201).json(forum);
    } catch (error) {
      res.status(500).json({ message: "Error creating forum" });
    }
  });
  
  // Forum Threads routes
  app.get('/api/forums/:forumId/threads', async (req, res) => {
    try {
      const forumId = parseInt(req.params.forumId);
      if (isNaN(forumId)) {
        return res.status(400).json({ message: "Invalid forum ID" });
      }
      
      const threads = await storage.getAllThreads(forumId);
      res.json(threads);
    } catch (error) {
      res.status(500).json({ message: "Error fetching threads" });
    }
  });
  
  app.get('/api/threads/recent', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const threads = await storage.getRecentThreads(limit);
      res.json(threads);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent threads" });
    }
  });
  
  app.get('/api/threads/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid thread ID" });
      }
      
      const thread = await storage.getThreadById(id);
      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      
      res.json(thread);
    } catch (error) {
      res.status(500).json({ message: "Error fetching thread" });
    }
  });
  
  app.post('/api/forums/:forumId/threads', async (req, res) => {
    try {
      const forumId = parseInt(req.params.forumId);
      if (isNaN(forumId)) {
        return res.status(400).json({ message: "Invalid forum ID" });
      }
      
      const threadData = z.object({
        title: z.string(),
        content: z.string(),
        isPinned: z.boolean().optional(),
        isLocked: z.boolean().optional(),
        tags: z.array(z.string()).optional()
      }).parse({
        ...req.body,
        forumId,
        userId: 1 // Fixado para o projeto de demonstração
      });
      
      const thread = await storage.createThread(threadData);
      res.status(201).json(thread);
    } catch (error) {
      res.status(500).json({ message: "Error creating thread" });
    }
  });
  
  app.patch('/api/threads/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid thread ID" });
      }
      
      const threadData = z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        isPinned: z.boolean().optional(),
        isLocked: z.boolean().optional(),
        tags: z.array(z.string()).optional()
      }).parse(req.body);
      
      const updatedThread = await storage.updateThread(id, threadData);
      res.json(updatedThread);
    } catch (error) {
      res.status(500).json({ message: "Error updating thread" });
    }
  });
  
  // Forum Posts routes
  app.get('/api/threads/:threadId/posts', async (req, res) => {
    try {
      const threadId = parseInt(req.params.threadId);
      if (isNaN(threadId)) {
        return res.status(400).json({ message: "Invalid thread ID" });
      }
      
      const posts = await storage.getPostsByThread(threadId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts" });
    }
  });
  
  app.get('/api/posts/recent', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const posts = await storage.getRecentPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent posts" });
    }
  });
  
  app.get('/api/posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching post" });
    }
  });
  
  app.post('/api/threads/:threadId/posts', async (req, res) => {
    try {
      const threadId = parseInt(req.params.threadId);
      if (isNaN(threadId)) {
        return res.status(400).json({ message: "Invalid thread ID" });
      }
      
      const postData = z.object({
        content: z.string(),
        isAnswer: z.boolean().optional(),
        parentId: z.number().optional()
      }).parse({
        ...req.body,
        threadId,
        userId: 1 // Fixado para o projeto de demonstração
      });
      
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Error creating post" });
    }
  });
  
  app.patch('/api/posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const postData = z.object({
        content: z.string().optional(),
        isAnswer: z.boolean().optional()
      }).parse(req.body);
      
      const updatedPost = await storage.updatePost(id, postData);
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Error updating post" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
