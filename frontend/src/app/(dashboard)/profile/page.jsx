'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { profileUpdateSchema } from '@/lib/validations/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, User, Mail, Phone, CreditCard } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [wantToChangePassword, setWantToChangePassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      password: '',
      confirmPassword: '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => usersApi.update(user.id, data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      setSuccessMessage('Perfil actualizado exitosamente');
      form.reset({
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        password: '',
        confirmPassword: '',
      });
      setWantToChangePassword(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    },
  });

  const onSubmit = async (data) => {
    // Remove password fields if not changing password
    if (!wantToChangePassword || !data.password) {
      delete data.password;
      delete data.confirmPassword;
    }

    updateMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-500 mt-1">Gestiona tu información personal</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {updateMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al actualizar perfil: {updateMutation.error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Info Card (Read-only) */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Información de Usuario</CardTitle>
            <CardDescription>Datos básicos de tu cuenta (no editables)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base text-gray-900">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Cédula</p>
                  <p className="text-base text-gray-900">{user?.cedula}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Rol</p>
                  <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user?.role}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-5 w-5" /> {/* Spacer */}
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <Badge variant={user?.status === 'ACTIVE' ? 'success' : 'secondary'}>
                    {user?.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
            <CardDescription>Actualiza tu información personal</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Pérez García" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="3001234567" {...field} />
                        </FormControl>
                        <FormDescription>10 dígitos, inicia con 3</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Change Password Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="changePassword"
                    checked={wantToChangePassword}
                    onChange={(e) => setWantToChangePassword(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="changePassword" className="text-sm font-medium text-gray-700">
                    Quiero cambiar mi contraseña
                  </label>
                </div>

                {/* Password Fields (conditional) */}
                {wantToChangePassword && (
                  <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-gray-200">
                    {/* New Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nueva Contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormDescription>Mínimo 8 caracteres</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={updateMutation.isPending}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
