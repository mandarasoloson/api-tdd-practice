import { describe, it, expect } from 'vitest';
import { parsePrice, groupBy, calculateDiscount } from '../src/utils.js';

describe('Exercices Supplémentaires', () => {

  describe('A5: parsePrice()', () => {
    it('doit parser des chaines valides', () => {
      expect(parsePrice("12.99")).toBe(12.99);
      expect(parsePrice("12,99")).toBe(12.99);
      expect(parsePrice("12.99 €")).toBe(12.99);
      expect(parsePrice("€12.99")).toBe(12.99);
    });

    it('doit gerer les nombres et le mot gratuit', () => {
      expect(parsePrice(12.99)).toBe(12.99);
      expect(parsePrice("gratuit")).toBe(0);
    });

    it('doit renvoyer null pour les valeurs invalides ou negatives', () => {
      expect(parsePrice("abc")).toBeNull();
      expect(parsePrice("-5.00")).toBeNull();
      expect(parsePrice(null)).toBeNull();
      expect(parsePrice("")).toBeNull();
    });
  });

  describe('A6: groupBy()', () => {
    const data = [
      { name: "Alice", role: "dev" },
      { name: "Bob", role: "design" },
      { name: "Charlie", role: "dev" }
    ];

    it('doit regrouper les elements par la cle specifiee', () => {
      const expected = {
        dev: [{ name: "Alice", role: "dev" }, { name: "Charlie", role: "dev" }],
        design: [{ name: "Bob", role: "design" }]
      };
      expect(groupBy(data, "role")).toEqual(expected);
    });

    it('doit gerer un tableau vide ou null', () => {
      expect(groupBy([], "role")).toEqual({});
      expect(groupBy(null, "role")).toEqual({});
    });

    it('doit ignorer les elements qui ne possedent pas la cle', () => {
      const mixedData = [{ name: "Alice", role: "dev" }, { name: "Bob" }];
      expect(groupBy(mixedData, "role")).toEqual({
        dev: [{ name: "Alice", role: "dev" }]
      });
    });
  });

  describe('A7: calculateDiscount()', () => {
    it('doit appliquer une reduction en pourcentage', () => {
      expect(calculateDiscount(100, [{ type: "percentage", value: 10 }])).toBe(90);
    });

    it('doit appliquer une reduction fixe', () => {
      expect(calculateDiscount(100, [{ type: "fixed", value: 15 }])).toBe(85);
    });

    it('doit appliquer l\'offre achetez-en X, obtenez-en Y gratuitement', () => {
      // 4 articles à 10€ = 40€. On en a acheté 3, le 4ème est gratuit (-10€)
      expect(calculateDiscount(40, [{ type: "buyXgetY", buy: 3, free: 1, itemPrice: 10 }])).toBe(30);
    });

    it('doit cumuler les reductions dans l\'ordre', () => {
      const rules = [
        { type: "percentage", value: 10 }, // 100 - 10% = 90
        { type: "fixed", value: 5 }        // 90 - 5 = 85
      ];
      expect(calculateDiscount(100, rules)).toBe(85);
    });

    it('ne doit jamais renvoyer un prix negatif', () => {
      expect(calculateDiscount(10, [{ type: "fixed", value: 50 }])).toBe(0);
    });

    it('doit declencher une erreur si le prix initial est invalide', () => {
      expect(() => calculateDiscount(-10, [])).toThrow("Prix initial invalide");
      expect(() => calculateDiscount("100", [])).toThrow("Prix initial invalide");
    });
  });
});