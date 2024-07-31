<!-- Schema Author -->
const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String },
    email: { type: String, lowercase: true , unique: true },
    dateOfBirth: { type: String },
    avatar: { type: String },
    password: {type: String },
    googleId: { type: String },
    githubId: { type: String },
    }, {
    timestamps: true,
    collection: "authors"
    });



<!-- Schema Comment -->
const commentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        content: { type: String, required: true },
    },
    {
        timestamps: true,
        _id: true, // Mi assicuro che ogni commento abbia un proprio _id univoco
    },
);


<!-- Schema BlogPost -->
const blogPostSchema = new mongoose.Schema({
    category: { type: String, required: true,
        enum:[ "Technology", "Entertaiment", "Lifestyle", "Development", "Travel" ],
        default: "Development" },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
        value: { type: Number, required: true },
        unit: { type: String, required: true }
    },
    author: { type: String, required: true }, // email dell'autore
    content: { type: String, required: true },
    comments: [commentSchema], // Aggiungo l'array di commenti
    }, 
    {
    timestamps: true,
    collection: "blogPosts"
});

<!-- Da passportConfig.js Author google -->
 author = new Author({
              googleId: profile.id, // ID univoco fornito da Google
              name: profile.name.givenName, // Nome dell'utente
              surname: profile.name.familyName, // Cognome dell'utente
              email: profile.emails[0].value, // Email principale dell'utente
              // Nota: la data di nascita non è fornita da Google, quindi la impostiamo a null
              dateOfBirth: null,
            });


<!-- Da passportConfig.js Author github -->
 author = new Author({
          githubId: profile.id,
          name: name || 'GitHub User',  // Se non abbiamo un nome, usiamo 'GitHub User' come fallback
          surname: surname,
          email: email,
        });


<!-- Variabili di Ambiente  -->

# FRONTEND
- VITE_API_URL 
- CI 

# BACKEND
# Collegamento server
MONGODB_URI 
PORT=

# Collegamento Cloud(cloudinary)
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 

#Collegamento a mailgun (email validation)2cc725d6dfea4e558720183a501a7f9d-623e10c8-412b6d31
MAILGUN_DOMAIN = 

# Chiavi di accesso(JWT/ SESSION_SECRET si usa come token di sessione anche per GOOGLE)
JWT_SECRET = 
SESSION_SECRET = 

# login by Google
GOOGLE_CLIENT_ID = 
GOOGLE_CLIENT_SECRET = 


#  login by GitHub
GITHUB_CLIENT_ID = 
GITHUB_CLIENT_SECRET = 

# Render/Vercel
NODE_ENV 
FRONTEND_URL 
BACKEND_URL



<!-- Spiegazione App -->
La pagina iniziale è rappresentata dalla schermata login,poichè senza essere loggati non si può vedere l'HomePage.Nella pagina login hai 3 tipi di accesso;con Google,GitHub e tramite registrazione,a cui si viene reinderizzati tramite la navbar.Una volta loggati si viene renderizzata l'Home,dove si viene visualizzato un messaggio se non ci sono i post,altrimenti verrano renderizzati i post creati precedentemente.La navbar viene modifica una volta effetuato il login, dove le opzioni sono la Home e NewPost ,dove e possibile creare un post.Una volta Che la Home è popolata dai post si renderizza una searchBar per la ricerca tramite il title di essi.Se viene cliccato si aprirà una pagina dettagio con tutte le info della creazione del post(vedi schema creazione post).Inoltre c'è una parte dedicata all'inserimento dei commenti.Nella Home sopra il footer , vi è la paginazione dei post.
Ci sono 2 cose mancanti,un bottone per eliminare il commento e post(davano problemi al codice,funzionavano ad intermittenza),il render dell'avatar.

Le prove per mailgun puoi farle con: dcardarilli.dev@gmail.com (non ti da l'errore)



GRAZIE DI TUTTO SIMOOOOOOOO!!!!!!!!