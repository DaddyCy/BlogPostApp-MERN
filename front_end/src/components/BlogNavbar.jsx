import { Navbar, Container, Nav, } from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { PiHandPeaceDuotone } from "react-icons/pi";
import Button from 'react-bootstrap/Button';
import "./BlogNavbar.css";
import { getUserData } from "../services/AxiosApi";


export default function BlogNavbar() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    // Controlla se esiste un token nel localStorage
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await getUserData();
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Token non valido:", err);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    
    // Controlla lo stato di login all'avvio
    checkLoginStatus();

    // Aggiungi un event listener per controllare lo stato di login
    window.addEventListener("storage", checkLoginStatus);
    // Evento per il cambio di stato
    window.addEventListener("loginStateChange", checkLoginStatus);
    // Rimuovi l'event listener quando il componente viene smontato ed al cambiamento
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStateChange", checkLoginStatus);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };
  
  return (
    
            <Navbar className="mt-2">
  <Container>
    <Nav className="w-100 d-flex justify-content-between align-items-center">
      {isLoggedIn ? (
        <>
          <div className="d-flex align-items-center">
            <Link className="logoNavbar me-3" to="/">
              <PiHandPeaceDuotone />
            </Link>
            <Link className='nav-link me-2' to="/">Home</Link>
            <Link className='nav-link' to="/create">New Post</Link>
          </div>
          <Button variant="outline-info" onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <>
          <div className="d-flex align-items-center">
            <Link className="logoNavbar me-3" to="/">
              <PiHandPeaceDuotone />
            </Link>
            <Link className='nav-link me-2' to="/login">Login</Link>
            <Link className='nav-link' to="/register">Registration</Link>
          </div>
          <div></div> {/* Elemento vuoto per mantenere la struttura */}
          <div></div> {/* Elemento vuoto per mantenere la struttura */}
        </>
      )}
    </Nav>
  </Container>
</Navbar>
    
  )
}
