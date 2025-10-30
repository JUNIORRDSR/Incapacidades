'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { documentsApi } from '@/lib/api';
import { getDocumentTypeLabel, getDocumentStatusLabel, formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Plus, Eye, AlertCircle, Loader2 } from 'lucide-react';

export default function DocumentsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error } = useQuery({
    queryKey: ['documents', page, limit],
    queryFn: () => documentsApi.getAll(page, limit),
  });

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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Documentos</h1>
            <p className="text-gray-500 mt-1">Gestiona tus documentos de incapacidades y pensiones</p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar documentos: {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>

        <Button onClick={() => router.push('/dashboard')}>
          Volver al Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Documentos</h1>
          <p className="text-gray-500 mt-1">Gestiona tus documentos de incapacidades y pensiones</p>
        </div>
        <Button asChild>
          <Link href="/documents/new">
            <Plus className="h-4 w-4 mr-2" />
            Subir Documento
          </Link>
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Documents Grid */}
      {!isLoading && data && (
        <>
          {data.documents?.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tienes documentos
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza subiendo tu primer documento de incapacidad o pensión
                </p>
                <Button asChild>
                  <Link href="/documents/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Subir Primer Documento
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.documents?.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-1">{doc.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {getDocumentTypeLabel(doc.type)}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(doc.status)}>
                          {getDocumentStatusLabel(doc.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {doc.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                        <div className="text-xs text-gray-500">
                          <p>Creado: {formatDateTime(doc.createdAt)}</p>
                          {doc.updatedAt !== doc.createdAt && (
                            <p>Actualizado: {formatDateTime(doc.updatedAt)}</p>
                          )}
                        </div>
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => router.push(`/documents/${doc.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <div className="text-sm text-gray-700">
                    Página <span className="font-medium">{data.currentPage}</span> de{' '}
                    <span className="font-medium">{data.totalPages}</span>
                    {' '}({data.total} documentos)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                      disabled={page === data.totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
