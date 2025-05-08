import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ClipboardList, 
  Timer, 
  FileText, 
  CheckCircle2,
  ListFilter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import PageTitle from "@/components/ui/page-title";
import EmptyState from "@/components/ui/empty-state";

type Exam = {
  id: number;
  title: string;
  description: string;
  subjects: string[];
  duration: number;
  difficulty: number | null;
  questionCount: number | null;
  isPublic: boolean | null;
  passingScore: number | null;
};

type ExamAttempt = {
  id: number;
  examId: number;
  status: string;
  startedAt: Date | null;
  completedAt: Date | null;
  score: number | null;
  timeSpent: number | null;
};

// Mostrar dificuldade
const DifficultyBadge = ({ difficulty }: { difficulty: number | null }) => {
  if (difficulty === null) return null;
  
  let color = "";
  let label = "";
  
  switch (difficulty) {
    case 1:
      color = "bg-green-100 text-green-800";
      label = "Fácil";
      break;
    case 2:
      color = "bg-blue-100 text-blue-800";
      label = "Médio";
      break;
    case 3:
      color = "bg-yellow-100 text-yellow-800";
      label = "Moderado";
      break;
    case 4:
      color = "bg-orange-100 text-orange-800";
      label = "Difícil";
      break;
    case 5:
      color = "bg-red-100 text-red-800";
      label = "Muito Difícil";
      break;
    default:
      return null;
  }
  
  return (
    <Badge variant="outline" className={cn("ml-2", color)}>
      {label}
    </Badge>
  );
};

