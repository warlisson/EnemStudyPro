import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Flag, 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type ExamAttempt = {
  id: number;
  examId: number;
  status: string;
  startedAt: Date | null;
  completedAt: Date | null;
  score: number | null;
  timeSpent: number | null;
  answers: Record<string, string>;
};

type Exam = {
  id: number;
  title: string;
  description: string;
  subjects: string[];
  duration: number;
  questionCount: number | null;
  passingScore: number | null;
};

type Question = {
  id: number;
  content: string;
  options: Record<string, string>;
  subject: string;
  examYear: string | null;
  answer: string | null;
  explanation: string | null;
};

type ExamQuestion = {
  id: number;
  examId: number;
  questionId: number;
  order: number | null;
  points: number | null;
  question: Question;
};

export default function ExamAttempt() {
  const [_, params] = useRoute<{ id: string; attemptId: string }>("/exam/:id/attempt/:attemptId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isTimeUpDialogOpen, setIsTimeUpDialogOpen] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  
  const { toast: toastFn } = useToast();
  
  // Obter detalhes do exame
  const { 
    data: exam,
    isLoading: isLoadingExam,
    error: examError
  } = useQuery({
    queryKey: [`/api/exams/${params?.id}`],
    enabled: !!params?.id
  });
  
  // Obter detalhes da tentativa
  const { 
    data: attempt,
    isLoading: isLoadingAttempt,
    error: attemptError
  } = useQuery({
    queryKey: [`/api/exams/${params?.id}/attempts/${params?.attemptId}`],
    enabled: !!params?.id && !!params?.attemptId,
    refetchInterval: 60000, // Atualizar a cada minuto para manter o status sincronizado
  });
  
  // Obter questões do exame
  const { 
    data: examQuestions = [],
    isLoading: isLoadingQuestions,
    error: questionsError 
  } = useQuery({
    queryKey: [`/api/exams/${params?.id}/questions`],
    enabled: !!params?.id
  });
  
  // Mutação para salvar respostas
  const saveAnswersMutation = useMutation({
    mutationFn: async (data: { answers: Record<string, string> }) => {
      return apiRequest(`/api/exams/${params?.id}/attempts/${params?.attemptId}/save`, {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/exams/${params?.id}/attempts/${params?.attemptId}`] });
      toast({
        title: "Respostas salvas",
        description: "Suas respostas foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar suas respostas. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Mutação para finalizar o exame
  const submitExamMutation = useMutation({
    mutationFn: async (data: { answers: Record<string, string> }) => {
      return apiRequest(`/api/exams/${params?.id}/attempts/${params?.attemptId}/submit`, {
        method: "POST",
        body: data,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/exams/${params?.id}/attempts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/exams/${params?.id}/attempts/${params?.attemptId}`] });
      
      // Redirecionar para a página de resultados
      if (data && data.id) {
        setIsSubmitDialogOpen(false);
        setIsReviewMode(true);
        toast({
          title: "Exame concluído",
          description: `Sua pontuação: ${data.score}%`,
        });
      } else {
        setLocation(`/exam/${params?.id}`);
      }
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao finalizar o exame. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Configurar respostas iniciais do usuário e iniciar o temporizador
  useEffect(() => {
    if (attempt && !isLoadingAttempt) {
      // Definir respostas do usuário
      if (attempt.answers) {
        setAnswers(attempt.answers);
      }
      
      // Verificar o status da tentativa
      if (attempt.status === "completed") {
        setIsReviewMode(true);
      }
      
      // Configurar o temporizador
      if (attempt.status === "in_progress" && exam && !isLoadingExam) {
        // Calcular tempo restante em segundos
        const startTime = new Date(attempt.startedAt || Date.now()).getTime();
        const endTime = startTime + (exam.duration * 60 * 1000);
        const now = Date.now();
        const remainingTime = Math.max(0, endTime - now);
        
        setTimeLeft(Math.round(remainingTime / 1000));
        
        // Iniciar temporizador para atualizar o tempo restante
        if (intervalId === null) {
          const id = setInterval(() => {
            setTimeLeft((prevTime) => {
              if (prevTime !== null && prevTime <= 1) {
                // Tempo acabou
                clearInterval(id);
                setIsTimeUpDialogOpen(true);
                return 0;
              }
              return prevTime !== null ? prevTime - 1 : null;
            });
          }, 1000);
          
          setIntervalId(id);
        }
      }
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [attempt, exam, isLoadingAttempt, isLoadingExam, intervalId]);
  
  // Funções para navegação entre questões
  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };
  
  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min(examQuestions.length - 1, prev + 1));
  };
  
  // Função para atualizar resposta de uma questão
  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };
  
  // Função para salvar respostas
  const handleSaveAnswers = () => {
    saveAnswersMutation.mutate({ answers });
  };
  
  // Função para finalizar o exame
  const handleSubmitExam = () => {
    submitExamMutation.mutate({ answers });
  };
  
  // Função para formatar o tempo
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--:--";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  // Verificar se há alguma questão sem resposta
  const unansweredQuestions = examQuestions.filter(
    (q: ExamQuestion) => !answers[q.questionId]
  );
  
  // Renderizar mensagem de erro
  if (examError || attemptError || questionsError) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Ocorreu um erro ao carregar o exame. Por favor, tente novamente mais tarde.
        </div>
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setLocation(`/exam/${params?.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o exame
          </Button>
        </div>
      </div>
    );
  }
  
  // Renderizar loading
  if (isLoadingExam || isLoadingAttempt || isLoadingQuestions) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <div className="h-12 bg-gray-100 animate-pulse rounded-md mb-4"></div>
        <div className="h-8 bg-gray-100 animate-pulse rounded-md mb-4"></div>
        <div className="h-96 bg-gray-100 animate-pulse rounded-md mb-4"></div>
        <div className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
      </div>
    );
  }
  
  // Verificar se há questões
  if (examQuestions.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Este exame não possui questões. Por favor, entre em contato com o suporte.
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setLocation(`/exam/${params?.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o exame
          </Button>
        </div>
      </div>
    );
  }
  
  // Obter questão atual
  const currentQuestion = examQuestions[currentQuestionIndex]?.question;
  const currentQuestionId = examQuestions[currentQuestionIndex]?.questionId;
  const totalQuestions = examQuestions.length;
  const progress = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  
  // Verificar se a questão atual foi respondida
  const isCurrentQuestionAnswered = !!answers[currentQuestionId];
  
  // Verificar se a questão atual está correta (apenas no modo de revisão)
  const isCurrentAnswerCorrect = isReviewMode && 
    answers[currentQuestionId] === currentQuestion?.answer;
  
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center bg-muted p-4 rounded-md">
          <div>
            <h1 className="text-xl font-bold">{exam.title}</h1>
            {!isReviewMode && (
              <p className="text-sm text-muted-foreground">
                Responda todas as {totalQuestions} questões dentro do tempo limite.
              </p>
            )}
            {isReviewMode && (
              <p className="text-sm text-muted-foreground">
                Revisão do exame: veja suas respostas e as respostas corretas.
              </p>
            )}
          </div>
          {!isReviewMode && (
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className={cn(
                "font-mono text-lg",
                timeLeft !== null && timeLeft < 300 && "text-red-600 font-bold"
              )}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
          {isReviewMode && attempt && (
            <div className="text-right">
              <p className="font-semibold">Pontuação: {attempt.score}%</p>
              <p className="text-sm text-muted-foreground">
                {(attempt.score || 0) >= (exam.passingScore || 0) ? "Aprovado" : "Não aprovado"}
              </p>
            </div>
          )}
        </div>
        
        {/* Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Questão {currentQuestionIndex + 1} de {totalQuestions}</span>
            <span>
              {Object.keys(answers).length} de {totalQuestions} respondidas
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Questão */}
        <Card className="border-2">
          <CardHeader className="bg-muted/50">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Questão {currentQuestionIndex + 1}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {currentQuestion?.subject}
                </Badge>
                {currentQuestion?.examYear && (
                  <Badge variant="outline">
                    ENEM {currentQuestion.examYear}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div 
              className="mb-6" 
              dangerouslySetInnerHTML={{ __html: currentQuestion?.content || "" }}
            />
            
            <RadioGroup 
              value={answers[currentQuestionId] || ""}
              onValueChange={(value) => !isReviewMode && handleAnswerChange(currentQuestionId, value)}
              className="space-y-3"
              disabled={isReviewMode}
            >
              {currentQuestion?.options && Object.entries(currentQuestion.options).map(([key, value]) => (
                <div 
                  key={key} 
                  className={cn(
                    "flex items-center space-x-2 rounded-md border p-4",
                    isReviewMode && answers[currentQuestionId] === key && answers[currentQuestionId] !== currentQuestion.answer && "border-red-500 bg-red-50",
                    isReviewMode && key === currentQuestion.answer && "border-green-500 bg-green-50"
                  )}
                >
                  <RadioGroupItem value={key} id={key} />
                  <Label 
                    htmlFor={key} 
                    className={cn(
                      "flex-1 cursor-pointer",
                      isReviewMode && key === currentQuestion.answer && "font-semibold"
                    )}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{key.toUpperCase()}.</span>
                      <span dangerouslySetInnerHTML={{ __html: value }} />
                      
                      {isReviewMode && key === currentQuestion.answer && (
                        <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                      )}
                      
                      {isReviewMode && answers[currentQuestionId] === key && key !== currentQuestion.answer && (
                        <XCircle className="h-5 w-5 text-red-600 ml-2" />
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            {isReviewMode && currentQuestion?.explanation && (
              <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-md">
                <p className="font-semibold mb-2">Explicação:</p>
                <p dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }} />
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button 
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            <div className="flex space-x-2">
              {!isReviewMode && (
                <Button 
                  variant="outline" 
                  onClick={handleSaveAnswers} 
                  disabled={saveAnswersMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              )}
              
              {currentQuestionIndex === totalQuestions - 1 ? (
                isReviewMode ? (
                  <Button onClick={() => setLocation(`/exam/${params?.id}`)}>
                    <Home className="h-4 w-4 mr-2" />
                    Voltar para o Exame
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setIsSubmitDialogOpen(true)}
                    variant="default"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Finalizar Exame
                  </Button>
                )
              ) : (
                <Button onClick={goToNextQuestion}>
                  Próxima
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
        
        {/* Navegação de questões */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {examQuestions.map((q: ExamQuestion, index: number) => (
            <Button
              key={q.questionId}
              variant={currentQuestionIndex === index ? "default" : "outline"}
              className={cn(
                "h-10 w-10 p-0",
                answers[q.questionId] ? "bg-primary/20" : "",
                isReviewMode && answers[q.questionId] === q.question.answer ? "border-green-500 bg-green-100" : "",
                isReviewMode && answers[q.questionId] && answers[q.questionId] !== q.question.answer ? "border-red-500 bg-red-100" : ""
              )}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Diálogo de confirmação para finalizar o exame */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Exame</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja finalizar o exame? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {unansweredQuestions.length > 0 && (
            <Alert variant="warning" className="my-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Você ainda não respondeu {unansweredQuestions.length} {unansweredQuestions.length === 1 ? 'questão' : 'questões'}.
                {unansweredQuestions.length <= 5 && (
                  <div className="mt-2">
                    Questões não respondidas:{' '}
                    {unansweredQuestions.map((q: ExamQuestion, index: number) => (
                      <span key={q.questionId}>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto"
                          onClick={() => {
                            setCurrentQuestionIndex(examQuestions.findIndex((eq: ExamQuestion) => eq.questionId === q.questionId));
                            setIsSubmitDialogOpen(false);
                          }}
                        >
                          {examQuestions.findIndex((eq: ExamQuestion) => eq.questionId === q.questionId) + 1}
                        </Button>
                        {index < unansweredQuestions.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Continuar Exame
            </Button>
            <Button 
              onClick={handleSubmitExam}
              disabled={submitExamMutation.isPending}
            >
              {submitExamMutation.isPending ? "Finalizando..." : "Finalizar Exame"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de tempo esgotado */}
      <Dialog open={isTimeUpDialogOpen} onOpenChange={setIsTimeUpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tempo Esgotado!</DialogTitle>
            <DialogDescription>
              O tempo para este exame acabou. Suas respostas serão submetidas automaticamente.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              onClick={handleSubmitExam}
              disabled={submitExamMutation.isPending}
            >
              {submitExamMutation.isPending ? "Finalizando..." : "Finalizar Exame"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}