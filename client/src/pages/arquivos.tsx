import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Folder,
  File,
  FileText,
  Search,
  Download,
  FilePlus2,
  FolderPlus,
  Grid2X2,
  List,
  MoreHorizontal,
  ArrowUpDown,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Tipo para pastas
interface Folder {
  id: string;
  name: string;
  itemCount: number;
  updatedAt: string;
}

// Tipo para arquivos
interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
  downloadUrl?: string;
  subject?: string;
}

export default function Arquivos() {
  const [, navigate] = useLocation();
  const { folderId } = useParams();
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("todos");

  // Mock data para pastas 
  const rootFolders: Folder[] = [
    { id: "materiais", name: "Materiais de Estudo", itemCount: 24, updatedAt: "2023-12-10" },
    { id: "resumos", name: "Resumos", itemCount: 18, updatedAt: "2023-12-15" },
    { id: "exercicios", name: "Exercícios Resolvidos", itemCount: 45, updatedAt: "2023-12-05" },
    { id: "provas", name: "Provas Anteriores", itemCount: 32, updatedAt: "2023-11-30" },
    { id: "livros", name: "Livros Digitais", itemCount: 12, updatedAt: "2023-12-01" },
    { id: "outros", name: "Outros Documentos", itemCount: 8, updatedAt: "2023-12-20" },
  ];

  // Mock data para subpastas e arquivos - simulando a navegação
  const subFolders: Record<string, Folder[]> = {
    "materiais": [
      { id: "materiais-portugues", name: "Português", itemCount: 7, updatedAt: "2023-12-10" },
      { id: "materiais-matematica", name: "Matemática", itemCount: 8, updatedAt: "2023-12-12" },
      { id: "materiais-fisica", name: "Física", itemCount: 4, updatedAt: "2023-12-15" },
      { id: "materiais-quimica", name: "Química", itemCount: 5, updatedAt: "2023-12-08" },
    ],
    "resumos": [
      { id: "resumos-literatura", name: "Literatura", itemCount: 5, updatedAt: "2023-12-15" },
      { id: "resumos-historia", name: "História", itemCount: 6, updatedAt: "2023-12-11" },
      { id: "resumos-geografia", name: "Geografia", itemCount: 4, updatedAt: "2023-12-13" },
      { id: "resumos-biologia", name: "Biologia", itemCount: 3, updatedAt: "2023-12-14" },
    ],
  };

  // Mock data para arquivos em subpastas
  const files: Record<string, FileItem[]> = {
    "materiais-portugues": [
      { id: "file1", name: "Gramática completa para o ENEM", type: "pdf", size: "2.4 MB", updatedAt: "2023-12-08", subject: "Português" },
      { id: "file2", name: "Interpretação de textos - técnicas avançadas", type: "pdf", size: "1.8 MB", updatedAt: "2023-12-05", subject: "Português" },
      { id: "file3", name: "Figuras de linguagem", type: "pdf", size: "1.2 MB", updatedAt: "2023-12-10", subject: "Português" },
      { id: "file4", name: "Redação dissertativa - estrutura e exemplos", type: "docx", size: "950 KB", updatedAt: "2023-12-09", subject: "Português" },
      { id: "file5", name: "Lista de exercícios - concordância verbal", type: "pdf", size: "1.1 MB", updatedAt: "2023-12-07", subject: "Português" },
    ],
    "materiais-matematica": [
      { id: "file6", name: "Fórmulas essenciais para o ENEM", type: "pdf", size: "3.2 MB", updatedAt: "2023-12-11", subject: "Matemática" },
      { id: "file7", name: "Geometria espacial - guia completo", type: "pdf", size: "4.5 MB", updatedAt: "2023-12-12", subject: "Matemática" },
      { id: "file8", name: "Funções - teoria e exercícios", type: "pdf", size: "2.8 MB", updatedAt: "2023-12-10", subject: "Matemática" },
      { id: "file9", name: "Trigonometria na prática", type: "pdf", size: "1.9 MB", updatedAt: "2023-12-09", subject: "Matemática" },
    ],
    "resumos-literatura": [
      { id: "file10", name: "Resumo - Realismo e Naturalismo", type: "pdf", size: "1.5 MB", updatedAt: "2023-12-14", subject: "Literatura" },
      { id: "file11", name: "Modernismo brasileiro - principais obras", type: "pdf", size: "2.1 MB", updatedAt: "2023-12-15", subject: "Literatura" },
      { id: "file12", name: "Quincas Borba - análise completa", type: "docx", size: "1.8 MB", updatedAt: "2023-12-13", subject: "Literatura" },
    ],
  };

  // Função para determinar o conteúdo com base na navegação
  const getCurrentFolderContent = () => {
    if (!folderId) {
      return { folders: rootFolders, files: [], currentPath: "/" };
    } 
    
    // Verificar se é uma pasta raiz com subpastas
    if (subFolders[folderId]) {
      const parentFolder = rootFolders.find(f => f.id === folderId);
      return { 
        folders: subFolders[folderId], 
        files: [], 
        currentPath: `/${parentFolder?.name || folderId}/` 
      };
    }
    
    // Se é uma subpasta com arquivos
    for (const parentId in subFolders) {
      const subFolder = subFolders[parentId].find(f => f.id === folderId);
      if (subFolder) {
        const rootFolder = rootFolders.find(f => f.id === parentId);
        return { 
          folders: [], 
          files: files[folderId] || [], 
          currentPath: `/${rootFolder?.name || parentId}/${subFolder.name}/` 
        };
      }
    }
    
    return { folders: [], files: [], currentPath: "/" };
  };

  const { folders, files: folderFiles, currentPath } = getCurrentFolderContent();

  // Filtragem baseada na busca
  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredFiles = folderFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === "todos" || 
      (file.subject && file.subject.toLowerCase() === selectedTab.toLowerCase());
    return matchesSearch && matchesTab;
  });

  // Ordenação
  const sortedFolders = [...filteredFolders].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  // Extrair disciplinas únicas dos arquivos para as tabs
  const subjects = Array.from(new Set(folderFiles.map(file => file.subject).filter(Boolean)));

  // Função para obter cor baseada no tipo de arquivo
  const getFileIconColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return "text-red-500";
      case 'docx':
      case 'doc':
        return "text-blue-500";
      case 'xlsx':
      case 'xls':
        return "text-green-500";
      case 'pptx':
      case 'ppt':
        return "text-orange-500";
      case 'txt':
        return "text-gray-500";
      default:
        return "text-neutral-500";
    }
  };

  // Função para obter ícone baseado no tipo de arquivo
  const FileIcon = ({ type }: { type: string }) => {
    const iconClass = getFileIconColor(type);
    return <FileText className={`h-6 w-6 ${iconClass}`} />;
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Função para voltar para a pasta anterior
  const navigateBack = () => {
    if (!folderId) return;
    
    // Se estamos em uma subpasta de arquivos, voltar para a pasta pai
    for (const parentId in subFolders) {
      if (subFolders[parentId].some(f => f.id === folderId)) {
        return navigate(`/arquivos/${parentId}`);
      }
    }
    
    // Se estamos em uma pasta raiz, voltar para a raiz
    navigate("/arquivos");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Arquivos</h1>
          <p className="text-muted-foreground">
            Acesse materiais de estudo, resumos e documentos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <FolderPlus className="h-4 w-4 mr-2" />
            Nova pasta
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <FilePlus2 className="h-4 w-4 mr-2" />
            Novo arquivo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
        <div className="space-y-4">
          {/* Barra de navegação e busca */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={() => navigate("/arquivos")}
              >
                Início
              </Button>
              
              {currentPath !== "/" && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  {currentPath.split('/').filter(Boolean).map((segment, i, arr) => (
                    <div key={i} className="flex items-center">
                      <span className="px-2">{segment}</span>
                      {i < arr.length - 1 && <ChevronRight className="h-4 w-4" />}
                    </div>
                  ))}
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar arquivos..."
                  className="pl-8 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    {sortBy === "name" ? "Nome" : "Data"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    Nome
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("date")}>
                    Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="bg-gray-200 rounded-md p-0.5 flex">
                <Button
                  variant={viewType === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewType("grid")}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewType === "list" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewType("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navegação entre pastas */}
          {folderId && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={navigateBack}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
          )}

          {/* Tabs para filtrar por disciplina (apenas quando há arquivos) */}
          {folderFiles.length > 0 && subjects.length > 0 && (
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="bg-gray-100">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                {subjects.map((subject) => (
                  <TabsTrigger key={subject} value={subject || ""}>
                    {subject}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          {/* Conteúdo principal - Pastas e Arquivos */}
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Pastas */}
              {sortedFolders.map((folder) => (
                <Card 
                  key={folder.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/arquivos/${folder.id}`)}
                >
                  <CardContent className="p-4 flex flex-col gap-2">
                    <div className="flex items-center">
                      <Folder className="h-10 w-10 text-blue-500" />
                      <div className="ml-3">
                        <p className="font-medium line-clamp-1">{folder.name}</p>
                        <p className="text-xs text-muted-foreground">{folder.itemCount} itens</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Arquivos */}
              {sortedFiles.map((file) => (
                <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col gap-2">
                    <div className="flex items-center">
                      <FileIcon type={file.type} />
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="font-medium line-clamp-1">{file.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="uppercase">{file.type}</span>
                          <span className="mx-1">•</span>
                          <span>{file.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {file.subject && (
                        <Badge variant="outline" className="text-xs">
                          {file.subject}
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {/* Cabeçalho da lista */}
              <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_auto] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground bg-gray-100 rounded-md">
                <div>Nome</div>
                <div>Tamanho</div>
                <div>Data</div>
                <div></div>
              </div>
              
              {/* Pastas */}
              {sortedFolders.map((folder) => (
                <div 
                  key={folder.id}
                  className="grid grid-cols-[3fr_1fr_1fr_auto] md:grid-cols-[3fr_1fr_1fr_auto] gap-4 px-4 py-3 items-center border rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/arquivos/${folder.id}`)}
                >
                  <div className="flex items-center">
                    <Folder className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="font-medium truncate">{folder.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground hidden md:block">
                    {folder.itemCount} itens
                  </div>
                  <div className="text-sm text-muted-foreground hidden md:block">
                    {formatDate(folder.updatedAt)}
                  </div>
                  <div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Arquivos */}
              {sortedFiles.map((file) => (
                <div 
                  key={file.id}
                  className="grid grid-cols-[3fr_1fr_1fr_auto] md:grid-cols-[3fr_1fr_1fr_auto] gap-4 px-4 py-3 items-center border rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <FileIcon type={file.type} />
                    <div className="ml-3 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      {file.subject && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {file.subject}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {file.size}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(file.updatedAt)}
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Clock className="h-4 w-4 mr-2" />
                          Ver histórico
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              
              {/* Mensagem quando não há conteúdo para exibir */}
              {sortedFolders.length === 0 && sortedFiles.length === 0 && (
                <div className="text-center py-12">
                  <File className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium mb-2">Nenhum arquivo encontrado</h3>
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
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Armazenamento</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Usado</span>
                  <span className="font-medium">2.4 GB</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-primary rounded-full" style={{ width: "40%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground">6 GB total</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Arquivos recentes</h3>
              <div className="space-y-3">
                {[
                  { name: "Resumo de Matemática - Funções", type: "pdf", date: "Hoje" },
                  { name: "Lista exercícios de Física", type: "docx", date: "Ontem" },
                  { name: "Redação modelo dissertativo", type: "pdf", date: "2 dias atrás" },
                ].map((file, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FileIcon type={file.type} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <Button variant="ghost" size="sm" className="w-full">
                Ver todos
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Categorias</h3>
              <div className="space-y-2">
                {[
                  { name: "Materiais de Estudo", count: 24, color: "bg-blue-100 text-blue-800" },
                  { name: "Resumos", count: 18, color: "bg-purple-100 text-purple-800" },
                  { name: "Exercícios", count: 45, color: "bg-green-100 text-green-800" },
                  { name: "Provas", count: 32, color: "bg-yellow-100 text-yellow-800" },
                ].map((category, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      const catId = category.name.toLowerCase().replace(/\s+/g, '-');
                      navigate(`/arquivos/${catId}`);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Badge className={category.color}>{category.count}</Badge>
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}