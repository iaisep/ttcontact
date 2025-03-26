
/**
 * Validates an email address
 * @param email The email to validate
 * @returns True if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a password meets minimum requirements
 * @param password The password to validate
 * @returns True if password is valid, false otherwise
 */
export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Validates a name
 * @param name The name to validate
 * @returns True if name is valid, false otherwise
 */
export function validateName(name: string): boolean {
  return name.trim().length > 0;
}

/**
 * Gets validation error messages for form fields
 * @param field The field to validate
 * @param value The value to validate
 * @returns Error message or empty string if valid
 */
export function getValidationError(field: string, value: string): string {
  switch (field) {
    case 'email':
      if (!value) return 'El email es requerido';
      if (!validateEmail(value)) return 'Ingresa un email válido';
      return '';
    case 'password':
      if (!value) return 'La contraseña es requerida';
      if (!validatePassword(value)) return 'La contraseña debe tener al menos 6 caracteres';
      return '';
    case 'name':
      if (!value) return 'El nombre es requerido';
      if (!validateName(value)) return 'Ingresa un nombre válido';
      return '';
    default:
      return '';
  }
}
