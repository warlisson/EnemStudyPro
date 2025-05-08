import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { ChevronLeft, Edit, Trash, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import PageTitle from "@/components/ui/page-title";

type FlashCard = {
  id: number;
  front: string;
  back: string;
  subject: string;
  difficulty: number | null;
  tags: string[];
  imageUrl?: string | null;
  lastReviewDate?: Date | null;
  nextReviewDate?: Date | null;
  reviewCount: number | null;
};

// Botões para registrar dificuldade da revisão
const DifficultyButtons = ({ onSelect }: { onSelect: (difficulty: number) => void }) => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      <Button 
        onClick={() => onSelect(1)} 
        variant="outline" 
        className="bg-red-100 hover:bg-red-200 text-red-800 border-red-200"
      >
        Muito Difícil
      </Button>
      <Button 
        onClick={() => onSelect(2)} 
        variant="outline" 
        className="bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200"
      >
        Difícil
      </Button>
      <Button 
        onClick={() => onSelect(3)} 
        variant="outline" 
        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200"
      >
        Médio
      </Button>
      <Button 
        onClick={() => onSelect(4)} 
        variant="outline" 
        className="bg-green-100 hover:bg-green-200 text-green-800 border-green-200"
      >
        Fácil
      </Button>
      <Button 
        onClick={() => onSelect(5)} 
        variant="outline" 
        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-200"
      >
        Muito Fácil
      </Button>
    </div>
  );
};

export default function FlashCardDetail() {
  const [_, params] = useRoute<{ id: string }>("/flashcards/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [flipped, setFlipped] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  
  // Obter detalhes do flash card
  const { 
    data: card,
    isLoading,
    error
  } = useQuery({
    queryKey: [`/api/flashcards/${params?.id}`],
    enabled: !!params?.id
  });
  
  // Mutação para registrar a revisão
  const reviewMutation = useMutation({
    mutationFn: async (difficulty: number) => {
      return apiRequest(`/api/flashcards/${params?.id}/review`, {
        method: "POST",
        body: { difficulty },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/flashcards/${params?.id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/flashcards/due'] });
      toast({
        title: "Revisão registrada",
        description: "Sua revisão foi registrada com sucesso.",
      });
      setIsReviewing(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar a revisão. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Mutação para excluir o flash card
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/flashcards/${params?.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flashcards'] });
      toast({
        title: "Flash card excluído",
        description: "O flash card foi excluído com sucesso.",
      });
      setLocation("/flashcards");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o flash card. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Função para registrar a revisão
  const handleReview = (difficulty: number) => {
    reviewMutation.mutate(difficulty);
  };
  
  // Renderizar mensagem de erro
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/flashcards")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <PageTitle 
            title="Flash Card não encontrado" 
            icon={<BrainCircuit className="h-6 w-6" />}
          />
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Flash card não encontrado ou ocorreu um erro ao carregar as informações.
        </div>
      </div>
    );
  }
  
  // Renderizar loading
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/flashcards")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="h-8 w-96 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-96 bg-gray-100 animate-pulse rounded-md"></div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/flashcards")}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <PageTitle 
              title="Detalhes do Flash Card" 
              icon={<BrainCircuit className="h-6 w-6" />}
            />
          </div>
          <div className="flex space-x-2">
            <Link href={`/flashcards/${params?.id}/edit`}>
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
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cartão */}
          <div className="lg:w-2/3">
            <Card 
              className={cn(
                "relative overflow-hidden cursor-pointer hover:shadow-md h-[400px]",
                flipped ? "bg-primary-50" : "bg-white"
              )}
              onClick={() => !isReviewing && setFlipped(!flipped)}
            >
              <CardContent className="h-full flex flex-col items-center justify-center p-8">
                <div className={cn(
                  "transition-all duration-500 w-full text-center", 
                  flipped ? "opacity-0 absolute" : "opacity-100"
                )}>
                  <h2 className="text-2xl font-semibold mb-6">{card.front}</h2>
                  {card.imageUrl && (
                    <div className="mt-4 flex justify-center">
                      <img 
                        src={card.imageUrl} 
                        alt="Flash card imagem" 
                        className="max-h-48 max-w-full rounded-md"
                      />
                    </div>
                  )}
                </div>
                
                <div className={cn(
                  "transition-all duration-500 w-full text-center",
                  flipped ? "opacity-100" : "opacity-0 absolute"
                )}>
                  <h2 className="text-2xl font-semibold mb-6">Resposta</h2>
                  <p className="text-lg">{card.back}</p>
                </div>
                
                {isReviewing && flipped && (
                  <div className="absolute bottom-4 left-0 right-0">
                    <p className="text-center mb-2 text-sm text-muted-foreground">
                      Quão bem você lembrou deste cartão?
                    </p>
                    <DifficultyButtons onSelect={handleReview} />
                  </div>
                )}
              </CardContent>
            </Card>
            
            {!isReviewing && (
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={() => {
                    setIsReviewing(true);
                    setFlipped(true);
                  }}
                  className="w-full max-w-sm"
                  disabled={reviewMutation.isPending}
                >
                  {reviewMutation.isPending ? "Registrando..." : "Iniciar Revisão"}
                </Button>
              </div>
            )}
          </div>
          
          {/* Detalhes */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Informações</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disciplina:</span>
                  <span className="font-medium">{card.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dificuldade:</span>
                  <span className="font-medium">
                    {card.difficulty === 1 && "Muito Fácil"}
                    {card.difficulty === 2 && "Fácil"}
                    {card.difficulty === 3 && "Médio"}
                    {card.difficulty === 4 && "Difícil"}
                    {card.difficulty === 5 && "Muito Difícil"}
                    {(!card.difficulty || card.difficulty < 1 || card.difficulty > 5) && "Não definida"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revisões:</span>
                  <span className="font-medium">{card.reviewCount || 0}</span>
                </div>
                {card.lastReviewDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última revisão:</span>
                    <span className="font-medium">
                      {new Date(card.lastReviewDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                {card.nextReviewDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Próxima revisão:</span>
                    <span className="font-medium">
                      {new Date(card.nextReviewDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {card.tags && card.tags.length > 0 && (
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este flash card.
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
    </div>
  );
}