import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { 
  ChevronLeft, 
  Send, 
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  Edit,
  MessageSquare,
  PinIcon,
  LockIcon,
  Clock,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import PageTitle from "@/components/ui/page-title";
import EmptyState from "@/components/ui/empty-state";

type ForumThread = {
  id: number;
  title: string;
  content: string;
  forumId: number;
  forumTitle: string;
  forumSlug?: string;
  userId: number;
  userName: string;
  userAvatar?: string | null;
  userRole?: string | null;
  postCount: number | null;
  viewCount: number | null;
  isPinned: boolean | null;
  isLocked: boolean | null;
  tags: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
};

type ThreadReply = {
  id: number;
  threadId: number;
  userId: number;
  userName: string;
  userAvatar?: string | null;
  userRole?: string | null;
  content: string;
  isAnswer: boolean | null;
  voteCount: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

// Componente para a postagem principal (Tópico)
const ThreadPost = ({ thread }: { thread: ForumThread }) => {
  const isCurrentUser = thread.userId === 1; // Simulando usuário atual

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-xl">
              {thread.title}
              {thread.isPinned && (
                <PinIcon className="h-4 w-4 text-amber-500 inline-block ml-2" />
              )}
              {thread.isLocked && (
                <LockIcon className="h-4 w-4 text-red-500 inline-block ml-2" />
              )}
            </CardTitle>
          </div>
          
          <div className="flex items-center space-x-2">
            {thread.tags && thread.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
            
            {isCurrentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center text-destructive">
                    <Flag className="mr-2 h-4 w-4" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-1">
          <CardDescription>
            <Link href={`/forum/${thread.forumId}`} className="hover:underline">
              {thread.forumTitle}
            </Link>
          </CardDescription>
          <span className="text-muted-foreground">•</span>
          <CardDescription className="flex items-center">
            <Clock className="h-3 w-3 mr-1 inline" />
            {new Date(thread.createdAt || Date.now()).toLocaleDateString('pt-BR')}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pb-0">
        <div className="flex">
          <div className="w-16 md:w-36 flex flex-col items-center text-center mr-4">
            {thread.userAvatar ? (
              <div className="h-12 w-12 md:h-20 md:w-20 rounded-full overflow-hidden mb-2">
                <img 
                  src={thread.userAvatar} 
                  alt={thread.userName} 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-12 w-12 md:h-20 md:w-20 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-primary text-xl md:text-2xl font-medium">
                  {thread.userName?.slice(0, 2).toUpperCase() || "U"}
                </span>
              </div>
            )}
            
            <div>
              <p className="font-medium text-sm md:text-base">
                {thread.userName}
              </p>
              {thread.userRole && (
                <Badge variant="outline" className="mt-1">
                  {thread.userRole}
                </Badge>
              )}
              <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                {thread.postCount || 0} posts
              </p>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="prose prose-sm md:prose-base max-w-none">
              <p className="whitespace-pre-line">{thread.content}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-6 mt-6 border-t">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <ThumbsUp className="h-4 w-4 mr-1" />
            Útil
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Flag className="h-4 w-4 mr-1" />
            Reportar
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-1" />
            {thread.postCount || 0} respostas
          </span>
          <span className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            {thread.viewCount || 0} visualizações
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

// Componente para as respostas
const ReplyItem = ({ reply }: { reply: ThreadReply }) => {
  const [voteCount, setVoteCount] = useState(reply.voteCount || 0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const isCurrentUser = reply.userId === 1; // Simulando usuário atual

  const handleVote = (type: 'up' | 'down') => {
    if (userVote === type) {
      // Remover voto
      setUserVote(null);
      setVoteCount(voteCount + (type === 'up' ? -1 : 1));
    } else {
      // Adicionar ou mudar voto
      setVoteCount(voteCount + 
        (userVote ? (type === 'up' ? 2 : -2) : (type === 'up' ? 1 : -1))
      );
      setUserVote(type);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-0">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-sm">
              {reply.isAnswer && (
                <Badge variant="success" className="mr-2">Resposta Aceita</Badge>
              )}
            </CardTitle>
          </div>
          
          {isCurrentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center text-destructive">
                  <Flag className="mr-2 h-4 w-4" /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 pb-0">
        <div className="flex">
          <div className="w-16 md:w-36 flex flex-col items-center text-center mr-4">
            {reply.userAvatar ? (
              <div className="h-10 w-10 md:h-16 md:w-16 rounded-full overflow-hidden mb-2">
                <img 
                  src={reply.userAvatar} 
                  alt={reply.userName} 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 md:h-16 md:w-16 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-primary text-lg md:text-xl font-medium">
                  {reply.userName?.slice(0, 2).toUpperCase() || "U"}
                </span>
              </div>
            )}
            
            <div>
              <p className="font-medium text-xs md:text-sm">
                {reply.userName}
              </p>
              {reply.userRole && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {reply.userRole}
                </Badge>
              )}
              <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                Membro desde {new Date(reply.createdAt || Date.now()).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line">{reply.content}</p>
            </div>
            
            <div className="text-xs text-muted-foreground mt-4">
              {reply.updatedAt && reply.updatedAt !== reply.createdAt ? (
                <span>
                  Editado em {new Date(reply.updatedAt).toLocaleDateString('pt-BR')}
                </span>
              ) : (
                <span>
                  Respondido em {new Date(reply.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 mt-4 border-t">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={userVote === 'up' ? 'text-primary' : 'text-muted-foreground'}
            onClick={() => handleVote('up')}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
          </Button>
          <span className={`text-sm font-medium ${voteCount > 0 ? 'text-green-600' : voteCount < 0 ? 'text-red-600' : ''}`}>
            {voteCount > 0 ? `+${voteCount}` : voteCount}
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            className={userVote === 'down' ? 'text-destructive' : 'text-muted-foreground'}
            onClick={() => handleVote('down')}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Reply className="h-4 w-4 mr-1" />
            Citar
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Flag className="h-4 w-4 mr-1" />
            Reportar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function ThreadDetail() {
  const [_, params] = useRoute<{ id: string }>("/thread/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [replyContent, setReplyContent] = useState("");
  
  // Obter detalhes do tópico
  const { 
    data: thread,
    isLoading: isLoadingThread,
    error: threadError 
  } = useQuery({
    queryKey: [`/api/threads/${params?.id}`],
    enabled: !!params?.id
  });
  
  // Obter respostas
  const { 
    data: replies = [],
    isLoading: isLoadingReplies,
    error: repliesError 
  } = useQuery({
    queryKey: [`/api/threads/${params?.id}/replies`],
    enabled: !!params?.id
  });
  
  // Mutação para criar uma nova resposta
  const newReplyMutation = useMutation({
    mutationFn: async (content: string) => {
      const replyData = {
        threadId: Number(params?.id),
        content,
      };
      
      return apiRequest(`/api/threads/${params?.id}/replies`, {
        method: "POST",
        body: replyData,
      });
    },
    onSuccess: () => {
      // Limpar o campo de resposta
      setReplyContent("");
      
      // Atualizar as queries
      queryClient.invalidateQueries({ queryKey: [`/api/threads/${params?.id}/replies`] });
      
      // Mostrar mensagem de sucesso
      toast({
        title: "Resposta enviada",
        description: "Sua resposta foi publicada no tópico com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua resposta. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error posting reply:", error);
    },
  });
  
  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, escreva sua resposta antes de enviar.",
        variant: "destructive",
      });
      return;
    }
    
    newReplyMutation.mutate(replyContent);
  };
  
  // Renderizar mensagem de erro
  if (threadError) {
    return (
      <div className="container max-w-5xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/forums")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para Fóruns
          </Button>
          <PageTitle 
            title="Tópico não encontrado" 
            icon={<MessageSquare className="h-6 w-6" />}
          />
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Tópico não encontrado ou ocorreu um erro ao carregar as informações.
        </div>
      </div>
    );
  }
  
  // Renderizar loading
  if (isLoadingThread) {
    return (
      <div className="container max-w-5xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/forums")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para Fóruns
          </Button>
          <div className="h-8 w-96 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-64 bg-gray-100 animate-pulse rounded-md mb-6"></div>
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4" 
          onClick={() => setLocation(thread.forumId ? `/forum/${thread.forumId}` : "/forums")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar para {thread.forumTitle || "Fóruns"}
        </Button>
        <PageTitle 
          title="Visualizando Tópico" 
          icon={<MessageSquare className="h-6 w-6" />}
        />
      </div>
      
      {/* Tópico principal */}
      {thread && <ThreadPost thread={thread} />}
      
      {/* Separador de respostas */}
      <div className="flex items-center my-6">
        <h3 className="text-lg font-medium">Respostas</h3>
        <Separator className="flex-1 ml-4" />
      </div>
      
      {/* Lista de respostas */}
      {isLoadingReplies ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-md"></div>
          ))}
        </div>
      ) : replies.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-10 w-10" />}
          title="Nenhuma resposta ainda"
          description="Seja o primeiro a responder este tópico!"
        />
      ) : (
        <div className="space-y-4">
          {replies.map((reply: ThreadReply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))}
        </div>
      )}
      
      {/* Campo para responder */}
      {thread && !thread.isLocked && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Sua Resposta</h3>
          <div className="space-y-4">
            <Textarea
              placeholder="Escreva sua resposta aqui..."
              rows={6}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitReply}
                disabled={newReplyMutation.isPending || !replyContent.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                {newReplyMutation.isPending ? "Enviando..." : "Enviar Resposta"}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mensagem de tópico bloqueado */}
      {thread && thread.isLocked && (
        <div className="mt-8 bg-muted p-4 rounded-md flex items-center">
          <LockIcon className="h-5 w-5 text-muted-foreground mr-2" />
          <p className="text-muted-foreground">
            Este tópico está bloqueado e não aceita mais respostas.
          </p>
        </div>
      )}
    </div>
  );
}