import axios from 'axios';

// const API_URL = 'http://localhost:3001/api';
const API_URL = import.meta.env.VITE_API_URL || 'https://blogpostapp-h7ib.onrender.com/api';


const api = axios.create({baseURL: API_URL}); // creazione istanza axios

api.interceptors.request.use(
  (config) => {
    // Recupera il token dalla memoria locale
    const token = localStorage.getItem("token");
    if (token) {
      // Se il token esiste, aggiungilo all'header di autorizzazione
      config.headers["Authorization"] = `Bearer ${token}`;
      // console.log("Token inviato:", token);  Log del token inviato per debugging
    }
    return config; // Restituisce la configurazione aggiornata
  },
  (error) => {
    // Gestisce eventuali errori durante l'invio della richiesta
    return Promise.reject(error);
  }
);

// Creazione chiamate axios
// export const getPosts = () => api.get('/blogPosts');
export const getPosts = (currentPage, limit) => api.get(`/blogPosts?page=${currentPage}&limit=${limit}`).then((response) => response.data);
export const getPost = (id) => api.get(`/blogPosts/${id}`).then((response) => response.data); // o _id
// modificata la funzione createPost per gestire FormData
export const createPost = (postData) => api.post('/blogPosts', postData, {
    headers:{
        "Content-Type": "multipart/form-data"
    }
});

export const updatePost = (id, postData) =>  api.put(`/blogPosts/${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);

// Funzioni per gestire i commenti

// Recupera tutti i commenti per un post specifico
export const getComments = (postId) =>
    api.get(`/blogPosts/${postId}/comments`).then((response) => response.data);

  // Aggiunge un nuovo commento a un post specifico
export const addComment = (postId, commentData) =>
    api
        .post(`/blogPosts/${postId}/comments`, commentData)
        .then((response) => response.data);

  // Funzione per recuperare un commento specifico
export const getComment = (postId, commentId) =>
    api
        .get(`/blogPosts/${postId}/comments/${commentId}`)
        .then((response) => response.data);

  // Funzione per aggiornare un commento specifico
export const updateComment = (postId, commentId, commentData) =>
    api
        .put(`/blogPosts/${postId}/comments/${commentId}`, commentData)
        .then((response) => response.data);

  // Funzione per eliminare un commento specifico
export const deleteComment = (postId, commentId) =>
    api
        .delete(`/blogPosts/${postId}/comments/${commentId}`)
        .then((response) => response.data);

// ROTTE PER L'AUTENTICAZIONE

  // Funzione per registrare un nuovo utente
  export const registerUser = (userData) => api.post("/authors", userData);
    
    // Funzione per effettuare il login di un utente
    export const loginUser = async (credentials) => {
      try {
        const response = await api.post("/auth/login", credentials); // Effettua la richiesta di login
        console.log("Risposta API login:", response.data); // Log della risposta per debugging
        return response.data; // Restituisce i dati della risposta
      } catch (error) {
        console.error("Errore nella chiamata API di login:", error); // Log dell'errore per debugging
        throw error; // Lancia l'errore per essere gestito dal chiamante
      }
    };
    
    // Funzione per ottenere i dati dell'utente attualmente autenticato
    export const getMe = () =>
      api.get("/auth/me").then((response) => response.data);
    
    // Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
    export const getUserData = async () => {
      try {
        const response = await api.get('/auth/me'); // Effettua la richiesta per ottenere i dati dell'utente
        return response.data; // Restituisce i dati della risposta
      } catch (error) {
        console.error('Errore nel recupero dei dati utente:', error); // Log dell'errore per debugging
        throw error; // Lancia l'errore per essere gestito dal chiamante
      }
    };
    

export default api;