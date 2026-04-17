export function calculateDeliveryFee(distance, weight) {
    if (distance < 0 || weight < 0) throw new Error("Distance ou poids négatif");
    if (distance > 10) throw new Error("Livraison refusée");

    let fee = 2.00; // Base
    if (distance > 3) {
        fee += (distance - 3) * 0.50;
    }
    if (weight > 5) {
        fee += 1.50;
    }
    return Number(fee.toFixed(2));
}

// 2. Application du code promo
export function applyPromoCode(subtotal, promoCode, promoCodes, currentDate = new Date()) {
    if (subtotal < 0) throw new Error("Sous-total négatif");
    if (!promoCode) return subtotal; // Pas de code = pas de réduc

    const codeObj = promoCodes.find(c => c.code === promoCode);
    if (!codeObj) throw new Error("Code inconnu");
    if (subtotal < codeObj.minOrder) throw new Error("Commande minimum non atteinte");

    const expiration = new Date(codeObj.expiresAt);
    if (currentDate > expiration) throw new Error("Code expiré");

    let newTotal = subtotal;
    if (codeObj.type === 'percentage') {
        newTotal -= subtotal * (codeObj.value / 100);
    } else if (codeObj.type === 'fixed') {
        newTotal -= codeObj.value;
    }

    return Math.max(0, Number(newTotal.toFixed(2))); // Jamais sous 0
}

// 3. Multiplicateur (Surge Pricing)
export function calculateSurge(hour, dayOfWeek) {
  
    if (hour < 10 || hour >= 22) return 0; // Fermé

    if (dayOfWeek === 7) return 1.2; // Dimanche
    
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Vendredi-Samedi
        if (hour >= 19 && hour < 22) return 1.8;
        return 1.0;
    }

    // Lundi - Jeudi (1 à 4)
    if (hour >= 12 && hour < 13.5) return 1.3; // Déjeuner
    if (hour >= 19 && hour < 21) return 1.5;   // Dîner
    
    return 1.0; // Heures creuses
}

// 4. Calcul du total de la commande
// Fake BDD des promos pour l'intégration
export const DB_PROMOS = [
    { code: "BIENVENUE20", type: "percentage", value: 20, minOrder: 15.00, expiresAt: "2099-12-31" },
    { code: "FIXE10", type: "fixed", value: 10, minOrder: 10.00, expiresAt: "2099-12-31" }
];

export function calculateOrderTotal(items, distance, weight, promoCode, hour, dayOfWeek) {
    if (!items || items.length === 0) throw new Error("Panier vide");
    if (distance > 10) throw new Error("Hors zone");
    if (hour < 10 || hour >= 22) throw new Error("Fermé");

    let subtotal = 0;
    for (const item of items) {
        if (item.price < 0) throw new Error("Prix négatif invalide");
        if (item.quantity <= 0) throw new Error("Quantité invalide");
        subtotal += item.price * item.quantity;
    }

    let discountedSubtotal = subtotal;
    if (promoCode) {
        discountedSubtotal = applyPromoCode(subtotal, promoCode, DB_PROMOS);
    }

    const discount = subtotal - discountedSubtotal;
    const baseDelivery = calculateDeliveryFee(distance, weight);
    const surge = calculateSurge(hour, dayOfWeek);
    
    const finalDelivery = baseDelivery * surge;
    const total = discountedSubtotal + finalDelivery;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        deliveryFee: Number(finalDelivery.toFixed(2)), // On retourne les frais FINAUX (multipliés)
        surge: surge,
        total: Number(total.toFixed(2))
    };
}