// Componente para o Card de Exame
const ExamItem = ({ exam }: { exam: Exam }) => {
  return (
    <Link href={`/exam/${exam.id}`}>
      <Card className="cursor-pointer hover:shadow-md h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-1">{exam.title}</CardTitle>
            <DifficultyBadge difficulty={exam.difficulty} />
          </div>
          <CardDescription className="line-clamp-2 mt-1">
            {exam.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {exam.questionCount || 0} questões
              </span>
              <span className="text-muted-foreground flex items-center">
                <Timer className="h-4 w-4 mr-2" />
                {Math.floor(exam.duration / 60)}h{exam.duration % 60 > 0 ? ` ${exam.duration % 60}m` : ""}
              </span>
            </div>
            
            {exam.passingScore && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Aprovação:</span>
                <Progress value={exam.passingScore} className="h-2" />
                <span className="text-xs font-medium">{exam.passingScore}%</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 border-t">
          <div className="flex flex-wrap gap-1 w-full">
            {exam.subjects && exam.subjects.slice(0, 3).map((subject, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
            {exam.subjects && exam.subjects.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{exam.subjects.length - 3}
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

// Componente para o Card de Tentativa de Exame
const AttemptItem = ({ attempt, exam }: { attempt: ExamAttempt; exam: Exam }) => {
  // Calcular quanto tempo demorou (em minutos)
  const timeSpentMinutes = attempt.timeSpent 
    ? Math.round(attempt.timeSpent / 60) 
    : attempt.status === "in_progress" && attempt.startedAt
      ? Math.round((new Date().getTime() - new Date(attempt.startedAt).getTime()) / 60000)
      : 0;
  
  // Status da tentativa
  const getStatusInfo = () => {
    switch (attempt.status) {
      case "in_progress":
        return {
          label: "Em andamento",
          badgeClass: "bg-blue-100 text-blue-800",
          icon: <Timer className="h-4 w-4 mr-2" />
        };
      case "completed":
        return {
          label: "Concluído",
          badgeClass: "bg-green-100 text-green-800",
          icon: <CheckCircle2 className="h-4 w-4 mr-2" />
        };
      case "abandoned":
        return {
          label: "Abandonado",
          badgeClass: "bg-red-100 text-red-800",
          icon: <FileText className="h-4 w-4 mr-2" />
        };
      default:
        return {
          label: "Desconhecido",
          badgeClass: "bg-gray-100 text-gray-800",
          icon: <FileText className="h-4 w-4 mr-2" />
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <Link href={`/exam/${exam.id}/attempt/${attempt.id}`}>
      <Card className="cursor-pointer hover:shadow-md h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-1">{exam.title}</CardTitle>
            <Badge variant="outline" className={statusInfo.badgeClass}>
              {statusInfo.label}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 mt-1">
            {exam.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Iniciado: {attempt.startedAt ? new Date(attempt.startedAt).toLocaleDateString('pt-BR') : "N/A"}
              </span>
              <span className="text-muted-foreground flex items-center">
                <Timer className="h-4 w-4 mr-2" />
                {timeSpentMinutes} min
              </span>
            </div>
            
            {attempt.status === "completed" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Resultado:</span>
                <Progress 
                  value={attempt.score || 0} 
                  className="h-2" 
                  indicatorClassName={
                    (attempt.score || 0) >= (exam.passingScore || 0) 
                      ? "bg-green-600" 
                      : "bg-red-600"
                  }
                />
                <span className="text-xs font-medium">{attempt.score || 0}%</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 border-t">
          <div className="flex justify-between w-full">
            <span className="text-xs text-muted-foreground">
              {attempt.completedAt 
                ? `Concluído: ${new Date(attempt.completedAt).toLocaleDateString('pt-BR')}` 
                : attempt.status === "in_progress" 
                  ? "Clique para continuar" 
                  : "Clique para ver detalhes"}
            </span>
            
            {exam.passingScore && attempt.score && (
              <Badge variant={attempt.score >= exam.passingScore ? "default" : "destructive"}>
                {attempt.score >= exam.passingScore ? "Aprovado" : "Reprovado"}
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default function Exams() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  // Buscar exames disponíveis
  const { 
    data: exams = [],
    isLoading: isLoadingExams,
    error: examsError 
  } = useQuery({
    queryKey: ['/api/exams'],
    enabled: true
  });

  // Buscar tentativas de exames do usuário
  const { 
    data: attempts = [],
    isLoading: isLoadingAttempts,
    error: attemptsError 
  } = useQuery({
    queryKey: ['/api/exams/attempts/completed'],
    enabled: true
  });
  
  // Buscar exames em andamento
  const { 
    data: inProgressExams = [],
    isLoading: isLoadingInProgress,
    error: inProgressError 
  } = useQuery({
    queryKey: ['/api/exams/attempts/in-progress'],
    enabled: true
  });
  
  // Filtrar e ordenar exames
  const filteredExams = exams.filter((exam: Exam) => {
    const matchesSearch = searchTerm === "" || 
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === "all" || 
      (exam.subjects && exam.subjects.includes(subjectFilter));
    
    const matchesDifficulty = difficultyFilter === "all" || 
      (difficultyFilter === "easy" && (exam.difficulty === 1 || exam.difficulty === 2)) ||
      (difficultyFilter === "medium" && exam.difficulty === 3) ||
      (difficultyFilter === "hard" && (exam.difficulty === 4 || exam.difficulty === 5));
    
    return matchesSearch && matchesSubject && matchesDifficulty;
  });
  
  // Ordenar exames
  const sortedExams = [...filteredExams].sort((a: Exam, b: Exam) => {
    switch (sortBy) {
      case "recent":
        // Ordenar pelo mais recente (id maior)
        return b.id - a.id;
      case "alphabetical":
        // Ordenar por ordem alfabética
        return a.title.localeCompare(b.title);
      case "duration-asc":
        // Ordenar por duração (crescente)
        return a.duration - b.duration;
      case "duration-desc":
        // Ordenar por duração (decrescente)
        return b.duration - a.duration;
      case "difficulty-asc":
        // Ordenar por dificuldade (do mais fácil ao mais difícil)
        return (a.difficulty || 0) - (b.difficulty || 0);
      case "difficulty-desc":
        // Ordenar por dificuldade (do mais difícil ao mais fácil)
        return (b.difficulty || 0) - (a.difficulty || 0);
      default:
        return 0;
    }
  });
  
  // Combinar dados de exames com tentativas para mostrar o histórico
  const attemptHistory = attempts
    .filter((attempt: ExamAttempt) => attempt.status === "completed")
    .map((attempt: ExamAttempt) => {
      const exam = exams.find((e: Exam) => e.id === attempt.examId);
      return { attempt, exam };
    })
    .filter(item => item.exam) // Filtrar tentativas sem exame correspondente
    .sort((a, b) => {
      const dateA = a.attempt.completedAt ? new Date(a.attempt.completedAt).getTime() : 0;
      const dateB = b.attempt.completedAt ? new Date(b.attempt.completedAt).getTime() : 0;
      return dateB - dateA; // Ordenar da mais recente para a mais antiga
    });
  
  // Combinar dados de exames com tentativas em andamento
  const inProgressItems = inProgressExams
    .map((attempt: ExamAttempt) => {
      const exam = exams.find((e: Exam) => e.id === attempt.examId);
      return { attempt, exam };
    })
    .filter(item => item.exam); // Filtrar tentativas sem exame correspondente
  
  // Renderizar mensagem de erro
  if (examsError || attemptsError || inProgressError) {
    return (
      <div className="container max-w-7xl mx-auto py-6">
        <PageTitle 
          title="Simulados" 
          description="Erro ao carregar simulados"
          icon={<ClipboardList className="h-6 w-6" />}
        />
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Ocorreu um erro ao carregar os simulados. Por favor, tente novamente mais tarde.
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <PageTitle 
            title="Simulados" 
            description="Teste seus conhecimentos com simulados completos"
            icon={<ClipboardList className="h-6 w-6" />}
          />
          
          <Link href="/exams/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar Simulado
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue={inProgressItems.length > 0 ? "in-progress" : "exams"} className="w-full">
          <TabsList className="mb-4">
            {inProgressItems.length > 0 && (
              <TabsTrigger value="in-progress">
                Em Andamento
                <Badge className="ml-2 bg-primary">{inProgressItems.length}</Badge>
              </TabsTrigger>
            )}
            <TabsTrigger value="exams">Simulados Disponíveis</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          {/* Exames em andamento */}
          {inProgressItems.length > 0 && (
            <TabsContent value="in-progress" className="w-full">
              {isLoadingInProgress ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-md"></div>
                  ))}
                </div>
              ) : inProgressItems.length === 0 ? (
                <EmptyState
                  icon={<ClipboardList className="h-10 w-10" />}
                  title="Nenhum simulado em andamento"
                  description="Comece um novo simulado para testar seus conhecimentos."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressItems.map(({ attempt, exam }) => (
                    <AttemptItem key={attempt.id} attempt={attempt} exam={exam} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
          
          {/* Exames disponíveis */}
          <TabsContent value="exams" className="w-full">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar simulados..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Select 
                  value={subjectFilter} 
                  onValueChange={setSubjectFilter}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as disciplinas</SelectItem>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="portugues">Português</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                    <SelectItem value="quimica">Química</SelectItem>
                    <SelectItem value="biologia">Biologia</SelectItem>
                    <SelectItem value="historia">História</SelectItem>
                    <SelectItem value="geografia">Geografia</SelectItem>
                    <SelectItem value="filosofia">Filosofia</SelectItem>
                    <SelectItem value="sociologia">Sociologia</SelectItem>
                    <SelectItem value="ingles">Inglês</SelectItem>
                    <SelectItem value="literatura">Literatura</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={difficultyFilter} 
                  onValueChange={setDifficultyFilter}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <ListFilter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as dificuldades</SelectItem>
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                  </SelectContent>
                </Select>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Ordenar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                      <DropdownMenuRadioItem value="recent">Mais recentes</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="alphabetical">Alfabética (A-Z)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="duration-asc">Duração (menor → maior)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="duration-desc">Duração (maior → menor)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="difficulty-asc">Dificuldade (fácil → difícil)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="difficulty-desc">Dificuldade (difícil → fácil)</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {isLoadingExams ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : sortedExams.length === 0 ? (
              <EmptyState
                icon={<ClipboardList className="h-10 w-10" />}
                title="Nenhum simulado encontrado"
                description={searchTerm || subjectFilter !== "all" || difficultyFilter !== "all"
                  ? "Tente alterar os filtros de busca ou criar um novo simulado." 
                  : "Crie seu primeiro simulado para testar seus conhecimentos."}
                action={
                  <Link href="/exams/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Simulado
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedExams.map((exam: Exam) => (
                  <ExamItem key={exam.id} exam={exam} />
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Histórico de tentativas */}
          <TabsContent value="history" className="w-full">
            {isLoadingAttempts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : attemptHistory.length === 0 ? (
              <EmptyState
                icon={<ClipboardList className="h-10 w-10" />}
                title="Nenhum simulado concluído"
                description="Complete um simulado para visualizar seu histórico."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {attemptHistory.map(({ attempt, exam }) => (
                  <AttemptItem key={attempt.id} attempt={attempt} exam={exam} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}