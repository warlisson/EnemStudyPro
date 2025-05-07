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

  app.get('/api/materials/:subject', async (req, res) => {
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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
