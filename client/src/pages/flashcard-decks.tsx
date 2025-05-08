import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Search, Filter, ArrowUpDown, BrainCircuit, BookOpen } from "lucide-react";
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

// Componente de Card para um Deck de Flash Cards
const DeckItem = ({ deck }: { deck: FlashCardDeck }) => {
  return (
    <Link href={`/flashcard-deck/${deck.id}`}>
      <Card className="cursor-pointer hover:shadow-md overflow-hidden h-full">
        {deck.coverImage && (
          <div className="h-32 overflow-hidden">
            <img 
              src={deck.coverImage} 
              alt={deck.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader className={cn("pb-3", !deck.coverImage && "pt-6")}>
          <div className="flex justify-between">
            <CardTitle className="line-clamp-1">{deck.name}</CardTitle>
            {deck.isPublic && (
              <Badge variant="outline" className="ml-2">Público</Badge>
            )}
          </div>
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

export default function FlashCardDecks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  // Buscar Decks de Flash Cards do usuário
  const { 
    data: myDecks = [],
    isLoading: isLoadingMyDecks,
    error: myDecksError 
  } = useQuery({
    queryKey: ['/api/flashcarddecks'],
    enabled: true
  });

  // Buscar Decks públicos
  const { 
    data: publicDecks = [],
    isLoading: isLoadingPublicDecks,
    error: publicDecksError 
  } = useQuery({
    queryKey: ['/api/flashcarddecks/public'],
    enabled: true
  });
  
  // Filtrar e ordenar Decks
  const filteredMyDecks = myDecks.filter((deck: FlashCardDeck) => {
    const matchesSearch = searchTerm === "" || 
      deck.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (deck.description && deck.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (deck.tags && deck.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesSubject = subjectFilter === "all" || deck.subject === subjectFilter;
    
    return matchesSearch && matchesSubject;
  });
  
  // Filtrar e ordenar Decks públicos
  const filteredPublicDecks = publicDecks.filter((deck: FlashCardDeck) => {
    const matchesSearch = searchTerm === "" || 
      deck.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (deck.description && deck.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (deck.tags && deck.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesSubject = subjectFilter === "all" || deck.subject === subjectFilter;
    
    // Excluir decks que já estão nos meus decks
    const isMyDeck = myDecks.some((myDeck: FlashCardDeck) => myDeck.id === deck.id);
    
    return matchesSearch && matchesSubject && !isMyDeck;
  });
  
  // Ordenar Decks
  const sortDecks = (decks: FlashCardDeck[]) => {
    return [...decks].sort((a: FlashCardDeck, b: FlashCardDeck) => {
      switch (sortBy) {
        case "recent":
          // Ordenar pelo mais recente
          return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
        case "name":
          // Ordenar por nome
          return a.name.localeCompare(b.name);
        case "cards":
          // Ordenar por número de cards
          return (b.cardCount || 0) - (a.cardCount || 0);
        default:
          return 0;
      }
    });
  };
  
  const sortedMyDecks = sortDecks(filteredMyDecks);
  const sortedPublicDecks = sortDecks(filteredPublicDecks);
  
  // Renderizar mensagem de erro
  if (myDecksError || publicDecksError) {
    return (
      <div className="container max-w-7xl mx-auto py-6">
        <PageTitle 
          title="Decks de Flash Cards" 
          description="Erro ao carregar decks"
          icon={<BookOpen className="h-6 w-6" />}
        />
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Ocorreu um erro ao carregar os decks de flash cards. Por favor, tente novamente mais tarde.
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <PageTitle 
            title="Decks de Flash Cards" 
            description="Conjuntos organizados de flash cards para seu estudo"
            icon={<BookOpen className="h-6 w-6" />}
          />
          
          <Link href="/flashcard-decks/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Deck
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar decks..."
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
                  <DropdownMenuRadioItem value="name">Nome (A-Z)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="cards">Mais cards</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Tabs defaultValue="my-decks" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="my-decks">Meus Decks</TabsTrigger>
            <TabsTrigger value="public-decks">Decks Públicos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-decks" className="w-full">
            {isLoadingMyDecks ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-56 bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : sortedMyDecks.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="h-10 w-10" />}
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
                {sortedMyDecks.map((deck: FlashCardDeck) => (
                  <DeckItem key={deck.id} deck={deck} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="public-decks" className="w-full">
            {isLoadingPublicDecks ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-56 bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : sortedPublicDecks.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="h-10 w-10" />}
                title="Nenhum deck público encontrado"
                description={searchTerm || subjectFilter !== "all" 
                  ? "Tente alterar os filtros de busca ou explorar outras disciplinas." 
                  : "Não há decks públicos disponíveis no momento."}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPublicDecks.map((deck: FlashCardDeck) => (
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