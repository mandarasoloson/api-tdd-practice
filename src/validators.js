export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password) {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    return {
      valid: false,
      errors: [
        "Minimum 8 caractères",
        "Au moins 1 majuscule",
        "Au moins 1 minuscule",
        "Au moins 1 chiffre",
        "Au moins 1 caractère spécial"
      ]
    };
  }

  if (password.length < 8) errors.push("Minimum 8 caractères");
  if (!/[A-Z]/.test(password)) errors.push("Au moins 1 majuscule");
  if (!/[a-z]/.test(password)) errors.push("Au moins 1 minuscule");
  if (!/[0-9]/.test(password)) errors.push("Au moins 1 chiffre");
  if (!/[!@#$%^&*]/.test(password)) errors.push("Au moins 1 caractère spécial");

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

export function isValidAge(age) {
  if (typeof age !== 'number') return false;
  if (!Number.isInteger(age)) return false; 
  if (age < 0 || age > 150) return false;
  
  return true;
}