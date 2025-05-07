import { 
  users, type User, type InsertUser,
  subjects, type Subject, type InsertSubject,
  questions, type Question, type InsertQuestion,
  studyMaterials, type StudyMaterial, type InsertStudyMaterial,
  userPerformance, type UserPerformance, type InsertUserPerformance,
  news, type News, type InsertNews
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subjects: Map<number, Subject>;
  private questions: Map<number, Question>;
  private studyMaterials: Map<number, StudyMaterial>;
  private userPerformance: Map<number, UserPerformance>;
  private news: Map<number, News>;
  
  private currentUserIds: number;
  private currentSubjectIds: number;
  private currentQuestionIds: number;
  private currentMaterialIds: number;
  private currentPerformanceIds: number;
  private currentNewsIds: number;

  constructor() {
    this.users = new Map();
    this.subjects = new Map();
    this.questions = new Map();
    this.studyMaterials = new Map();
    this.userPerformance = new Map();
    this.news = new Map();
    
    this.currentUserIds = 1;
    this.currentSubjectIds = 1;
    this.currentQuestionIds = 1;
    this.currentMaterialIds = 1;
    this.currentPerformanceIds = 1;
    this.currentNewsIds = 1;
    
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
}

export const storage = new MemStorage();
