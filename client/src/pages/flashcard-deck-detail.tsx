import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { 
  ChevronLeft, 
  Edit, 
  Trash, 
  BookOpen, 
  Plus, 
  Copy, 
  Play, 
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown
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
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
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
import EmptyState from "@/components/ui/empty-state";

type FlashCard = {
  id: number;
  front: string;
  back: string;
  subject: string;
  difficulty: number | null;
  tags: string[];
  lastReviewDate?: Date | null;
  nextReviewDate?: Date | null;
  reviewCount: number | null;
};

type FlashCardDeck = {
  id: number;
  name: string;
  description: string | null;
  subject: string | null;
  cardCount: number | null;
  isPublic: boolean | null;
  tags: string[];
  coverImage: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

// Componente de Card para um Flash Card
const FlashCardItem = ({ card }: { card: FlashCard }) => {
  const [flipped, setFlipped] = useState(false);
  
  return (
    <div>
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-500 cursor-pointer hover:shadow-md h-[200px]",
          flipped ? "bg-primary-50" : "bg-white"
        )}
        onClick={(e) => {
          e.preventDefault();
          setFlipped(!flipped);
        }}
      >        
        <CardContent className="flex flex-col items-center justify-center h-full p-6">
          <div className={cn(
            "transition-all duration-500 w-full", 
            flipped ? "opacity-0 absolute" : "opacity-100"
          )}>
            <p className="text-lg font-medium text-center">{card.front}</p>
          </div>
          
          <div className={cn(
            "transition-all duration-500 w-full",
            flipped ? "opacity-100" : "opacity-0 absolute"
          )}>
            <p className="text-lg text-center">{card.back}</p>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 border-t flex justify-between items-center">
          <div className="flex space-x-1 overflow-x-auto">
            {card.tags && card.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {card.tags && card.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{card.tags.length - 3}
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {card.difficulty && (
              <Badge variant="outline">
                {card.difficulty === 1 && "Muito Fácil"}
                {card.difficulty === 2 && "Fácil"}
                {card.difficulty === 3 && "Médio"}
                {card.difficulty === 4 && "Difícil"}
                {card.difficulty === 5 && "Muito Difícil"}
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
      <Button 
        variant="link" 
        className="mt-2 px-0 w-full"
        onClick={() => window.location.href = `/flashcards/${card.id}`}
      >
        Ver detalhes
      </Button>
    </div>
  );
};

export default function FlashCardDeckDetail() {
  const [_, params] = useRoute<{ id: string }>("/flashcard-deck/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  
  // Obter detalhes do deck
  const { 
    data: deck = { id: 0, name: "Carregando...", description: null, tags: [] },
    isLoading: isLoadingDeck,
    error: deckError
  } = useQuery({
    queryKey: [`/api/flashcarddecks/${params?.id}`],
    enabled: !!params?.id
  });
  
  // Obter cards do deck
  const { 
    data: cards = [],
    isLoading: isLoadingCards,
    error: cardsError 
  } = useQuery({
    queryKey: [`/api/flashcarddecks/${params?.id}/cards`],
    enabled: !!params?.id
  });
  
  // Mutação para excluir o deck
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/flashcarddecks/${params?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flashcarddecks'] });
      toast({
        title: "Deck excluído",
        description: "O deck foi excluído com sucesso.",
      });
      setLocation("/flashcard-decks");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o deck. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Mutação para clonar o deck
  const cloneMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/flashcarddecks/${params?.id}/clone`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/flashcarddecks'] });
      toast({
        title: "Deck clonado",
        description: "O deck foi clonado com sucesso.",
      });
      setLocation(`/flashcard-deck/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao clonar o deck. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Filtrar e ordenar cards
  const filteredCards = cards.filter((card: FlashCard) => {
    const matchesSearch = searchTerm === "" || 
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) || 
      card.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.tags && card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    return matchesSearch;
  });
  
  // Ordenar cards
  const sortedCards = [...filteredCards].sort((a: FlashCard, b: FlashCard) => {
    switch (sortBy) {
      case "recent":
        // Ordenar pelo mais recente
        return (b.id || 0) - (a.id || 0);
      case "difficulty-asc":
        // Ordenar por dificuldade (do mais fácil ao mais difícil)
        return ((a.difficulty || 0) - (b.difficulty || 0));
      case "difficulty-desc":
        // Ordenar por dificuldade (do mais difícil ao mais fácil)
        return ((b.difficulty || 0) - (a.difficulty || 0));
      case "reviews":
        // Ordenar por número de revisões
        return ((b.reviewCount || 0) - (a.reviewCount || 0));
      default:
        return 0;
    }
  });
  
  // Renderizar mensagem de erro
  if (deckError || cardsError) {
    return (
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/flashcard-decks")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <PageTitle 
            title="Deck não encontrado" 
            icon={<BookOpen className="h-6 w-6" />}
          />
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Deck não encontrado ou ocorreu um erro ao carregar as informações.
        </div>
      </div>
    );
  }
  
  // Renderizar loading
  if (isLoadingDeck) {
    return (
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/flashcard-decks")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="h-8 w-96 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-48 bg-gray-100 animate-pulse rounded-md mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[200px] bg-gray-100 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/flashcard-decks")}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <PageTitle 
              title={deck.name} 
              description={deck.description || ""}
              icon={<BookOpen className="h-6 w-6" />}
            />
          </div>
          <div className="flex space-x-2">
            <DropdownMenu open={isActionMenuOpen} onOpenChange={setIsActionMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Ações do Deck</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setLocation(`/flashcard-deck/${deck.id}/study`)}>
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Estudo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => cloneMutation.mutate()} disabled={cloneMutation.isPending}>
                  <Copy className="h-4 w-4 mr-2" />
                  {cloneMutation.isPending ? "Clonando..." : "Clonar Deck"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation(`/flashcard-deck/${deck.id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Deck
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-red-600 hover:text-red-700 focus:text-red-700"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Excluir Deck
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="sm" onClick={() => setLocation(`/flashcard-deck/${deck.id}/add-card`)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Card
            </Button>
          </div>
        </div>
        
        <div className="bg-muted p-6 rounded-md">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4 md:w-2/3">
              <div>
                <h3 className="font-medium text-lg">Informações</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Disciplina</p>
                    <p className="font-medium">{deck.subject || "Não especificada"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantidade de Cards</p>
                    <p className="font-medium">{deck.cardCount || 0} cards</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Visibilidade</p>
                    <p className="font-medium">{deck.isPublic ? "Público" : "Privado"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Criado em</p>
                    <p className="font-medium">
                      {deck.createdAt ? new Date(deck.createdAt).toLocaleDateString('pt-BR') : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              
              {deck.tags && deck.tags.length > 0 && (
                <div>
                  <h3 className="font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {deck.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {deck.coverImage && (
              <div className="md:w-1/3">
                <img 
                  src={deck.coverImage} 
                  alt={deck.name} 
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold">Cards neste deck</h2>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar cards..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
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
                  <DropdownMenuRadioItem value="difficulty-asc">Dificuldade (fácil → difícil)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="difficulty-desc">Dificuldade (difícil → fácil)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="reviews">Mais revisados</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {isLoadingCards ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[200px] bg-gray-100 rounded-md"></div>
            ))}
          </div>
        ) : sortedCards.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-10 w-10" />}
            title="Nenhum card neste deck"
            description={searchTerm 
              ? "Tente alterar os termos de busca" 
              : "Adicione seu primeiro flash card a este deck para começar a estudar."}
            action={
              <Button onClick={() => setLocation(`/flashcard-deck/${deck.id}/add-card`)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Card
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCards.map((card: FlashCard) => (
              <FlashCardItem key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este deck e todos os seus cards.
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