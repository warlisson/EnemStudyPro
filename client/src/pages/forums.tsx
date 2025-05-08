import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MessageSquare, 
  Users,
  Clock,
  BookOpen,
  PinIcon,
  LockIcon
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
import { cn } from "@/lib/utils";
import PageTitle from "@/components/ui/page-title";
import EmptyState from "@/components/ui/empty-state";

type Forum = {
  id: number;
  title: string;
  description: string | null;
  subject: string | null;
  threadCount: number | null;
  postCount: number | null;
  lastActivityAt: Date | null;
};

type ForumThread = {
  id: number;
  title: string;
  content: string;
  forumId: number;
  forumTitle?: string;
  userId: number;
  userName?: string;
  replyCount: number | null;
  viewCount: number | null;
  isPinned: boolean | null;
  isLocked: boolean | null;
  tags: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
  lastReplyAt: Date | null;
};

// Componente para o Card de Fórum
const ForumItem = ({ forum }: { forum: Forum }) => {
  return (
    <Link href={`/forum/${forum.id}`}>
      <Card className="cursor-pointer hover:shadow-md h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <CardTitle className="line-clamp-1">{forum.title}</CardTitle>
          </div>
          {forum.description && (
            <CardDescription className="line-clamp-2 mt-1">
              {forum.description}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="pb-0">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              {forum.threadCount || 0} tópicos
            </span>
            <span className="text-muted-foreground flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {forum.postCount || 0} posts
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 border-t mt-4">
          <div className="flex justify-between items-center w-full">
            <Badge variant="outline">
              {forum.subject || "Geral"}
            </Badge>
            
            {forum.lastActivityAt && (
              <span className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Última atividade: {new Date(forum.lastActivityAt).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

// Componente para o Card de Tópico
const ThreadItem = ({ thread }: { thread: ForumThread }) => {
  return (
    <Link href={`/thread/${thread.id}`}>
      <Card className="cursor-pointer hover:shadow-md h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {thread.isPinned && (
                <PinIcon className="h-4 w-4 text-amber-500" />
              )}
              {thread.isLocked && (
                <LockIcon className="h-4 w-4 text-red-500" />
              )}
              <CardTitle className="line-clamp-1 text-base">{thread.title}</CardTitle>
            </div>
            {thread.tags && thread.tags.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {thread.tags[0]}
                {thread.tags.length > 1 && `+${thread.tags.length - 1}`}
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-2 mt-1">
            {thread.content.length > 150 
              ? thread.content.substring(0, 150) + '...' 
              : thread.content}
          </CardDescription>
        </CardHeader>
        
        <CardFooter className="pt-2 border-t flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              Criado por: {thread.userName || "Usuário"}
            </span>
            <span className="text-xs text-muted-foreground">
              Fórum: {thread.forumTitle || "Geral"}
            </span>
          </div>
          <div className="flex space-x-4">
            <span className="text-xs text-muted-foreground flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              {thread.replyCount || 0}
            </span>
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {thread.lastReplyAt 
                ? new Date(thread.lastReplyAt).toLocaleDateString('pt-BR')
                : new Date(thread.createdAt || Date.now()).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default function Forums() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  // Buscar todos os fóruns
  const { 
    data: forums = [],
    isLoading: isLoadingForums,
    error: forumsError 
  } = useQuery({
    queryKey: ['/api/forums'],
    enabled: true
  });

  // Buscar tópicos recentes
  const { 
    data: recentThreads = [],
    isLoading: isLoadingThreads,
    error: threadsError 
  } = useQuery({
    queryKey: ['/api/forums/threads/recent'],
    enabled: true
  });
  
  // Filtrar e ordenar fóruns
  const filteredForums = Array.isArray(forums) ? forums.filter((forum: Forum) => {
    if (!forum || typeof forum !== 'object') return false;
    
    const matchesSearch = searchTerm === "" || 
      (forum.title && forum.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (forum.description && forum.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = subjectFilter === "all" || forum.subject === subjectFilter;
    
    return matchesSearch && matchesSubject;
  }) : [];
  
  // Ordenar fóruns
  const sortedForums = [...filteredForums].sort((a: Forum, b: Forum) => {
    switch (sortBy) {
      case "recent":
        // Ordenar por atividade mais recente
        return new Date(b.lastActivityAt || 0).getTime() - new Date(a.lastActivityAt || 0).getTime();
      case "alphabetical":
        // Ordenar por ordem alfabética
        return (a.title || '').localeCompare(b.title || '');
      case "threads":
        // Ordenar por número de tópicos
        return (b.threadCount || 0) - (a.threadCount || 0);
      case "posts":
        // Ordenar por número de posts
        return (b.postCount || 0) - (a.postCount || 0);
      default:
        return 0;
    }
  });
  
  // Filtrar e ordenar tópicos recentes
  const filteredThreads = Array.isArray(recentThreads) ? recentThreads.filter((thread: ForumThread) => {
    if (!thread || typeof thread !== 'object') return false;
    
    const matchesSearch = searchTerm === "" || 
      (thread.title && thread.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (thread.content && thread.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (thread.tags && Array.isArray(thread.tags) && thread.tags.some(tag => 
        tag && tag.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    const matchesSubject = subjectFilter === "all" || 
      (thread.forumId && Array.isArray(forums) && forums.find((f: Forum) => f.id === thread.forumId)?.subject === subjectFilter);
    
    return matchesSearch && matchesSubject;
  }) : [];
  
  // Ordenar tópicos
  const sortedThreads = [...filteredThreads].sort((a: ForumThread, b: ForumThread) => {
    switch (sortBy) {
      case "recent":
        // Ordenar por criação/atividade mais recente
        const dateA = a.lastReplyAt || a.createdAt;
        const dateB = b.lastReplyAt || b.createdAt;
        return new Date(dateB || 0).getTime() - new Date(dateA || 0).getTime();
      case "alphabetical":
        // Ordenar por ordem alfabética
        return a.title.localeCompare(b.title);
      case "replies":
        // Ordenar por número de respostas
        return (b.replyCount || 0) - (a.replyCount || 0);
      case "views":
        // Ordenar por número de visualizações
        return (b.viewCount || 0) - (a.viewCount || 0);
      default:
        return 0;
    }
  });
  
  // Renderizar mensagem de erro
  if (forumsError || threadsError) {
    return (
      <div className="container max-w-7xl mx-auto py-6">
        <PageTitle 
          title="Fóruns" 
          description="Erro ao carregar fóruns"
          icon={<MessageSquare className="h-6 w-6" />}
        />
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Ocorreu um erro ao carregar os fóruns. Por favor, tente novamente mais tarde.
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <PageTitle 
            title="Fóruns" 
            description="Participe de discussões e tire suas dúvidas"
            icon={<MessageSquare className="h-6 w-6" />}
          />
          
          <div className="flex items-center space-x-2">
            <Link href="/forums/new-thread">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Tópico
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar fóruns e tópicos..."
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
                  <DropdownMenuRadioItem value="alphabetical">Alfabética (A-Z)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="threads">Mais tópicos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="posts">Mais posts</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="replies">Mais respostas</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="views">Mais visualizações</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Tabs defaultValue="forums" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="forums">
              Fóruns
            </TabsTrigger>
            <TabsTrigger value="recent">Tópicos Recentes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forums" className="w-full">
            {isLoadingForums ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-48 bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : sortedForums.length === 0 ? (
              <EmptyState
                icon={<MessageSquare className="h-10 w-10" />}
                title="Nenhum fórum encontrado"
                description={searchTerm || subjectFilter !== "all" 
                  ? "Tente alterar os filtros de busca." 
                  : "Não há fóruns disponíveis no momento."}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedForums.map((forum: Forum) => (
                  <ForumItem key={forum.id} forum={forum} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="w-full">
            {isLoadingThreads ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : sortedThreads.length === 0 ? (
              <EmptyState
                icon={<MessageSquare className="h-10 w-10" />}
                title="Nenhum tópico encontrado"
                description={searchTerm || subjectFilter !== "all" 
                  ? "Tente alterar os filtros de busca ou criar um novo tópico." 
                  : "Seja o primeiro a criar um tópico de discussão."}
                action={
                  <Link href="/forums/new-thread">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Tópico
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sortedThreads.map((thread: ForumThread) => (
                  <ThreadItem key={thread.id} thread={thread} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}