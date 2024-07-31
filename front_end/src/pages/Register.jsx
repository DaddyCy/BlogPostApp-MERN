import { useState, useEffect } from "react"; // Importa il hook useState da React per gestire lo stato del componente
import { useNavigate } from "react-router-dom"; // Importa useNavigate da react-router-dom per navigare tra le pagine
import { registerUser } from "../services/AxiosApi"; // Importa la funzione registerUser dal file api.js per effettuare la registrazione
import "./Register.css";


export default function Register() {
  // Definisce lo stato del form con useState, inizializzato con campi vuoti
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });


 
  const [minDate, setMinDate] = useState(""); // Definisce lo stato della data di nascita(min)
  const [maxDate, setMaxDate] = useState(""); // Definisce lo stato della data di nascita(max)
  const navigate = useNavigate(); // Inizializza useNavigate per poter navigare programmaticamente

  useEffect(() => {
    
    const today = new Date();
    // Calcola la data minima (16 anni fa da oggi)
    const minDateAccept = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    setMinDate(minDateAccept.toISOString().split('T')[0]);
    // Calcola la data massima (130 anni  da oggi)
    const maxDateAccept = new Date(today.getFullYear() - 130, today.getMonth(), today.getDate());
    setMaxDate(maxDateAccept.toISOString().split('T')[0]);
  }, []);


  // Gestore per aggiornare lo stato quando i campi del form cambiano
  const handleChange = (e) => {
    // Aggiorna il campo corrispondente nello stato con il valore attuale dell'input
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  
  // Gestore per la sottomissione del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
    try {
      await registerUser(formData); // Chiama la funzione registerUser con i dati del form
      alert("Registrazione avvenuta con successo!"); // Mostra un messaggio di successo
      navigate("/login"); // Naviga alla pagina di login dopo la registrazione
    } catch (error) {
      console.error("Errore durante la registrazione:", error); // Logga l'errore in console
      alert("Errore durante la registrazione. Riprova."); // Mostra un messaggio di errore
    }
  };

  return (
<div className="container d-flex flex-column align-items-center mt-4">
  <h2 className=" titleRegister text-center mb-5">Registration</h2>
  <div className="row justify-content-center w-100">
    <div className="col-md-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="date"
            name="dateOfBirth"
            onChange={handleChange}
            min={maxDate}
            max={minDate}
            required
            className="form-control"
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-outline-warning">Sign In</button>
        </div>
      </form>
    </div>
  </div>
</div>
  );
}
