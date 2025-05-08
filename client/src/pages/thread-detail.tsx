import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { 
  ChevronLeft, 
  MessageSquare, 
  PinIcon, 
  LockIcon,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Reply,
  Edit,
  Trash,
  Clock,
  CheckCircle2,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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

type ForumThread = {
  id: number;
  title: string;
  content: string;
  forumId: number;
  forumTitle: string;
  userId: number;
  userName: string;
  userAvatar?: string | null;
  userRole?: string | null;
  replyCount: number | null;
  viewCount: number | null;
  isPinned: boolean | null;
  isLocked: boolean | null;
  tags: string[];
  likes: number | null;
  dislikes: number | null;
  userLiked?: boolean | null;
  userDisliked?: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  lastReplyAt: Date | null;
};

type Reply = {
  id: number;
  threadId: number;
  content: string;
  userId: number;
  userName: string;
  userAvatar?: string | null;
  userRole?: string | null;
  parentId: number | null;
  isAnswer: boolean | null;
  likes: number | null;
  dislikes: number | null;
  userLiked?: boolean | null;
  userDisliked?: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

// Componente para a mensagem principal ou resposta
const PostCard = ({ 
  content, 
  author, 
  avatar, 
  role,
  createdAt, 
  updatedAt,
  likes,
  dislikes,
  userLiked,
  userDisliked,
  isThreadAuthor = false,
  isAnswer = false,
  onLike,
  onDislike,
  onDelete,
  onMarkAsAnswer,
  canMarkAsAnswer = false
}: { 
  content: string; 
  author: string;
  avatar?: string | null;
  role?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  likes: number | null;
  dislikes: number | null;
  userLiked?: boolean | null;
  userDisliked?: boolean | null;
  isThreadAuthor?: boolean;
  isAnswer?: boolean;
  onLike: () => void;
  onDislike: () => void;
  onDelete: () => void;
  onMarkAsAnswer?: () => void;
  canMarkAsAnswer?: boolean;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  return (
    <Card className={cn(isAnswer && "border-green-500 bg-green-50")}>
      <CardHeader className="pb-2 flex flex-row justify-between items-start space-y-0">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={avatar || undefined} alt={author} />
            <AvatarFallback>{author.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <p className="font-medium">{author}</p>
              {isThreadAuthor && (
                <Badge className="ml-2" variant="outline">
                  Autor
                </Badge>
              )}
              {role && (
                <Badge className="ml-2" variant={role === "mod" ? "default" : "secondary"}>
                  {role === "mod" ? "Moderador" : role === "admin" ? "Admin" : role}
                </Badge>
              )}
              {isAnswer && (
                <Badge className="ml-2 bg-green-500">
                  Resposta
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {createdAt 
                ? new Date(createdAt).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : ""}
              {updatedAt && updatedAt !== createdAt && " (editado)"}
            </p>
          </div>
        </div>
        
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => alert("Editar")}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Reportar")}>
              <Flag className="h-4 w-4 mr-2" />
              Reportar
            </DropdownMenuItem>
            {canMarkAsAnswer && !isAnswer && (
              <DropdownMenuItem onClick={onMarkAsAnswer}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Marcar como resposta
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-600 hover:text-red-700 focus:text-red-700"
            >
              <Trash className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente esta mensagem.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  onDelete();
                  setIsDeleteDialogOpen(false);
                }}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      
      <CardContent className="pt-4 whitespace-pre-wrap">
        {content}
      </CardContent>
      
      <CardFooter className="pt-4 border-t flex justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(userLiked && "text-green-600 bg-green-50")}
            onClick={onLike}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            {likes || 0}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(userDisliked && "text-red-600 bg-red-50")}
            onClick={onDislike}
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            {dislikes || 0}
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Reply className="h-4 w-4 mr-2" />
          Responder
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function ThreadDetail() {
  const [_, params] = useRoute<{ id: string }>("/thread/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Obter detalhes do tópico
  const { 
    data: thread,
    isLoading: isLoadingThread,
    error: threadError
  } = useQuery({
    queryKey: [`/api/forums/threads/${params?.id}`],
    enabled: !!params?.id
  });
  
  // Obter respostas do tópico
  const { 
    data: replies = [],
    isLoading: isLoadingReplies,
    error: repliesError 
  } = useQuery({
    queryKey: [`/api/forums/threads/${params?.id}/replies`],
    enabled: !!params?.id
  });
  
  // Mutação para curtir o tópico
  const likeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/forums/threads/${params?.id}/like`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forums/threads/${params?.id}`] });
      toast({
        title: "Sucesso",
        description: "Tópico curtido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao curtir o tópico. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Mutação para descurtir o tópico
  const dislikeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/forums/threads/${params?.id}/dislike`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forums/threads/${params?.id}`] });
      toast({
        title: "Sucesso",
        description: "Descurtida registrada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao descurtir o tópico. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Mutação para excluir o tópico
  const deleteThreadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/forums/threads/${params?.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forums/${thread?.forumId}/threads`] });
      toast({
        title: "Tópico excluído",
        description: "O tópico foi excluído com sucesso.",
      });
      setLocation(`/forum/${thread?.forumId}`);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o tópico. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Mutação para curtir uma resposta
  const likeReplyMutation = useMutation({
    mutationFn: async (replyId: number) => {
      return apiRequest(`/api/forums/replies/${replyId}/like`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forums/threads/${params?.id}/replies`] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao curtir a resposta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Mutação para descurtir uma resposta
  const dislikeReplyMutation = useMutation({
    mutationFn: async (replyId: number) => {
      return apiRequest(`/api/forums/replies/${replyId}/dislike`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forums/threads/${params?.id}/replies`] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao descurtir a resposta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Mutação para excluir uma resposta
  const deleteReplyMutation = useMutation({
    mutationFn: async (replyId: number) => {
      return apiRequest(`/api/forums/replies/${replyId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forums/threads/${params?.id}/replies`] });
      toast({
        title: "Resposta excluída",
        description: "A resposta foi excluída com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a resposta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Mutação para marcar resposta como resposta aceita
  const markAsAnswerMutation = useMutation({
    mutationFn: async (replyId: number) => {
      return apiRequest(`/api/forums/replies/${replyId}/mark-as-answer`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forums/threads/${params?.id}/replies`] });
      toast({
        title: "Resposta marcada",
        description: "A resposta foi marcada como solução com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao marcar a resposta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Mutação para enviar uma resposta
  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest(`/api/forums/threads/${params?.id}/reply`, {
        method: "POST",
        body: { content },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forums/threads/${params?.id}/replies`] });
      queryClient.invalidateQueries({ queryKey: [`/api/forums/threads/${params?.id}`] });
      setReplyContent("");
      toast({
        title: "Resposta enviada",
        description: "Sua resposta foi enviada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a resposta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Função para lidar com envio de resposta
  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo da resposta não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await replyMutation.mutateAsync(replyContent);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Renderizar mensagem de erro
  if (threadError || repliesError) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/forums")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
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
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/forums")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="h-8 w-96 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-80 bg-gray-100 animate-pulse rounded-md mb-6"></div>
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Ordenar as respostas por data, mas manter as respostas marcadas como resposta no topo
  const sortedReplies = [...replies].sort((a: Reply, b: Reply) => {
    if (a.isAnswer && !b.isAnswer) return -1;
    if (!a.isAnswer && b.isAnswer) return 1;
    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
  });
  
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-4" 
              onClick={() => thread?.forumId 
                ? setLocation(`/forum/${thread.forumId}`) 
                : setLocation("/forums")
              }
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar para {thread?.forumTitle || "Fóruns"}
            </Button>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">{thread.title}</h1>
              {thread.isPinned && (
                <PinIcon className="h-5 w-5 text-amber-500" />
              )}
              {thread.isLocked && (
                <LockIcon className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex space-x-1">
              {thread.tags && thread.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-4">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {thread.createdAt 
                ? new Date(thread.createdAt).toLocaleDateString('pt-BR')
                : ""}
            </span>
            <span>{thread.viewCount || 0} visualizações</span>
            <span>{thread.replyCount || 0} respostas</span>
          </div>
        </div>
        
        {/* Post principal */}
        <PostCard 
          content={thread.content}
          author={thread.userName}
          avatar={thread.userAvatar}
          role={thread.userRole}
          createdAt={thread.createdAt}
          updatedAt={thread.updatedAt}
          likes={thread.likes}
          dislikes={thread.dislikes}
          userLiked={thread.userLiked}
          userDisliked={thread.userDisliked}
          isThreadAuthor={true}
          onLike={() => likeMutation.mutate()}
          onDislike={() => dislikeMutation.mutate()}
          onDelete={() => deleteThreadMutation.mutate()}
        />
        
        {/* Respostas */}
        {replies.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-semibold">Respostas</h2>
              <Badge className="ml-2 bg-muted text-foreground">{replies.length}</Badge>
            </div>
            <div className="space-y-4">
              {isLoadingReplies ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-gray-100 rounded-md"></div>
                  ))}
                </div>
              ) : (
                sortedReplies.map((reply: Reply) => (
                  <PostCard 
                    key={reply.id}
                    content={reply.content}
                    author={reply.userName}
                    avatar={reply.userAvatar}
                    role={reply.userRole}
                    createdAt={reply.createdAt}
                    updatedAt={reply.updatedAt}
                    likes={reply.likes}
                    dislikes={reply.dislikes}
                    userLiked={reply.userLiked}
                    userDisliked={reply.userDisliked}
                    isAnswer={reply.isAnswer}
                    onLike={() => likeReplyMutation.mutate(reply.id)}
                    onDislike={() => dislikeReplyMutation.mutate(reply.id)}
                    onDelete={() => deleteReplyMutation.mutate(reply.id)}
                    onMarkAsAnswer={() => markAsAnswerMutation.mutate(reply.id)}
                    canMarkAsAnswer={true} // Idealmente, verificar se o usuário é o autor do tópico
                  />
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Formulário de resposta */}
        {!thread.isLocked && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Sua resposta</h3>
            <div className="space-y-4">
              <Textarea 
                placeholder="Escreva sua resposta aqui..." 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-32"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitReply}
                  disabled={isSubmitting || !replyContent.trim()}
                >
                  {isSubmitting ? "Enviando..." : "Responder"}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {thread.isLocked && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md">
            <div className="flex items-center">
              <LockIcon className="h-5 w-5 mr-2" />
              <p>Este tópico está bloqueado e não aceita novas respostas.</p>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}