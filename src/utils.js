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