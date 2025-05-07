import { ReactNode } from "react";
import Sidebar from "./sidebar";
import MobileSidebar from "./mobile-sidebar";

type MainLayoutProps = {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <div className="flex-1 md:ml-64">
        <MobileSidebar />
        
        <main>
          {children}
        </main>
        
        <footer className="bg-white border-t border-neutral-200 p-6 mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-primary rounded flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                  </div>
                  <span className="text-xl font-bold text-neutral-800">prisma</span>
                </div>
                <p className="mt-2 text-sm text-neutral-500">Sua plataforma de estudos para o ENEM</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-800 mb-3">Plataforma</h3>
                  <ul className="space-y-2">
                    <li><a href="/" className="text-sm text-neutral-500 hover:text-primary">Início</a></li>
                    <li><a href="/questoes" className="text-sm text-neutral-500 hover:text-primary">Questões</a></li>
                    <li><a href="/disciplinas" className="text-sm text-neutral-500 hover:text-primary">Disciplinas</a></li>
                    <li><a href="/desempenho" className="text-sm text-neutral-500 hover:text-primary">Desempenho</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-neutral-800 mb-3">Recursos</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-sm text-neutral-500 hover:text-primary">Simulados</a></li>
                    <li><a href="#" className="text-sm text-neutral-500 hover:text-primary">Videoaulas</a></li>
                    <li><a href="#" className="text-sm text-neutral-500 hover:text-primary">Exercícios</a></li>
                    <li><a href="#" className="text-sm text-neutral-500 hover:text-primary">Resumos</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-neutral-800 mb-3">Empresa</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-sm text-neutral-500 hover:text-primary">Sobre nós</a></li>
                    <li><a href="#" className="text-sm text-neutral-500 hover:text-primary">Contato</a></li>
                    <li><a href="#" className="text-sm text-neutral-500 hover:text-primary">Blog</a></li>
                    <li><a href="#" className="text-sm text-neutral-500 hover:text-primary">Carreiras</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-neutral-800 mb-3">Legal</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-sm text-neutral-500 hover:text-primary">Termos</a></li>
                    <li><a href="#" className="text-sm text-neutral-500 hover:text-primary">Privacidade</a></li>
                    <li><a href="#" className="text-sm text-neutral-500 hover:text-primary">Cookies</a></li>
                    <li><a href="#" className="text-sm text-neutral-500 hover:text-primary">Licenças</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-neutral-200 flex flex-col md:flex-row md:justify-between md:items-center">
              <p className="text-sm text-neutral-500">&copy; 2023 Prisma. Todos os direitos reservados.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-neutral-400 hover:text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
