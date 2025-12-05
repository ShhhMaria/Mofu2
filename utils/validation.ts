import { ValidationResult } from '../types';

export const validateEmail = (email: string): ValidationResult => {
  if (!email) return { isValid: false, error: "Email is required" };
  
  // Basic Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  // Complicated: Ban temporary email providers
  const bannedDomains = ['tempmail.com', 'throwaway.com', '10minutemail.com', 'mailinator.com'];
  const domain = email.split('@')[1];
  if (bannedDomains.includes(domain)) {
    return { isValid: false, error: "Temporary email providers are not allowed." };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) return { isValid: false, error: "Password is required" };

  // Complicated Password Policy
  // 1. Min 8 chars
  if (password.length < 8) return { isValid: false, error: "Password must be at least 8 characters" };
  
  // 2. Must have uppercase
  if (!/[A-Z]/.test(password)) return { isValid: false, error: "Must contain at least one uppercase letter" };

  // 3. Must have lowercase
  if (!/[a-z]/.test(password)) return { isValid: false, error: "Must contain at least one lowercase letter" };

  // 4. Must have number
  if (!/[0-9]/.test(password)) return { isValid: false, error: "Must contain at least one number" };

  // 5. Must have special char
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return { isValid: false, error: "Must contain at least one special character (!@#$%)" };

  return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
  if (!name) return { isValid: false, error: "Name is required" };
  if (name.length < 2) return { isValid: false, error: "Name is too short" };
  if (!/^[a-zA-Z\s]*$/.test(name)) return { isValid: false, error: "Name can only contain letters" };
  return { isValid: true };
};