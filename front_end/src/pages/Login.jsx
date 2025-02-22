import { useState, useEffect } from "react"; // Importa il hook useState da React per gestire lo stato
import { useNavigate, useLocation } from "react-router-dom"; // Importa useNavigate da react-router-dom per navigare programmaticamente
import { loginUser } from "../services/AxiosApi"; // Importa la funzione API per effettuare il login
import "./Login.css";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const API_URL = import.meta.env.VITE_API_URL || "https://blogpostapp-h7ib.onrender.com";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "", // Stato iniziale del campo email
    password: "", // Stato iniziale del campo password
  });
  const navigate = useNavigate(); // Inizializza il navigatore per cambiare pagina
  const location = useLocation();
  
  useEffect(() => {
    // Questo effect viene eseguito dopo il rendering del componente
    // e ogni volta che location o navigate cambiano
  
    // Estraiamo i parametri dall'URL
    const params = new URLSearchParams(location.search);
    // Cerchiamo un parametro 'token' nell'URL
    const token = params.get("token");
  
    if (token) {
      // Se troviamo un token, lo salviamo nel localStorage
      localStorage.setItem("token", token);
      // Dispatchamo un evento 'storage' per aggiornare altri componenti che potrebbero dipendere dal token
      window.dispatchEvent(new Event("storage"));
      // Navighiamo alla home page
      navigate("/");
    }
  }, [location, navigate]); // Questo effect dipende da location e navigate
  
  
  
  // Gestore del cambiamento degli input del form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Aggiorna lo stato del form con i valori degli input
  };

  // Gestore dell'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
    try {
      const response = await loginUser(formData); // Chiama la funzione loginUser per autenticare l'utente
      localStorage.setItem("token", response.token); // Memorizza il token di autenticazione nel localStorage
      // Trigger l'evento storage per aggiornare la Navbar
      window.dispatchEvent(new Event("storage")); // Scatena un evento di storage per aggiornare componenti come la Navbar
      console.log("Login effettuato con successo!"); // Mostra un messaggio di successo
      navigate("/"); // Naviga alla pagina principale
    } catch (error) {
      console.error("Errore durante il login:", error); // Logga l'errore in console
      alert("Credenziali non valide. Riprova."); // Mostra un messaggio di errore
    }
  };
  
// Funzione per gestire il login con Google
const handleGoogleLogin = () => {
// Reindirizziamo l'utente all'endpoint del backend che inizia il processo di autenticazione Google  
  window.location.href =   `${API_URL}/api/auth/google`;
};
// Funzione per gestire il login con Github
const handleGitHubLogin = () => {
// Reindirizziamo l'utente all'endpoint del backend che inizia il processo di autenticazione Github  
  window.location.href =    `${API_URL}/api/auth/github`;
};

  return (
    <div className="container mt-5">
    <h2 className="titleLogin text-center mb-5">Login</h2>
    <form onSubmit={handleSubmit} className="mb-5">
      <div className="row justify-content-center mb-4">
        <div className="col-md-4 mb-3">
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="row justify-content-center mb-5">
        <div className="col-md-4 text-center">
          <button className="btn btn-outline-success" type="submit">Log In</button>
        </div>
      </div>
    </form>
    <div className="row justify-content-center">
      <div className="col-md-8 d-flex justify-content-between">
        <button className="btn btn-outline-warning flex-grow-1 me-2" onClick={handleGoogleLogin}>Log In Google</button>
        <button className="btn btn-outline-info flex-grow-1 ms-2" onClick={handleGitHubLogin}>Log In GitHub</button>
      </div>
    </div>
  </div>
  );
}
