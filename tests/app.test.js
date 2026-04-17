import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app, { resetOrders  } from '../src/app.js';

describe('Vérification de l\'API (Health Check)', () => {
  it('doit renvoyer un code 200 sur la route /api/health', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});

describe('API Integration Tests', () => {
  
  beforeEach(() => {
    resetOrders();
  });

  const validPayload = {
    items: [{ name: "Pizza", price: 12.50, quantity: 2 }], 
    distance: 5,
    weight: 2,
    promoCode: null,
    hour: 15,
    dayOfWeek: 2
  };

  describe('POST /orders/simulate', () => {
    it('Commande normale -> 200 + detail du prix correct', async () => {
      const res = await request(app).post('/orders/simulate').send(validPayload);
      expect(res.status).toBe(200);
      expect(res.body.subtotal).toBe(25.00);
      expect(res.body.total).toBe(28.00);
    });

    it('Avec code promo valide -> reduction appliquee', async () => {
      const payload = { ...validPayload, promoCode: "BIENVENUE20" };
      const res = await request(app).post('/orders/simulate').send(payload);
      expect(res.status).toBe(200);
      expect(res.body.discount).toBe(5.00);
      expect(res.body.total).toBe(23.00);
    });

    it('Avec code promo expire ou conditions non remplies -> 400 + erreur', async () => {
      const payload = { 
        ...validPayload, 
        items: [{ name: "Soda", price: 5, quantity: 1 }], 
        promoCode: "BIENVENUE20" 
      };
      const res = await request(app).post('/orders/simulate').send(payload);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Commande minimum non atteinte");
    });

    it('Panier vide -> 400', async () => {
      const res = await request(app).post('/orders/simulate').send({ ...validPayload, items: [] });
      expect(res.status).toBe(400);
    });

    it('Hors zone (> 10 km) -> 400', async () => {
      const res = await request(app).post('/orders/simulate').send({ ...validPayload, distance: 15 });
      expect(res.status).toBe(400);
    });

    it('Ferme (23h) -> 400', async () => {
      const res = await request(app).post('/orders/simulate').send({ ...validPayload, hour: 23 });
      expect(res.status).toBe(400);
    });

    it('Surge (vendredi 20h) -> deliveryFee multiplie', async () => {
      const res = await request(app).post('/orders/simulate').send({ ...validPayload, hour: 20, dayOfWeek: 5 });
      expect(res.status).toBe(200);
      expect(res.body.surge).toBe(1.8);
      expect(res.body.deliveryFee).toBe(5.40); 
    });
  });

  describe('POST /orders', () => {
    it('Commande valide -> 201 + commande avec ID', async () => {
      const res = await request(app).post('/orders').send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.total).toBe(28.00);
    });

    it('La commande est retrouvable via GET /orders/:id', async () => {
      const postRes = await request(app).post('/orders').send(validPayload);
      const getRes = await request(app).get(`/orders/${postRes.body.id}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.id).toBe(postRes.body.id);
    });

    it('Deux commandes -> deux IDs differents', async () => {
      const res1 = await request(app).post('/orders').send(validPayload);
      const res2 = await request(app).post('/orders').send(validPayload);
      expect(res1.body.id).not.toBe(res2.body.id);
    });

    it('Commande invalide -> 400 (pas enregistree)', async () => {
      const res = await request(app).post('/orders').send({ ...validPayload, distance: 15 });
      expect(res.status).toBe(400);
      expect(res.body).not.toHaveProperty('id');
    });

    it('Verifier que la commande invalide nest PAS enregistree', async () => {
      const res = await request(app).post('/orders').send({ ...validPayload, distance: 15 });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /orders/:id', () => {
    it('ID existant -> 200 + commande complete', async () => {
      const postRes = await request(app).post('/orders').send(validPayload);
      const res = await request(app).get(`/orders/${postRes.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(res.body).toHaveProperty('total');
    });

    it('ID inexistant -> 404', async () => {
      const res = await request(app).get('/orders/fake-id-123');
      expect(res.status).toBe(404);
    });

    it('La structure retournee est correcte', async () => {
      const postRes = await request(app).post('/orders').send(validPayload);
      const res = await request(app).get(`/orders/${postRes.body.id}`);
      expect(res.body).toMatchObject({
        distance: 5,
        subtotal: 25.00,
        total: 28.00
      });
    });
  });

  describe('POST /promo/validate', () => {
    it('Code valide -> 200 + details de la reduction', async () => {
      const res = await request(app).post('/promo/validate').send({ promoCode: "BIENVENUE20", subtotal: 50 });
      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(true);
      expect(res.body.newTotal).toBe(40);
    });

    it('Commande sous le minimum -> 400 + raison', async () => {
      const res = await request(app).post('/promo/validate').send({ promoCode: "BIENVENUE20", subtotal: 10 });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Commande minimum non atteinte");
    });

    it('Code inconnu -> 404', async () => {
      const res = await request(app).post('/promo/validate').send({ promoCode: "FAKE", subtotal: 50 });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Code inconnu");
    });

    it('Sans code dans le body -> 400', async () => {
      const res = await request(app).post('/promo/validate').send({ subtotal: 50 });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Code promo manquant");
    });

    it('Sans sous-total dans le body -> 400', async () => {
      const res = await request(app).post('/promo/validate').send({ promoCode: "BIENVENUE20" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Sous-total invalide");
    });
  });
});