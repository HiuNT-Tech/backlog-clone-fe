import { z, ZodError } from 'zod';
import i18n from '@/i18n';
import regex from '@/constant/regex';

export interface RegisterFormErrors {
  [key: string]: string;
}
export const registerFormSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, i18n.t('validation.fieldRequired'))
      .refine(
        value => {
          if (!value || value.trim() === '') return true;
          return regex.email.test(String(value));
        },
        {
          message: i18n.t('validation.email'),
        }
      ),
    password: z
      .string()
      .trim()
      .min(1, i18n.t('validation.fieldRequired'))
      .refine(
        value => {
          if (!value || value.trim() === '') return true;
          return regex.password.test(String(value));
        },
        {
          message: i18n.t('validation.passwordRule'),
        }
      ),
    passwordConfirmation: z
      .string()
      .trim()
      .min(1, i18n.t('validation.fieldRequired'))
      .refine(
        value => {
          if (!value || value.trim() === '') return true;
          return regex.password.test(String(value));
        },
        {
          message: i18n.t('validation.passwordRule'),
        }
      ),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: i18n.t('validation.passwordConfirmation'),
    path: ['passwordConfirmation'],
  });

export interface ValidationResult {
  isValid: boolean;
  errors: RegisterFormErrors;
}

export const validateRegisterForm = (
  formData: z.infer<typeof registerFormSchema>
): ValidationResult => {
  try {
    registerFormSchema.parse(formData);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: RegisterFormErrors = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        errors[`registerForm.${path}`] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: {} };
  }
};
