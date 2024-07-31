import express from "express";
import Author from "../models/Author.js";
import BlogPost from "../models/BlogPost.js";
import cloudinaryUploader from "../config/cloudinaryConfig.js";

const router = express.Router();

// Get/authors :ritorna la lista di tutti gli autori
router.get('/', async (req,res) =>{
    try {
        const page = parseInt(req.query.page) || 1; // Estrae il numero di pagina dalla query, default a 1 se non specificato
        const limit = parseInt(req.query.limit) || 10; // Estrae il limite di risultati per pagina, default a 5
        const sort = req.query.sort || "email"; // Determina il campo per l'ordinamento, default a email
        const sortDirection = req.query.sortDirection === "desc" ? -1 : 1; // Determina la direzione dell'ordinamento (1 per ascendente, -1 per discendente)
        const skip = (page - 1) * limit; // Calcola quanti documenti saltare per arrivare alla pagina richiesta
    
        // Esegue la query al database con paginazione, ordinamento e limite
        const authors = await Author.find({}) 
            .sort({ [sort]: sortDirection }) // Ordina i risultati
            .skip(skip) // Salta i documenti delle pagine precedenti
            .limit(limit); // Limita il numero di risultati
            
            const totalAuthors = await Author.countDocuments(); // Conta il numero totale di autori nel database
            
            // Invia la risposta JSON con i dati degli utenti e tutte le informazioni di paginazione
            res.json({
                authors, // Array degli autori per la pagina corrente
                currentPage: page, // Numero della pagina corrente
                totalPages: Math.ceil(totalAuthors / limit), // Calcola il numero totale di pagine
                totalAuthors: totalAuthors, // Numero totale di utenti nel database 
            });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get/authors/123 : ritorna il singolo autore
router.get('/:id', async (req,res) => {
    try {
        const author = await Author.findById(req.params.id);
        if(!author){
            return res.status(404).json({ message: "Autore non trovato" }); // ritorna un messaggio con l'errore
        }
        res.json(author);// invia l'autore trovato come risposta JSON
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Post/authors: crea un nuovo autore
router.post('/', async (req,res) => {
    try {
        const author = new Author(req.body); // Crea una nuova istanza di Author con i dati del body dalla richiesta
        const newAuthor = await author.save(); // Salva l'autore nel database
        // Rimuovi la password dalla risposta per sicurezza
        const authorResponse = newAuthor.toObject();
        delete authorResponse.password;
        res.status(201).json(authorResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
        
    }
});



//Patch/authors/123: modifica l'autore con l'id associato
router.patch('/:id', async (req,res) => {
    try { 
        const updateAuthor = await Author.findByIdAndUpdate(
            req.params.id , // prende l'id dell'autore da modificare
            req.body , // prende il corpo della richiesta di modifica
            { new: true },
        );
        if(!updateAuthor){
            return res.status(404).json({ message: "Autore non trovato" });
        };
        res.json(updateAuthor);
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
});

// Delete/authors/123: cancella l'autore con l'id associato
router.delete('/:id', async (req,res) => {
    try {
        const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
        if (!deletedAuthor) {
            return res.status(404).json({ message: "Autore non trovato" });
        }
        res.json({ message: "Autore eliminato" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get/authors/:id/blogPosts: ricevi tutti i blog post di uno specifico autore
router.get('/:id/blogPosts', async (req,res) => {  // rotta con specifico autore( ci torviamo già nella rotta autori),ricerca blogpost
    try {
        const author = await Author.findById(req.params.id);// Cerca l'autore specifico per ID
    if (!author) {
        return res.status(404).json({ message: "Autore non trovato" });
    }
    const blogPosts = await BlogPost.find({ author: author.email }); // Cerca tutti i blog post dell'autore usando la sua email
    res.json(blogPosts); // Invia la lista dei blog post come risposta JSON
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /authors/:authorId/avatar: modifica l'immagine avatar per l'autore specificato
router.patch("/:authorId/avatar", cloudinaryUploader.single("avatar"), async (req, res) => {
    try {
        // Verifica se è stato caricato un file, se non l'ho caricato rispondo con un 400
        if (!req.file) {
        return res.status(400).json({ message: "Nessun file caricato" });
        }
        // Cerca l'autore nel database, se non esiste rispondo con una 404
        const author = await Author.findById(req.params.authorId);
        if (!author) {
        return res.status(404).json({ message: "Autore non trovato" });
        }
        // Aggiorna l'URL dell'avatar dell'autore con l'URL fornito da Cloudinary
        author.avatar = req.file.path;

        // Salva le modifiche nel db
        await author.save();

        // Invia la risposta con l'autore aggiornato
        res.json(author);
    } catch (error) {
        console.error("Errore durante l'aggiornamento dell'avatar:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
});
export default router;
