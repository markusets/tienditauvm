import { useState, useEffect } from 'react'
import { useRoleStore } from '@/store/carStore.mjs'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Package, Users, LayoutDashboard, LogOut } from 'lucide-react'
import ProductsTable from './ProductsTable'
import UsersTable from './UsersTable'

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('cuenta')
  const [profile, setProfile] = useState({})
  const { role, setRole } = useRoleStore()
  const API_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    getProfile()
  }, [])

  const handleLogout = () => {
    const token = localStorage.getItem('token')
    if (token) {
      localStorage.removeItem('token')
      setRole('')

    }
  }

  const getProfile = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        setProfile(data)
        return
      } catch (error) {
        console.log(error)
      }
    }
  }


  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Package className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Panel Administrativo</span>
                    <h6 className="text-lx text-black">Bienvenido {profile.name}</h6>
                    <span className="text-xs text-muted">{profile.email}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection('cuenta')}
                  isActive={activeSection === 'cuenta'}
                >
                  <LayoutDashboard className="size-4" />
                  <span>Cuenta</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {role === 'admin' && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('productos')}
                      isActive={activeSection === 'productos'}
                    >
                      <Package className="size-4" />
                      <span>Productos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('usuarios')}
                      isActive={activeSection === 'usuarios'}
                    >
                      <Users className="size-4" />
                      <span>Usuarios</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="size-4" />
                  <span>Cerrar Sesion</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {activeSection === 'cuenta' && <div>Cuenta</div>}
            {activeSection === 'productos' && role === 'admin' && <ProductsTable />}
            {activeSection === 'usuarios' && role === 'admin' && <UsersTable />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
