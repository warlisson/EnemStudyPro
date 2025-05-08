import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { 
  ChevronLeft, 
  Play, 
  Clock, 
  FileText, 
  ClipboardList,
  Medal,
  BarChart3,
  Eye,
  Users,
  Calendar,
  BookOpen,
  Edit,
  Trash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import PageTitle from "@/components/ui/page-title";

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
  instructions: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
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

export default function ExamDetail() {
  const [_, params] = useRoute<{ id: string }>("/exam/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStartExamDialogOpen, setIsStartExamDialogOpen] = useState(false);
  const [isLoadingStart, setIsLoadingStart] = useState(false);
  
  // Obter detalhes do exame
  const { 
    data: exam,
    isLoading: isLoadingExam,
    error: examError
  } = useQuery({
    queryKey: [`/api/exams/${params?.id}`],
    enabled: !!params?.id
  });
  
  // Obter tentativas anteriores deste exame
  const { 
    data: attempts = [],
    isLoading: isLoadingAttempts
  } = useQuery({
    queryKey: [`/api/exams/${params?.id}/attempts`],
    enabled: !!params?.id
  });
  
  // Obter média de pontuação de todos os usuários neste exame
  const { 
    data: examStats,
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: [`/api/exams/${params?.id}/stats`],
    enabled: !!params?.id
  });
  
  // Mutação para excluir o exame
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/exams/${params?.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/exams'] });
      toast({
        title: "Exame excluído",
        description: "O exame foi excluído com sucesso.",
      });
      setLocation("/exams");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o exame. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Função para iniciar um novo exame
  const startExam = async () => {
    setIsLoadingStart(true);
    try {
      const response = await apiRequest(`/api/exams/${params?.id}/start`, {
        method: "POST",
      });
      
      if (response && response.attemptId) {
        toast({
          title: "Exame iniciado",
          description: "Boa sorte no seu exame!",
        });
        setLocation(`/exam/${params?.id}/attempt/${response.attemptId}`);
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao iniciar o exame. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingStart(false);
      setIsStartExamDialogOpen(false);
    }
  };
  
  // Formatação do tempo para exibição
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ""}`;
    }
    return `${mins} minutos`;
  };
  
  // Formatação da data para exibição
  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Renderizar mensagem de erro
  if (examError) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/exams")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <PageTitle 
            title="Exame não encontrado" 
            icon={<ClipboardList className="h-6 w-6" />}
          />
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Exame não encontrado ou ocorreu um erro ao carregar as informações.
        </div>
      </div>
    );
  }
  
  // Renderizar loading
  if (isLoadingExam) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/exams")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="h-8 w-96 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-48 bg-gray-100 animate-pulse rounded-md mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Verificar se há uma tentativa em andamento
  const inProgressAttempt = attempts.find((attempt: ExamAttempt) => attempt.status === 'in_progress');
  
  // Ordenar tentativas por data (mais recente primeiro)
  const sortedAttempts = [...attempts].sort((a: ExamAttempt, b: ExamAttempt) => {
    const dateA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
    const dateB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
    return dateB - dateA;
  });
  
  // Melhor pontuação do usuário
  const bestScore = Math.max(...attempts
    .filter((attempt: ExamAttempt) => attempt.status === 'completed' && attempt.score !== null)
    .map((attempt: ExamAttempt) => attempt.score || 0), 0);
  
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/exams")}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <PageTitle 
              title={exam.title} 
              icon={<ClipboardList className="h-6 w-6" />}
            />
          </div>
          <div className="flex space-x-2">
            <Link href={`/exams/${exam.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
        
        <div className="bg-muted p-6 rounded-md">
          <div className="flex flex-col space-y-4">
            <p className="text-muted-foreground">{exam.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Duração</p>
                <p className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {formatDuration(exam.duration)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Questões</p>
                <p className="font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  {exam.questionCount || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nota para aprovação</p>
                <p className="font-medium flex items-center">
                  <Medal className="h-4 w-4 mr-2 text-muted-foreground" />
                  {exam.passingScore || 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dificuldade</p>
                <p className="font-medium">
                  {exam.difficulty === 1 && "Fácil"}
                  {exam.difficulty === 2 && "Médio-Fácil"}
                  {exam.difficulty === 3 && "Médio"}
                  {exam.difficulty === 4 && "Médio-Difícil"}
                  {exam.difficulty === 5 && "Difícil"}
                  {(!exam.difficulty || exam.difficulty < 1 || exam.difficulty > 5) && "Não definida"}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Disciplinas</p>
              <div className="flex flex-wrap gap-2">
                {exam.subjects && exam.subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
            
            {exam.instructions && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Instruções</p>
                <p className="text-sm bg-white p-4 rounded border">{exam.instructions}</p>
              </div>
            )}
            
            <div className="flex justify-center mt-4">
              {inProgressAttempt ? (
                <Link href={`/exam/${exam.id}/attempt/${inProgressAttempt.id}`}>
                  <Button size="lg" className="w-full max-w-md">
                    <Play className="h-4 w-4 mr-2" />
                    Continuar Exame
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full max-w-md"
                  onClick={() => setIsStartExamDialogOpen(true)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Exame
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Estatísticas do usuário */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Seu Desempenho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tentativas:</span>
                  <span className="font-medium">{attempts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Melhor pontuação:</span>
                  <span className="font-medium">{bestScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={bestScore >= (exam.passingScore || 0) ? "default" : "secondary"}>
                    {bestScore >= (exam.passingScore || 0) ? "Aprovado" : "Não aprovado"}
                  </Badge>
                </div>
                
                {bestScore > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Sua melhor nota:</span>
                      <span className="font-medium">{bestScore}%</span>
                    </div>
                    <Progress 
                      value={bestScore} 
                      className="h-2" 
                      indicatorClassName={
                        bestScore >= (exam.passingScore || 0) 
                          ? "bg-green-600" 
                          : "bg-amber-600"
                      }
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>0%</span>
                      <span>{exam.passingScore}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Estatísticas globais */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Estatísticas Gerais
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded mt-4"></div>
                </div>
              ) : examStats ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total de tentativas:</span>
                    <span className="font-medium">{examStats.totalAttempts || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Média de pontuação:</span>
                    <span className="font-medium">{examStats.averageScore || 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de aprovação:</span>
                    <span className="font-medium">{examStats.passRate || 0}%</span>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Pontuação média:</span>
                      <span className="font-medium">{examStats.averageScore || 0}%</span>
                    </div>
                    <Progress 
                      value={examStats.averageScore || 0} 
                      className="h-2"
                      indicatorClassName={
                        (examStats.averageScore || 0) >= (exam.passingScore || 0) 
                          ? "bg-green-600" 
                          : "bg-amber-600"
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  Nenhuma estatística disponível
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Informações adicionais */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Criado em:</span>
                  <span className="font-medium">
                    {exam.createdAt ? new Date(exam.createdAt).toLocaleDateString('pt-BR') : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Atualizado em:</span>
                  <span className="font-medium">
                    {exam.updatedAt ? new Date(exam.updatedAt).toLocaleDateString('pt-BR') : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Visibilidade:</span>
                  <Badge variant="outline">
                    {exam.isPublic ? "Público" : "Privado"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Histórico de tentativas */}
        {(attempts.length > 0 || isLoadingAttempts) && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Histórico de Tentativas
            </h2>
            {isLoadingAttempts ? (
              <div className="h-48 bg-gray-100 animate-pulse rounded-md"></div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableCaption>Histórico de tentativas neste exame</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tempo</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAttempts.map((attempt: ExamAttempt) => (
                      <TableRow key={attempt.id}>
                        <TableCell>{formatDate(attempt.startedAt)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              attempt.status === "completed" 
                                ? (attempt.score || 0) >= (exam.passingScore || 0) 
                                  ? "default" 
                                  : "destructive"
                                : attempt.status === "in_progress" 
                                  ? "secondary" 
                                  : "outline"
                            }
                          >
                            {attempt.status === "completed" && "Concluído"}
                            {attempt.status === "in_progress" && "Em Andamento"}
                            {attempt.status === "abandoned" && "Abandonado"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {attempt.timeSpent 
                            ? `${Math.floor(attempt.timeSpent / 60)}min ${attempt.timeSpent % 60}s`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {attempt.status === "completed" 
                            ? `${attempt.score || 0}%` 
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/exam/${exam.id}/attempt/${attempt.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              {attempt.status === "in_progress" ? "Continuar" : "Ver"}
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este exame e todo seu histórico de tentativas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Diálogo de confirmação para iniciar o exame */}
      <Dialog open={isStartExamDialogOpen} onOpenChange={setIsStartExamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar Exame</DialogTitle>
            <DialogDescription>
              Você está prestes a iniciar o exame "{exam.title}". O cronômetro será iniciado assim que você confirmar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Duração:</span>
              <span>{formatDuration(exam.duration)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Questões:</span>
              <span>{exam.questionCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Nota para aprovação:</span>
              <span>{exam.passingScore || 0}%</span>
            </div>
            
            {exam.instructions && (
              <div className="border rounded-md p-3 bg-muted">
                <p className="font-medium mb-1">Instruções:</p>
                <p className="text-sm">{exam.instructions}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStartExamDialogOpen(false)}>Cancelar</Button>
            <Button onClick={startExam} disabled={isLoadingStart}>
              {isLoadingStart ? "Iniciando..." : "Iniciar Agora"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}