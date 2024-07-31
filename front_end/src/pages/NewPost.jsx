import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getMe } from "../services/AxiosApi";

export default function NewPost() {
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    cover: "",
    readTime: { value: 0, unit: "minutes" },
    author: "",
  });

  const [coverFile, setCoverFile] = useState(null);
  const navigate = useNavigate();

  const categories = ["Technology", "Entertainment", "Lifestyle", "Development", "Travel"];

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await getMe();
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else if (name === "title") {
      const titleText = value.charAt(0).toUpperCase() + value.slice(1);
      setPost({ ...post, [name]: titleText });
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(post).forEach((key) => {
        if (key === "readTime") {
          formData.append("readTime[value]", post.readTime.value);
          formData.append("readTime[unit]", post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });
      if (coverFile) {
        formData.append("cover", coverFile);
      }
      await createPost(formData);
      navigate("/");
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
  };

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  return (
    <div className="container mt-4">
  <h1 className="mb-3">Crea un nuovo post</h1>
  <form onSubmit={handleSubmit} className="create-post-form">
    <div className="row g-2 mb-2">
      <div className="col-md-6">
        <label htmlFor="title" className="form-label small mb-1">Titolo</label>
        <input
          type="text"
          className="form-control form-control-sm"
          id="title"
          name="title"
          value={post.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="category" className="form-label small mb-1">Categoria</label>
        <select
          className="form-select form-select-sm"
          id="category"
          name="category"
          value={post.category}
          onChange={handleChange}
          required
        >
          <option value="">Seleziona una categoria</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="mb-2">
      <label htmlFor="content" className="form-label small mb-1">Contenuto</label>
      <textarea
        className="form-control form-control-sm"
        id="content"
        name="content"
        value={post.content}
        onChange={handleChange}
        required
        rows="4"
      />
    </div>
    <div className="row g-2 mb-2">
      <div className="col-md-6">
        <label htmlFor="cover" className="form-label small mb-1">Immagine Post</label>
        <input
          type="file"
          className="form-control form-control-sm"
          id="cover"
          name="cover"
          onChange={handleFileChange}
          required
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="readTimeValue" className="form-label small mb-1">Tempo di lettura (min)</label>
        <input
          type="number"
          className="form-control form-control-sm"
          id="readTimeValue"
          name="readTimeValue"
          value={post.readTime.value}
          onChange={handleChange}
          required
        />
      </div>
    </div>
    <div className="mb-2">
      <label htmlFor="author" className="form-label small mb-1">Email autore</label>
      <input
        type="email"
        className="form-control form-control-sm"
        id="author"
        name="author"
        value={post.author}
        readOnly
      />
    </div>
    <button type="submit" className="btn btn-outline-warning btn-sm w-100">
      Crea il post
    </button>
  </form>
</div>
  );
}