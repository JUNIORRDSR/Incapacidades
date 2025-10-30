'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api';
import { documentSchema } from '@/lib/validations/schemas';
import { isValidFileType, isValidFileSize, formatFileSize } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Upload, FileText, X, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const DOCUMENT_TYPES = [
  { value: 'INCAPACIDAD', label: 'Incapacidad' },
  { value: 'PENSION', label: 'Pensión' },
  { value: 'CERTIFICADO_MEDICO', label: 'Certificado Médico' },
  { value: 'HISTORIA_CLINICA', label: 'Historia Clínica' },
  { value: 'OTRO', label: 'Otro' },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function NewDocumentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: '',
      type: '',
      description: '',
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, metadata }) => documentsApi.uploadFile(file, metadata),
    onSuccess: () => {
      setSuccessMessage('Documento subido exitosamente');
      queryClient.invalidateQueries(['documents']);
      setTimeout(() => router.push('/documents'), 2000);
    },
  });

  const handleFileSelect = (file) => {
    setFileError('');
    
    if (!file) return;

    if (!isValidFileType(file, ALLOWED_FILE_TYPES)) {
      setFileError('Tipo de archivo no permitido. Use PDF, JPEG, PNG o DOCX');
      return;
    }

    if (!isValidFileSize(file, MAX_FILE_SIZE)) {
      setFileError(`El archivo excede el tamaño máximo de ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      setFileError('Debe seleccionar un archivo');
      return;
    }

    uploadMutation.mutate({
      file: selectedFile,
      metadata: data,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subir Documento</h1>
          <p className="text-gray-500 mt-1">Sube tu documento de incapacidad o pensión</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}. Redirigiendo...
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {uploadMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al subir documento: {uploadMutation.error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Document Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Documento</CardTitle>
              <CardDescription>
                Completa los datos básicos del documento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Incapacidad por enfermedad general" {...field} />
                    </FormControl>
                    <FormDescription>
                      Un título descriptivo para identificar el documento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de documento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DOCUMENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Detalles adicionales sobre el documento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* File Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Archivo</CardTitle>
              <CardDescription>
                Arrastra y suelta o haz clic para seleccionar el archivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Arrastra tu archivo aquí o haz clic para seleccionar
                  </p>
                  <Input
                    type="file"
                    className="hidden"
                    id="file-input"
                    accept={ALLOWED_FILE_TYPES.join(',')}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                  <Label htmlFor="file-input">
                    <Button type="button" variant="outline" asChild>
                      <span>Seleccionar Archivo</span>
                    </Button>
                  </Label>
                  <p className="text-xs text-gray-500 mt-4">
                    PDF, JPEG, PNG o DOCX (máx. {formatFileSize(MAX_FILE_SIZE)})
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {fileError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={uploadMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={uploadMutation.isPending || !selectedFile}>
              {uploadMutation.isPending ? 'Subiendo...' : 'Subir Documento'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
