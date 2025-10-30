'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { documentsApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { getDocumentTypeLabel, getDocumentStatusLabel, formatDateTime, formatFileSize } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Download, Trash2, AlertCircle, Loader2, FileText } from 'lucide-react';

export default function DocumentDetailPage({ params }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAdmin } = useAuthStore();

  const { data: document, isLoading, error } = useQuery({
    queryKey: ['document', params.id],
    queryFn: () => documentsApi.getById(params.id),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => documentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
      router.push('/documents');
    },
  });

  const downloadMutation = useMutation({
    mutationFn: (id) => documentsApi.downloadFile(id),
  });

  const handleDownload = async () => {
    try {
      const blob = await downloadMutation.mutateAsync(document.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.fileName || `documento-${document.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar este documento? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate(document.id);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'destructive';
      case 'PENDING':
        return 'warning';
      case 'IN_REVIEW':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const canDelete = document && (document.userId === user?.id || isAdmin());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar documento: {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Documento no encontrado</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{document.title}</h1>
            <p className="text-gray-500 mt-1">{getDocumentTypeLabel(document.type)}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(document.status)}>
          {getDocumentStatusLabel(document.status)}
        </Badge>
      </div>

      {/* Delete Error */}
      {deleteMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al eliminar documento: {deleteMutation.error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      )}

      {/* Download Error */}
      {downloadMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al descargar archivo: {downloadMutation.error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Document Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Información del Documento</CardTitle>
            <CardDescription>Detalles y metadata del documento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Título</p>
                <p className="text-base text-gray-900">{document.title}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Tipo</p>
                <p className="text-base text-gray-900">{getDocumentTypeLabel(document.type)}</p>
              </div>

              {document.description && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Descripción</p>
                  <p className="text-base text-gray-900">{document.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500">Estado</p>
                <Badge variant={getStatusVariant(document.status)} className="mt-1">
                  {getDocumentStatusLabel(document.status)}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de Creación</p>
                <p className="text-base text-gray-900">{formatDateTime(document.createdAt)}</p>
              </div>

              {document.updatedAt !== document.createdAt && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Última Actualización</p>
                  <p className="text-base text-gray-900">{formatDateTime(document.updatedAt)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Info */}
        {document.fileName && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Archivo</CardTitle>
              <CardDescription>Información del archivo adjunto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{document.fileName}</p>
                    {document.fileSize && (
                      <p className="text-sm text-gray-500">{formatFileSize(document.fileSize)}</p>
                    )}
                  </div>
                </div>
                <Button onClick={handleDownload} disabled={downloadMutation.isPending}>
                  {downloadMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Descargar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      {canDelete && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
            <CardDescription>Acciones irreversibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Eliminar Documento</p>
                <p className="text-sm text-gray-500">
                  Una vez eliminado, no se puede recuperar
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
