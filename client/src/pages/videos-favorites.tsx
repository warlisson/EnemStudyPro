import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Play, Clock, Star, BookOpen } from "lucide-react";

export default function VideosFavorites() {
  const [, navigate] = useLocation();
  const userId = 1; // Mock user ID for demo
  
  // Fetch favorite videos
  const { data: videos, isLoading } = useQuery({
    queryKey: ['/api/users', userId, 'videos/favorites'],
    queryFn: async () => {
      try {
        // This endpoint doesn't exist yet, so we'll mock it for now
        // Normally, this would be a real API call
        const response = await fetch(`/api/users/${userId}/videos/favorites`);
        return await response.json();
      } catch (error) {
        // Fallback to demo data
        return [];
      }
    }
  });
  
  // Format duration from seconds to minutes
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
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
  
  // Get color for difficulty badge
  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return "bg-green-100 text-green-800 hover:bg-green-100";
      case 2: return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case 3: return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-green-100 text-green-800 hover:bg-green-100";
    }
  };
  
  return (
    <MainLayout>
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
          <h1 className="text-3xl font-bold tracking-tight">Vídeos Favoritos</h1>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-40" />
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {!videos || videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500 mb-4">Você ainda não adicionou nenhum vídeo aos favoritos.</p>
                <Button onClick={() => navigate("/videos")}>Explorar vídeos</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video: any) => (
                  <Link key={video.id} href={`/video/${video.id}`}>
                    <a className="block h-full">
                      <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                        <div className="relative">
                          <img 
                            src={video.thumbnailUrl || "https://via.placeholder.com/640x360?text=Video+aula"} 
                            alt={video.title}
                            className="w-full aspect-video object-cover" 
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div className="rounded-full bg-white p-3">
                              <Play className="h-6 w-6 text-primary fill-current" />
                            </div>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                          <CardDescription className="flex items-center">
                            {video.professor}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDuration(video.duration)}</span>
                            </Badge>
                            
                            <Badge variant="outline" className={`flex items-center space-x-1 ${getDifficultyColor(video.level)}`}>
                              <BookOpen className="h-3 w-3" />
                              <span>{getDifficultyText(video.level)}</span>
                            </Badge>
                          </div>
                          
                          {video.averageRating > 0 && (
                            <Badge variant="outline" className="flex items-center space-x-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
                              <Star className="h-3 w-3 fill-current" />
                              <span>{video.averageRating.toFixed(1)}</span>
                            </Badge>
                          )}
                        </CardFooter>
                      </Card>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}