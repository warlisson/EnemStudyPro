// Ajuste os caminhos conforme sua estrutura real
import {
  Exam,
  ExamAttempt,
  ExamQuestion,
  Forum,
  ForumPost,
  ForumThread,
  InsertExamAttempt,
  InsertForum,
  InsertForumPost,
  InsertForumThread,
  Question
} from './types';

class MemStorage {
  private exams = new Map<number, Exam>();
  private examAttempts = new Map<number, ExamAttempt>();
  private examQuestions = new Map<number, ExamQuestion>();

  private forums = new Map<number, Forum>();
  private forumThreads = new Map<number, ForumThread>();
  private forumPosts = new Map<number, ForumPost>();

  private currentExamAttemptIds = 1;
  private currentForumIds = 1;
  private currentForumThreadIds = 1;
  private currentForumPostIds = 1;

  // Métodos

  async removeQuestionFromExam(examId: number, questionId: number): Promise<boolean> {
    const exam = await this.getExamById(examId);
    if (!exam) throw new Error(`Exam with id ${examId} not found`);

    const examQuestionEntry = Array.from(this.examQuestions.entries())
      .find(([_, eq]) => eq.examId === examId && eq.questionId === questionId);

    if (!examQuestionEntry) return false;

    this.examQuestions.delete(examQuestionEntry[0]);

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

    const examQuestions = Array.from(this.examQuestions.values())
      .filter(eq => eq.examId === examId)
      .sort((a, b) => a.order - b.order);

    const questions: Question[] = [];
    for (const eq of examQuestions) {
      const question = await this.getQuestionById(eq.questionId);
      if (question) questions.push(question);
    }

    return questions;
  }

  async reorderQuestionInExam(examId: number, questionId: number, newOrder: number): Promise<boolean> {
    const examQuestionEntry = Array.from(this.examQuestions.entries())
      .find(([_, eq]) => eq.examId === examId && eq.questionId === questionId);

    if (!examQuestionEntry) return false;

    const [id, examQuestion] = examQuestionEntry;

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

  // Forums
  async getAllForums(): Promise<Forum[]> {
    console.log("Tentando carregar todos os fóruns...");
    try {
      if (this.forums.size === 0) {
        console.log("Nenhum fórum encontrado na memória.");
        // Aqui você pode carregar os dados estáticos, se necessário
        const forumsSeedData: Forum[] = [
          {
            id: 1,
            subject: "Tecnologia",
            name: "Desenvolvimento de Software",
            description: "Fórum sobre desenvolvimento de software, programação e boas práticas.",
            createdAt: new Date(),
            threadCount: 0,
            postCount: 0
          },
          {
            id: 2,
            subject: "Educação",
            name: "Ensino Online",
            description: "Discussões sobre educação a distância e recursos de ensino online.",
            createdAt: new Date(),
            threadCount: 0,
            postCount: 0
          }
        ];

        // Carregar os dados estáticos no storage
        forumsSeedData.forEach(forum => this.forums.set(forum.id, forum));

        console.log("Dados estáticos carregados com sucesso:", forumsSeedData);
      }

      // Agora, recuperar os fóruns
      const forums = Array.from(this.forums.values());
      console.log("Fóruns encontrados:", forums);
      return forums;
    } catch (error) {
      console.error("Erro ao tentar carregar os fóruns:", error);
      throw new Error("Erro ao carregar os fóruns.");
    }
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

  async getAllThreads(forumId: number): Promise<ForumThread[]> {
    const forum = await this.getForumById(forumId);
    if (!forum) throw new Error(`Forum with id ${forumId} not found`);

    return Array.from(this.forumThreads.values())
      .filter(thread => thread.forumId === forumId)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

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

  async getPostsByThread(threadId: number): Promise<ForumPost[]> {
    const thread = await this.getThreadById(threadId);
    if (!thread) throw new Error(`Thread with id ${threadId} not found`);

    const updatedThread: ForumThread = {
      ...thread,
      viewCount: thread.viewCount + 1
    };

    this.forumThreads.set(threadId, updatedThread);

    return Array.from(this.forumPosts.values())
      .filter(post => post.threadId === threadId)
      .sort((a, b) => {
        if (a.parentId === null && b.parentId !== null) return -1;
        if (a.parentId !== null && b.parentId === null) return 1;
        if (a.parentId !== b.parentId) return (a.parentId || 0) - (b.parentId || 0);
        return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
      });
  }

  async getPostById(id: number): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }

  async createPost(post: InsertForumPost): Promise<ForumPost> {
    const thread = await this.getThreadById(post.threadId);
    if (!thread) throw new Error(`Thread with id ${post.threadId} not found`);

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

    const updatedThread: ForumThread = {
      ...thread,
      replyCount: thread.replyCount + 1,
      lastReplyAt: createdAt
    };

    this.forumThreads.set(thread.id, updatedThread);

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

  async getAllExams(): Promise<Exam[]> {
    console.log("Tentando carregar todos os exames...");
    try {
      if (this.exams.size === 0) {
        console.log("Nenhum exame encontrado na memória.");

        // Carregar dados estáticos de exames
        const examsSeedData: Exam[] = [
          {
            id: 1,
            name: "Exame de Matemática",
            description: "Exame sobre álgebra, geometria e cálculo.",
            subject: "Matemática",
            createdAt: new Date(),
            updatedAt: new Date(),
            questionCount: 0,
          },
          {
            id: 2,
            name: "Exame de Física",
            description: "Exame sobre mecânica, termodinâmica e ondas.",
            subject: "Física",
            createdAt: new Date(),
            updatedAt: new Date(),
            questionCount: 0,
          }
        ];

        // Carregar os dados estáticos no storage
        examsSeedData.forEach(exam => this.exams.set(exam.id, exam));

        console.log("Dados estáticos de exames carregados com sucesso:", examsSeedData);
      }

      // Agora, recuperar os exames
      const exams = Array.from(this.exams.values());
      console.log("Exames encontrados:", exams);
      return exams;
    } catch (error) {
      console.error("Erro ao tentar carregar os exames:", error);
      throw new Error("Erro ao carregar os exames.");
    }
  }

  // Métodos auxiliares simulados — devem ser implementados corretamente
  async getExamById(examId: number): Promise<Exam | undefined> {
    return this.exams.get(examId);
  }

  async getQuestionById(questionId: number): Promise<Question | undefined> {
    // Simulação — substitua pela lógica real
    return undefined;
  }
}

export const storage = new MemStorage();
