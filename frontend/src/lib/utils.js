import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to local string
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date and time to local string
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format file size in bytes to human readable
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get document type label in Spanish
 * @param {string} type
 * @returns {string}
 */
export function getDocumentTypeLabel(type) {
  const labels = {
    INCAPACIDAD: 'Incapacidad',
    PENSION: 'Pensión',
    CERTIFICADO_MEDICO: 'Certificado Médico',
    HISTORIA_CLINICA: 'Historia Clínica',
    OTRO: 'Otro',
  };
  return labels[type] || type;
}

/**
 * Get document status label in Spanish
 * @param {string} status
 * @returns {string}
 */
export function getDocumentStatusLabel(status) {
  const labels = {
    PENDING: 'Pendiente',
    APPROVED: 'Aprobado',
    REJECTED: 'Rechazado',
    IN_REVIEW: 'En Revisión',
  };
  return labels[status] || status;
}

/**
 * Get status color for badge
 * @param {string} status
 * @returns {string}
 */
export function getStatusColor(status) {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    IN_REVIEW: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Validate file type
 * @param {File} file
 * @param {string[]} allowedTypes
 * @returns {boolean}
 */
export function isValidFileType(file, allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']) {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 * @param {File} file
 * @param {number} maxSizeInMB
 * @returns {boolean}
 */
export function isValidFileSize(file, maxSizeInMB = 10) {
  return file.size <= maxSizeInMB * 1024 * 1024;
}

/**
 * Download file from blob
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
