/**
 * 
 */
export function capitalize(str){
    if(!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function calculateAverage(numbers){
    const len = numbers.length;
    if(len === 0) return 0;
    const sum = numbers.reduce((acc, value) => acc + value, 0);
    return sum / len;
}

export function slugify(text){
    if (!text || typeof text !== 'string') return '';

    return text
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/[\s]+/g, "-");
}

export function clamp(value, min, max) {
    if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') return 0;
    return Math.min(Math.max(value, min), max);
}

export function sortStudents(students, sortBy, order = 'asc') {
    // Règle 5 et 6 : Si null ou vide, on retourne un tableau vide
    if (!students || !Array.isArray(students) || students.length === 0) {
        return [];
    }

    // Règle 7 : On retourne un NOUVEAU tableau (copie) pour ne pas modifier l'original
    const sorted = [...students];

    return sorted.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        // Si on trie par nom (chaînes de caractères)
        if (typeof valA === 'string' && typeof valB === 'string') {
        if (order === 'desc') {
            return valB.localeCompare(valA);
        }
        return valA.localeCompare(valB);
        }

        // Si on trie par âge ou par note (nombres)
        if (order === 'desc') {
        return valB - valA;
        }
        return valA - valB; // ordre ascendant par défaut
    });
}

// A5 : parsePrice
export function parsePrice(input) {
  if (input === "gratuit") return 0;
  if (typeof input === 'number') return input >= 0 ? input : null;
  if (!input || typeof input !== 'string') return null;

  // Remplace la virgule par un point et supprime les espaces et le symbole €
  const cleaned = input.replace(/,/g, '.').replace(/[€\s]/g, '');
  const num = parseFloat(cleaned);

  if (isNaN(num)) return null;
  if (num < 0) return null;

  return Number(num.toFixed(2));
}

// A6 : groupBy
export function groupBy(array, key) {
  if (!array || !Array.isArray(array)) return {};
  
  return array.reduce((acc, item) => {
    const groupKey = item[key];
    // Si l'objet n'a pas la clé, on l'ignore (ou on le met dans undefined, ici on ignore pour la propreté)
    if (groupKey === undefined) return acc;
    
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    
    return acc;
  }, {});
}

// A7 : calculateDiscount
export function calculateDiscount(price, discountRules) {
    if (typeof price !== 'number' || price < 0) {
        throw new Error("Prix initial invalide");
    }
    if (!discountRules || !Array.isArray(discountRules)) return price;

    let finalPrice = price;

    for (const rule of discountRules) {
        if (rule.type === 'percentage') {
        finalPrice -= finalPrice * (rule.value / 100);
        } 
        else if (rule.type === 'fixed') {
        finalPrice -= rule.value;
        } 
        else if (rule.type === 'buyXgetY' && rule.itemPrice > 0) {
        // Calcule combien d'articles on a au total
        const totalItems = Math.floor(finalPrice / rule.itemPrice);
        // Calcule combien de groupes (Achetés + Gratuits) on a
        const groups = Math.floor(totalItems / (rule.buy + rule.free));
        // Déduit le prix des articles gratuits
        finalPrice -= groups * rule.free * rule.itemPrice;
        }
    }

    // Le prix ne peut pas être négatif
    return Math.max(0, Number(finalPrice.toFixed(2)));
}