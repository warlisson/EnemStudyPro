import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  ChevronRight,
  CalendarDays,
  BarChart3,
  FileText,
  Video,
  Lightbulb,
  ChevronLeft,
  Star,
  Loader2,
  ListChecks,
  Coffee,
  Brain,
  Sparkles,
  PlayCircle,
  Circle,
  CheckCircle2,
  PlusCircle,
  Download,
  Share2
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Tipos para os planos de estudo
interface StudyPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  totalHours: number;
  subjects: string[];
  progress: number;
  targetExam: string;
  creator?: {
    name: string;
    avatar?: string;
    role: string;
  };
  difficulty: "Básico" | "Intermediário" | "Avançado";
  featured?: boolean;
  recommended?: boolean;
  enrolledCount?: number;
  rating?: number;
  startDate?: string;
  endDate?: string;
}

// Tipos para as atividades do plano
interface StudyActivity {
  id: string;
  title: string;
  type: "video" | "reading" | "exercise" | "quiz" | "review" | "rest";
  subject?: string;
  duration: number; // em minutos
  status: "completed" | "in-progress" | "pending";
  dueDate?: string;
  description?: string;
  resourceUrl?: string;
}

// Tipo para os dias do plano
interface StudyDay {
  id: string;
  date: string;
  dayNumber: number;
  weekday: string;
  activities: StudyActivity[];
  completed: boolean;
  totalMinutes: number;
}

