import { z } from 'zod';

// ==================== AUTH SCHEMAS ====================

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    cedula: z
      .string()
      .regex(/^\d{6,10}$/, 'La cédula debe tener entre 6 y 10 dígitos'),
    phone: z
      .string()
      .regex(/^3\d{9}$/, 'El teléfono debe tener 10 dígitos y comenzar con 3')
      .optional()
      .or(z.literal('')),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// ==================== DOCUMENT SCHEMAS ====================

export const documentSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  type: z.enum([
    'INCAPACIDAD',
    'PENSION',
    'CERTIFICADO_MEDICO',
    'HISTORIA_CLINICA',
    'OTRO',
  ]),
  description: z.string().optional(),
});

// ==================== USER SCHEMAS ====================

export const profileUpdateSchema = z
  .object({
    fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').optional(),
    phone: z
      .string()
      .regex(/^3\d{9}$/, 'El teléfono debe tener 10 dígitos y comenzar con 3')
      .optional()
      .or(z.literal('')),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== '') {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }
  );
