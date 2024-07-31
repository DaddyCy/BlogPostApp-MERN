import crypto from 'crypto';

// Creazione Key

console.log(crypto.randomBytes(64).toString('hex')); // Crea nel terminale una key univoca ,trasforma un codice binario in una stringa esadecimale

