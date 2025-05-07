import { StudyMaterialCard } from "@/components/ui/study-material-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Box } from "lucide-react";

export default function Novidades() {
  // Fetch news data
  const { data: newsData, isLoading: loadingNews } = useQuery({
    queryKey: ['/api/news'],
  });

  // Dummy data for demonstration
  const newsItems = [
    {
      id: 1,
      title: "Hereditariedade: o que é, conceitos importantes e como cai no vestibular",
      description: "Nossos olhos, nosso cabelo, a cor da nossa pele e nossa altura. O que tudo isso tem em comum? Todas estas características são herdadas de nossos pais. É sobre o modo como isso ocorre que falaremos aqui.",
      category: "Biologia",
      image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      time: "há um dia"
    },
    {
      id: 2,
      title: "Globalização: conceito, características e impactos",
      description: "Entenda o que é a globalização, suas características principais e os impactos socioeconômicos e culturais no mundo contemporâneo.",
      category: "Geografia",
      image: "https://images.unsplash.com/photo-1532299033990-5bf9c755c0b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      time: "há 3 dias"
    },
    {
      id: 3,
      title: "Auguste Comte e o positivismo: principais ideias",
      description: "Conheça as principais ideias do filósofo francês Auguste Comte, fundador do positivismo, e a influência dessa corrente de pensamento.",
      category: "Filosofia",
      image: "https://images.unsplash.com/photo-1582034438086-cb123ba5fdb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      time: "há 5 dias"
    },
    {
      id: 4,
      title: "Como entender e aprender o cubo mágico",
      description: "O cubo de Rubik, ou cubo mágico, é um quebra-cabeça tridimensional que pode ajudar a desenvolver habilidades importantes para a matemática e raciocínio lógico.",
      category: "Matemática",
      image: "https://images.unsplash.com/photo-1496354265829-17b1c7b7c363?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      time: "há 1 semana"
    },
  ];

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { bg: string, text: string }> = {
      "Biologia": { bg: "bg-green-100", text: "text-green-600" },
      "Português": { bg: "bg-blue-100", text: "text-blue-600" },
      "Matemática": { bg: "bg-green-100", text: "text-green-600" },
      "Física": { bg: "bg-yellow-100", text: "text-yellow-600" },
      "Química": { bg: "bg-green-100", text: "text-green-600" },
      "História": { bg: "bg-red-100", text: "text-red-600" },
      "Geografia": { bg: "bg-orange-100", text: "text-orange-600" },
      "Literatura": { bg: "bg-purple-100", text: "text-purple-600" },
      "Inglês": { bg: "bg-blue-100", text: "text-blue-600" },
      "Filosofia": { bg: "bg-indigo-100", text: "text-indigo-600" },
    };
    
    return styles[category] || { bg: "bg-gray-100", text: "text-gray-600" };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Novidades</h1>
        <p className="text-neutral-600">Mantenha-se atualizado com os últimos conteúdos e recursos.</p>
      </header>

      {/* Hero Banner */}
      <div className="bg-primary rounded-xl overflow-hidden relative mb-12">
        <div className="flex flex-col md:flex-row">
          <div className="p-8 md:w-7/12 z-10">
            <h2 className="text-white text-2xl font-bold mb-4">Boas-vindas! Vamos estudar?</h2>
            <p className="text-primary-100 mb-6">
              Olá, estamos muito felizes que você está aqui! Saiba mais sobre
              nossa missão, nossos valores e por qual motivo queremos lhe
              ajudar a alcançar o tão sonhado vaga no ensino superior.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" className="bg-white hover:bg-neutral-100 text-primary">
                <Box className="mr-2 h-4 w-4" />
                Conheça o Prisma
              </Button>
              <Button className="bg-primary-700 hover:bg-primary-800 text-white">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Comece a praticar
              </Button>
            </div>
          </div>
          <div className="md:w-5/12 relative">
            <img 
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=800" 
              alt="Estudante se preparando para o ENEM" 
              className="h-full w-full object-cover md:absolute inset-0" 
            />
            
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 h-6 w-6 bg-orange-400 rounded-full"></div>
            <div className="absolute top-20 right-20 h-4 w-4 bg-blue-400 rounded-full"></div>
            <div className="absolute bottom-10 right-10 h-8 w-8 bg-white opacity-50 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="destaques" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="destaques">Destaques</TabsTrigger>
          <TabsTrigger value="dicas">Dicas de estudo</TabsTrigger>
          <TabsTrigger value="fala">Fala Professor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="destaques">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item) => {
              const style = getCategoryStyle(item.category);
              return (
                <StudyMaterialCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  category={item.category}
                  categoryBg={style.bg}
                  categoryColor={style.text}
                  href={`/materiais/${item.id}`}
                />
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="dicas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.slice(0, 2).map((item) => {
              const style = getCategoryStyle(item.category);
              return (
                <StudyMaterialCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  category={item.category}
                  categoryBg={style.bg}
                  categoryColor={style.text}
                  href={`/materiais/${item.id}`}
                />
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="fala">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.slice(1, 3).map((item) => {
              const style = getCategoryStyle(item.category);
              return (
                <StudyMaterialCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  category={item.category}
                  categoryBg={style.bg}
                  categoryColor={style.text}
                  href={`/materiais/${item.id}`}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recently Added */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Adicionados Recentemente</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.slice(0, 3).map((item) => {
            const style = getCategoryStyle(item.category);
            return (
              <StudyMaterialCard
                key={item.id}
                title={item.title}
                description={item.description}
                image={item.image}
                category={item.category}
                categoryBg={style.bg}
                categoryColor={style.text}
                href={`/materiais/${item.id}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
