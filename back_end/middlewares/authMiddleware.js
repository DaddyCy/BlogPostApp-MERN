// Importiamo le dipendenze necessarie
import {verifyJWT} from "../utils/jwt.js";
import Author from "../models/Author.js";


// Middleware di autenticazione e verifica
export const authMiddleware = async (req, res, next) => {
    try {
      // Estrai il token dall'header Authorization
        const token = req.headers.authorization?.replace('Bearer ', '');
      // Se non c'è un token, restituisci un errore 401 (Unauthorized)
        if (!token) {
        return res.status(401).send('Autorizzazione negata: Token mancante');
    }
      // Verifica e decodifica il token usando la funzione verifyJWT
        const decoded = await verifyJWT(token);// Se il token è valido, decoded conterrà il payload del token (es. { id: '123' })
        console.log('clg middleware decoded', decoded); 
      // Usa l'ID dell'autore dal token per trovare l'autore nel database
        const author = await Author.findById(decoded.id).select('-password');// .select('-password') esclude il campo password dai dati restituiti poichè è Hashato(codificato)
        console.log('clg middleware author', author);
      // Se l'autore non viene trovato nel database, restituisci un errore 401
        if (!author) {
        return res.status(401).send('Autore non trovato nel DB');
    }
      // Aggiungi l'oggetto author alla richiesta
        req.author = author;// Questo rende i dati dell'autore disponibili per le route successive
        next();// Passa al prossimo middleware o alla route handler
        } catch (error) {
      // Se c'è un errore durante la verifica del token o nel trovare l'autore,
        res.status(401).send('Token non valido');
    }
};