import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Bell, 
  Search, 
  MessageSquare, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [, setLocation] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Buscar dados do usuário
  const { data: userData = {
    username: "Usuário",
    fullName: "Usuário",
    avatarUrl: ""
  } } = useQuery<{
    id: number;
    username: string;
    fullName?: string;
    email: string;
    avatarUrl?: string;
    isVerified: boolean;
    level: number;
    xp: number;
    premium: boolean;
  }>({
    queryKey: ['/api/users/me'],
  });
  
  // Buscar notificações
  const { data: notifications = [] } = useQuery<any[]>({
    queryKey: ['/api/notifications'],
    // Se a API de notificações não estiver implementada, podemos definir um valor padrão
    // Isso será substituído quando a API estiver pronta
    placeholderData: [],
  });
  
  // Dados de mensagens não lidas
  const { data: messages = [] } = useQuery<any[]>({
    queryKey: ['/api/messages/unread'],
    // Se a API de mensagens não estiver implementada, podemos definir um valor padrão
    // Isso será substituído quando a API estiver pronta
    placeholderData: [],
  });
  
  const unreadNotificationsCount = Array.isArray(notifications) ? notifications.length : 0;
  const unreadMessagesCount = Array.isArray(messages) ? messages.length : 0;
  
  return (
    <header className="bg-white border-b border-neutral-200 py-2 px-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {isSearchOpen ? (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar..."
                className="pl-9 pr-4"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1"
                onClick={() => setIsSearchOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <div className="relative max-w-md hidden md:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar na plataforma..."
              className="pl-9 pr-4"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500"
                  aria-label={`${unreadNotificationsCount} notificações não lidas`}
                >
                  <span className="text-[10px]">{unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}</span>
                </Badge>
              )}
            </Button>
          </div>
          
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
              {unreadMessagesCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-blue-500"
                  aria-label={`${unreadMessagesCount} mensagens não lidas`}
                >
                  <span className="text-[10px]">{unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}</span>
                </Badge>
              )}
            </Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={userData?.avatarUrl} 
                    alt={userData?.username || "Usuário"} 
                  />
                  <AvatarFallback>
                    {userData?.username 
                      ? userData.username.slice(0, 2).toUpperCase() 
                      : "UN"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm hidden sm:inline-block">
                  {userData?.fullName || userData?.username || "Usuário"}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setLocation("/perfil")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/central-aluno")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Central do Aluno</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/planos")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Planos e Assinatura</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Logout não implementado")}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}