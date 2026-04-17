import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPassword, isValidAge } from '../src/validators.js';

describe('Validators Functions', () => {

  describe('isValidEmail()', () => {
    it('doit retourner true pour des emails valides', () => {
      expect(isValidEmail("user@example.com")).toBe(true);
      expect(isValidEmail("user.name+tag@domain.co")).toBe(true);
    });

    it('doit retourner false si le format est incorrect', () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
    });

    it('doit retourner false pour une chaine vide ou null', () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });

  describe('isValidPassword()', () => {
    it('doit valider un mot de passe correct', () => {
      expect(isValidPassword("Passw0rd!")).toEqual({ valid: true, errors: [] });
    });

    it('doit detecter les erreurs multiples pour un mot de passe trop court', () => {
      const result = isValidPassword("short");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Minimum 8 caractères");
      expect(result.errors).toContain("Au moins 1 majuscule");
      expect(result.errors).toContain("Au moins 1 chiffre");
      expect(result.errors).toContain("Au moins 1 caractère spécial");
    });

    it('doit detecter la majuscule manquante', () => {
      expect(isValidPassword("alllowercase1!")).toEqual({
        valid: false,
        errors: ["Au moins 1 majuscule"]
      });
    });

    it('doit detecter la minuscule manquante', () => {
      expect(isValidPassword("ALLUPPERCASE1!")).toEqual({
        valid: false,
        errors: ["Au moins 1 minuscule"]
      });
    });

    it('doit detecter le chiffre manquant', () => {
      expect(isValidPassword("NoDigits!here")).toEqual({
        valid: false,
        errors: ["Au moins 1 chiffre"]
      });
    });

    it('doit detecter le caractere special manquant', () => {
      expect(isValidPassword("NoSpecial1here")).toEqual({
        valid: false,
        errors: ["Au moins 1 caractère spécial"]
      });
    });

    it('doit tout rejeter pour vide ou null', () => {
      const emptyResult = isValidPassword("");
      expect(emptyResult.valid).toBe(false);
      expect(emptyResult.errors.length).toBe(5);

      const nullResult = isValidPassword(null);
      expect(nullResult.valid).toBe(false);
      expect(nullResult.errors.length).toBe(5);
    });
  });

  describe('isValidAge()', () => {
    it('doit accepter les ages valides', () => {
      expect(isValidAge(25)).toBe(true);
      expect(isValidAge(0)).toBe(true);
      expect(isValidAge(150)).toBe(true);
    });

    it('doit refuser les ages hors limites', () => {
      expect(isValidAge(-1)).toBe(false);
      expect(isValidAge(151)).toBe(false);
    });

    it('doit refuser les decimals et autres types non valides', () => {
      expect(isValidAge(25.5)).toBe(false);
      expect(isValidAge("25")).toBe(false);
      expect(isValidAge(null)).toBe(false);
    });
  });

});