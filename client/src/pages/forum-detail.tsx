import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { 
  ChevronLeft, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MessageSquare,
  PinIcon,
  LockIcon,
  Users,
  Clock,
  Edit
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
  rules: string | null;
  moderators: string[] | null;
};

type ForumThread = {
  id: number;
  title: string;
  content: string;
  forumId: number;
  userId: number;
  userName: string;
  userAvatar?: string | null;
  replyCount: number | null;
  viewCount: number | null;
  isPinned: boolean | null;
  isLocked: boolean | null;
  tags: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
  lastReplyAt: Date | null;
};

// Componente para o Card de Tópico
const ThreadItem = ({ thread }: { thread: ForumThread }) => {
  return (
    <Link href={`/thread/${thread.id}`}>
      <Card className="cursor-pointer hover:shadow-md">
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
              <div className="flex space-x-1">
                {thread.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
                {thread.tags.length > 2 && (
                  <Badge variant="outline">
                    +{thread.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <CardDescription className="line-clamp-2 mt-1">
            {thread.content.length > 150 
              ? thread.content.substring(0, 150) + '...' 
              : thread.content}
          </CardDescription>
        </CardHeader>
        
        <CardFooter className="pt-2 border-t flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {thread.userAvatar ? (
              <div className="h-6 w-6 rounded-full overflow-hidden">
                <img 
                  src={thread.userAvatar} 
                  alt={thread.userName} 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary text-xs font-medium">
                  {thread.userName?.slice(0, 2).toUpperCase() || "U"}
                </span>
              </div>
            )}
            <span className="text-sm">{thread.userName || "Usuário"}</span>
          </div>
          <div className="flex space-x-4">
            <span className="text-xs text-muted-foreground flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              {thread.replyCount || 0}
            </span>
            <span className="text-xs text-muted-foreground flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {thread.viewCount || 0}
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

export default function ForumDetail() {
  const [_, params] = useRoute<{ id: string }>("/forum/:id");
  const [, setLocation] = useLocation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [view, setView] = useState<string>("all");
  
  // Obter detalhes do fórum
  const { 
    data: forum = { id: 0, title: "", description: null, threadCount: 0, postCount: 0, tags: [] },
    isLoading: isLoadingForum,
    error: forumError
  } = useQuery({
    queryKey: [`/api/forums/${params?.id}`],
    enabled: !!params?.id
  });
  
  // Obter tópicos do fórum
  const { 
    data: threads = [],
    isLoading: isLoadingThreads,
    error: threadsError 
  } = useQuery({
    queryKey: [`/api/forums/${params?.id}/threads`],
    enabled: !!params?.id
  });
  
  // Extrair todas as tags únicas dos tópicos
  const uniqueTags = threads
    .flatMap((thread: ForumThread) => thread.tags || [])
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .sort();
  
  // Filtrar e ordenar tópicos
  const filteredThreads = threads.filter((thread: ForumThread) => {
    const matchesSearch = searchTerm === "" || 
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      thread.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = tagFilter === "all" || 
      (thread.tags && thread.tags.includes(tagFilter));
    
    const matchesView = 
      view === "all" ||
      (view === "pinned" && thread.isPinned) ||
      (view === "locked" && thread.isLocked);
    
    return matchesSearch && matchesTag && matchesView;
  });
  
  // Ordenar tópicos
  const sortedThreads = [...filteredThreads].sort((a: ForumThread, b: ForumThread) => {
    // Sempre manter os pinados no topo
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    switch (sortBy) {
      case "recent":
        // Ordenar por criação/atividade mais recente
        const dateA = a.lastReplyAt || a.createdAt;
        const dateB = b.lastReplyAt || b.createdAt;
        return new Date(dateB || 0).getTime() - new Date(dateA || 0).getTime();
      case "oldest":
        // Ordenar por mais antigo
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
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
  if (forumError || threadsError) {
    return (
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/forums")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <PageTitle 
            title="Fórum não encontrado" 
            icon={<MessageSquare className="h-6 w-6" />}
          />
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Fórum não encontrado ou ocorreu um erro ao carregar as informações.
        </div>
      </div>
    );
  }
  
  // Renderizar loading
  if (isLoadingForum) {
    return (
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/forums")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="h-8 w-96 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-36 bg-gray-100 animate-pulse rounded-md mb-6"></div>
        <div className="flex flex-col md:flex-row gap-4 mb-6 animate-pulse">
          <div className="h-10 bg-gray-100 rounded flex-1"></div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-100 rounded"></div>
            <div className="h-10 w-32 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-md"></div>
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
            <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/forums")}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <PageTitle 
              title={forum.title} 
              description={forum.description || ""}
              icon={<MessageSquare className="h-6 w-6" />}
            />
          </div>
          <Link href={`/forums/${forum.id}/new-thread`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Tópico
            </Button>
          </Link>
        </div>
        
        {/* Informações do fórum */}
        <div className="bg-muted p-6 rounded-md">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2 md:w-2/3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Disciplina</p>
                  <p className="font-medium">{forum.subject || "Geral"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tópicos</p>
                  <p className="font-medium">{forum.threadCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posts</p>
                  <p className="font-medium">{forum.postCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última atividade</p>
                  <p className="font-medium">
                    {forum.lastActivityAt 
                      ? new Date(forum.lastActivityAt).toLocaleDateString('pt-BR') 
                      : "Sem atividade"}
                  </p>
                </div>
              </div>
              
              {forum.moderators && forum.moderators.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Moderadores</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {forum.moderators.map((moderator, index) => (
                      <Badge key={index} variant="outline">
                        {moderator}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {forum.rules && (
              <div className="md:w-1/3">
                <p className="text-sm font-medium mb-1">Regras do Fórum</p>
                <div className="bg-white p-3 rounded-md border text-sm">
                  {forum.rules}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Filtros de busca */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar tópicos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {uniqueTags.length > 0 && (
              <Select 
                value={tagFilter} 
                onValueChange={setTagFilter}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as tags</SelectItem>
                  {uniqueTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Select 
              value={view} 
              onValueChange={setView}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Visualizar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tópicos</SelectItem>
                <SelectItem value="pinned">Fixados</SelectItem>
                <SelectItem value="locked">Bloqueados</SelectItem>
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
                  <DropdownMenuRadioItem value="oldest">Mais antigos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="alphabetical">Alfabética (A-Z)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="replies">Mais respostas</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="views">Mais visualizações</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Lista de tópicos */}
        <div className="space-y-4">
          {isLoadingThreads ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-md"></div>
              ))}
            </div>
          ) : sortedThreads.length === 0 ? (
            <EmptyState
              icon={<MessageSquare className="h-10 w-10" />}
              title="Nenhum tópico encontrado"
              description={searchTerm || tagFilter !== "all" || view !== "all"
                ? "Tente alterar os filtros de busca ou criar um novo tópico." 
                : "Seja o primeiro a criar um tópico neste fórum."}
              action={
                <Link href={`/forums/${forum.id}/new-thread`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Tópico
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {sortedThreads.map((thread: ForumThread) => (
                <ThreadItem key={thread.id} thread={thread} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}