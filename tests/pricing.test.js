import { describe, it, expect } from 'vitest';
import { 
    calculateDeliveryFee, 
    applyPromoCode, 
    calculateSurge, 
    calculateOrderTotal,
} from '../src/pricing.js';

describe('Pricing Engine', () => {

  describe('calculateDeliveryFee()', () => {
    it('doit renvoyer 2.00€ pour 2km et 1kg', () => expect(calculateDeliveryFee(2, 1)).toBe(2.00));
    it('doit renvoyer 4.00€ pour 7km et 3kg', () => expect(calculateDeliveryFee(7, 3)).toBe(4.00));
    it('doit ajouter le supplement lourd pour 5km et 8kg', () => expect(calculateDeliveryFee(5, 8)).toBe(4.50));
    
    it('doit renvoyer la base pour exactement 3km', () => expect(calculateDeliveryFee(3, 2)).toBe(2.00));
    it('doit accepter exactement 10km', () => expect(calculateDeliveryFee(10, 2)).toBe(5.50));
    it('ne doit pas appliquer de supplement pour exactement 5kg', () => expect(calculateDeliveryFee(2, 5)).toBe(2.00));
    
    it('doit refuser une distance > 10km', () => expect(() => calculateDeliveryFee(15, 2)).toThrow("Livraison refusée"));
    it('doit jeter une erreur pour une distance ou un poids negatif', () => {
      expect(() => calculateDeliveryFee(-1, 2)).toThrow();
      expect(() => calculateDeliveryFee(2, -5)).toThrow();
    });
    it('doit accepter une distance de 0km', () => expect(calculateDeliveryFee(0, 1)).toBe(2.00));
  });

  describe('applyPromoCode()', () => {
    const promos = [
      { code: "PERC20", type: "percentage", value: 20, minOrder: 15, expiresAt: "2050-01-01" },
      { code: "FIXE5", type: "fixed", value: 5, minOrder: 10, expiresAt: "2050-01-01" },
      { code: "EXPIRE", type: "fixed", value: 5, minOrder: 10, expiresAt: "2020-01-01" },
      { code: "HUGE", type: "fixed", value: 50, minOrder: 10, expiresAt: "2050-01-01" }
    ];
    const mockDate = new Date("2025-01-01");

    it('doit reduire de 20%', () => expect(applyPromoCode(50, "PERC20", promos, mockDate)).toBe(40));
    it('doit reduire de 5€', () => expect(applyPromoCode(30, "FIXE5", promos, mockDate)).toBe(25));
    
    it('doit refuser un code expire', () => expect(() => applyPromoCode(30, "EXPIRE", promos, mockDate)).toThrow("Code expiré"));
    it('doit refuser si minOrder non atteint', () => expect(() => applyPromoCode(10, "PERC20", promos, mockDate)).toThrow("Commande minimum non atteinte"));
    it('doit jeter une erreur si code inconnu', () => expect(() => applyPromoCode(30, "FAKE", promos, mockDate)).toThrow("Code inconnu"));
    
    it('ne doit pas rendre le total negatif', () => expect(applyPromoCode(30, "HUGE", promos, mockDate)).toBe(0));
    it('doit gerer subtotal = 0', () => {
      const promosZero = [{ code: "ZERO", type: "fixed", value: 5, minOrder: 0, expiresAt: "2050-01-01" }];
      expect(applyPromoCode(0, "ZERO", promosZero, mockDate)).toBe(0);
    });
    
    it('doit retourner subtotal si promoCode est null ou vide', () => {
      expect(applyPromoCode(50, null, promos, mockDate)).toBe(50);
      expect(applyPromoCode(50, "", promos, mockDate)).toBe(50);
    });
    it('doit jeter une erreur si subtotal negatif', () => expect(() => applyPromoCode(-10, "PERC20", promos, mockDate)).toThrow("Sous-total négatif"));
  });

  describe('calculateSurge()', () => {
    it('Mardi 15h', () => expect(calculateSurge(15, 2)).toBe(1.0));
    it('Mercredi 12h30', () => expect(calculateSurge(12.5, 3)).toBe(1.3));
    it('Jeudi 20h', () => expect(calculateSurge(20, 4)).toBe(1.5));
    it('Vendredi 21h', () => expect(calculateSurge(21, 5)).toBe(1.8));
    it('Dimanche 14h', () => expect(calculateSurge(14, 7)).toBe(1.2));
    
    it('11h30 pile', () => expect(calculateSurge(11.5, 1)).toBe(1.0));
    it('19h00 pile', () => expect(calculateSurge(19, 1)).toBe(1.5));
    it('10h00 pile', () => expect(calculateSurge(10, 1)).toBe(1.0));
    it('9h59 ou 22h00', () => {
      expect(calculateSurge(9.9, 1)).toBe(0);
      expect(calculateSurge(22, 1)).toBe(0);
    });
  });

  describe('calculateOrderTotal()', () => {
    const items = [{ name: "Pizza", price: 12.50, quantity: 2 }]; 

    it('Commande standard : mardi 15h, 5km', () => {
      const res = calculateOrderTotal(items, 5, 2, null, 15, 2);
      expect(res).toEqual({ subtotal: 25.00, discount: 0, deliveryFee: 3.00, surge: 1.0, total: 28.00 });
    });

    it('Commande avec code promo 20%', () => {
      const res = calculateOrderTotal(items, 5, 2, "BIENVENUE20", 15, 2);
      expect(res).toEqual({ subtotal: 25.00, discount: 5.00, deliveryFee: 3.00, surge: 1.0, total: 23.00 });
    });

    it('Commande vendredi soir 20h', () => {
      const res = calculateOrderTotal(items, 5, 2, null, 20, 5);
      expect(res).toEqual({ subtotal: 25.00, discount: 0, deliveryFee: 5.40, surge: 1.8, total: 30.40 });
    });

    it('Erreur si panier vide', () => expect(() => calculateOrderTotal([], 5, 2, null, 15, 2)).toThrow("Panier vide"));
    it('Erreur si quantite ou prix invalide', () => {
      expect(() => calculateOrderTotal([{ price: 10, quantity: 0 }], 5, 2, null, 15, 2)).toThrow("Quantité invalide");
      expect(() => calculateOrderTotal([{ price: -5, quantity: 1 }], 5, 2, null, 15, 2)).toThrow("Prix négatif");
    });
    it('Erreur si hors ouverture', () => expect(() => calculateOrderTotal(items, 5, 2, null, 23, 2)).toThrow("Fermé"));
    it('Erreur si hors zone', () => expect(() => calculateOrderTotal(items, 15, 2, null, 15, 2)).toThrow("Hors zone"));

    it('Verifie que surge sapplique uniquement a la livraison', () => {
      const res = calculateOrderTotal(items, 5, 2, null, 20, 5); 
      expect(res.total).toBe(30.40);
      expect(res.total).toBe(res.subtotal - res.discount + res.deliveryFee);
    });
    
    it('Retourne la structure exacte attendue avec 2 decimales', () => {
      const res = calculateOrderTotal([{ price: 10.333, quantity: 1 }], 1, 1, null, 15, 2);
      expect(res.subtotal).toBe(10.33);
      expect(res.deliveryFee).toBe(2.00);
      expect(res.total).toBe(12.33);
    });
  });
});