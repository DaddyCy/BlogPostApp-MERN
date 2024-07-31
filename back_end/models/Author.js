import mongoose from "mongoose";
import bcrypt from 'bcrypt'; // Importa bcrypt per l'hashing delle password

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

// Metodo per confrontare le password
// Questo metodo viene aggiunto a ogni documento 'author',comparePassword nome inventato
    authorSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password); // Usa bcrypt per confrontare la password fornita con quella hashata nel database (passwoord oggetto author)
};


// Middleware per l'hashing delle password prima del salvataggio(pre)
    authorSchema.pre('save', async function(next) {

    // Esegui l'hashing solo se la password è stata modificata (o è nuova)
    if (!this.isModified('password')) return next();// Questo previene l'hashing multiplo della stessa password
    
    try {
        const salt = await bcrypt.genSalt(10); // Genera un salt (un valore casuale per rendere l'hash più sicuro)
        this.password = await bcrypt.hash(this.password, salt); // Crea l'hash della password usando il salt(salvataggio)
        next();
    } catch (error) {
        next(error); // Passa eventuali errori al middleware successivo
    }
});    

export default mongoose.model("Author", authorSchema);