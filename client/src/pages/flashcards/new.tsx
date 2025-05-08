import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft, Save, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PageTitle from "@/components/ui/page-title";

// Esquema de validação para o formulário
const flashCardSchema = z.object({
  front: z.string().min(1, { message: "O texto frontal não pode estar vazio" }),
  back: z.string().min(1, { message: "O texto traseiro não pode estar vazio" }),
  subject: z.string().min(1, { message: "Escolha uma disciplina" }),
  difficulty: z.string().optional(),
  tags: z.string().optional(),
  imageUrl: z.string().optional(),
});

type FlashCardFormValues = z.infer<typeof flashCardSchema>;

export default function NewFlashCard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Configurar o formulário
  const form = useForm<FlashCardFormValues>({
    resolver: zodResolver(flashCardSchema),
    defaultValues: {
      front: "",
      back: "",
      subject: "",
      difficulty: "3",
      tags: "",
      imageUrl: "",
    },
  });
  
  // Obter valores atuais do formulário para a pré-visualização
  const watchedValues = form.watch();
  
  // Formatar tags para exibição
  const getFormattedTags = () => {
    if (!watchedValues.tags) return [];
    return watchedValues.tags.split(',').map(tag => tag.trim()).filter(Boolean);
  };
  
  // Converter dificuldade para um nome legível
  const getDifficultyName = (difficultyValue: string) => {
    const difficulty = Number(difficultyValue);
    switch (difficulty) {
      case 1: return "Muito Fácil";
      case 2: return "Fácil";
      case 3: return "Médio";
      case 4: return "Difícil";
      case 5: return "Muito Difícil";
      default: return "Médio";
    }
  };
  
  // Mutação para criar um novo flash card
  const createFlashCardMutation = useMutation({
    mutationFn: async (data: FlashCardFormValues) => {
      // Converter as tags em um array
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      
      // Preparar os dados para envio ao backend
      const flashCardData = {
        front: data.front,
        back: data.back,
        subject: data.subject,
        difficulty: data.difficulty ? Number(data.difficulty) : 3,
        tags: tags,
        imageUrl: data.imageUrl || null,
      };
      
      return apiRequest("POST", "/api/flashcards", flashCardData);
    },
    onSuccess: (data) => {
      // Atualizar a cache
      queryClient.invalidateQueries({ queryKey: ['/api/flashcards'] });
      queryClient.invalidateQueries({ queryKey: ['/api/flashcards/due'] });
      
      // Mostrar mensagem de sucesso
      toast({
        title: "Flash Card criado",
        description: "Seu flash card foi criado com sucesso.",
      });
      
      // Redirecionar para a página de detalhes ou para a lista
      setLocation(`/flashcards/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o flash card. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error creating flash card:", error);
    },
  });
  
  // Função para lidar com o envio do formulário
  const onSubmit = (data: FlashCardFormValues) => {
    createFlashCardMutation.mutate(data);
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => setLocation("/flashcards")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <PageTitle 
            title="Novo Flash Card" 
            description="Crie um novo flash card para memorizar conceitos"
            icon={<BrainCircuit className="h-6 w-6" />}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulário */}
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disciplina</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma disciplina" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="front"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frente (Pergunta)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite a pergunta ou conceito para o flash card"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="back"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verso (Resposta)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite a resposta ou definição para o flash card"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dificuldade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a dificuldade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Muito Fácil</SelectItem>
                          <SelectItem value="2">Fácil</SelectItem>
                          <SelectItem value="3">Médio</SelectItem>
                          <SelectItem value="4">Difícil</SelectItem>
                          <SelectItem value="5">Muito Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecione a dificuldade do conceito para ajustar a frequência de revisão
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Geometria, Trigonometria, Matemática Básica"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Separe as tags com vírgulas. Exemplo: "Álgebra, Polinômios, Equações"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Adicione uma imagem para ilustrar o conceito (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={createFlashCardMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {createFlashCardMutation.isPending ? "Salvando..." : "Salvar Flash Card"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          {/* Pré-visualização */}
          <div>
            <div className="sticky top-24">
              <h3 className="font-medium text-lg mb-4">Pré-visualização</h3>
              
              <Card 
                className={`cursor-pointer overflow-hidden h-80 shadow-md transition-all duration-300 ${isFlipped ? 'bg-primary-50' : 'bg-white'}`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {watchedValues.subject ? 
                        watchedValues.subject.charAt(0).toUpperCase() + watchedValues.subject.slice(1) : 
                        "Disciplina"
                      }
                    </CardTitle>
                    {watchedValues.difficulty && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {getDifficultyName(watchedValues.difficulty)}
                      </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="flex items-center justify-center h-full">
                  <div className={`transition-opacity duration-300 ${isFlipped ? 'opacity-0 absolute' : 'opacity-100'}`}>
                    <div className="text-center p-4">
                      <p className="text-lg font-medium">
                        {watchedValues.front || "Frente do flash card (pergunta)"}
                      </p>
                      
                      {watchedValues.imageUrl && (
                        <div className="mt-4 flex justify-center">
                          <img 
                            src={watchedValues.imageUrl} 
                            alt="Preview" 
                            className="max-h-28 max-w-full rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/400x200/eee/ccc?text=Imagem+Inválida";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={`transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 absolute'}`}>
                    <div className="text-center p-4">
                      <p className="text-lg">
                        {watchedValues.back || "Verso do flash card (resposta)"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2 border-t">
                  <div className="w-full flex gap-2 flex-wrap">
                    {getFormattedTags().slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-muted text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {getFormattedTags().length > 3 && (
                      <span className="bg-muted text-xs px-2 py-1 rounded">
                        +{getFormattedTags().length - 3}
                      </span>
                    )}
                  </div>
                </CardFooter>
              </Card>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Clique no card para ver o {isFlipped ? "frente" : "verso"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}