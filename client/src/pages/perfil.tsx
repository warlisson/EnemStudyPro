import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  User, 
  Settings, 
  Bell, 
  CreditCard, 
  Edit3, 
  Camera, 
  LogOut, 
  Key,
  Shield
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PageTitle from "@/components/ui/page-title";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface ProfileData {
  id: number;
  username: string;
  email: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  phoneNumber: string;
  school: string;
  targetExam: string;
  state: string;
  city: string;
  birthDate: string;
  xp: number;
  level: number;
  premium: boolean;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    weeklyReports: boolean;
    newContentAlerts: boolean;
    studyReminders: boolean;
    dueFlashcards: boolean;
    recommendedMaterials: boolean;
  };
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  
  // Buscar dados do perfil
  const { 
    data: profile,
    isLoading,
    error 
  } = useQuery<ProfileData>({
    queryKey: ['/api/users/me'],
    onSuccess: (data) => {
      setFormData(data);
    }
  });
  
  // Mutação para atualizar o perfil
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileData>) => {
      return apiRequest("PATCH", "/api/users/me", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      setEditMode(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    }
  });
  
  // Mutação para atualizar preferências de notificação
  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: Partial<ProfileData['preferences']>) => {
      return apiRequest("PATCH", "/api/users/me/preferences", preferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram atualizadas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar suas preferências. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error updating preferences:", error);
    }
  });
  
  // Mutação para atualizar avatar
  const updateAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      return fetch('/api/users/me/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
      setAvatarDialogOpen(false);
      setAvatarPreview(null);
      setAvatarFile(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar sua foto. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error updating avatar:", error);
    }
  });
  
  // Mutação para alterar senha
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return apiRequest("POST", "/api/users/me/change-password", data);
    },
    onSuccess: () => {
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
      setIsPasswordDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar a senha. Verifique sua senha atual e tente novamente.",
        variant: "destructive",
      });
      console.error("Error changing password:", error);
    }
  });
  
  // Handler para atualizar preferências
  const handlePreferenceChange = (key: keyof ProfileData['preferences'], value: boolean) => {
    if (!profile) return;
    
    const updatedPreferences = {
      ...profile.preferences,
      [key]: value
    };
    
    updatePreferencesMutation.mutate(updatedPreferences);
  };
  
  // Handler para mudança de campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handler para envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };
  
  // Handler para seleção de avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handler para envio de avatar
  const handleAvatarSubmit = () => {
    if (avatarFile) {
      updateAvatarMutation.mutate(avatarFile);
    }
  };
  
  // Handler para alterar senha
  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Campos em branco",
        description: "Preencha todos os campos para alterar sua senha.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas diferentes",
        description: "A nova senha e a confirmação não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };
  
  // Renderizar carregando
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex items-center mb-8">
          <PageTitle 
            title="Carregando perfil..." 
            icon={<User className="h-6 w-6" />}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-48 bg-gray-100 animate-pulse rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
            <div className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Renderizar erro
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex items-center mb-8">
          <PageTitle 
            title="Perfil" 
            icon={<User className="h-6 w-6" />}
          />
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Ocorreu um erro ao carregar seu perfil. Tente novamente mais tarde.
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/users/me'] })}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return null;
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="flex items-center mb-8">
        <PageTitle 
          title="Meu Perfil" 
          description="Gerencie suas informações e preferências"
          icon={<User className="h-6 w-6" />}
        />
      </div>
      
      <div className="bg-card rounded-lg p-6 mb-8 border">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={profile.avatarUrl} alt={profile.username} />
              <AvatarFallback className="text-xl">{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                  <Camera className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alterar foto de perfil</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarPreview || profile.avatarUrl} />
                      <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Selecione uma nova imagem</Label>
                    <Input 
                      id="avatar" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarChange} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setAvatarDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAvatarSubmit}
                    disabled={!avatarFile || updateAvatarMutation.isPending}
                  >
                    {updateAvatarMutation.isPending ? "Enviando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold">{profile.fullName || profile.username}</h2>
            <p className="text-muted-foreground">{profile.email}</p>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <div className="flex items-center justify-center md:justify-start gap-1 text-sm text-primary">
                <div className="flex items-center bg-primary/10 px-2 py-1 rounded">
                  <span className="font-semibold">Nível {profile.level}</span>
                </div>
                <div className="w-24 h-2 bg-primary/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${(profile.xp % 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs">{profile.xp} XP</span>
              </div>
              
              {profile.premium && (
                <div className="flex items-center justify-center md:justify-start text-sm">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    Premium
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex justify-end">
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => setEditMode(!editMode)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {editMode ? "Cancelar" : "Editar Perfil"}
            </Button>
          </div>
        </div>
        
        {profile.bio && !editMode && (
          <div className="mt-6">
            <p className="text-muted-foreground">{profile.bio}</p>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="perfil">
        <TabsList className="mb-6">
          <TabsTrigger value="perfil">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="pagamentos">
            <CreditCard className="h-4 w-4 mr-2" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="seguranca">
            <Key className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="perfil">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e detalhes de contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de usuário</Label>
                    <Input 
                      id="username" 
                      name="username" 
                      value={formData.username || ''} 
                      onChange={handleInputChange} 
                      disabled={!editMode || updateProfileMutation.isPending}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email || ''} 
                      onChange={handleInputChange} 
                      disabled={true} // Email não pode ser alterado diretamente
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      value={formData.fullName || ''} 
                      onChange={handleInputChange} 
                      disabled={!editMode || updateProfileMutation.isPending}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Telefone</Label>
                    <Input 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      value={formData.phoneNumber || ''} 
                      onChange={handleInputChange} 
                      disabled={!editMode || updateProfileMutation.isPending}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de nascimento</Label>
                    <Input 
                      id="birthDate" 
                      name="birthDate" 
                      type="date" 
                      value={formData.birthDate || ''} 
                      onChange={handleInputChange} 
                      disabled={!editMode || updateProfileMutation.isPending}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetExam">Vestibular alvo</Label>
                    <Select 
                      disabled={!editMode || updateProfileMutation.isPending}
                      value={formData.targetExam}
                      onValueChange={(value) => setFormData({...formData, targetExam: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o vestibular" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enem">ENEM</SelectItem>
                        <SelectItem value="fuvest">FUVEST</SelectItem>
                        <SelectItem value="unicamp">UNICAMP</SelectItem>
                        <SelectItem value="unesp">UNESP</SelectItem>
                        <SelectItem value="ufrj">UFRJ</SelectItem>
                        <SelectItem value="ufmg">UFMG</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="school">Escola/Universidade</Label>
                  <Input 
                    id="school" 
                    name="school" 
                    value={formData.school || ''} 
                    onChange={handleInputChange} 
                    disabled={!editMode || updateProfileMutation.isPending}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input 
                      id="state" 
                      name="state" 
                      value={formData.state || ''} 
                      onChange={handleInputChange} 
                      disabled={!editMode || updateProfileMutation.isPending}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={formData.city || ''} 
                      onChange={handleInputChange} 
                      disabled={!editMode || updateProfileMutation.isPending}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Input 
                    id="bio" 
                    name="bio" 
                    value={formData.bio || ''} 
                    onChange={handleInputChange} 
                    disabled={!editMode || updateProfileMutation.isPending}
                  />
                  <p className="text-xs text-muted-foreground">
                    Conte um pouco sobre você, seus objetivos e interesses.
                  </p>
                </div>
              </CardContent>
              
              {editMode && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditMode(false);
                      setFormData(profile);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </form>
        </TabsContent>
        
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Gerencie como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="font-medium">
                      Notificações por e-mail
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações importantes por e-mail
                    </p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={profile.preferences?.emailNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                    disabled={updatePreferencesMutation.isPending}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications" className="font-medium">
                      Notificações push no navegador
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas mesmo quando não estiver na plataforma
                    </p>
                  </div>
                  <Switch 
                    id="pushNotifications" 
                    checked={profile.preferences?.pushNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
                    disabled={updatePreferencesMutation.isPending}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications" className="font-medium">
                      Notificações por SMS
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba lembretes e alertas importantes por SMS
                    </p>
                  </div>
                  <Switch 
                    id="smsNotifications" 
                    checked={profile.preferences?.smsNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('smsNotifications', checked)}
                    disabled={updatePreferencesMutation.isPending}
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-medium pt-4">Tipos de notificação</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReports" className="font-medium">
                      Relatórios semanais
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Resumo semanal do seu progresso e desempenho
                    </p>
                  </div>
                  <Switch 
                    id="weeklyReports" 
                    checked={profile.preferences?.weeklyReports}
                    onCheckedChange={(checked) => handlePreferenceChange('weeklyReports', checked)}
                    disabled={updatePreferencesMutation.isPending}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newContentAlerts" className="font-medium">
                      Novos conteúdos
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas sobre novos materiais, vídeos e cursos
                    </p>
                  </div>
                  <Switch 
                    id="newContentAlerts" 
                    checked={profile.preferences?.newContentAlerts}
                    onCheckedChange={(checked) => handlePreferenceChange('newContentAlerts', checked)}
                    disabled={updatePreferencesMutation.isPending}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="studyReminders" className="font-medium">
                      Lembretes de estudo
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Lembretes para seguir seu plano de estudos
                    </p>
                  </div>
                  <Switch 
                    id="studyReminders" 
                    checked={profile.preferences?.studyReminders}
                    onCheckedChange={(checked) => handlePreferenceChange('studyReminders', checked)}
                    disabled={updatePreferencesMutation.isPending}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dueFlashcards" className="font-medium">
                      Flashcards pendentes
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas sobre flashcards que precisam ser revisados
                    </p>
                  </div>
                  <Switch 
                    id="dueFlashcards" 
                    checked={profile.preferences?.dueFlashcards}
                    onCheckedChange={(checked) => handlePreferenceChange('dueFlashcards', checked)}
                    disabled={updatePreferencesMutation.isPending}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="recommendedMaterials" className="font-medium">
                      Materiais recomendados
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Sugestões de materiais com base no seu desempenho
                    </p>
                  </div>
                  <Switch 
                    id="recommendedMaterials" 
                    checked={profile.preferences?.recommendedMaterials}
                    onCheckedChange={(checked) => handlePreferenceChange('recommendedMaterials', checked)}
                    disabled={updatePreferencesMutation.isPending}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pagamentos">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>
                Visualize suas transações e assinaturas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-muted p-3 text-sm font-medium">
                  <div>Data</div>
                  <div>Descrição</div>
                  <div>Plano</div>
                  <div>Valor</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {/* Exemplo de transações */}
                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div>05/04/2023</div>
                    <div>Assinatura Mensal</div>
                    <div>Premium</div>
                    <div>R$ 39,90</div>
                    <div className="text-green-600">Pago</div>
                  </div>
                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div>05/03/2023</div>
                    <div>Assinatura Mensal</div>
                    <div>Premium</div>
                    <div>R$ 39,90</div>
                    <div className="text-green-600">Pago</div>
                  </div>
                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div>05/02/2023</div>
                    <div>Assinatura Mensal</div>
                    <div>Premium</div>
                    <div>R$ 39,90</div>
                    <div className="text-green-600">Pago</div>
                  </div>
                </div>
              </div>
              
              {profile.premium ? (
                <div className="mt-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-md flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-medium">Plano Premium Ativo</p>
                    <p className="text-sm">Sua assinatura está ativa e será renovada em 05/05/2023.</p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não possui um plano premium. Assine agora e tenha acesso completo!
                  </p>
                  <Button onClick={() => setLocation("/planos")}>
                    Ver planos disponíveis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>
                Gerencie as configurações de segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-medium">Alterar senha</h3>
                    <p className="text-sm text-muted-foreground">
                      Atualize sua senha regularmente para aumentar a segurança
                    </p>
                  </div>
                  <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        Alterar senha
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Alterar senha</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Senha atual</Label>
                          <Input 
                            id="currentPassword" 
                            name="currentPassword" 
                            type="password" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Nova senha</Label>
                          <Input 
                            id="newPassword" 
                            name="newPassword" 
                            type="password" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                          <Input 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type="password" 
                            required 
                          />
                        </div>
                        <DialogFooter>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsPasswordDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit"
                            disabled={changePasswordMutation.isPending}
                          >
                            {changePasswordMutation.isPending ? "Alterando..." : "Salvar nova senha"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-medium">Dispositivos conectados</h3>
                    <p className="text-sm text-muted-foreground">
                      Gerenciar dispositivos que estão conectados à sua conta
                    </p>
                  </div>
                  <Button variant="outline">
                    Gerenciar dispositivos
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-red-600">Excluir conta</h3>
                    <p className="text-sm text-muted-foreground">
                      Excluir permanentemente sua conta e todos os seus dados
                    </p>
                  </div>
                  <AlertDialog open={isDeleteAccountDialogOpen} onOpenChange={setIsDeleteAccountDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        Excluir conta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados dos nossos servidores.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                          Excluir permanentemente
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}