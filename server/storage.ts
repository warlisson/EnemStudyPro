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
  videoExercises, type VideoExercise, type InsertVideoExercise,
  // Novos tipos para Flash Cards
  flashCards, type FlashCard, type InsertFlashCard,
  flashCardDecks, type FlashCardDeck, type InsertFlashCardDeck,
  deckCards, type DeckCard, type InsertDeckCard,
  // Novos tipos para Exames
  exams, type Exam, type InsertExam,
  examQuestions, type ExamQuestion, type InsertExamQuestion,
  examAttempts, type ExamAttempt, type InsertExamAttempt,
  // Novos tipos para Fóruns
  forums, type Forum, type InsertForum,
  forumThreads, type ForumThread, type InsertForumThread,
  forumPosts, type ForumPost, type InsertForumPost,
  type Json
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
  
  // Flash Cards
  getAllFlashCards(userId: number): Promise<FlashCard[]>;
  getFlashCardsBySubject(userId: number, subject: string): Promise<FlashCard[]>;
  getFlashCardById(id: number): Promise<FlashCard | undefined>;
  createFlashCard(flashCard: InsertFlashCard): Promise<FlashCard>;
  updateFlashCard(id: number, data: Partial<InsertFlashCard>): Promise<FlashCard>;
  deleteFlashCard(id: number): Promise<boolean>;
  getDueFlashCards(userId: number, limit?: number): Promise<FlashCard[]>;
  updateFlashCardReviewStatus(id: number, difficulty: number): Promise<FlashCard>;
  
  // Flash Card Decks
  getAllFlashCardDecks(userId: number): Promise<FlashCardDeck[]>;
  getFlashCardDeckById(id: number): Promise<FlashCardDeck | undefined>;
  createFlashCardDeck(deck: InsertFlashCardDeck): Promise<FlashCardDeck>;
  updateFlashCardDeck(id: number, data: Partial<InsertFlashCardDeck>): Promise<FlashCardDeck>;
  deleteFlashCardDeck(id: number): Promise<boolean>;
  getFlashCardDecksBySubject(userId: number, subject: string): Promise<FlashCardDeck[]>;
  getPublicFlashCardDecks(): Promise<FlashCardDeck[]>;
  
  // Deck Cards (Relacionamento entre deck e cards)
  addFlashCardToDeck(deckId: number, cardId: number, order?: number): Promise<DeckCard>;
  removeFlashCardFromDeck(deckId: number, cardId: number): Promise<boolean>;
  getFlashCardsFromDeck(deckId: number): Promise<FlashCard[]>;
  reorderFlashCardInDeck(deckId: number, cardId: number, newOrder: number): Promise<boolean>;
  
  // Exams
  getAllExams(): Promise<Exam[]>;
  getExamById(id: number): Promise<Exam | undefined>;
  createExam(exam: InsertExam): Promise<Exam>;
  updateExam(id: number, data: Partial<InsertExam>): Promise<Exam>;
  deleteExam(id: number): Promise<boolean>;
  getExamsBySubject(subject: string): Promise<Exam[]>;
  getPublicExams(): Promise<Exam[]>;
  
  // Exam Questions
  addQuestionToExam(examQuestion: InsertExamQuestion): Promise<ExamQuestion>;
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
  
  // Novos maps para Flash Cards
  private flashCards: Map<number, FlashCard>;
  private flashCardDecks: Map<number, FlashCardDeck>;
  private deckCards: Map<number, DeckCard>;
  
  // Novos maps para Exams
  private exams: Map<number, Exam>;
  private examQuestions: Map<number, ExamQuestion>;
  private examAttempts: Map<number, ExamAttempt>;
  
  // Novos maps para Forums
  private forums: Map<number, Forum>;
  private forumThreads: Map<number, ForumThread>;
  private forumPosts: Map<number, ForumPost>;
  
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
  
  // Novos IDs counters
  private currentFlashCardIds: number = 1;
  private currentFlashCardDeckIds: number = 1;
  private currentDeckCardIds: number = 1;
  private currentExamIds: number = 1;
  private currentExamQuestionIds: number = 1;
  private currentExamAttemptIds: number = 1;
  private currentForumIds: number = 1;
  private currentForumThreadIds: number = 1;
  private currentForumPostIds: number = 1;

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
    
    // Inicialização dos novos maps
    this.flashCards = new Map();
    this.flashCardDecks = new Map();
    this.deckCards = new Map();
    this.exams = new Map();
    this.examQuestions = new Map();
    this.examAttempts = new Map();
    this.forums = new Map();
    this.forumThreads = new Map();
    this.forumPosts = new Map();
    
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
    
    // Add sample categories
    const categoriesData: InsertCategory[] = [
      {
        name: "Revisão para o ENEM",
        description: "Aulas de revisão com foco no ENEM",
        icon: "graduationCap",
        color: "#3b82f6",
        subject: null
      },
      {
        name: "Exercícios Resolvidos",
        description: "Aulas com resolução passo a passo de exercícios",
        icon: "pencil",
        color: "#22c55e",
        subject: null
      },
      {
        name: "Gramática",
        description: "Aulas sobre regras gramaticais e escrita",
        icon: "book",
        color: "#3b82f6",
        subject: "portugues"
      },
      {
        name: "Álgebra",
        description: "Aulas sobre equações, funções e polinômios",
        icon: "calculator",
        color: "#22c55e",
        subject: "matematica"
      },
      {
        name: "Eletromagnetismo",
        description: "Aulas sobre eletricidade e magnetismo",
        icon: "atom",
        color: "#eab308",
        subject: "fisica"
      }
    ];
    
    const createdCategories = Promise.all(categoriesData.map(category => this.createCategory(category)));
    
    // Add sample video lessons
    const videoLessonsData: InsertVideoLesson[] = [
      {
        title: "Equações do 2º Grau - Teoria e Fórmula de Bhaskara",
        description: "Nesta aula, vamos aprender sobre equações do segundo grau: como identificá-las, o que significa cada termo e como aplicar a fórmula de Bhaskara para encontrar suas raízes.",
        videoUrl: "https://www.youtube.com/watch?v=example1",
        thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        subject: "matematica",
        professor: "Ricardo Oliveira",
        duration: 1800, // 30 minutos
        level: 1, // Básico
        orderInSeries: 1,
        seriesId: 1,
        topics: ["álgebra", "equações", "bhaskara"],
        attachments: [
          { name: "Apostila de Equações", url: "https://example.com/apostila.pdf" },
          { name: "Lista de Exercícios", url: "https://example.com/exercicios.pdf" }
        ]
      },
      {
        title: "Resolução de Equações do 2º Grau - Exercícios Comentados",
        description: "Nesta aula, vamos resolver diversos exercícios de equações do segundo grau, desde os mais simples até problemas mais complexos que caem em vestibulares.",
        videoUrl: "https://www.youtube.com/watch?v=example2",
        thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        subject: "matematica",
        professor: "Ricardo Oliveira",
        duration: 2400, // 40 minutos
        level: 2, // Intermediário
        orderInSeries: 2,
        seriesId: 1,
        topics: ["álgebra", "equações", "bhaskara", "problemas"],
        attachments: [
          { name: "Lista de Exercícios Resolvidos", url: "https://example.com/exercicios-resolvidos.pdf" }
        ]
      },
      {
        title: "Análise Sintática - Sujeito e Predicado",
        description: "Nesta aula, vamos aprender sobre a estrutura básica das orações em português, identificando os diferentes tipos de sujeito e predicado.",
        videoUrl: "https://www.youtube.com/watch?v=example3",
        thumbnailUrl: "https://images.unsplash.com/photo-1455894127589-22f75500213a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        subject: "portugues",
        professor: "Ana Paula Silva",
        duration: 1500, // 25 minutos
        level: 1, // Básico
        orderInSeries: 1,
        seriesId: 2,
        topics: ["gramática", "análise sintática", "sujeito", "predicado"],
        attachments: [
          { name: "Resumo de Análise Sintática", url: "https://example.com/resumo.pdf" }
        ]
      },
      {
        title: "Leis de Newton - Força e Movimento",
        description: "Nesta aula, vamos estudar as três leis de Newton que fundamentam a mecânica clássica, com exemplos práticos e aplicações.",
        videoUrl: "https://www.youtube.com/watch?v=example4",
        thumbnailUrl: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        subject: "fisica",
        professor: "Carlos Mendes",
        duration: 2700, // 45 minutos
        level: 2, // Intermediário
        orderInSeries: null,
        seriesId: null,
        topics: ["mecânica", "leis de newton", "força", "movimento"],
        attachments: [
          { name: "Formulário de Mecânica", url: "https://example.com/formulario.pdf" },
          { name: "Simulações Interativas", url: "https://example.com/simulacoes.html" }
        ]
      },
      {
        title: "Genética Mendeliana - Primeira e Segunda Lei de Mendel",
        description: "Nesta aula, vamos entender os princípios da hereditariedade descobertos por Gregor Mendel, estudando a lei da segregação e a lei da segregação independente.",
        videoUrl: "https://www.youtube.com/watch?v=example5",
        thumbnailUrl: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        subject: "biologia",
        professor: "Marina Costa",
        duration: 3000, // 50 minutos
        level: 3, // Avançado
        orderInSeries: null,
        seriesId: null,
        topics: ["genética", "mendel", "hereditariedade", "alelos"],
        attachments: [
          { name: "Quadro de Cruzamentos", url: "https://example.com/cruzamentos.pdf" }
        ]
      }
    ];
    
    videoLessonsData.forEach(async (videoLesson) => {
      const video = await this.createVideoLesson(videoLesson);
      
      // Associar vídeos às categorias
      if (video.subject === "matematica") {
        const algebraCategory = await this.getCategoriesBySubject("matematica").then(cats => cats[0]);
        if (algebraCategory) {
          await this.addVideoCategoryRelation({
            videoId: video.id,
            categoryId: algebraCategory.id
          });
        }
        
        if (video.title.includes("Exercícios")) {
          const exercisesCategory = (await this.getAllCategories())[1]; // "Exercícios Resolvidos"
          if (exercisesCategory) {
            await this.addVideoCategoryRelation({
              videoId: video.id,
              categoryId: exercisesCategory.id
            });
          }
        }
      } else if (video.subject === "portugues") {
        const grammarCategory = await this.getCategoriesBySubject("portugues").then(cats => cats[0]);
        if (grammarCategory) {
          await this.addVideoCategoryRelation({
            videoId: video.id,
            categoryId: grammarCategory.id
          });
        }
      } else if (video.subject === "fisica") {
        const physicsCategory = await this.getCategoriesBySubject("fisica").then(cats => cats[0]);
        if (physicsCategory) {
          await this.addVideoCategoryRelation({
            videoId: video.id,
            categoryId: physicsCategory.id
          });
        }
      }
      
      // Adicionar à categoria de revisão ENEM para todos os vídeos
      const enemCategory = (await this.getAllCategories())[0]; // "Revisão para o ENEM"
      if (enemCategory) {
        await this.addVideoCategoryRelation({
          videoId: video.id,
          categoryId: enemCategory.id
        });
      }
    });
    
    // Adicionar alguns comentários de exemplo
    setTimeout(async () => {
      const videos = await this.getAllVideoLessons();
      if (videos.length > 0) {
        const firstVideo = videos[0];
        
        this.addVideoComment({
          userId: 1,
          videoId: firstVideo.id,
          content: "Ótima explicação! Muito mais fácil de entender do que no meu colégio.",
          parentId: null,
          isQuestion: false,
          isProfessorResponse: false
        });
        
        this.addVideoComment({
          userId: 1,
          videoId: firstVideo.id,
          content: "Tenho uma dúvida: o delta pode ser negativo? E se for, o que significa?",
          parentId: null,
          isQuestion: true,
          isProfessorResponse: false
        }).then(comment => {
          this.addVideoComment({
            userId: 1,
            videoId: firstVideo.id,
            content: "Ótima pergunta! Quando o delta é negativo, a equação não possui raízes reais, apenas raízes complexas. Isso significa que a parábola que representa a equação não cruza o eixo x em nenhum ponto.",
            parentId: comment.id,
            isQuestion: false,
            isProfessorResponse: true
          });
        });
        
        // Adicionar algumas avaliações
        this.addVideoRating({
          userId: 1,
          videoId: firstVideo.id,
          rating: 5,
          comment: "Excelente aula! O professor explica de forma clara e didática."
        });
        
        this.addVideoRating({
          userId: 2,
          videoId: firstVideo.id,
          rating: 4,
          comment: "Muito boa, mas poderia ter mais exemplos."
        });
      }
    }, 500); // Pequeno delay para garantir que os vídeos já foram criados
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
  
  // Category-Video relation methods
  async addVideoCategoryRelation(relation: InsertVideoCategoryRelation): Promise<VideoCategoryRelation> {
    const id = this.currentVideoCategoryRelationIds++;
    const videoCategoryRelation: VideoCategoryRelation = { ...relation, id };
    this.videoCategoryRelations.set(id, videoCategoryRelation);
    return videoCategoryRelation;
  }
}

export const storage = new MemStorage();
