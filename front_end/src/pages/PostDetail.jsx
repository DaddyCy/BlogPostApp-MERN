// Importa gli hook necessari da React
import { useState, useEffect } from "react";
// Importa useParams per accedere ai parametri dell'URL
import { useParams, Link } from "react-router-dom";
// Importo la funzione getPost dal mio file services/api
import { getPost, getComments, addComment, getUserData } from "../services/AxiosApi";
import "./PostDetail.css";



export default function PostDetail() {
  
  const [post, setPost] = useState(null); // Stato per memorizzare i dati del post
  const [comments, setComments] = useState([]); // Stato per memorizzare i commenti
  const [newComment, setNewComment] = useState({ content: "" }); // Stato per il nuovo commento da aggiungere
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato per verificare se l'utente è loggato
  const [userData, setUserData] = useState(null); // Stato per memorizzare i dati dell'utente
  const { id } = useParams(); // Estrae l'id del post dai parametri dell'URL


  // Effect hook per fetchare i dati del post quando il componente viene montato o l'id cambia
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Effettua una richiesta GET al backend per ottenere i dettagli del post
        const postResponse = await getPost(id);
        // Aggiorna lo stato con i dati del post
        setPost(postResponse);
      } catch (err) {
          console.error("Errore nel caricamento del post:", err); // Logga l'errore in console
        }
    };
        
    // Fetch dei commenti
    const fetchComments = async () => {
      try { 
        const commentsResponse = await getComments(id); // Ottiene i commenti del post dall'API
        setComments(commentsResponse); // Imposta i commenti nello stato
      } catch (error) {
        console.error("Errore nel caricamento dei commenti:", error); // Logga eventuali errori nella console
      }
    };
    
    // Verifica autorizzazioni 
    const checkAuthAndFetchUserData = async () => {
      const token = localStorage.getItem("token"); // Recupera il token di autenticazione dalla memoria locale
      if (token) {
        setIsLoggedIn(true); // Imposta lo stato di autenticazione a true
        try {
          const data = await getUserData(); // Ottiene i dati dell'utente autenticato dall'API
          setUserData(data); // Imposta i dati dell'utente nello stato
          fetchComments(); // Carica i commenti del post
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error); // Logga l'errore in console
          setIsLoggedIn(false); // Imposta lo stato di autenticazione a false
        }
      } else {
        setIsLoggedIn(false); // Imposta lo stato di autenticazione a false
      }
    };

    fetchPost(); // Carica i dati del post al caricamento del componente
    checkAuthAndFetchUserData(); // Verifica l'autenticazione e carica i dati dell'utente
  }, [id]); // L'effetto si attiva quando l'id cambia
  
// Gestore per l'invio di un nuovo commento
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
    if (!isLoggedIn) {
      console.error("Devi effettuare il login per commentare."); // Logga un messaggio di errore se l'utente non è loggato
      return;
    }
    try {
      const commentResponse = {
        content: newComment.content, // Contenuto del nuovo commento
        name: `${userData.name} ${userData.surname}`, // Nome dell'utente
        email: userData.email, // Email dell'utente
      };
      const newCommentResponse = await addComment(id, commentResponse); // Invia il nuovo commento all'API
      
    // Genera un ID temporaneo se l'API non restituisce un ID in tempo
      if (!newCommentResponse._id) {
        newCommentResponse._id = Date.now().toString();
      }
      setComments((newComments) => [...newComments, newCommentResponse]); // Aggiunge il nuovo commento alla lista dei commenti
      setNewComment({ content: "" }); // Resetta il campo del nuovo commento
    } catch (err) {
      console.error("Errore nell'invio del commento:", err); // Logga l'errore in console
      alert(
        `Errore nell'invio del commento: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  // Se il post non è ancora stato caricato, mostra un messaggio di caricamento
  if (!post) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  // Rendering del componente
  return (
    <div className="container">
    <article className="post-detail">
      <div className="row">
        {/* Colonna sinistra con immagine e contenuto */}
        <div className="col-md-8">
          {/* Immagine di copertina del post */}
          <div className="d-flex justify-content-center align-items-center mb-3">
            <img
              src={post.cover}
              alt={post.title}
              className="post-cover img-fluid"
              style={{ maxWidth: '80%', height: 'auto' }}
            />
          </div>
          
          {/* Contenuto del post */}
          <div
            className="post-content mb-4 ms-5"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Colonna destra con titolo e dati del post */}
        <div className="col-md-4">
          <h1>{post.title}</h1>
          <div className="post-meta my-3">
            <p><strong>Category:</strong> {post.category}</p>
            <p><strong>Author:</strong> {post.author}</p>
            <p><strong>Reading time:</strong> {post.readTime.value} {post.readTime.unit}</p>
          </div>
        </div>
      </div>

      {/* Form per aggiungere un nuovo commento */}
      <div className="comment-form mb-3">
        <h3 className="mb-2">Write a comment</h3>
        <form onSubmit={handleCommentSubmit}>
          <div className="form-group">
            <textarea
              className="form-control"
              rows="3"
              value={newComment.content}
              onChange={(e) =>
                setNewComment({ ...newComment, content: e.target.value })
              }
              placeholder="Scrivi un commento..."
            />
          </div>
          <button type="submit" className="btn btn-info mt-2">Send the Comment</button>
        </form>
      </div>

      {/* Sezione commenti */}
      <div className="comment-section">
        <h3 className="comment-section-title mb-3">Comments</h3>
        {comments.map((comment) => (
          <div key={comment._id} className="comment mb-2">
            <p className="mb-1">{comment.content}</p>
            <small>Of: {comment.name}</small>
          </div>
        ))}
      </div>
    </article>
  </div>
);
}
