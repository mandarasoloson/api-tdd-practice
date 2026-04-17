import express from 'express';
import { calculateOrderTotal, applyPromoCode, DB_PROMOS } from './pricing.js';
const app = express();

app.use(express.json());

app.get('/api/health', (req, res)=> {
    res.status(200).json({ status: 'OK', message: 'L\'API fonctionne parfaitement' });  
});

let orders = [];

export function resetOrders() {
  orders = [];
}

app.post('/orders/simulate', (req, res) => {
  try {
    const { items, distance, weight, promoCode, hour, dayOfWeek } = req.body;
    const result = calculateOrderTotal(items, distance, weight, promoCode, hour, dayOfWeek);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.post('/orders', (req, res) => {
  try {
    const { items, distance, weight, promoCode, hour, dayOfWeek } = req.body;
    const pricing = calculateOrderTotal(items, distance, weight, promoCode, hour, dayOfWeek);
    
    // Generation d'un ID basique
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    
    const order = {
      id,
      items,
      distance,
      weight,
      promoCode,
      hour,
      dayOfWeek,
      ...pricing
    };
    
    orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Commande non trouvée" });
  }
  res.status(200).json(order);
});

app.post('/promo/validate', (req, res) => {
  try {
    const { promoCode, subtotal } = req.body;
    
    if (!promoCode) {
      return res.status(400).json({ error: "Code promo manquant" });
    }
    if (subtotal === undefined || subtotal < 0) {
      return res.status(400).json({ error: "Sous-total invalide" });
    }
    
    const newTotal = applyPromoCode(subtotal, promoCode, DB_PROMOS);
    res.status(200).json({ valid: true, newTotal });
  } catch (error) {
    if (error.message === "Code inconnu") {
      return res.status(404).json({ error: error.message });
    }
    // Pour les codes expires ou minimum non atteint
    res.status(400).json({ error: error.message });
  }
});

export default app;