// Componente principal
export default function PlanoEstudos() {
  const [, navigate] = useLocation();
  const { planId } = useParams();
  const [activeTab, setActiveTab] = useState(planId ? "calendario" : "todos");

  // Mock data para planos de estudo
  const studyPlans: StudyPlan[] = [
    {
      id: "enem-90-dias",
      name: "Plano ENEM - 90 dias",
      description: "Cronograma intensivo para o ENEM com revisão completa de todas as matérias em apenas 3 meses",
      duration: "90 dias",
      totalHours: 360,
      subjects: ["Matemática", "Português", "História", "Geografia", "Física", "Química", "Biologia", "Redação"],
      progress: 0,
      targetExam: "ENEM 2024",
      creator: {
        name: "Equipe Prisma",
        role: "Especialistas ENEM",
        avatar: ""
      },
      difficulty: "Intermediário",
      featured: true,
      enrolledCount: 4582,
      rating: 4.8
    },
    {
      id: "redacao-30-dias",
      name: "Redação ENEM - 30 dias",
      description: "Plano focado em redação para o ENEM. Aprenda a desenvolver textos nota 1000 em apenas um mês",
      duration: "30 dias",
      totalHours: 60,
      subjects: ["Redação"],
      progress: 25,
      targetExam: "ENEM 2024",
      difficulty: "Básico",
      recommended: true,
      enrolledCount: 3241,
      rating: 4.7
    },
    {
      id: "matematica-intensivo",
      name: "Matemática Intensivo",
      description: "Revise todo o conteúdo de matemática para o ENEM com exercícios práticos e videoaulas",
      duration: "45 dias",
      totalHours: 120,
      subjects: ["Matemática"],
      progress: 10,
      targetExam: "ENEM 2024",
      difficulty: "Avançado",
      enrolledCount: 2187,
      rating: 4.6
    },
    {
      id: "ciencias-natureza",
      name: "Ciências da Natureza",
      description: "Plano completo para as disciplinas de Física, Química e Biologia focado em questões do ENEM",
      duration: "60 dias",
      totalHours: 180,
      subjects: ["Física", "Química", "Biologia"],
      progress: 0,
      targetExam: "ENEM 2024",
      difficulty: "Intermediário",
      enrolledCount: 1846,
      rating: 4.5
    },
    {
      id: "ciencias-humanas",
      name: "Ciências Humanas",
      description: "Revise História, Geografia, Filosofia e Sociologia de forma completa para o ENEM",
      duration: "60 dias",
      totalHours: 160,
      subjects: ["História", "Geografia", "Filosofia", "Sociologia"],
      progress: 0,
      targetExam: "ENEM 2024",
      difficulty: "Intermediário",
      enrolledCount: 1675,
      rating: 4.4
    },
    {
      id: "linguagens",
      name: "Linguagens e Códigos",
      description: "Plano de estudos para a área de Linguagens com foco em interpretação de texto e literatura",
      duration: "45 dias",
      totalHours: 90,
      subjects: ["Português", "Literatura", "Inglês", "Espanhol"],
      progress: 0,
      targetExam: "ENEM 2024",
      difficulty: "Básico",
      enrolledCount: 2105,
      rating: 4.5
    }
  ];

  // Mock data para um plano específico
  const studyDays: StudyDay[] = [
    {
      id: "day-1",
      date: "2023-12-22",
      dayNumber: 1,
      weekday: "Segunda-feira",
      completed: true,
      totalMinutes: 240,
      activities: [
        {
          id: "act-1",
          title: "Introdução à Matemática - Funções",
          type: "video",
          subject: "Matemática",
          duration: 45,
          status: "completed",
          resourceUrl: "/video/1"
        },
        {
          id: "act-2",
          title: "Leitura: Funções de 1º e 2º grau",
          type: "reading",
          subject: "Matemática",
          duration: 60,
          status: "completed",
          resourceUrl: "/artigos/1"
        },
        {
          id: "act-3",
          title: "Exercícios de Funções",
          type: "exercise",
          subject: "Matemática",
          duration: 90,
          status: "completed",
          resourceUrl: "/questoes/matematica"
        },
        {
          id: "act-4",
          title: "Pausa para descanso",
          type: "rest",
          duration: 15,
          status: "completed"
        },
        {
          id: "act-5",
          title: "Revisão do dia",
          type: "review",
          duration: 30,
          status: "completed"
        }
      ]
    },
    {
      id: "day-2",
      date: "2023-12-23",
      dayNumber: 2,
      weekday: "Terça-feira",
      completed: true,
      totalMinutes: 240,
      activities: [
        {
          id: "act-6",
          title: "Aula: Interpretação de Textos",
          type: "video",
          subject: "Português",
          duration: 45,
          status: "completed",
          resourceUrl: "/video/2"
        },
        {
          id: "act-7",
          title: "Leitura: Figuras de Linguagem",
          type: "reading",
          subject: "Português",
          duration: 60,
          status: "completed",
          resourceUrl: "/artigos/2"
        },
        {
          id: "act-8",
          title: "Exercícios de Interpretação",
          type: "exercise",
          subject: "Português",
          duration: 90,
          status: "completed",
          resourceUrl: "/questoes/portugues"
        },
        {
          id: "act-9",
          title: "Pausa para descanso",
          type: "rest",
          duration: 15,
          status: "completed"
        },
        {
          id: "act-10",
          title: "Revisão do dia",
          type: "review",
          duration: 30,
          status: "completed"
        }
      ]
    },
    {
      id: "day-3",
      date: "2023-12-24",
      dayNumber: 3,
      weekday: "Quarta-feira",
      completed: false,
      totalMinutes: 240,
      activities: [
        {
          id: "act-11",
          title: "Aula: Mecânica Clássica",
          type: "video",
          subject: "Física",
          duration: 45,
          status: "in-progress",
          resourceUrl: "/video/3"
        },
        {
          id: "act-12",
          title: "Leitura: Leis de Newton",
          type: "reading",
          subject: "Física",
          duration: 60,
          status: "pending",
          resourceUrl: "/artigos/3"
        },
        {
          id: "act-13",
          title: "Exercícios de Mecânica",
          type: "exercise",
          subject: "Física",
          duration: 90,
          status: "pending",
          resourceUrl: "/questoes/fisica"
        },
        {
          id: "act-14",
          title: "Pausa para descanso",
          type: "rest",
          duration: 15,
          status: "pending"
        },
        {
          id: "act-15",
          title: "Revisão do dia",
          type: "review",
          duration: 30,
          status: "pending"
        }
      ]
    },
    {
      id: "day-4",
      date: "2023-12-25",
      dayNumber: 4,
      weekday: "Quinta-feira",
      completed: false,
      totalMinutes: 240,
      activities: [
        {
          id: "act-16",
          title: "Aula: Química Orgânica",
          type: "video",
          subject: "Química",
          duration: 45,
          status: "pending",
          resourceUrl: "/video/4"
        },
        {
          id: "act-17",
          title: "Leitura: Hidrocarbonetos",
          type: "reading",
          subject: "Química",
          duration: 60,
          status: "pending",
          resourceUrl: "/artigos/4"
        },
        {
          id: "act-18",
          title: "Exercícios de Química Orgânica",
          type: "exercise",
          subject: "Química",
          duration: 90,
          status: "pending",
          resourceUrl: "/questoes/quimica"
        },
        {
          id: "act-19",
          title: "Pausa para descanso",
          type: "rest",
          duration: 15,
          status: "pending"
        },
        {
          id: "act-20",
          title: "Revisão do dia",
          type: "review",
          duration: 30,
          status: "pending"
        }
      ]
    }
  ];

  // Filtrar plano específico se houver um ID
  const currentPlan = planId ? studyPlans.find(plan => plan.id === planId) : null;
  
  // Função para obter ícone por tipo de atividade
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'reading':
        return <FileText className="h-4 w-4" />;
      case 'exercise':
        return <BookOpen className="h-4 w-4" />;
      case 'quiz':
        return <Lightbulb className="h-4 w-4" />;
      case 'review':
        return <Brain className="h-4 w-4" />;
      case 'rest':
        return <Coffee className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Função para obter cor por tipo de atividade
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'video':
        return "bg-blue-100 text-blue-800";
      case 'reading':
        return "bg-purple-100 text-purple-800";
      case 'exercise':
        return "bg-green-100 text-green-800";
      case 'quiz':
        return "bg-yellow-100 text-yellow-800";
      case 'review':
        return "bg-indigo-100 text-indigo-800";
      case 'rest':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função para obter ícone por status da atividade
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <Circle className="h-5 w-5 text-gray-300" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  // Função para obter a cor por dificuldade
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico':
        return "bg-green-100 text-green-800";
      case 'Intermediário':
        return "bg-yellow-100 text-yellow-800";
      case 'Avançado':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função para formatar minutos em horas e minutos
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}min`;
    }
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short'
    });
  };

  // Cálculo do progresso total do plano
  const calculateOverallProgress = () => {
    const totalActivities = studyDays.reduce((acc, day) => acc + day.activities.length, 0);
    const completedActivities = studyDays.reduce((acc, day) => 
      acc + day.activities.filter(act => act.status === "completed").length, 0);
    
    return Math.round((completedActivities / totalActivities) * 100);
  };

  // Se não houver ID, mostrar lista de planos
  if (!planId) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Planos de Estudo</h1>
            <p className="text-muted-foreground">
              Cronogramas organizados para preparação completa
            </p>
          </div>
          <Button variant="outline" className="hidden sm:flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar plano personalizado
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="todos">Todos os planos</TabsTrigger>
            <TabsTrigger value="meus">Meus planos</TabsTrigger>
            <TabsTrigger value="recomendados">Recomendados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="todos" className="space-y-4">
            {/* Planos em destaque */}
            {studyPlans.filter(plan => plan.featured).length > 0 && (
              <>
                <h2 className="text-xl font-semibold">Em destaque</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {studyPlans
                    .filter(plan => plan.featured)
                    .map(plan => (
                      <Card 
                        key={plan.id} 
                        className="overflow-hidden border-t-4 border-primary hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/plano-estudos/${plan.id}`)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <Badge className={getDifficultyColor(plan.difficulty)}>
                                {plan.difficulty}
                              </Badge>
                              <Badge variant="outline" className="ml-2">
                                {plan.duration}
                              </Badge>
                            </div>
                            {plan.rating && (
                              <Badge variant="secondary" className="flex items-center">
                                <Star className="h-3 w-3 fill-current mr-1" />
                                {plan.rating}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="mt-2">{plan.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {plan.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {plan.subjects.slice(0, 4).map((subject, i) => (
                                <Badge key={i} variant="outline">{subject}</Badge>
                              ))}
                              {plan.subjects.length > 4 && (
                                <Badge variant="outline">+{plan.subjects.length - 4}</Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <CalendarDays className="h-4 w-4 mr-1" />
                                <span>{plan.duration}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{plan.totalHours} horas</span>
                              </div>
                              {plan.enrolledCount && (
                                <div className="flex items-center">
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  <span>{plan.enrolledCount.toLocaleString()} alunos</span>
                                </div>
                              )}
                            </div>
                            
                            {plan.creator && (
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={plan.creator.avatar} />
                                  <AvatarFallback>{plan.creator.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                  <span className="font-medium">{plan.creator.name}</span>
                                  <span className="text-muted-foreground ml-2">{plan.creator.role}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 border-t">
                          <Button variant="outline" className="w-full">
                            Ver detalhes
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  }
                </div>
              </>
            )}

            {/* Todos os planos */}
            <h2 className="text-xl font-semibold mt-6">Todos os planos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studyPlans.map(plan => (
                <Card 
                  key={plan.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/plano-estudos/${plan.id}`)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(plan.difficulty)}>
                        {plan.difficulty}
                      </Badge>
                      {plan.rating && (
                        <Badge variant="secondary" className="flex items-center">
                          <Star className="h-3 w-3 fill-current mr-1" />
                          {plan.rating}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-2">{plan.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {plan.subjects.slice(0, 3).map((subject, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{subject}</Badge>
                        ))}
                        {plan.subjects.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{plan.subjects.length - 3}</Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{plan.totalHours}h</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <span>{plan.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      Ver detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="meus">
            <div className="flex flex-col items-center justify-center h-64">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhum plano iniciado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não iniciou nenhum plano de estudos
              </p>
              <Button onClick={() => setActiveTab("todos")}>
                Explorar planos disponíveis
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="recomendados">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studyPlans
                .filter(plan => plan.recommended)
                .map(plan => (
                  <Card 
                    key={plan.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/plano-estudos/${plan.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(plan.difficulty)}>
                          {plan.difficulty}
                        </Badge>
                        {plan.rating && (
                          <Badge variant="secondary" className="flex items-center">
                            <Star className="h-3 w-3 fill-current mr-1" />
                            {plan.rating}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg mt-2">{plan.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {plan.subjects.slice(0, 3).map((subject, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{subject}</Badge>
                          ))}
                          {plan.subjects.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{plan.subjects.length - 3}</Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{plan.totalHours}h</span>
                          </div>
                          <div className="flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            <span>{plan.duration}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver detalhes
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {studyPlans.filter(plan => plan.recommended).length === 0 && (
                  <div className="col-span-3 flex flex-col items-center justify-center h-64">
                    <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Sem recomendações ainda</h3>
                    <p className="text-muted-foreground mb-4">
                      Continue utilizando a plataforma para receber recomendações personalizadas
                    </p>
                  </div>
                )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  // Se houver ID, mostrar detalhes do plano
  if (!currentPlan) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h1 className="text-2xl font-bold mb-4">Plano não encontrado</h1>
        <Button onClick={() => navigate("/plano-estudos")}>Voltar para planos</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/plano-estudos")}
          className="flex items-center mb-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para planos
        </Button>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getDifficultyColor(currentPlan.difficulty)}>
                {currentPlan.difficulty}
              </Badge>
              <Badge variant="outline">{currentPlan.duration}</Badge>
              {currentPlan.targetExam && (
                <Badge variant="secondary">{currentPlan.targetExam}</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight">{currentPlan.name}</h1>
            <p className="text-muted-foreground mt-1 max-w-3xl">
              {currentPlan.description}
            </p>
            
            {currentPlan.creator && (
              <div className="flex items-center mt-3">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={currentPlan.creator.avatar} />
                  <AvatarFallback>{currentPlan.creator.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <span className="font-medium">{currentPlan.creator.name}</span>
                  <span className="text-muted-foreground ml-2">{currentPlan.creator.role}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button size="sm">
              Iniciar plano
            </Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
        <div>
          <Tabs defaultValue="calendario" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="calendario" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Calendário
              </TabsTrigger>
              <TabsTrigger value="estatisticas" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Estatísticas
              </TabsTrigger>
              <TabsTrigger value="disciplinas" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Disciplinas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendario" className="space-y-6">
              {/* Progresso geral */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Progresso geral</h3>
                    <Badge variant="outline" className="font-normal">
                      {calculateOverallProgress()}% concluído
                    </Badge>
                  </div>
                  <Progress value={calculateOverallProgress()} className="h-2" />
                </CardContent>
              </Card>
              
              {/* Calendário de atividades */}
              <div className="space-y-6">
                {studyDays.map((day) => (
                  <Card key={day.id} className={day.completed ? "border-l-4 border-l-green-500" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Dia {day.dayNumber}</Badge>
                            <Badge variant={day.completed ? "secondary" : "outline"}>
                              {day.completed ? (
                                <div className="flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Concluído
                                </div>
                              ) : (
                                "Pendente"
                              )}
                            </Badge>
                          </div>
                          <h3 className="font-semibold mt-1">
                            {day.weekday} - {formatDate(day.date)}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Tempo total</p>
                          <p className="font-medium">{formatMinutes(day.totalMinutes)}</p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <Progress 
                          value={day.activities.filter(a => a.status === "completed").length / day.activities.length * 100} 
                          className="h-1.5" 
                        />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <Accordion type="single" collapsible defaultValue={day.completed ? undefined : day.id}>
                        <AccordionItem value={day.id} className="border-0">
                          <AccordionTrigger className="py-2">
                            <span className="text-sm font-medium">Atividades do dia</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              {day.activities.map((activity) => (
                                <div 
                                  key={activity.id} 
                                  className="flex gap-3 p-3 border rounded-md hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex-shrink-0 pt-1">
                                    {getStatusIcon(activity.status)}
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge className={getActivityColor(activity.type)}>
                                            <div className="flex items-center">
                                              {getActivityIcon(activity.type)}
                                              <span className="ml-1 capitalize">
                                                {activity.type === "rest" ? "Descanso" : activity.type}
                                              </span>
                                            </div>
                                          </Badge>
                                          {activity.subject && (
                                            <Badge variant="outline">{activity.subject}</Badge>
                                          )}
                                        </div>
                                        <h4 className="font-medium">{activity.title}</h4>
                                        {activity.description && (
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {activity.description}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex items-center text-sm text-muted-foreground sm:text-right">
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>{formatMinutes(activity.duration)}</span>
                                      </div>
                                    </div>
                                    
                                    {activity.resourceUrl && (
                                      <div className="mt-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="h-8"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(activity.resourceUrl || "");
                                          }}
                                        >
                                          {activity.type === "video" ? (
                                            <>
                                              <PlayCircle className="h-3 w-3 mr-2" />
                                              Assistir aula
                                            </>
                                          ) : activity.type === "reading" ? (
                                            <>
                                              <FileText className="h-3 w-3 mr-2" />
                                              Ler material
                                            </>
                                          ) : (
                                            <>
                                              <BookOpen className="h-3 w-3 mr-2" />
                                              Acessar exercícios
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="estatisticas" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total de horas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-8 w-8 text-primary mr-3" />
                        <div>
                          <p className="text-2xl font-bold">{currentPlan.totalHours}</p>
                          <p className="text-sm text-muted-foreground">horas de estudo</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Conclusão prevista</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CalendarDays className="h-8 w-8 text-primary mr-3" />
                        <div>
                          <p className="text-xl font-bold">90 dias</p>
                          <p className="text-sm text-muted-foreground">a partir do início</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Progresso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ListChecks className="h-8 w-8 text-primary mr-3" />
                        <div>
                          <p className="text-2xl font-bold">{calculateOverallProgress()}%</p>
                          <p className="text-sm text-muted-foreground">do plano concluído</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por disciplinas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { subject: "Matemática", percentage: 25, activities: 32, hours: 80 },
                      { subject: "Português", percentage: 20, activities: 28, hours: 72 },
                      { subject: "Física", percentage: 15, activities: 20, hours: 54 },
                      { subject: "Química", percentage: 15, activities: 18, hours: 54 },
                      { subject: "Biologia", percentage: 10, activities: 14, hours: 36 },
                      { subject: "História", percentage: 8, activities: 12, hours: 28 },
                      { subject: "Geografia", percentage: 7, activities: 10, hours: 24 }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.subject}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.activities} atividades
                            </Badge>
                          </div>
                          <span className="text-sm">
                            {item.hours}h ({item.percentage}%)
                          </span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por tipo de atividade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "video", name: "Vídeo-aulas", percentage: 40, color: "bg-blue-500" },
                      { type: "reading", name: "Leitura", percentage: 25, color: "bg-purple-500" },
                      { type: "exercise", name: "Exercícios", percentage: 30, color: "bg-green-500" },
                      { type: "review", name: "Revisão", percentage: 5, color: "bg-indigo-500" }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {getActivityIcon(item.type)}
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <span className="text-sm">{item.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${item.color}`} 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="disciplinas" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentPlan.subjects.map((subject, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{subject}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Tópicos por disciplina */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Principais tópicos</h4>
                          <div className="flex flex-wrap gap-2">
                            {[
                              subject === "Matemática" ? ["Funções", "Geometria", "Estatística", "Probabilidade"] :
                              subject === "Português" ? ["Interpretação", "Gramática", "Literatura", "Redação"] :
                              subject === "Física" ? ["Mecânica", "Eletricidade", "Ondulatória", "Termologia"] :
                              subject === "Química" ? ["Orgânica", "Geral", "Físico-Química", "Atomística"] :
                              subject === "Biologia" ? ["Genética", "Ecologia", "Fisiologia", "Citologia"] :
                              subject === "História" ? ["Brasil", "Geral", "América", "Guerras"] :
                              ["Climatologia", "Geopolítica", "Cartografia", "Demografia"]
                            ].map((topic, i) => (
                              <Badge key={i} variant="outline">{topic}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* Materiais recomendados */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Materiais recomendados</h4>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-primary" />
                              <span>Apostila completa de {subject}</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <Video className="h-4 w-4 text-primary" />
                              <span>Playlist de vídeo-aulas de {subject}</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <BookOpen className="h-4 w-4 text-primary" />
                              <span>Lista de exercícios resolvidos</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver detalhes da disciplina
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Resumo do plano</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duração</span>
                  <span className="font-medium">{currentPlan.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Horas de estudo</span>
                  <span className="font-medium">{currentPlan.totalHours} horas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disciplinas</span>
                  <span className="font-medium">{currentPlan.subjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dificuldade</span>
                  <Badge className={getDifficultyColor(currentPlan.difficulty)}>
                    {currentPlan.difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">{calculateOverallProgress()}%</span>
                </div>
                <Progress value={calculateOverallProgress()} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3">
              <Button className="w-full">Iniciar plano</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Próximas atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studyDays
                  .flatMap(day => day.activities)
                  .filter(activity => activity.status === "pending")
                  .slice(0, 3)
                  .map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                      <div className="bg-primary-50 rounded-full p-2 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <Badge className={`${getActivityColor(activity.type)} text-xs mb-1`}>
                          {activity.type === "video" ? "Vídeo" : 
                          activity.type === "reading" ? "Leitura" : 
                          activity.type === "exercise" ? "Exercício" : 
                          activity.type === "quiz" ? "Quiz" : 
                          activity.type === "review" ? "Revisão" : "Descanso"}
                        </Badge>
                        <h4 className="text-sm font-medium line-clamp-2">{activity.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatMinutes(activity.duration)}</span>
                          </div>
                          {activity.subject && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span>{activity.subject}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3">
              <Button variant="outline" size="sm" className="w-full">
                Ver todas
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Estatísticas rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2.5">
                    <CalendarDays className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Dias de estudo</p>
                    <p className="text-lg font-medium">{studyDays.length} dias</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2.5">
                    <CheckCircle className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Atividades concluídas</p>
                    <p className="text-lg font-medium">
                      {studyDays.reduce((acc, day) => 
                        acc + day.activities.filter(a => a.status === "completed").length, 0)
                      }/{
                        studyDays.reduce((acc, day) => acc + day.activities.length, 0)
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 rounded-full p-2.5">
                    <Clock className="h-5 w-5 text-yellow-700" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Horas de estudo</p>
                    <p className="text-lg font-medium">
                      {formatMinutes(studyDays.reduce((acc, day) => 
                        acc + day.activities
                          .filter(a => a.status === "completed")
                          .reduce((sum, a) => sum + a.duration, 0), 0
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}