import { 
  User, InsertUser,
  Subject, InsertSubject,
  Question, InsertQuestion,
  StudyMaterial, InsertStudyMaterial,
  UserPerformance, InsertUserPerformance,
  News, InsertNews,
  VideoLesson, InsertVideoLesson,
  VideoProgress, InsertVideoProgress,
  VideoRating, InsertVideoRating,
  VideoComment, InsertVideoComment,
  Category, InsertCategory,
  VideoCategoryRelation, InsertVideoCategoryRelation,
  VideoExercise, InsertVideoExercise,
  FlashCard, InsertFlashCard,
  FlashCardDeck, InsertFlashCardDeck,
  DeckCard, InsertDeckCard,
  Exam, InsertExam, 
  ExamQuestion, InsertExamQuestion,
  ExamAttempt, InsertExamAttempt,
  Forum, InsertForum,
  ForumThread, InsertForumThread,
  ForumPost, InsertForumPost
} from "../shared/schema";

// Interface para o Storage
interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Subjects
  getAllSubjects(): Promise<Subject[]>;
  getSubjectById(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: number, data: Partial<InsertSubject>): Promise<Subject>;
  
  // Questions
  getAllQuestions(): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  getQuestionsBySubject(subjectId: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, data: Partial<InsertQuestion>): Promise<Question>;
  
  // Study Materials
  getAllStudyMaterials(): Promise<StudyMaterial[]>;
  getStudyMaterialById(id: number): Promise<StudyMaterial | undefined>;
  getStudyMaterialsBySubject(subjectId: number): Promise<StudyMaterial[]>;
  createStudyMaterial(material: InsertStudyMaterial): Promise<StudyMaterial>;
  updateStudyMaterial(id: number, data: Partial<InsertStudyMaterial>): Promise<StudyMaterial>;
  getRecentStudyMaterials(limit?: number): Promise<StudyMaterial[]>;
  
  // User Performance
  getUserPerformance(userId: number): Promise<UserPerformance | undefined>;
  createUserPerformance(performance: InsertUserPerformance): Promise<UserPerformance>;
  updateUserPerformance(userId: number, data: Partial<InsertUserPerformance>): Promise<UserPerformance>;
  getUserStatistics(userId: number): Promise<any>;
  
  // News
  getAllNews(): Promise<News[]>;
  getNewsById(id: number): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, data: Partial<InsertNews>): Promise<News>;
  getRecentNews(limit?: number): Promise<News[]>;
  
  // Video Lessons
  getAllVideoLessons(): Promise<VideoLesson[]>;
  getVideoLessonById(id: number): Promise<VideoLesson | undefined>;
  getVideoLessonsBySubject(subjectId: number): Promise<VideoLesson[]>;
  getVideoLessonsByCategory(categoryId: number): Promise<VideoLesson[]>;
  createVideoLesson(video: InsertVideoLesson): Promise<VideoLesson>;
  updateVideoLesson(id: number, data: Partial<InsertVideoLesson>): Promise<VideoLesson>;
  getPopularVideoLessons(limit?: number): Promise<VideoLesson[]>;
  getRecentVideoLessons(limit?: number): Promise<VideoLesson[]>;
  getFavoriteVideoLessons(userId: number): Promise<VideoLesson[]>;
  
  // Video Progress
  getVideoProgress(userId: number, videoId: number): Promise<VideoProgress | undefined>;
  createVideoProgress(progress: InsertVideoProgress): Promise<VideoProgress>;
  updateVideoProgress(userId: number, videoId: number, data: Partial<InsertVideoProgress>): Promise<VideoProgress>;
  getUserVideoProgresses(userId: number): Promise<VideoProgress[]>;
  
  // Video Ratings
  getVideoRating(userId: number, videoId: number): Promise<VideoRating | undefined>;
  createVideoRating(rating: InsertVideoRating): Promise<VideoRating>;
  updateVideoRating(userId: number, videoId: number, data: Partial<InsertVideoRating>): Promise<VideoRating>;
  getVideoRatings(videoId: number): Promise<VideoRating[]>;
  
  // Video Comments
  getVideoComments(videoId: number): Promise<VideoComment[]>;
  getVideoCommentById(id: number): Promise<VideoComment | undefined>;
  createVideoComment(comment: InsertVideoComment): Promise<VideoComment>;
  updateVideoComment(id: number, data: Partial<InsertVideoComment>): Promise<VideoComment>;
  deleteVideoComment(id: number): Promise<boolean>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category>;
  
  // Video Category Relations
  createVideoCategoryRelation(relation: InsertVideoCategoryRelation): Promise<VideoCategoryRelation>;
  getVideoCategoriesByVideo(videoId: number): Promise<Category[]>;
  getVideosByCategory(categoryId: number): Promise<VideoLesson[]>;
  
  // Video Exercises
  getVideoExercises(videoId: number): Promise<VideoExercise[]>;
  getVideoExerciseById(id: number): Promise<VideoExercise | undefined>;
  createVideoExercise(exercise: InsertVideoExercise): Promise<VideoExercise>;
  updateVideoExercise(id: number, data: Partial<InsertVideoExercise>): Promise<VideoExercise>;
  
  // Flash Cards
  getAllFlashCards(): Promise<FlashCard[]>;
  getFlashCardById(id: number): Promise<FlashCard | undefined>;
  createFlashCard(flashCard: InsertFlashCard): Promise<FlashCard>;
  updateFlashCard(id: number, data: Partial<InsertFlashCard>): Promise<FlashCard>;
  getFlashCardsByDeck(deckId: number): Promise<FlashCard[]>;
  
  // Flash Card Decks
  getAllFlashCardDecks(): Promise<FlashCardDeck[]>;
  getFlashCardDeckById(id: number): Promise<FlashCardDeck | undefined>;
  createFlashCardDeck(deck: InsertFlashCardDeck): Promise<FlashCardDeck>;
  updateFlashCardDeck(id: number, data: Partial<InsertFlashCardDeck>): Promise<FlashCardDeck>;
  getFlashCardDecksByUser(userId: number): Promise<FlashCardDeck[]>;
  getPublicFlashCardDecks(): Promise<FlashCardDeck[]>;
  
  // Deck Cards
  addCardToDeck(deckId: number, cardId: number): Promise<DeckCard>;
  removeCardFromDeck(deckId: number, cardId: number): Promise<boolean>;
  
  // Exams
  getAllExams(): Promise<Exam[]>;
  getExamById(id: number): Promise<Exam | undefined>;
  createExam(exam: InsertExam): Promise<Exam>;
  updateExam(id: number, data: Partial<InsertExam>): Promise<Exam>;
  
  // Exam Questions
  addQuestionToExam(examId: number, questionId: number, order?: number, points?: number): Promise<ExamQuestion>;
  removeQuestionFromExam(examId: number, questionId: number): Promise<boolean>;
  getQuestionsFromExam(examId: number): Promise<Question[]>;
  reorderQuestionInExam(examId: number, questionId: number, newOrder: number): Promise<boolean>;
  
  // Exam Attempts
  createExamAttempt(attempt: InsertExamAttempt): Promise<ExamAttempt>;
  updateExamAttempt(id: number, data: Partial<InsertExamAttempt>): Promise<ExamAttempt>;
  getExamAttempt(id: number): Promise<ExamAttempt | undefined>;
  getExamAttemptsByUser(userId: number): Promise<ExamAttempt[]>;
  getExamAttemptsByExam(examId: number): Promise<ExamAttempt[]>;
  getExamAttemptsByUserAndExam(userId: number, examId: number): Promise<ExamAttempt[]>;
  
  // Forums
  getAllForums(): Promise<Forum[]>;
  getForumById(id: number): Promise<Forum | undefined>;
  createForum(forum: InsertForum): Promise<Forum>;
  getForumsBySubject(subject: string): Promise<Forum[]>;
  
  // Forum Threads
  getAllThreads(forumId: number): Promise<ForumThread[]>;
  getThreadById(id: number): Promise<ForumThread | undefined>;
  createThread(thread: InsertForumThread): Promise<ForumThread>;
  updateThread(id: number, data: Partial<InsertForumThread>): Promise<ForumThread>;
  getRecentThreads(limit?: number): Promise<ForumThread[]>;
  
  // Forum Posts
  getPostsByThread(threadId: number): Promise<ForumPost[]>;
  getPostById(id: number): Promise<ForumPost | undefined>;
  createPost(post: InsertForumPost): Promise<ForumPost>;
  updatePost(id: number, data: Partial<InsertForumPost>): Promise<ForumPost>;
  getRecentPosts(limit?: number): Promise<ForumPost[]>;
}

