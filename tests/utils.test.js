import { describe, it, expect } from 'vitest';
import { capitalize, calculateAverage, slugify, clamp } from '../src/utils.js';

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

});