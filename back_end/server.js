// Import dei moduli necessari
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import session from "express-session";
import passport from "./config/passportConfig.js";

// Import delle rotte
import authorRoutes from "./routes/authorRoutes.js";
import blogPostRoutes from "./routes/blogPostRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// MIDDLEWARE Importazione dei middleware per la gestione degli errori
import {
    badRequestHandler,
    unauthorizedHandler,
    notFoundHandler,
    genericErrorHandler,
} from "./middlewares/errorHandlers.js";


dotenv.config();
const app = express();

// Da implementare con il deploy su render e vercel ,non funzionante da risolvere
const corsOptions = {
    origin: function (origin, callback) {
      // Definiamo una whitelist di origini consentite. 
      // Queste sono gli URL da cui il nostro frontend farà richieste al backend.
      const whitelist = [
          'http://localhost:5173',
          'https://blog-post-app-xi.vercel.app',
          'https://blogpostapp-h7ib.onrender.com'
      ];
      
      if (process.env.NODE_ENV === 'development') {
        // In sviluppo, permettiamo anche richieste senza origine (es. Postman)
        callback(null, true);
      } else if (whitelist.indexOf(origin) !== -1 || !origin) {
        // In produzione, controlliamo se l'origine è nella whitelist
        callback(null, true);
      } else {
        callback(new Error('PERMESSO NEGATO - CORS'));
      }
    },
    credentials: true // Permette l'invio di credenziali, come nel caso di autenticazione
    // basata su sessioni.
  };
  


app.use(cors(corsOptions));
app.use(express.json());

app.use(
    session({
      // Il 'secret' è usato per firmare il cookie di sessione
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  
  // Inizializzazione di Passport
  app.use(passport.initialize());
  app.use(passport.session());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connesso"))
    .catch((err) => console.error("Errore di connessione MongoDB:", err));

app.use("/api/auth", authRoutes); // Rotte per login(autenticazione), se si vogliono utilizzare solo una volta loggati,bisogna aggiungere authMiddleware
app.use("/api/authors", authorRoutes); // Rotte per gli autori
app.use("/api/blogPosts", blogPostRoutes); // Rotte per i blog post   

const PORT = process.env.PORT || 3000; // || 5000 se PORT=5001

// Applicazione dei middleware per la gestione degli errori
app.use(badRequestHandler); // Gestisce errori 400 Bad Request
app.use(unauthorizedHandler); // Gestisce errori 401 Unauthorized
app.use(notFoundHandler); // Gestisce errori 404 Not Found
app.use(genericErrorHandler); // Gestisce tutti gli altri errori

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);

    // Stampa tutte le rotte disponibili in formato tabellare
    console.log("Rotte disponibili:");
    console.table(
        listEndpoints(app).map((route) => ({
        path: route.path,
        methods: route.methods.join(", "),
        })),
    );
});

