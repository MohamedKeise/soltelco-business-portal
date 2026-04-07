export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  // Minimum 8 characters
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  // Must contain combination of:
  // - At least one uppercase letter
  // - At least one lowercase letter  
  // - At least one number
  // - At least one special character
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function getPasswordRequirements(): string[] {
  return [
    "At least 8 characters long",
    "Contains uppercase letter (A-Z)",
    "Contains lowercase letter (a-z)",
    "Contains number (0-9)",
    "Contains special character (!@#$%^&* etc.)"
  ];
}
