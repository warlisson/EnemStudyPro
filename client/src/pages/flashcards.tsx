import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Search, Filter, ArrowUpDown, BrainCircuit } from "lucide-react";
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
import { cn } from "@/lib/utils";
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
};

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
      color = "bg-green-100 text-green-800";
      label = "Médio-Fácil";
      break;
    case 3:
      color = "bg-yellow-100 text-yellow-800";
      label = "Médio";
      break;
    case 4:
      color = "bg-orange-100 text-orange-800";
      label = "Médio-Difícil";
      break;
    case 5:
      color = "bg-red-100 text-red-800";
      label = "Difícil";
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

// Componente de Card para um Flash Card
const FlashCardItem = ({ card }: { card: FlashCard }) => {
  const [flipped, setFlipped] = useState(false);
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-500 transform cursor-pointer hover:shadow-md h-[200px]",
        flipped ? "bg-primary-50" : "bg-white"
      )}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="absolute top-2 right-2 flex space-x-2">
        <DifficultyBadge difficulty={card.difficulty} />
      </div>
      
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
          {card.reviewCount !== null && `Revisado ${card.reviewCount} ${card.reviewCount === 1 ? 'vez' : 'vezes'}`}
        </div>
      </CardFooter>
    </Card>
  );
};

// Componente de Card para um Deck de Flash Cards
const DeckItem = ({ deck }: { deck: FlashCardDeck }) => {
  return (
    <Link href={`/flashcard-deck/${deck.id}`}>
      <Card className="cursor-pointer hover:shadow-md">
        <CardHeader className="pb-3">
          <CardTitle>{deck.name}</CardTitle>
          {deck.description && (
            <CardDescription className="line-clamp-2">{deck.description}</CardDescription>
          )}
        </CardHeader>
        
        <CardFooter className="pt-2 border-t flex justify-between items-center">
          <div className="flex space-x-1 overflow-x-auto">
            {deck.tags && deck.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {deck.tags && deck.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{deck.tags.length - 3}
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {deck.cardCount || 0} cards
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default function FlashCards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  // Buscar Flash Cards do usuário
  const { 
    data: flashCards = [],
    isLoading: isLoadingCards,
    error: cardsError 
  } = useQuery({
    queryKey: ['/api/flashcards'],
    enabled: true
  });

  // Buscar Decks de Flash Cards
  const { 
    data: decks = [],
    isLoading: isLoadingDecks,
    error: decksError 
  } = useQuery({
    queryKey: ['/api/flashcarddecks'],
    enabled: true
  });
  
  // Buscar Flash Cards para revisão hoje
  const { 
    data: dueCards = [],
    isLoading: isLoadingDueCards,
    error: dueCardsError 
  } = useQuery({
    queryKey: ['/api/flashcards/due'],
    enabled: true
  });
  
  // Filtrar e ordenar Flash Cards
  const filteredCards = flashCards.filter((card: FlashCard) => {
    const matchesSearch = searchTerm === "" || 
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) || 
      card.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.tags && card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesSubject = subjectFilter === "all" || card.subject === subjectFilter;
    
    return matchesSearch && matchesSubject;
  });
  
  // Ordenar Flash Cards
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
  
  // Filtrar e ordenar Decks
  const filteredDecks = decks.filter((deck: FlashCardDeck) => {
    const matchesSearch = searchTerm === "" || 
      deck.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (deck.description && deck.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (deck.tags && deck.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesSubject = subjectFilter === "all" || deck.subject === subjectFilter;
    
    return matchesSearch && matchesSubject;
  });
  
  // Renderizar mensagem de erro
  // if (cardsError || decksError || dueCardsError) {
  //   return (
  //     <div className="container max-w-7xl mx-auto py-6">
  //       <PageTitle 
  //         title="Flash Cards" 
  //         description="Erro ao carregar flash cards"
  //         icon={<BrainCircuit className="h-6 w-6" />}
  //       />
  //       <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
  //         Ocorreu um erro ao carregar os flash cards. Por favor, tente novamente mais tarde.
  //       </div>
  //     </div>
  //   );
  // }
  
  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <PageTitle 
            title="Flash Cards" 
            description="Memorize conceitos e revise seu conhecimento"
            icon={<BrainCircuit className="h-6 w-6" />}
          />
          
          <div className="flex items-center space-x-2">
            <Link href="/flashcards/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Flash Card
              </Button>
            </Link>
            <Link href="/flashcard-decks/new">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Novo Deck
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar flash cards..."
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
                <SelectItem value="redacao">Redação</SelectItem>
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
                  <DropdownMenuRadioItem value="difficulty-asc">Dificuldade (fácil → difícil)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="difficulty-desc">Dificuldade (difícil → fácil)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="reviews">Mais revisados</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Tabs defaultValue="due" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="due">
              Para Revisão
              {dueCards.length > 0 && (
                <Badge className="ml-2 bg-primary">{dueCards.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="cards">Meus Flash Cards</TabsTrigger>
            <TabsTrigger value="decks">Meus Decks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="due" className="w-full">
            {isLoadingDueCards ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[200px] bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : dueCards.length === 0 ? (
              <EmptyState
                icon={<BrainCircuit className="h-10 w-10" />}
                title="Nenhum flash card para revisão hoje"
                description="Todos os seus flash cards estão em dia! Crie novos flash cards para continuar estudando."
                action={
                  <Link href="/flashcards/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Flash Card
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dueCards.map((card: FlashCard) => (
                  <FlashCardItem key={card.id} card={card} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cards" className="w-full">
            {isLoadingCards ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[200px] bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : sortedCards.length === 0 ? (
              <EmptyState
                icon={<BrainCircuit className="h-10 w-10" />}
                title="Nenhum flash card encontrado"
                description={searchTerm || subjectFilter !== "all" 
                  ? "Tente alterar os filtros de busca ou criar um novo flash card." 
                  : "Crie seu primeiro flash card para começar a estudar."}
                action={
                  <Link href="/flashcards/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Flash Card
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCards.map((card: FlashCard) => (
                  <FlashCardItem key={card.id} card={card} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="decks" className="w-full">
            {isLoadingDecks ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-36 bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : filteredDecks.length === 0 ? (
              <EmptyState
                icon={<BrainCircuit className="h-10 w-10" />}
                title="Nenhum deck encontrado"
                description={searchTerm || subjectFilter !== "all" 
                  ? "Tente alterar os filtros de busca ou criar um novo deck." 
                  : "Crie seu primeiro deck de flash cards para organizar seu estudo."}
                action={
                  <Link href="/flashcard-decks/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Deck
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDecks.map((deck: FlashCardDeck) => (
                  <DeckItem key={deck.id} deck={deck} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}