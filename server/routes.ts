import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
