import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Star,
  Heart,
  MessageSquare,
  Download,
  Share2,
  CheckCircle,
  BookOpenCheck,
  ThumbsUp,
  Eye
} from "lucide-react";

export default function VideoDetail() {
  const { id } = useParams();
  const videoId = parseInt(id || "");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const queryClient = useQueryClient();
  const userId = 1; // Mock user ID for demo

  const [activeTab, setActiveTab] = useState("description");
  const [currentProgress, setCurrentProgress] = useState(0);
  const [comment, setComment] = useState("");
  const [isQuestion, setIsQuestion] = useState(false);

  // Fetch video details
  const { data: video, isLoading } = useQuery({
    queryKey: ['/api/videos', videoId],
    enabled: !isNaN(videoId)
  });

  // Fetch video progress
  const { data: progress } = useQuery({
    queryKey: ['/api/videos', videoId, 'progress'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/videos/${videoId}/progress?userId=${userId}`);
        return await response.json();
      } catch (error) {
        return { progress: 0, watched: false, favorite: false };
      }
    },
    enabled: !isNaN(videoId)
  });

  // Fetch comments
  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ['/api/videos', videoId, 'comments'],
    enabled: !isNaN(videoId) && activeTab === "comments"
  });

  // Fetch exercises
  const { data: exercises } = useQuery({
    queryKey: ['/api/videos', videoId, 'exercises'],
    enabled: !isNaN(videoId) && activeTab === "exercises"
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: { userId: number, progress: number }) => {
      return apiRequest("POST", `/api/videos/${videoId}/progress`, progressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos', videoId, 'progress'] });
    }
  });

  // Toggle watched mutation
  const toggleWatchedMutation = useMutation({
    mutationFn: async (watched: boolean) => {
      return apiRequest("POST", `/api/videos/${videoId}/watched`, { userId, watched });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos', videoId, 'progress'] });
      toast({
        title: progress?.watched ? "Vídeo marcado como não assistido" : "Vídeo marcado como assistido",
        description: "Seu progresso foi atualizado.",
      });
    }
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/videos/${videoId}/favorite`, { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos', videoId, 'progress'] });
      toast({
        title: progress?.favorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: progress?.favorite ? "O vídeo foi removido da sua lista de favoritos." : "O vídeo foi adicionado à sua lista de favoritos.",
      });
    }
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (commentData: { userId: number, content: string, isQuestion: boolean }) => {
      return apiRequest("POST", `/api/videos/${videoId}/comments`, commentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos', videoId, 'comments'] });
      setComment("");
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi publicado com sucesso.",
      });
    }
  });

  // Handle time update to track progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const progress = video.currentTime / video.duration;
      setCurrentProgress(progress);
      
      // Throttle progress updates to reduce API calls
      if (Math.abs(progress - (progress?.progress || 0)) > 0.05) {
        updateProgressMutation.mutate({ userId, progress });
      }
    }
  };

  // Load saved progress when video is loaded
  useEffect(() => {
    if (videoRef.current && progress && progress.progress > 0) {
      const video = videoRef.current;
      if (video.readyState >= 2) { // Has enough data to seek
        video.currentTime = video.duration * progress.progress;
      } else {
        // Wait for video to be loaded enough to seek
        const handleCanPlay = () => {
          video.currentTime = video.duration * progress.progress;
          video.removeEventListener('canplay', handleCanPlay);
        };
        video.addEventListener('canplay', handleCanPlay);
        return () => video.removeEventListener('canplay', handleCanPlay);
      }
    }
  }, [progress, videoRef.current?.readyState]);

  // Format duration from seconds to minutes
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Map difficulty level to text
  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1: return "Básico";
      case 2: return "Intermediário";
      case 3: return "Avançado";
      default: return "Básico";
    }
  };

  // Handle submit comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      addCommentMutation.mutate({
        userId,
        content: comment,
        isQuestion
      });
    }
  };

  // Handle toggle watched
  const handleToggleWatched = () => {
    toggleWatchedMutation.mutate(!progress?.watched);
  };

  // Handle toggle favorite
  const handleToggleFavorite = () => {
    toggleFavoriteMutation.mutate();
  };

  if (isNaN(videoId)) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h1 className="text-2xl font-bold mb-4">ID de vídeo inválido</h1>
        <Button onClick={() => navigate("/videos")}>Voltar para vídeos</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h1 className="text-2xl font-bold mb-4">Vídeo não encontrado</h1>
        <Button onClick={() => navigate("/videos")}>Voltar para vídeos</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/videos")}
          className="flex items-center mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex-grow truncate">
          {video.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              controls
              className="w-full aspect-video"
              onTimeUpdate={handleTimeUpdate}
            ></video>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleWatched}
                className={cn(
                  "flex items-center",
                  progress?.watched && "bg-primary/10"
                )}
              >
                {progress?.watched ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Assistido
                  </>
                ) : (
                  <>
                    <BookOpenCheck className="h-4 w-4 mr-2" />
                    Marcar como assistido
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleFavorite}
                className={cn(
                  "flex items-center",
                  progress?.favorite && "bg-primary/10"
                )}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 mr-2",
                    progress?.favorite && "fill-red-500 text-red-500"
                  )}
                />
                {progress?.favorite ? "Favoritado" : "Favoritar"}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              {video.attachments && video.attachments.length > 0 && (
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(video.duration)}</span>
            </Badge>

            <Badge variant="outline" className="flex items-center space-x-1">
              <BookOpen className="h-3 w-3" />
              <span>{getDifficultyText(video.level)}</span>
            </Badge>

            {video.viewCount && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{video.viewCount} visualizações</span>
              </Badge>
            )}

            {video.averageRating > 0 && (
              <Badge
                variant="outline"
                className="flex items-center space-x-1 bg-amber-100 text-amber-800"
              >
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span>{video.averageRating.toFixed(1)}</span>
              </Badge>
            )}
          </div>

          {currentProgress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progresso</span>
                <span>{Math.round(currentProgress * 100)}%</span>
              </div>
              <Progress value={currentProgress * 100} className="h-2" />
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 grid grid-cols-3 lg:grid-cols-4">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="materials">Materiais</TabsTrigger>
              <TabsTrigger value="exercises">Exercícios</TabsTrigger>
              <TabsTrigger value="comments">Comentários</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Sobre esta aula</h3>
                <p className="text-gray-700 whitespace-pre-line">{video.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Professor</h3>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{video.professor ? video.professor.charAt(0) : 'P'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{video.professor || 'Professor'}</p>
                    <p className="text-sm text-muted-foreground">Professor de {video.subject || 'ENEM'}</p>
                  </div>
                </div>
              </div>

              {video.topics && video.topics.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-2">Tópicos abordados</h3>
                  <div className="flex flex-wrap gap-2">
                    {video.topics.map((topic: string) => (
                      <Badge key={topic} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              {video.attachments && video.attachments.length > 0 ? (
                <div>
                  <h3 className="text-xl font-bold mb-4">Materiais Complementares</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {video.attachments.map((attachment: any, index: number) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{attachment.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button asChild variant="outline" className="w-full">
                            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">Nenhum material complementar disponível para esta aula.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="exercises" className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Exercícios Relacionados</h3>
              {exercises?.length > 0 ? (
                <div className="space-y-6">
                  {exercises.map((exercise: any) => (
                    <Card key={exercise.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">Questão {exercise.id}</CardTitle>
                        <CardDescription>{exercise.examYear || "ENEM"}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <p className="whitespace-pre-line">{exercise.content}</p>
                        </div>
                        
                        <div className="space-y-2">
                          {exercise.options && exercise.options.map((option: any) => (
                            <div 
                              key={option.id} 
                              className={cn(
                                "p-3 rounded-md border",
                                exercise.answer === option.id ? "border-green-500 bg-green-50" : "border-gray-200"
                              )}
                            >
                              <p className="flex">
                                <span className="font-medium mr-2">{option.id.toUpperCase()})</span>
                                <span>{option.text}</span>
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        {exercise.explanation && (
                          <div className="mt-4 p-4 rounded-md bg-blue-50 border border-blue-200">
                            <h4 className="font-semibold mb-1">Resolução:</h4>
                            <p className="whitespace-pre-line">{exercise.explanation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">Nenhum exercício disponível para esta aula.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Deixe seu comentário ou dúvida</h3>
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <Textarea
                    placeholder="Escreva seu comentário ou dúvida aqui..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isQuestion"
                        checked={isQuestion}
                        onChange={(e) => setIsQuestion(e.target.checked)}
                        className="rounded text-primary"
                      />
                      <label htmlFor="isQuestion" className="text-sm">
                        Marcar como dúvida
                      </label>
                    </div>
                    <Button
                      type="submit"
                      disabled={!comment.trim() || addCommentMutation.isPending}
                    >
                      {addCommentMutation.isPending ? (
                        <>Enviando...</>
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Enviar
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Comentários</h3>
                {comments?.length > 0 ? (
                  <div className="space-y-6">
                    {comments.length > 0 ? (
                      comments.map((comment: any) => (
                        <Card key={comment.id} className={comment.isQuestion ? "border-primary" : ""}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    Usuário
                                    {comment.isProfessorResponse && (
                                      <Badge className="ml-2" variant="outline">
                                        Professor
                                      </Badge>
                                    )}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {comment.isQuestion && (
                                <Badge variant="outline" className="bg-primary/10 text-primary">
                                  Dúvida
                                </Badge>
                              )}
                            </div>
                            <CardDescription>{comment.content}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center space-x-2 text-sm">
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <ThumbsUp className="mr-1 h-3 w-3" />
                                <span>Útil</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <MessageSquare className="mr-1 h-3 w-3" />
                                <span>Responder</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        Nenhum comentário ainda. Seja o primeiro a comentar!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg text-gray-500">Seja o primeiro a comentar!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Vídeos Relacionados</CardTitle>
              <CardDescription>Mais sobre {video.subject || 'ENEM'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="text-sm" asChild>
                  <Link href="/videos">
                    Todos os vídeos
                  </Link>
                </Button>
                {video.subject && (
                  <Button variant="outline" className="text-sm" asChild>
                    <Link href={`/videos?subject=${video.subject}`}>
                      {video.subject}
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}