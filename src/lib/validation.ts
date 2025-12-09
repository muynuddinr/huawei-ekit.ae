import DOMPurify from 'isomorphic-dompurify';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  type?: 'string' | 'number' | 'email' | 'url' | 'array';
  sanitize?: boolean;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData: any;
}

export function validateInput(data: any, schema: ValidationSchema): ValidationResult {
  const errors: string[] = [];
  const sanitizedData: any = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Check required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip validation if field is not required and empty
    if (!rules.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Type validation
    if (rules.type) {
      switch (rules.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${field} must be a string`);
            continue;
          }
          break;
        case 'number':
          if (typeof value !== 'number' && isNaN(Number(value))) {
            errors.push(`${field} must be a number`);
            continue;
          }
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`${field} must be a valid email`);
            continue;
          }
          break;
        case 'url':
          try {
            new URL(value);
          } catch {
            errors.push(`${field} must be a valid URL`);
            continue;
          }
          break;
        case 'array':
          if (!Array.isArray(value)) {
            errors.push(`${field} must be an array`);
            continue;
          }
          break;
      }
    }

    // Length validation for strings
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters long`);
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must not exceed ${rules.maxLength} characters`);
      }
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${field} format is invalid`);
    }

    // Sanitization
    let sanitizedValue = value;
    if (rules.sanitize && typeof value === 'string') {
      sanitizedValue = DOMPurify.sanitize(value.trim());
    }

    sanitizedData[field] = sanitizedValue;
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
}

// Common validation schemas
export const commonSchemas = {
  login: {
    username: { required: true, type: 'string' as const, minLength: 3, maxLength: 50, sanitize: true },
    password: { required: true, type: 'string' as const, minLength: 6, maxLength: 100 }
  },
  product: {
    name: { required: true, type: 'string' as const, minLength: 2, maxLength: 200, sanitize: true },
    description: { required: true, type: 'string' as const, minLength: 10, maxLength: 2000, sanitize: true },
    image1: { required: true, type: 'url' as const },
    navbarCategory: { required: true, type: 'string' as const, pattern: /^[0-9a-fA-F]{24}$/ },
    category: { required: true, type: 'string' as const, pattern: /^[0-9a-fA-F]{24}$/ },
    subcategory: { type: 'string' as const, pattern: /^[0-9a-fA-F]{24}$/ },
    keyFeatures: { type: 'array' as const }
  },
  contact: {
    name: { required: true, type: 'string' as const, minLength: 2, maxLength: 100, sanitize: true },
    email: { required: true, type: 'email' as const, sanitize: true },
    phone: { type: 'string' as const, minLength: 10, maxLength: 20, sanitize: true },
    message: { required: true, type: 'string' as const, minLength: 10, maxLength: 1000, sanitize: true }
  }
};
