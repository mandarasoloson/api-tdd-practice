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