import { describe, it, expect } from 'vitest';
import { capitalize, calculateAverage, slugify, clamp, sortStudents } from '../src/utils.js';

describe('Utils Functions()', () => {
    describe('capitalize()', () =>{
        it('doit mettre la premère lettre en majuscule quand on passe un mot en minuscule', () => {
            const input="hello";
            const result=capitalize(input);
            expect(result).toBe("Hello");
        });

        it('doit formater correctement quand le mot est tout en majuscule', () => {
            const input ="HELLO";
            const result=capitalize(input);
            expect(result).toBe("Hello");
        });

        it('doit renvoyer une chaîne vide quand on passe une chaîne vide', () => {
            const result = capitalize("");
            expect(result).toBe("");
        });

        it('doit renvoyer une chaîne vide quand on passe null', () => {
            const result = capitalize(null);
            expect(result).toBe("");
        });
    });

    describe('calculateAverage()', () => {
        it('doit calculer la moyenne quand on passe un tableau de 2 nombres minimum', () => {
            const input = [1, 2, 20, 7, 15];
            const result= calculateAverage(input);
            expect(result).toBe(9);
        });

        it('doit renvoyer 0 quand on passe un tableau vide', () => {
            const input = [];
            const result= calculateAverage(input);
            expect(result).toBe(0);
        });

        it('doit renvoyer le nombre meme quand on passe un seul nombre', () => {
            const input = [1];
            const result = calculateAverage(input);
            expect(result).toBe(1);
        });

        it('doit renvoyer 0  quand on passe null', () => {
            const input = [null];
            const result = calculateAverage(input);
            expect(result).toBe(0);
        });
    
    });



    describe('slugify()', () => {
        it('doit remplacer les espaces par des tirets et tout mettre en minuscules', () =>{
        const result = slugify("Hello World");
        expect(result).toBe("hello-world");
        });

        it('doit supprimer les espaces au début et à la fin (trim)', () => {
            const result = slugify(" Spaces Everywhere ");
            expect(result).toBe("spaces-everywhere");
        });

        it('doit supprimer les caractères spéciaux et les accents', () => {
            const result = slugify("C'est l'ete !");
            expect(result).toBe("cest-lete");    
        });

        it('doit renvoyer une chaîne vide si on passe une chaîne vide ou null', () => {
            const result = slugify("");
            expect(result).toBe("");
            expect(slugify(null)).toBe("");
        });

    });

    describe('clamp()', () => {
        it('doit renvoyer la valeur si elle est entre le min et le max', () => {
        expect(clamp(5, 0, 10)).toBe(5);
        });

        it('doit renvoyer le minimum si la valeur est inferieure au minimum', () => {
        expect(clamp(-5, 0, 10)).toBe(0);
        });

        it('doit renvoyer le maximum si la valeur est superieure au maximum', () => {
        expect(clamp(15, 0, 10)).toBe(10);
        });

        it('doit gerer le cas ou toutes les valeurs sont a 0', () => {
        expect(clamp(0, 0, 0)).toBe(0);
        });
    });

    describe('sortStudents()', () => {
    const baseStudents = [
      { name: "Charlie", grade: 18, age: 19 },
      { name: "Alice", grade: 15, age: 20 },
      { name: "Bob", grade: 12, age: 22 }
    ];

    it('1. should sort students by grade ascending', () => {
      const result = sortStudents(baseStudents, 'grade', 'asc');
      expect(result[0].name).toBe("Bob");     // 12
      expect(result[1].name).toBe("Alice");   // 15
      expect(result[2].name).toBe("Charlie"); // 18
    });

    it('2. should sort students by grade descending', () => {
      const result = sortStudents(baseStudents, 'grade', 'desc');
      expect(result[0].name).toBe("Charlie"); // 18
      expect(result[2].name).toBe("Bob");     // 12
    });

    it('3. should sort students by name ascending', () => {
      const result = sortStudents(baseStudents, 'name', 'asc');
      expect(result[0].name).toBe("Alice");
      expect(result[1].name).toBe("Bob");
      expect(result[2].name).toBe("Charlie");
    });

    it('4. should sort students by age ascending', () => {
      const result = sortStudents(baseStudents, 'age', 'asc');
      expect(result[0].age).toBe(19);
      expect(result[2].age).toBe(22);
    });

    it('5. should return empty array for null input', () => {
      expect(sortStudents(null, 'name', 'asc')).toEqual([]);
    });

    it('6. should return empty array for empty input', () => {
      expect(sortStudents([], 'name', 'asc')).toEqual([]);
    });

    it('7. should not modify the original array', () => {
      const originalCopy = [...baseStudents];
      const result = sortStudents(baseStudents, 'grade', 'desc');
      
      expect(result).not.toBe(baseStudents);
      // On vérifie que le tableau de base n'a pas bougé
      expect(baseStudents).toEqual(originalCopy);
    });

    it('8. should default to ascending order', () => {
      const result = sortStudents(baseStudents, 'grade');
      expect(result[0].name).toBe("Bob"); // Le plus bas doit être premier (asc)
    });
  });

});