// Implementação em memória para desenvolvimento
class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private subjects = new Map<number, Subject>();
  private questions = new Map<number, Question>();
  private studyMaterials = new Map<number, StudyMaterial>();
  private userPerformance = new Map<number, UserPerformance>();
  private news = new Map<number, News>();
  private videoLessons = new Map<number, VideoLesson>();
  private videoProgress = new Map<string, VideoProgress>();
  private videoRatings = new Map<string, VideoRating>();
  private videoComments = new Map<number, VideoComment>();
  private categories = new Map<number, Category>();
  private videoCategoryRelations = new Map<number, VideoCategoryRelation>();
  private videoExercises = new Map<number, VideoExercise>();
  private flashCards = new Map<number, FlashCard>();
  private flashCardDecks = new Map<number, FlashCardDeck>();
  private deckCards = new Map<number, DeckCard>();
  private exams = new Map<number, Exam>();
  private examQuestions = new Map<number, ExamQuestion>();
  private examAttempts = new Map<number, ExamAttempt>();
  private forums = new Map<number, Forum>();
  private forumThreads = new Map<number, ForumThread>();
  private forumPosts = new Map<number, ForumPost>();
  
  private currentUserId = 2;
  private currentSubjectId = 1;
  private currentQuestionId = 1;
  private currentStudyMaterialId = 1;
  private currentNewsId = 1;
  private currentVideoLessonId = 1;
  private currentVideoCommentId = 1;
  private currentCategoryId = 1;
  private currentVideoCategoryRelationId = 1;
  private currentVideoExerciseId = 1;
  private currentFlashCardId = 1;
  private currentFlashCardDeckId = 1;
  private currentDeckCardId = 1;
  private currentExamId = 1;
  private currentExamQuestionId = 1;
  private currentExamAttemptIds = 1;
  private currentForumIds = 1;
  private currentForumThreadIds = 1;
  private currentForumPostIds = 1;
  
  constructor() {
    // Inicializar dados mockados para desenvolvimento
    this.initializeMockData();
  }
  
  private initializeMockData() {
    // Usuario inicial
    this.users.set(1, {
      id: 1,
      username: "Warlisson Miranda",
      email: "mock@example.com",
      passwordHash: "hashed_password",
      fullName: "Warlisson Miranda",
      bio: "Estudante se preparando para o ENEM",
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-04-20"),
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      isVerified: true,
      preferences: {
        darkMode: false,
        emailNotifications: true,
        pushNotifications: true
      },
      level: 12,
      xp: 3450,
      premium: true
    });
    
    // Criar algumas disciplinas
    const subjects = [
      { id: 1, name: "Matemática", slug: "matematica", description: "Álgebra, geometria, estatística, etc." },
      { id: 2, name: "Português", slug: "portugues", description: "Gramática, interpretação de texto, literatura, etc." },
      { id: 3, name: "Física", slug: "fisica", description: "Mecânica, eletromagnetismo, termodinâmica, etc." },
      { id: 4, name: "Química", slug: "quimica", description: "Química orgânica, inorgânica, físico-química, etc." },
      { id: 5, name: "Biologia", slug: "biologia", description: "Citologia, genética, ecologia, etc." }
    ];
    
    subjects.forEach(subject => {
      this.subjects.set(subject.id, {
        ...subject,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01")
      });
    });
    
    this.currentSubjectId = subjects.length + 1;
    
    // Criar alguns materiais de estudo
    const materials = [
      { 
        id: 1, 
        title: "Hereditariedade: o que é, como funciona", 
        slug: "hereditariedade", 
        content: "A Hereditariedade é o fenômeno que estuda a transmissão das características genéticas de uma geração a outra...",
        subjectId: 5,
        type: "article"
      },
      { 
        id: 2, 
        title: "Funções do 1º Grau: Guia Completo", 
        slug: "funcoes-primeiro-grau", 
        content: "Neste artigo exploraremos os conceitos fundamentais das funções do 1º grau...",
        subjectId: 1,
        type: "article"
      },
      { 
        id: 3, 
        title: "Análise de O Cortiço - Literatura Brasileira", 
        slug: "analise-o-cortico", 
        content: "Neste artigo analisamos a obra 'O Cortiço' de Aluísio Azevedo...",
        subjectId: 2,
        type: "article"
      }
    ];
    
    materials.forEach(material => {
      this.studyMaterials.set(material.id, {
        ...material,
        authorId: 1,
        createdAt: new Date("2023-02-15"),
        updatedAt: new Date("2023-02-15"),
        featured: Math.random() > 0.5,
        readTime: Math.floor(Math.random() * 15) + 5,
        difficulty: Math.floor(Math.random() * 3) + 1
      });
    });
    
    this.currentStudyMaterialId = materials.length + 1;
    
    // Adicionar estatísticas do usuário
    this.userPerformance.set(1, {
      userId: 1,
      questionsResolved: 248,
      correctAnswers: 187,
      wrongAnswers: 61,
      studyTime: 4230,
      lastStudyDate: new Date("2023-04-19"),
      subjectPerformance: {
        "matematica": { correct: 45, total: 62 },
        "portugues": { correct: 52, total: 65 },
        "fisica": { correct: 28, total: 37 },
        "quimica": { correct: 32, total: 39 },
        "biologia": { correct: 30, total: 45 }
      },
      weeklyActivity: {
        "2023-04-13": 45,
        "2023-04-14": 60,
        "2023-04-15": 30,
        "2023-04-16": 0,
        "2023-04-17": 75,
        "2023-04-18": 120,
        "2023-04-19": 90
      },
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-04-19")
    });
    
    // Adicionar algumas notícias
    const newsItems = [
      {
        id: 1,
        title: "Novas questões de matemática disponíveis",
        slug: "novas-questoes-matematica",
        content: "Acabamos de adicionar mais de 100 novas questões de matemática...",
        featured: true,
        imageUrl: "https://example.com/math-banner.jpg"
      },
      {
        id: 2,
        title: "Atualização do cronograma do ENEM 2023",
        slug: "atualizacao-cronograma-enem-2023",
        content: "O INEP divulgou o novo cronograma oficial para o ENEM 2023...",
        featured: true,
        imageUrl: "https://example.com/enem-calendar.jpg"
      }
    ];
    
    newsItems.forEach(item => {
      this.news.set(item.id, {
        ...item,
        authorId: 1,
        createdAt: new Date("2023-04-01"),
        updatedAt: new Date("2023-04-01")
      });
    });
    
    this.currentNewsId = newsItems.length + 1;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    
    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now,
      isVerified: false,
      level: 1,
      xp: 0,
      premium: false
    };
    
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error(`User with id ${id} not found`);
    
    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateStripeCustomerId(id: number, stripeCustomerId: string): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error(`User with id ${id} not found`);
    
    const updatedUser: User = {
      ...user,
      stripeCustomerId,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(id: number, stripeData: any): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error(`User with id ${id} not found`);
    
    const updatedUser: User = {
      ...user,
      stripeCustomerId: stripeData.customerId,
      stripeSubscriptionId: stripeData.subscriptionId,
      premium: true,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Subjects
  async getAllSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }
  
  async getSubjectById(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }
  
  async createSubject(subject: InsertSubject): Promise<Subject> {
    const id = this.currentSubjectId++;
    const now = new Date();
    
    const newSubject: Subject = {
      ...subject,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.subjects.set(id, newSubject);
    return newSubject;
  }
  
  async updateSubject(id: number, data: Partial<InsertSubject>): Promise<Subject> {
    const subject = await this.getSubjectById(id);
    if (!subject) throw new Error(`Subject with id ${id} not found`);
    
    const updatedSubject: Subject = {
      ...subject,
      ...data,
      updatedAt: new Date()
    };
    
    this.subjects.set(id, updatedSubject);
    return updatedSubject;
  }
  
  // Questions
  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }
  
  async getQuestionById(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }
  
  async getQuestionsBySubject(subjectId: number): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(question => question.subjectId === subjectId);
  }
  
  async createQuestion(question: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionId++;
    const now = new Date();
    
    const newQuestion: Question = {
      ...question,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.questions.set(id, newQuestion);
    return newQuestion;
  }
  
  async updateQuestion(id: number, data: Partial<InsertQuestion>): Promise<Question> {
    const question = await this.getQuestionById(id);
    if (!question) throw new Error(`Question with id ${id} not found`);
    
    const updatedQuestion: Question = {
      ...question,
      ...data,
      updatedAt: new Date()
    };
    
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
  }
  
  // Study Materials
  async getAllStudyMaterials(): Promise<StudyMaterial[]> {
    return Array.from(this.studyMaterials.values());
  }
  
  async getStudyMaterialById(id: number): Promise<StudyMaterial | undefined> {
    return this.studyMaterials.get(id);
  }
  
  async getStudyMaterialsBySubject(subjectId: number): Promise<StudyMaterial[]> {
    return Array.from(this.studyMaterials.values())
      .filter(material => material.subjectId === subjectId);
  }
  
  async createStudyMaterial(material: InsertStudyMaterial): Promise<StudyMaterial> {
    const id = this.currentStudyMaterialId++;
    const now = new Date();
    
    const newMaterial: StudyMaterial = {
      ...material,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.studyMaterials.set(id, newMaterial);
    return newMaterial;
  }
  
  async updateStudyMaterial(id: number, data: Partial<InsertStudyMaterial>): Promise<StudyMaterial> {
    const material = await this.getStudyMaterialById(id);
    if (!material) throw new Error(`Study material with id ${id} not found`);
    
    const updatedMaterial: StudyMaterial = {
      ...material,
      ...data,
      updatedAt: new Date()
    };
    
    this.studyMaterials.set(id, updatedMaterial);
    return updatedMaterial;
  }
  
  async getRecentStudyMaterials(limit = 5): Promise<StudyMaterial[]> {
    const materials = Array.from(this.studyMaterials.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return materials.slice(0, limit);
  }
  
  // User Performance
  async getUserPerformance(userId: number): Promise<UserPerformance | undefined> {
    return this.userPerformance.get(userId);
  }
  
  async createUserPerformance(performance: InsertUserPerformance): Promise<UserPerformance> {
    const now = new Date();
    
    const newPerformance: UserPerformance = {
      ...performance,
      createdAt: now,
      updatedAt: now
    };
    
    this.userPerformance.set(performance.userId, newPerformance);
    return newPerformance;
  }
  
  async updateUserPerformance(userId: number, data: Partial<InsertUserPerformance>): Promise<UserPerformance> {
    const performance = await this.getUserPerformance(userId);
    
    if (!performance) {
      return this.createUserPerformance({
        userId,
        questionsResolved: data.questionsResolved || 0,
        correctAnswers: data.correctAnswers || 0,
        wrongAnswers: data.wrongAnswers || 0,
        studyTime: data.studyTime || 0,
        lastStudyDate: data.lastStudyDate || new Date(),
        subjectPerformance: data.subjectPerformance || {},
        weeklyActivity: data.weeklyActivity || {}
      });
    }
    
    const updatedPerformance: UserPerformance = {
      ...performance,
      ...data,
      updatedAt: new Date()
    };
    
    this.userPerformance.set(userId, updatedPerformance);
    return updatedPerformance;
  }
  
  async getUserStatistics(userId: number): Promise<any> {
    const performance = await this.getUserPerformance(userId);
    if (!performance) return null;
    
    // Calcular estatísticas
    const correctPercentage = performance.questionsResolved > 0 
      ? Math.round((performance.correctAnswers / performance.questionsResolved) * 100) 
      : 0;
    
    // Calcular ranking (mockado para agora)
    const ranking = {
      position: 42,
      total: 1250
    };
    
    return {
      questionsResolved: performance.questionsResolved,
      correctPercentage,
      studyTime: performance.studyTime,
      lastStudyDate: performance.lastStudyDate,
      subjectPerformance: performance.subjectPerformance,
      weeklyActivity: performance.weeklyActivity,
      ranking
    };
  }
  
  // Implementar todos os outros métodos conforme a interface
  async getAllNews(): Promise<News[]> {
    return Array.from(this.news.values());
  }
  
  async getNewsById(id: number): Promise<News | undefined> {
    return this.news.get(id);
  }
  
  async createNews(news: InsertNews): Promise<News> {
    const id = this.currentNewsId++;
    const now = new Date();
    
    const newNews: News = {
      ...news,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.news.set(id, newNews);
    return newNews;
  }
  
  async updateNews(id: number, data: Partial<InsertNews>): Promise<News> {
    const news = await this.getNewsById(id);
    if (!news) throw new Error(`News with id ${id} not found`);
    
    const updatedNews: News = {
      ...news,
      ...data,
      updatedAt: new Date()
    };
    
    this.news.set(id, updatedNews);
    return updatedNews;
  }
  
  async getRecentNews(limit = 5): Promise<News[]> {
    const newsItems = Array.from(this.news.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return newsItems.slice(0, limit);
  }
  
  // Video Lessons
  async getAllVideoLessons(): Promise<VideoLesson[]> {
    return Array.from(this.videoLessons.values());
  }
  
  async getVideoLessonById(id: number): Promise<VideoLesson | undefined> {
    return this.videoLessons.get(id);
  }
  
  async getVideoLessonsBySubject(subjectId: number): Promise<VideoLesson[]> {
    return Array.from(this.videoLessons.values())
      .filter(video => video.subjectId === subjectId);
  }
  
  async getVideoLessonsByCategory(categoryId: number): Promise<VideoLesson[]> {
    // Obter as relações para esta categoria
    const relations = Array.from(this.videoCategoryRelations.values())
      .filter(relation => relation.categoryId === categoryId);
    
    // Buscar os vídeos correspondentes
    const videos: VideoLesson[] = [];
    for (const relation of relations) {
      const video = await this.getVideoLessonById(relation.videoId);
      if (video) videos.push(video);
    }
    
    return videos;
  }
  
  async createVideoLesson(video: InsertVideoLesson): Promise<VideoLesson> {
    const id = this.currentVideoLessonId++;
    const now = new Date();
    
    const newVideo: VideoLesson = {
      ...video,
      id,
      createdAt: now,
      updatedAt: now,
      viewCount: 0,
      favoriteCount: 0,
      averageRating: 0
    };
    
    this.videoLessons.set(id, newVideo);
    return newVideo;
  }
  
  async updateVideoLesson(id: number, data: Partial<InsertVideoLesson>): Promise<VideoLesson> {
    const video = await this.getVideoLessonById(id);
    if (!video) throw new Error(`Video lesson with id ${id} not found`);
    
    const updatedVideo: VideoLesson = {
      ...video,
      ...data,
      updatedAt: new Date()
    };
    
    this.videoLessons.set(id, updatedVideo);
    return updatedVideo;
  }
  
  async getPopularVideoLessons(limit = 5): Promise<VideoLesson[]> {
    const videos = Array.from(this.videoLessons.values())
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    
    return videos.slice(0, limit);
  }
  
  async getRecentVideoLessons(limit = 5): Promise<VideoLesson[]> {
    const videos = Array.from(this.videoLessons.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return videos.slice(0, limit);
  }
  
  async getFavoriteVideoLessons(userId: number): Promise<VideoLesson[]> {
    // Implementar favoritação de vídeos
    return [];
  }
  
  // Video Progress
  async getVideoProgress(userId: number, videoId: number): Promise<VideoProgress | undefined> {
    const key = `${userId}-${videoId}`;
    return this.videoProgress.get(key);
  }
  
  async createVideoProgress(progress: InsertVideoProgress): Promise<VideoProgress> {
    const key = `${progress.userId}-${progress.videoId}`;
    const now = new Date();
    
    const newProgress: VideoProgress = {
      ...progress,
      createdAt: now,
      updatedAt: now
    };
    
    this.videoProgress.set(key, newProgress);
    
    // Atualizar contagem de visualizações do vídeo
    const video = await this.getVideoLessonById(progress.videoId);
    if (video) {
      this.videoLessons.set(video.id, {
        ...video,
        viewCount: (video.viewCount || 0) + 1
      });
    }
    
    return newProgress;
  }
  
  async updateVideoProgress(userId: number, videoId: number, data: Partial<InsertVideoProgress>): Promise<VideoProgress> {
    const key = `${userId}-${videoId}`;
    const progress = await this.getVideoProgress(userId, videoId);
    
    if (!progress) {
      return this.createVideoProgress({
        userId,
        videoId,
        currentTime: data.currentTime || 0,
        isCompleted: data.isCompleted || false,
        lastWatched: new Date()
      });
    }
    
    const updatedProgress: VideoProgress = {
      ...progress,
      ...data,
      updatedAt: new Date()
    };
    
    this.videoProgress.set(key, updatedProgress);
    return updatedProgress;
  }
  
  async getUserVideoProgresses(userId: number): Promise<VideoProgress[]> {
    return Array.from(this.videoProgress.values())
      .filter(progress => progress.userId === userId);
  }
  
  // Video Ratings
  async getVideoRating(userId: number, videoId: number): Promise<VideoRating | undefined> {
    const key = `${userId}-${videoId}`;
    return this.videoRatings.get(key);
  }
  
  async createVideoRating(rating: InsertVideoRating): Promise<VideoRating> {
    const key = `${rating.userId}-${rating.videoId}`;
    const now = new Date();
    
    const newRating: VideoRating = {
      ...rating,
      createdAt: now,
      updatedAt: now
    };
    
    this.videoRatings.set(key, newRating);
    
    // Atualizar a classificação média do vídeo
    await this.updateVideoAverageRating(rating.videoId);
    
    return newRating;
  }
  
  async updateVideoRating(userId: number, videoId: number, data: Partial<InsertVideoRating>): Promise<VideoRating> {
    const key = `${userId}-${videoId}`;
    const rating = await this.getVideoRating(userId, videoId);
    
    if (!rating) {
      return this.createVideoRating({
        userId,
        videoId,
        rating: data.rating || 0,
        comment: data.comment || ""
      });
    }
    
    const updatedRating: VideoRating = {
      ...rating,
      ...data,
      updatedAt: new Date()
    };
    
    this.videoRatings.set(key, updatedRating);
    
    // Atualizar a classificação média do vídeo
    await this.updateVideoAverageRating(videoId);
    
    return updatedRating;
  }
  
  private async updateVideoAverageRating(videoId: number): Promise<void> {
    const ratings = await this.getVideoRatings(videoId);
    
    // Calcular a média
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const average = ratings.length > 0 ? sum / ratings.length : 0;
    
    // Atualizar o vídeo
    const video = await this.getVideoLessonById(videoId);
    if (video) {
      this.videoLessons.set(videoId, {
        ...video,
        averageRating: average
      });
    }
  }
  
  async getVideoRatings(videoId: number): Promise<VideoRating[]> {
    return Array.from(this.videoRatings.values())
      .filter(rating => rating.videoId === videoId);
  }
  
  // Video Comments
  async getVideoComments(videoId: number): Promise<VideoComment[]> {
    return Array.from(this.videoComments.values())
      .filter(comment => comment.videoId === videoId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getVideoCommentById(id: number): Promise<VideoComment | undefined> {
    return this.videoComments.get(id);
  }
  
  async createVideoComment(comment: InsertVideoComment): Promise<VideoComment> {
    const id = this.currentVideoCommentId++;
    const now = new Date();
    
    const newComment: VideoComment = {
      ...comment,
      id,
      createdAt: now,
      updatedAt: now,
      likes: 0,
      dislikes: 0
    };
    
    this.videoComments.set(id, newComment);
    return newComment;
  }
  
  async updateVideoComment(id: number, data: Partial<InsertVideoComment>): Promise<VideoComment> {
    const comment = await this.getVideoCommentById(id);
    if (!comment) throw new Error(`Video comment with id ${id} not found`);
    
    const updatedComment: VideoComment = {
      ...comment,
      ...data,
      updatedAt: new Date()
    };
    
    this.videoComments.set(id, updatedComment);
    return updatedComment;
  }
  
  async deleteVideoComment(id: number): Promise<boolean> {
    return this.videoComments.delete(id);
  }
  
  // Categories
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const now = new Date();
    
    const newCategory: Category = {
      ...category,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category> {
    const category = await this.getCategoryById(id);
    if (!category) throw new Error(`Category with id ${id} not found`);
    
    const updatedCategory: Category = {
      ...category,
      ...data,
      updatedAt: new Date()
    };
    
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  // Video Category Relations
  async createVideoCategoryRelation(relation: InsertVideoCategoryRelation): Promise<VideoCategoryRelation> {
    const id = this.currentVideoCategoryRelationId++;
    
    const newRelation: VideoCategoryRelation = {
      ...relation,
      id
    };
    
    this.videoCategoryRelations.set(id, newRelation);
    return newRelation;
  }
  
  async getVideoCategoriesByVideo(videoId: number): Promise<Category[]> {
    // Encontrar todas as relações para este vídeo
    const relationIds = Array.from(this.videoCategoryRelations.values())
      .filter(relation => relation.videoId === videoId)
      .map(relation => relation.categoryId);
    
    // Buscar as categorias correspondentes
    const categories = await Promise.all(
      relationIds.map(id => this.getCategoryById(id))
    );
    
    return categories.filter(Boolean) as Category[];
  }
  
  async getVideosByCategory(categoryId: number): Promise<VideoLesson[]> {
    // Encontrar todas as relações para esta categoria
    const videoIds = Array.from(this.videoCategoryRelations.values())
      .filter(relation => relation.categoryId === categoryId)
      .map(relation => relation.videoId);
    
    // Buscar os vídeos correspondentes
    const videos = await Promise.all(
      videoIds.map(id => this.getVideoLessonById(id))
    );
    
    return videos.filter(Boolean) as VideoLesson[];
  }
  
  // Video Exercises
  async getVideoExercises(videoId: number): Promise<VideoExercise[]> {
    return Array.from(this.videoExercises.values())
      .filter(exercise => exercise.videoId === videoId);
  }
  
  async getVideoExerciseById(id: number): Promise<VideoExercise | undefined> {
    return this.videoExercises.get(id);
  }
  
  async createVideoExercise(exercise: InsertVideoExercise): Promise<VideoExercise> {
    const id = this.currentVideoExerciseId++;
    const now = new Date();
    
    const newExercise: VideoExercise = {
      ...exercise,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.videoExercises.set(id, newExercise);
    return newExercise;
  }
  
  async updateVideoExercise(id: number, data: Partial<InsertVideoExercise>): Promise<VideoExercise> {
    const exercise = await this.getVideoExerciseById(id);
    if (!exercise) throw new Error(`Video exercise with id ${id} not found`);
    
    const updatedExercise: VideoExercise = {
      ...exercise,
      ...data,
      updatedAt: new Date()
    };
    
    this.videoExercises.set(id, updatedExercise);
    return updatedExercise;
  }
  
  // Flash Cards
  async getAllFlashCards(): Promise<FlashCard[]> {
    return Array.from(this.flashCards.values());
  }
  
  async getFlashCardById(id: number): Promise<FlashCard | undefined> {
    return this.flashCards.get(id);
  }
  
  async createFlashCard(flashCard: InsertFlashCard): Promise<FlashCard> {
    const id = this.currentFlashCardId++;
    const now = new Date();
    
    const newFlashCard: FlashCard = {
      ...flashCard,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.flashCards.set(id, newFlashCard);
    return newFlashCard;
  }
  
  async updateFlashCard(id: number, data: Partial<InsertFlashCard>): Promise<FlashCard> {
    const flashCard = await this.getFlashCardById(id);
    if (!flashCard) throw new Error(`Flash card with id ${id} not found`);
    
    const updatedFlashCard: FlashCard = {
      ...flashCard,
      ...data,
      updatedAt: new Date()
    };
    
    this.flashCards.set(id, updatedFlashCard);
    return updatedFlashCard;
  }
  
  async getFlashCardsByDeck(deckId: number): Promise<FlashCard[]> {
    // Encontrar todas as relações deste deck
    const cardRelations = Array.from(this.deckCards.values())
      .filter(relation => relation.deckId === deckId);
    
    // Buscar os flashcards correspondentes
    const cards: FlashCard[] = [];
    for (const relation of cardRelations) {
      const card = await this.getFlashCardById(relation.cardId);
      if (card) cards.push(card);
    }
    
    return cards;
  }
  
  // Flash Card Decks
  async getAllFlashCardDecks(): Promise<FlashCardDeck[]> {
    return Array.from(this.flashCardDecks.values());
  }
  
  async getFlashCardDeckById(id: number): Promise<FlashCardDeck | undefined> {
    return this.flashCardDecks.get(id);
  }
  
  async createFlashCardDeck(deck: InsertFlashCardDeck): Promise<FlashCardDeck> {
    const id = this.currentFlashCardDeckId++;
    const now = new Date();
    
    const newDeck: FlashCardDeck = {
      ...deck,
      id,
      createdAt: now,
      updatedAt: now,
      cardCount: 0
    };
    
    this.flashCardDecks.set(id, newDeck);
    return newDeck;
  }
  
  async updateFlashCardDeck(id: number, data: Partial<InsertFlashCardDeck>): Promise<FlashCardDeck> {
    const deck = await this.getFlashCardDeckById(id);
    if (!deck) throw new Error(`Flash card deck with id ${id} not found`);
    
    const updatedDeck: FlashCardDeck = {
      ...deck,
      ...data,
      updatedAt: new Date()
    };
    
    this.flashCardDecks.set(id, updatedDeck);
    return updatedDeck;
  }
  
  async getFlashCardDecksByUser(userId: number): Promise<FlashCardDeck[]> {
    return Array.from(this.flashCardDecks.values())
      .filter(deck => deck.userId === userId);
  }
  
  async getPublicFlashCardDecks(): Promise<FlashCardDeck[]> {
    return Array.from(this.flashCardDecks.values())
      .filter(deck => deck.isPublic);
  }
  
  // Deck Cards
  async addCardToDeck(deckId: number, cardId: number): Promise<DeckCard> {
    // Verificar se o deck existe
    const deck = await this.getFlashCardDeckById(deckId);
    if (!deck) throw new Error(`Flash card deck with id ${deckId} not found`);
    
    // Verificar se o cartão existe
    const card = await this.getFlashCardById(cardId);
    if (!card) throw new Error(`Flash card with id ${cardId} not found`);
    
    // Verificar se a relação já existe
    const existingRelation = Array.from(this.deckCards.values())
      .find(dc => dc.deckId === deckId && dc.cardId === cardId);
    
    if (existingRelation) return existingRelation;
    
    // Criar a relação
    const id = this.currentDeckCardId++;
    
    const newRelation: DeckCard = {
      id,
      deckId,
      cardId
    };
    
    this.deckCards.set(id, newRelation);
    
    // Atualizar contador de cartões no deck
    this.flashCardDecks.set(deckId, {
      ...deck,
      cardCount: deck.cardCount + 1,
      updatedAt: new Date()
    });
    
    return newRelation;
  }
  
  async removeCardFromDeck(deckId: number, cardId: number): Promise<boolean> {
    // Verificar se o deck existe
    const deck = await this.getFlashCardDeckById(deckId);
    if (!deck) throw new Error(`Flash card deck with id ${deckId} not found`);
    
    // Encontrar a relação
    const relationEntry = Array.from(this.deckCards.entries())
      .find(([_, dc]) => dc.deckId === deckId && dc.cardId === cardId);
    
    if (!relationEntry) return false;
    
    // Remover a relação
    this.deckCards.delete(relationEntry[0]);
    
    // Atualizar contador de cartões no deck
    this.flashCardDecks.set(deckId, {
      ...deck,
      cardCount: Math.max(0, deck.cardCount - 1),
      updatedAt: new Date()
    });
    
    return true;
  }
  
  // Exams
  async getAllExams(): Promise<Exam[]> {
    return Array.from(this.exams.values());
  }
  
  async getExamById(id: number): Promise<Exam | undefined> {
    return this.exams.get(id);
  }
  
  async createExam(exam: InsertExam): Promise<Exam> {
    const id = this.currentExamId++;
    const now = new Date();
    
    const newExam: Exam = {
      ...exam,
      id,
      createdAt: now,
      updatedAt: now,
      questionCount: 0
    };
    
    this.exams.set(id, newExam);
    return newExam;
  }
  
  async updateExam(id: number, data: Partial<InsertExam>): Promise<Exam> {
    const exam = await this.getExamById(id);
    if (!exam) throw new Error(`Exam with id ${id} not found`);
    
    const updatedExam: Exam = {
      ...exam,
      ...data,
      updatedAt: new Date()
    };
    
    this.exams.set(id, updatedExam);
    return updatedExam;
  }
  
  // Exam Questions
  async addQuestionToExam(examId: number, questionId: number, order?: number, points?: number): Promise<ExamQuestion> {
    const exam = await this.getExamById(examId);
    if (!exam) throw new Error(`Exam with id ${examId} not found`);
    
    const question = await this.getQuestionById(questionId);
    if (!question) throw new Error(`Question with id ${questionId} not found`);
    
    // Verificar se a relação já existe
    const existingRelation = Array.from(this.examQuestions.values())
      .find(eq => eq.examId === examId && eq.questionId === questionId);
    
    if (existingRelation) return existingRelation;
    
    // Criar a relação
    const id = this.currentExamQuestionId++;
    
    // Se a ordem não foi especificada, usar a próxima disponível
    const actualOrder = order !== undefined ? order : exam.questionCount;
    
    const newRelation: ExamQuestion = {
      id,
      examId,
      questionId,
      order: actualOrder,
      points: points !== undefined ? points : 1
    };
    
    this.examQuestions.set(id, newRelation);
    
    // Atualizar contador de questões do exame
    this.exams.set(examId, {
      ...exam,
      questionCount: exam.questionCount + 1,
      updatedAt: new Date()
    });
    
    return newRelation;
  }
  
  async removeQuestionFromExam(examId: number, questionId: number): Promise<boolean> {
    const exam = await this.getExamById(examId);
    if (!exam) throw new Error(`Exam with id ${examId} not found`);
    
    // Encontrar a relação
    const examQuestionEntry = Array.from(this.examQuestions.entries())
      .find(([_, eq]) => eq.examId === examId && eq.questionId === questionId);
    
    if (!examQuestionEntry) return false;
    
    // Remover a relação
    this.examQuestions.delete(examQuestionEntry[0]);
    
    // Atualizar contador de questões do exame
    const updatedExam: Exam = {
      ...exam,
      questionCount: Math.max(0, exam.questionCount - 1),
      updatedAt: new Date()
    };
    
    this.exams.set(examId, updatedExam);
    
    return true;
  }
  
  async getQuestionsFromExam(examId: number): Promise<Question[]> {
    const exam = await this.getExamById(examId);
    if (!exam) throw new Error(`Exam with id ${examId} not found`);
    
    // Encontrar todas as relações deste exame
    const examQuestions = Array.from(this.examQuestions.values())
      .filter(eq => eq.examId === examId)
      .sort((a, b) => a.order - b.order);
    
    // Recuperar as questões na ordem correta
    const questions: Question[] = [];
    for (const eq of examQuestions) {
      const question = await this.getQuestionById(eq.questionId);
      if (question) questions.push(question);
    }
    
    return questions;
  }
  
  async reorderQuestionInExam(examId: number, questionId: number, newOrder: number): Promise<boolean> {
    // Encontrar a relação a ser atualizada
    const examQuestionEntry = Array.from(this.examQuestions.entries())
      .find(([_, eq]) => eq.examId === examId && eq.questionId === questionId);
    
    if (!examQuestionEntry) return false;
    
    const [id, examQuestion] = examQuestionEntry;
    
    // Atualizar a ordem
    const updatedExamQuestion: ExamQuestion = {
      ...examQuestion,
      order: newOrder
    };
    
    this.examQuestions.set(id, updatedExamQuestion);
    
    return true;
  }
  
  // Exam Attempts
  async createExamAttempt(attempt: InsertExamAttempt): Promise<ExamAttempt> {
    const id = this.currentExamAttemptIds++;
    const startedAt = attempt.startedAt || new Date();
    
    const newAttempt: ExamAttempt = {
      ...attempt,
      id,
      startedAt,
      completedAt: null,
      status: attempt.status || "in_progress"
    };
    
    this.examAttempts.set(id, newAttempt);
    return newAttempt;
  }
  
  async updateExamAttempt(id: number, data: Partial<InsertExamAttempt>): Promise<ExamAttempt> {
    const attempt = await this.getExamAttempt(id);
    if (!attempt) throw new Error(`Exam attempt with id ${id} not found`);
    
    const updatedAttempt: ExamAttempt = {
      ...attempt,
      ...data
    };
    
    // Se o status está mudando para completado, adicionar timestamp de conclusão
    if (data.status === "completed" && attempt.status !== "completed") {
      updatedAttempt.completedAt = new Date();
    }
    
    this.examAttempts.set(id, updatedAttempt);
    return updatedAttempt;
  }
  
  async getExamAttempt(id: number): Promise<ExamAttempt | undefined> {
    return this.examAttempts.get(id);
  }
  
  async getExamAttemptsByUser(userId: number): Promise<ExamAttempt[]> {
    return Array.from(this.examAttempts.values())
      .filter(attempt => attempt.userId === userId)
      .sort((a, b) => (b.startedAt?.getTime() || 0) - (a.startedAt?.getTime() || 0));
  }
  
  async getExamAttemptsByExam(examId: number): Promise<ExamAttempt[]> {
    return Array.from(this.examAttempts.values())
      .filter(attempt => attempt.examId === examId)
      .sort((a, b) => (b.startedAt?.getTime() || 0) - (a.startedAt?.getTime() || 0));
  }
  
  async getExamAttemptsByUserAndExam(userId: number, examId: number): Promise<ExamAttempt[]> {
    return Array.from(this.examAttempts.values())
      .filter(attempt => attempt.userId === userId && attempt.examId === examId)
      .sort((a, b) => (b.startedAt?.getTime() || 0) - (a.startedAt?.getTime() || 0));
  }

  // ===========================================
  // Forums Implementation
  // ===========================================
  
  async getAllForums(): Promise<Forum[]> {
    return Array.from(this.forums.values());
  }
  
  async getForumById(id: number): Promise<Forum | undefined> {
    return this.forums.get(id);
  }
  
  async createForum(forum: InsertForum): Promise<Forum> {
    const id = this.currentForumIds++;
    const createdAt = new Date();
    
    const newForum: Forum = {
      ...forum,
      id,
      createdAt,
      threadCount: 0,
      postCount: 0
    };
    
    this.forums.set(id, newForum);
    return newForum;
  }
  
  async getForumsBySubject(subject: string): Promise<Forum[]> {
    return Array.from(this.forums.values())
      .filter(forum => forum.subject === subject);
  }
  
  // Forum Threads
  async getAllThreads(forumId: number): Promise<ForumThread[]> {
    const forum = await this.getForumById(forumId);
    if (!forum) throw new Error(`Forum with id ${forumId} not found`);
    
    return Array.from(this.forumThreads.values())
      .filter(thread => thread.forumId === forumId)
      .sort((a, b) => {
        // Primeiro os fixados
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // Depois por data da última resposta ou criação
        const aTime = a.lastReplyAt?.getTime() || a.createdAt?.getTime() || 0;
        const bTime = b.lastReplyAt?.getTime() || b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });
  }
  
  async getThreadById(id: number): Promise<ForumThread | undefined> {
    return this.forumThreads.get(id);
  }
  
  async createThread(thread: InsertForumThread): Promise<ForumThread> {
    const forum = await this.getForumById(thread.forumId);
    if (!forum) throw new Error(`Forum with id ${thread.forumId} not found`);
    
    const id = this.currentForumThreadIds++;
    const createdAt = new Date();
    const updatedAt = new Date();
    
    const newThread: ForumThread = {
      ...thread,
      id,
      createdAt,
      updatedAt,
      viewCount: 0,
      replyCount: 0,
      lastReplyAt: null
    };
    
    this.forumThreads.set(id, newThread);
    
    // Atualizar o contador de threads do fórum
    const updatedForum: Forum = {
      ...forum,
      threadCount: forum.threadCount + 1
    };
    
    this.forums.set(forum.id, updatedForum);
    
    return newThread;
  }
  
  async updateThread(id: number, data: Partial<InsertForumThread>): Promise<ForumThread> {
    const thread = await this.getThreadById(id);
    if (!thread) throw new Error(`Thread with id ${id} not found`);
    
    const updatedThread: ForumThread = {
      ...thread,
      ...data,
      updatedAt: new Date()
    };
    
    this.forumThreads.set(id, updatedThread);
    return updatedThread;
  }
  
  async getRecentThreads(limit?: number): Promise<ForumThread[]> {
    const threads = Array.from(this.forumThreads.values())
      .sort((a, b) => {
        const aTime = a.updatedAt?.getTime() || a.createdAt?.getTime() || 0;
        const bTime = b.updatedAt?.getTime() || b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });
    
    return limit ? threads.slice(0, limit) : threads;
  }
  
  // Forum Posts
  async getPostsByThread(threadId: number): Promise<ForumPost[]> {
    const thread = await this.getThreadById(threadId);
    if (!thread) throw new Error(`Thread with id ${threadId} not found`);
    
    // Incrementar contador de visualizações
    const updatedThread: ForumThread = {
      ...thread,
      viewCount: thread.viewCount + 1
    };
    
    this.forumThreads.set(threadId, updatedThread);
    
    return Array.from(this.forumPosts.values())
      .filter(post => post.threadId === threadId)
      .sort((a, b) => {
        // Organizar respostas em árvore
        if (a.parentId === null && b.parentId !== null) return -1;
        if (a.parentId !== null && b.parentId === null) return 1;
        if (a.parentId !== b.parentId) return (a.parentId || 0) - (b.parentId || 0);
        
        // Ordenar por data de criação
        return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
      });
  }
  
  async getPostById(id: number): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }
  
  async createPost(post: InsertForumPost): Promise<ForumPost> {
    const thread = await this.getThreadById(post.threadId);
    if (!thread) throw new Error(`Thread with id ${post.threadId} not found`);
    
    // Verificar se o parent existe (se for resposta)
    if (post.parentId) {
      const parentPost = await this.getPostById(post.parentId);
      if (!parentPost) throw new Error(`Parent post with id ${post.parentId} not found`);
    }
    
    const id = this.currentForumPostIds++;
    const createdAt = new Date();
    const updatedAt = new Date();
    
    const newPost: ForumPost = {
      ...post,
      id,
      createdAt,
      updatedAt
    };
    
    this.forumPosts.set(id, newPost);
    
    // Atualizar o contador de respostas do thread
    const updatedThread: ForumThread = {
      ...thread,
      replyCount: thread.replyCount + 1,
      lastReplyAt: createdAt
    };
    
    this.forumThreads.set(thread.id, updatedThread);
    
    // Atualizar o contador de posts do fórum
    const forum = await this.getForumById(thread.forumId);
    if (forum) {
      const updatedForum: Forum = {
        ...forum,
        postCount: forum.postCount + 1
      };
      
      this.forums.set(forum.id, updatedForum);
    }
    
    return newPost;
  }
  
  async updatePost(id: number, data: Partial<InsertForumPost>): Promise<ForumPost> {
    const post = await this.getPostById(id);
    if (!post) throw new Error(`Post with id ${id} not found`);
    
    const updatedPost: ForumPost = {
      ...post,
      ...data,
      updatedAt: new Date()
    };
    
    this.forumPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async getRecentPosts(limit?: number): Promise<ForumPost[]> {
    const posts = Array.from(this.forumPosts.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    return limit ? posts.slice(0, limit) : posts;
  }
}

export const storage = new MemStorage();