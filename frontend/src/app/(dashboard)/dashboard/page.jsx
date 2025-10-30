'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, LogOut, User } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user?.fullName}
          </h1>
          <p className="mt-2 text-gray-600">
            Sistema de Gestión de Incapacidades y Pensiones
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Información del Usuario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Nombre Completo</p>
              <p className="text-base text-gray-900">{user?.fullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Correo Electrónico</p>
              <p className="text-base text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Cédula</p>
              <p className="text-base text-gray-900">{user?.cedula}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Teléfono</p>
              <p className="text-base text-gray-900">{user?.phone || 'No registrado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rol</p>
              <p className="text-base text-gray-900">
                {user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Estado</p>
              <p className="text-base text-green-600 font-medium">Activo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => router.push('/documents/new')}
              className="flex-1"
            >
              <FileText className="mr-2 h-4 w-4" />
              Subir Nuevo Documento
            </Button>
            <Button 
              onClick={() => router.push('/documents')}
              variant="outline"
              className="flex-1"
            >
              Ver Mis Documentos
            </Button>
            <Button 
              onClick={() => router.push('/profile')}
              variant="outline"
              className="flex-1"
            >
              <User className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Subir Documentos</p>
                <p>Utiliza el botón "Subir Nuevo Documento" para cargar tus incapacidades, pensiones o certificados médicos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Seguimiento</p>
                <p>Revisa el estado de tus documentos en la sección "Ver Mis Documentos". Podrás ver si están pendientes, en revisión o aprobados.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Descargar</p>
                <p>Descarga tus documentos en cualquier momento desde la lista de documentos.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
