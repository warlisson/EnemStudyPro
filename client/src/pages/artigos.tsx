import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Search, BookOpen, Calendar, Tag } from "lucide-react";

export default function Artigos() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("todos");

  // Fetch articles
  const { data: articles, isLoading } = useQuery({
    queryKey: ['/api/materials'],
  });

  // Filter articles based on search term and selected subject
  const filteredArticles = articles 
    ? articles.filter((article: any) => {
        const matchesSearch = searchTerm === "" || 
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSubject = selectedSubject === "todos" || 
          article.subject.toLowerCase() === selectedSubject.toLowerCase();
        
        return matchesSearch && matchesSubject;
      })
    : [];

  // Extract unique subjects
  const uniqueSubjects = articles
    ? Array.from(new Set(articles.map((article: any) => article.subject)))
    : [];

  // Format read time
  const formatReadTime = (minutes: number) => {
    if (!minutes) return "Leitura rápida";
    return `${minutes} min de leitura`;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artigos e Materiais</h1>
          <p className="text-muted-foreground">
            Conteúdos teóricos e materiais de estudo para o ENEM
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar artigos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="todos" value={selectedSubject} onValueChange={setSelectedSubject}>
        <TabsList className="mb-4 flex flex-nowrap overflow-x-auto">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          {uniqueSubjects.map((subject: string) => (
            <TabsTrigger key={subject} value={subject}>
              {subject}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="todos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </CardContent>
                </Card>
              ))
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article: any) => (
                <Card 
                  key={article.id} 
                  className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
                >
                  {article.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatReadTime(article.readTime)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                      {article.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {article.subject}
                      </Badge>
                      {article.topics && Array.isArray(article.topics) && article.topics.length > 0 && (
                        <Badge variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {article.topics[0]}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => navigate(`/artigos/${article.id}`)}
                      variant="outline" 
                      className="w-full"
                    >
                      Ler artigo
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">Nenhum artigo encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar seus filtros ou termos de busca.
                </p>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchTerm("")}
                  >
                    Limpar busca
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {uniqueSubjects.map((subject: string) => (
          <TabsContent key={subject} value={subject} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article: any) => (
                <Card 
                  key={article.id} 
                  className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
                >
                  {article.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatReadTime(article.readTime)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                      {article.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {article.subject}
                      </Badge>
                      {article.topics && Array.isArray(article.topics) && article.topics.length > 0 && (
                        <Badge variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {article.topics[0]}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => navigate(`/artigos/${article.id}`)}
                      variant="outline" 
                      className="w-full"
                    >
                      Ler artigo
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}