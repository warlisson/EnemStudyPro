import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Clock, BookOpen, Tag, Share2, Bookmark, ThumbsUp, Calendar } from "lucide-react";

export default function ArtigoDetail() {
  const { id } = useParams();
  const articleId = parseInt(id || "");
  const [, navigate] = useLocation();

  // Fetch article details
  const { data: article, isLoading } = useQuery({
    queryKey: ['/api/materials', articleId],
    enabled: !isNaN(articleId)
  });

  // Format read time
  const formatReadTime = (minutes: number) => {
    if (!minutes) return "Leitura rápida";
    return `${minutes} min de leitura`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (isNaN(articleId)) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h1 className="text-2xl font-bold mb-4">ID de artigo inválido</h1>
        <Button onClick={() => navigate("/artigos")}>Voltar para artigos</Button>
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

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
        <Button onClick={() => navigate("/artigos")}>Voltar para artigos</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/artigos")}
          className="flex items-center mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
      </div>

      {article.image && (
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-6">
          {article.createdAt && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
          )}
          
          {article.readTime > 0 && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatReadTime(article.readTime)}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{article.subject}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {article.topics && Array.isArray(article.topics) && article.topics.map((topic: string) => (
            <Badge key={topic} variant="secondary">
              <Tag className="h-3 w-3 mr-1" />
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <p className="text-lg font-medium text-muted-foreground">
          {article.description}
        </p>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      <article className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>

      <Separator className="my-6" />

      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Materiais relacionados</h3>
          <p className="text-gray-500 mb-4">
            Continue estudando sobre {article.subject} com estes conteúdos:
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate(`/artigos?subject=${article.subject}`)}>
              Mais artigos sobre {article.subject}
            </Button>
            <Button variant="outline" onClick={() => navigate(`/videos?subject=${article.subject}`)}>
              Vídeos sobre {article.subject}
            </Button>
            <Button variant="outline" onClick={() => navigate(`/questoes?subject=${article.subject}`)}>
              Questões de {article.subject}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}