// Importa il modulo mailgun-js per l'invio di email
import mailgun from "mailgun-js";

const mg = mailgun ({
    apiKey: process.env.MAILGUN_API_KEY,
    domain : process.env.MAILGUN_DOMAIN,
});


export const sendEmail = async (to, subject,htmlContent) => {
    // Prepara i dati dell'email(struttura di mailgun)
    const data = { 
        from: "Frozen <noreply@yourdomain.com>", // Mittente dell'email
        to, // Destinatario
        subject, // Oggetto dell'email
        html: htmlContent, // Contenuto HTML dell'email
    };

    try {
        // Invia l'email usando Mailgun
        const response = await mg.messages().send(data);
        console.log("Email inviata con successo:", response);
        return response; // Restituisce la risposta di Mailgun
    } catch (err) {
        // Gestione degli errori
        console.error("Errore nell'invio dell'email:", error);
        throw err; // Rilancia l'errore per permettere la gestione esterna  
    }
}