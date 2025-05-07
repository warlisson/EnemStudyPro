import { 
  users, type User, type InsertUser,
  subjects, type Subject, type InsertSubject,
  questions, type Question, type InsertQuestion,
  studyMaterials, type StudyMaterial, type InsertStudyMaterial,
  userPerformance, type UserPerformance, type InsertUserPerformance,
  news, type News, type InsertNews,
  videoLessons, type VideoLesson, type InsertVideoLesson,
  videoProgress, type VideoProgress, type InsertVideoProgress,
  videoRatings, type VideoRating, type InsertVideoRating,
  videoComments, type VideoComment, type InsertVideoComment,
  categories, type Category, type InsertCategory,
  videoCategoryRelations, type VideoCategoryRelation, type InsertVideoCategoryRelation,
  videoExercises, type VideoExercise, type InsertVideoExercise
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Subjects
  getAllSubjects(): Promise<Subject[]>;
  getSubjectByCode(code: string): Promise<Subject | undefined>;
  getSubjectDetails(code: string): Promise<any>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  // Questions
  getAllQuestions(): Promise<Question[]>;
  getQuestionsBySubject(subject: string): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // Study Materials
  getAllMaterials(): Promise<StudyMaterial[]>;
  getRecentMaterials(): Promise<StudyMaterial[]>;
  getMaterialsBySubject(subject: string): Promise<StudyMaterial[]>;
  getMaterialById(id: number): Promise<StudyMaterial | undefined>;
  createMaterial(material: InsertStudyMaterial): Promise<StudyMaterial>;
  
  // User Performance
  getUserPerformance(): Promise<any>;
  getUserPerformanceBySubject(subject: string): Promise<any>;
  addUserPerformance(performance: InsertUserPerformance): Promise<UserPerformance>;
  
  // News
  getNews(): Promise<News[]>;
  getNewsById(id: number): Promise<News | undefined>;
  createNews(newsItem: InsertNews): Promise<News>;
  
  // Video Lessons
  getAllVideoLessons(): Promise<VideoLesson[]>;
  getVideoLessonsBySubject(subject: string): Promise<VideoLesson[]>;
  getVideoLessonsByCategory(categoryId: number): Promise<VideoLesson[]>;
  getRecentVideoLessons(limit?: number): Promise<VideoLesson[]>;
  getVideoLessonById(id: number): Promise<VideoLesson | undefined>;
  createVideoLesson(videoLesson: InsertVideoLesson): Promise<VideoLesson>;
  incrementVideoViews(id: number): Promise<void>;
  
  // Video Progress
  getVideoProgress(userId: number, videoId: number): Promise<VideoProgress | undefined>;
  updateVideoProgress(userId: number, videoId: number, progress: number): Promise<VideoProgress>;
  setVideoWatched(userId: number, videoId: number, watched: boolean): Promise<VideoProgress>;
  toggleVideoFavorite(userId: number, videoId: number): Promise<VideoProgress>;
  getFavoriteVideos(userId: number): Promise<VideoLesson[]>;
  getWatchedVideos(userId: number): Promise<VideoLesson[]>;
  
  // Video Ratings and Comments
  getVideoRatings(videoId: number): Promise<VideoRating[]>;
  addVideoRating(rating: InsertVideoRating): Promise<VideoRating>;
  getAverageVideoRating(videoId: number): Promise<number>;
  getVideoComments(videoId: number): Promise<VideoComment[]>;
  addVideoComment(comment: InsertVideoComment): Promise<VideoComment>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoriesBySubject(subject: string): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Video Exercises
  getVideoExercises(videoId: number): Promise<Question[]>;
  addVideoExercise(videoExercise: InsertVideoExercise): Promise<VideoExercise>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subjects: Map<number, Subject>;
  private questions: Map<number, Question>;
  private studyMaterials: Map<number, StudyMaterial>;
  private userPerformance: Map<number, UserPerformance>;
  private news: Map<number, News>;
  private videoLessons: Map<number, VideoLesson>;
  private videoProgress: Map<number, VideoProgress>;
  private videoRatings: Map<number, VideoRating>;
  private videoComments: Map<number, VideoComment>;
  private categories: Map<number, Category>;
  private videoCategoryRelations: Map<number, VideoCategoryRelation>;
  private videoExercises: Map<number, VideoExercise>;
  
  private currentUserIds: number;
  private currentSubjectIds: number;
  private currentQuestionIds: number;
  private currentMaterialIds: number;
  private currentPerformanceIds: number;
  private currentNewsIds: number;
  private currentVideoLessonIds: number;
  private currentVideoProgressIds: number;
  private currentVideoRatingIds: number;
  private currentVideoCommentIds: number;
  private currentCategoryIds: number;
  private currentVideoCategoryRelationIds: number;
  private currentVideoExerciseIds: number;

  constructor() {
    this.users = new Map();
    this.subjects = new Map();
    this.questions = new Map();
    this.studyMaterials = new Map();
    this.userPerformance = new Map();
    this.news = new Map();
    this.videoLessons = new Map();
    this.videoProgress = new Map();
    this.videoRatings = new Map();
    this.videoComments = new Map();
    this.categories = new Map();
    this.videoCategoryRelations = new Map();
    this.videoExercises = new Map();
    
    this.currentUserIds = 1;
    this.currentSubjectIds = 1;
    this.currentQuestionIds = 1;
    this.currentMaterialIds = 1;
    this.currentPerformanceIds = 1;
    this.currentNewsIds = 1;
    this.currentVideoLessonIds = 1;
    this.currentVideoProgressIds = 1;
    this.currentVideoRatingIds = 1;
    this.currentVideoCommentIds = 1;
    this.currentCategoryIds = 1;
    this.currentVideoCategoryRelationIds = 1;
    this.currentVideoExerciseIds = 1;
    
    // Initialize with some data
    this.initializeData();
  }
  
  private initializeData() {
    // Add sample subjects
    const subjectsData: InsertSubject[] = [
      { code: "portugues", name: "Português", description: "Gramática, interpretação textual e linguística", icon: "book", color: "blue", questionCount: 1127 },
      { code: "matematica", name: "Matemática", description: "Álgebra, geometria, estatística e funções", icon: "calculator", color: "green", questionCount: 1328 },
      { code: "fisica", name: "Física", description: "Mecânica, termodinâmica, óptica e eletromagnetismo", icon: "atom", color: "yellow", questionCount: 832 },
      { code: "quimica", name: "Química", description: "Química orgânica, inorgânica e físico-química", icon: "flask", color: "green", questionCount: 764 },
      { code: "biologia", name: "Biologia", description: "Genética, ecologia, fisiologia e evolução", icon: "leaf", color: "green", questionCount: 892 },
    ];
    
    subjectsData.forEach(subject => this.createSubject(subject));
    
    // Add sample questions
    const questionsData: InsertQuestion[] = [
      {
        examYear: "ENEM 2023",
        subject: "matematica",
        content: "Um pintor pretende fazer uma reprodução do quadro Guernica em uma tela de dimensões 20 cm por 30 cm. A obra, de autoria do espanhol Pablo Picasso, é uma pintura com 3,5 m de altura e 7,8 m de comprimento. A reprodução a ser feita deverá preencher a maior área possível da tela, mantendo a proporção entre as dimensões da obra original.\n\nA escala que deve ser empregada para essa reprodução é:",
        options: [
          { id: "a", text: "1 : 12" },
          { id: "b", text: "1 : 16" },
          { id: "c", text: "1 : 21" },
          { id: "d", text: "1 : 26" },
          { id: "e", text: "1 : 35" }
        ],
        answer: "c",
        explanation: "Para manter a proporção, precisamos encontrar a escala adequada. Temos 7,8m/3,5m = 2,23 (proporção original) e 30cm/20cm = 1,5 (proporção da tela). Calculando a escala para cada dimensão: 350cm/20cm = 17,5 e 780cm/30cm = 26. Como queremos preencher a maior área possível mantendo a proporção, devemos usar a menor escala: 1:21.",
        hasStepByStep: true,
        hasVideo: false,
        difficulty: 3,
        topics: ["geometria", "escala", "proporção"]
      }
    ];
    
    questionsData.forEach(question => this.createQuestion(question));
    
    // Add sample study materials
    const materialsData: InsertStudyMaterial[] = [
      {
        title: "Hereditariedade: o que é, conceitos importantes e como cai no vestibular",
        description: "Nossos olhos, nosso cabelo, a cor da nossa pele e nossa altura. O que tudo isso tem em comum? Todas estas características são herdadas...",
        content: "Conteúdo completo sobre hereditariedade...",
        subject: "biologia",
        topics: ["genética", "hereditariedade", "leis de mendel"],
        image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        readTime: 15
      },
      {
        title: "Equações do 2º grau: resolução passo a passo",
        description: "Aprenda como resolver equações quadráticas utilizando a fórmula de Bhaskara e outros métodos práticos com diversos exemplos...",
        content: "Conteúdo completo sobre equações do 2º grau...",
        subject: "matematica",
        topics: ["álgebra", "equações", "bhaskara"],
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        readTime: 20
      },
      {
        title: "Colocação pronominal: próclise, mesóclise e ênclise",
        description: "Entenda quando utilizar cada tipo de colocação pronominal e quais são as regras que determinam o posicionamento dos pronomes oblíquos...",
        content: "Conteúdo completo sobre colocação pronominal...",
        subject: "portugues",
        topics: ["gramática", "pronomes", "colocação pronominal"],
        image: "https://images.unsplash.com/photo-1455894127589-22f75500213a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        readTime: 15
      }
    ];
    
    materialsData.forEach(material => this.createMaterial(material));
    
    // Add sample news
    const newsData: InsertNews[] = [
      {
        title: "Novas questões de matemática disponíveis",
        description: "Adicionamos mais de 200 novas questões de matemática para você praticar",
        content: "Conteúdo completo da notícia...",
        category: "Atualização",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      },
      {
        title: "Dicas para se preparar para o ENEM",
        description: "Confira nossas dicas para otimizar seus estudos a 3 meses do exame",
        content: "Conteúdo completo da notícia...",
        category: "Dicas de Estudo",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      }
    ];
    
    newsData.forEach(newsItem => this.createNews(newsItem));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserIds++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Subject methods
  async getAllSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }
  
  async getSubjectByCode(code: string): Promise<Subject | undefined> {
    return Array.from(this.subjects.values()).find(
      (subject) => subject.code === code,
    );
  }
  
  async getSubjectDetails(code: string): Promise<any> {
    const subject = await this.getSubjectByCode(code);
    if (!subject) return undefined;
    
    const questions = await this.getQuestionsBySubject(code);
    const materials = await this.getMaterialsBySubject(code);
    
    return {
      ...subject,
      questions: questions.length,
      materials: materials.length,
      progress: Math.floor(Math.random() * 100),
      topPerformance: Math.floor(Math.random() * 100)
    };
  }
  
  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = this.currentSubjectIds++;
    const subject: Subject = { ...insertSubject, id };
    this.subjects.set(id, subject);
    return subject;
  }
  
  // Question methods
  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }
  
  async getQuestionsBySubject(subject: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(
      (question) => question.subject === subject,
    );
  }
  
  async getQuestionById(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }
  
  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionIds++;
    const question: Question = { ...insertQuestion, id, createdAt: new Date() };
    this.questions.set(id, question);
    return question;
  }
  
  // Study Material methods
  async getAllMaterials(): Promise<StudyMaterial[]> {
    return Array.from(this.studyMaterials.values());
  }
  
  async getRecentMaterials(): Promise<StudyMaterial[]> {
    return Array.from(this.studyMaterials.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 3);
  }
  
  async getMaterialsBySubject(subject: string): Promise<StudyMaterial[]> {
    return Array.from(this.studyMaterials.values()).filter(
      (material) => material.subject === subject,
    );
  }
  
  async getMaterialById(id: number): Promise<StudyMaterial | undefined> {
    return this.studyMaterials.get(id);
  }
  
  async createMaterial(insertMaterial: InsertStudyMaterial): Promise<StudyMaterial> {
    const id = this.currentMaterialIds++;
    const material: StudyMaterial = { ...insertMaterial, id, createdAt: new Date() };
    this.studyMaterials.set(id, material);
    return material;
  }
  
  // User Performance methods
  async getUserPerformance(): Promise<any> {
    return {
      overall: {
        questionsResolved: 248,
        correctPercentage: 76,
        hoursStudied: 42,
        streak: 8
      },
      bySubject: [
        { subject: "Português", percentage: 82, color: "#3b82f6" },
        { subject: "Matemática", percentage: 65, color: "#22c55e" },
        { subject: "Física", percentage: 58, color: "#eab308" },
        { subject: "Química", percentage: 72, color: "#22c55e" },
        { subject: "Biologia", percentage: 88, color: "#22c55e" },
        { subject: "História", percentage: 76, color: "#ef4444" },
        { subject: "Geografia", percentage: 70, color: "#f97316" },
      ],
      progress: [
        {
          id: "Acertos",
          color: "#7c3aed",
          data: [
            { x: "Sem 1", y: 65 },
            { x: "Sem 2", y: 68 },
            { x: "Sem 3", y: 72 },
            { x: "Sem 4", y: 76 },
            { x: "Sem 5", y: 74 },
            { x: "Sem 6", y: 80 },
          ]
        },
        {
          id: "Questões",
          color: "#22c55e",
          data: [
            { x: "Sem 1", y: 25 },
            { x: "Sem 2", y: 36 },
            { x: "Sem 3", y: 30 },
            { x: "Sem 4", y: 45 },
            { x: "Sem 5", y: 40 },
            { x: "Sem 6", y: 55 },
          ]
        }
      ]
    };
  }
  
  async getUserPerformanceBySubject(subject: string): Promise<any> {
    const subjectData = {
      "portugues": { percentage: 82, questions: 120, avgTime: "2m 30s" },
      "matematica": { percentage: 65, questions: 85, avgTime: "3m 15s" },
      "fisica": { percentage: 58, questions: 62, avgTime: "2m 45s" },
      "quimica": { percentage: 72, questions: 78, avgTime: "2m 20s" },
      "biologia": { percentage: 88, questions: 90, avgTime: "1m 50s" },
    };
    
    return subjectData[subject] || { percentage: 0, questions: 0, avgTime: "0m 0s" };
  }
  
  async addUserPerformance(insertPerformance: InsertUserPerformance): Promise<UserPerformance> {
    const id = this.currentPerformanceIds++;
    const performance: UserPerformance = { ...insertPerformance, id, attemptDate: new Date() };
    this.userPerformance.set(id, performance);
    return performance;
  }
  
  // News methods
  async getNews(): Promise<News[]> {
    return Array.from(this.news.values())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  
  async getNewsById(id: number): Promise<News | undefined> {
    return this.news.get(id);
  }
  
  async createNews(insertNews: InsertNews): Promise<News> {
    const id = this.currentNewsIds++;
    const newsItem: News = { ...insertNews, id, publishedAt: new Date() };
    this.news.set(id, newsItem);
    return newsItem;
  }
  
  // Video Lessons methods
  async getAllVideoLessons(): Promise<VideoLesson[]> {
    return Array.from(this.videoLessons.values());
  }
  
  async getVideoLessonsBySubject(subject: string): Promise<VideoLesson[]> {
    return Array.from(this.videoLessons.values()).filter(
      (video) => video.subject === subject,
    );
  }
  
  async getVideoLessonsByCategory(categoryId: number): Promise<VideoLesson[]> {
    const relations = Array.from(this.videoCategoryRelations.values())
      .filter(relation => relation.categoryId === categoryId)
      .map(relation => relation.videoId);
      
    return Array.from(this.videoLessons.values()).filter(
      (video) => relations.includes(video.id),
    );
  }
  
  async getRecentVideoLessons(limit: number = 6): Promise<VideoLesson[]> {
    return Array.from(this.videoLessons.values())
      .sort((a, b) => {
        if (a.publishedAt && b.publishedAt) {
          return b.publishedAt.getTime() - a.publishedAt.getTime();
        }
        return 0;
      })
      .slice(0, limit);
  }
  
  async getVideoLessonById(id: number): Promise<VideoLesson | undefined> {
    return this.videoLessons.get(id);
  }
  
  async createVideoLesson(videoLesson: InsertVideoLesson): Promise<VideoLesson> {
    const id = this.currentVideoLessonIds++;
    const video: VideoLesson = { 
      ...videoLesson, 
      id, 
      publishedAt: new Date(),
      viewCount: 0
    };
    this.videoLessons.set(id, video);
    return video;
  }
  
  async incrementVideoViews(id: number): Promise<void> {
    const video = await this.getVideoLessonById(id);
    if (video) {
      video.viewCount += 1;
      this.videoLessons.set(id, video);
    }
  }
  
  // Video Progress methods
  async getVideoProgress(userId: number, videoId: number): Promise<VideoProgress | undefined> {
    return Array.from(this.videoProgress.values()).find(
      (progress) => progress.userId === userId && progress.videoId === videoId,
    );
  }
  
  async updateVideoProgress(userId: number, videoId: number, progress: number): Promise<VideoProgress> {
    let videoProgress = await this.getVideoProgress(userId, videoId);
    
    if (videoProgress) {
      videoProgress.progress = progress;
      videoProgress.lastWatched = new Date();
      // Auto-mark as watched if progress is > 90%
      if (progress > 0.9) {
        videoProgress.watched = true;
      }
      this.videoProgress.set(videoProgress.id, videoProgress);
      return videoProgress;
    }
    
    // Create a new progress entry if none exists
    const id = this.currentVideoProgressIds++;
    videoProgress = { 
      id, 
      userId, 
      videoId, 
      progress, 
      watched: progress > 0.9,
      favorite: false,
      lastWatched: new Date()
    };
    this.videoProgress.set(id, videoProgress);
    return videoProgress;
  }
  
  async setVideoWatched(userId: number, videoId: number, watched: boolean): Promise<VideoProgress> {
    let videoProgress = await this.getVideoProgress(userId, videoId);
    
    if (videoProgress) {
      videoProgress.watched = watched;
      videoProgress.lastWatched = new Date();
      this.videoProgress.set(videoProgress.id, videoProgress);
      return videoProgress;
    }
    
    // Create a new progress entry if none exists
    const id = this.currentVideoProgressIds++;
    videoProgress = { 
      id, 
      userId, 
      videoId, 
      progress: watched ? 1 : 0, 
      watched,
      favorite: false,
      lastWatched: new Date()
    };
    this.videoProgress.set(id, videoProgress);
    return videoProgress;
  }
  
  async toggleVideoFavorite(userId: number, videoId: number): Promise<VideoProgress> {
    let videoProgress = await this.getVideoProgress(userId, videoId);
    
    if (videoProgress) {
      videoProgress.favorite = !videoProgress.favorite;
      this.videoProgress.set(videoProgress.id, videoProgress);
      return videoProgress;
    }
    
    // Create a new progress entry if none exists
    const id = this.currentVideoProgressIds++;
    videoProgress = { 
      id, 
      userId, 
      videoId, 
      progress: 0, 
      watched: false,
      favorite: true,
      lastWatched: new Date()
    };
    this.videoProgress.set(id, videoProgress);
    return videoProgress;
  }
  
  async getFavoriteVideos(userId: number): Promise<VideoLesson[]> {
    const favoriteIds = Array.from(this.videoProgress.values())
      .filter(progress => progress.userId === userId && progress.favorite)
      .map(progress => progress.videoId);
      
    return Array.from(this.videoLessons.values()).filter(
      (video) => favoriteIds.includes(video.id),
    );
  }
  
  async getWatchedVideos(userId: number): Promise<VideoLesson[]> {
    const watchedIds = Array.from(this.videoProgress.values())
      .filter(progress => progress.userId === userId && progress.watched)
      .map(progress => progress.videoId);
      
    return Array.from(this.videoLessons.values()).filter(
      (video) => watchedIds.includes(video.id),
    );
  }
  
  // Video Ratings and Comments methods
  async getVideoRatings(videoId: number): Promise<VideoRating[]> {
    return Array.from(this.videoRatings.values()).filter(
      (rating) => rating.videoId === videoId,
    );
  }
  
  async addVideoRating(rating: InsertVideoRating): Promise<VideoRating> {
    const id = this.currentVideoRatingIds++;
    const videoRating: VideoRating = { ...rating, id, createdAt: new Date() };
    this.videoRatings.set(id, videoRating);
    return videoRating;
  }
  
  async getAverageVideoRating(videoId: number): Promise<number> {
    const ratings = await this.getVideoRatings(videoId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
    return sum / ratings.length;
  }
  
  async getVideoComments(videoId: number): Promise<VideoComment[]> {
    return Array.from(this.videoComments.values())
      .filter(comment => comment.videoId === videoId)
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        return 0;
      });
  }
  
  async addVideoComment(comment: InsertVideoComment): Promise<VideoComment> {
    const id = this.currentVideoCommentIds++;
    const videoComment: VideoComment = { ...comment, id, createdAt: new Date() };
    this.videoComments.set(id, videoComment);
    return videoComment;
  }
  
  // Categories methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoriesBySubject(subject: string): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(
      (category) => category.subject === subject,
    );
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryIds++;
    const newCategory: Category = { ...category, id, createdAt: new Date() };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Video Exercises methods
  async getVideoExercises(videoId: number): Promise<Question[]> {
    const exercisesIds = Array.from(this.videoExercises.values())
      .filter(exercise => exercise.videoId === videoId)
      .sort((a, b) => a.orderInVideo - b.orderInVideo)
      .map(exercise => exercise.questionId);
    
    const questions: Question[] = [];
    for (const id of exercisesIds) {
      const question = await this.getQuestionById(id);
      if (question) questions.push(question);
    }
    
    return questions;
  }
  
  async addVideoExercise(exercise: InsertVideoExercise): Promise<VideoExercise> {
    const id = this.currentVideoExerciseIds++;
    const videoExercise: VideoExercise = { ...exercise, id };
    this.videoExercises.set(id, videoExercise);
    return videoExercise;
  }
}

export const storage = new MemStorage();
