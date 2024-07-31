import { useEffect, useState } from "react";
import { getPosts } from "../services/AxiosApi";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap"
import SearchPost from "../components/SearchPost";
import "./Home.css";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(5);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = () => {
            // Sostituisci questa logica con il tuo metodo di verifica dell'autenticazione
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
            } else {
                setIsLoggedIn(true);
                fetchPosts();
            }
        };
            const fetchPosts = async () => {
                try {
                    const response = await getPosts(currentPage, limit);
                    setPosts(response.blogPosts || []);
                    setFilteredPosts(response.blogPosts || []);
                    setTotalPages(response.totalPages || 1);
                } catch (error) {
                    console.error("Errore nella fetch dei post:", error);
                }
            };
        checkLoggedIn();
    }, [currentPage, limit, navigate]);

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearch(query);

    if (query === "") {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(
                posts.filter((post) =>
                    post.title.toLowerCase().includes(query.toLowerCase())
                )
            );
        }
    };
    
    
    if (!isLoggedIn) {
        return null; // Non renderizzare nulla mentre reindirizza
    }

    return (
        <div className="container text-center mt-3">
        <h1 id="title">Posts Board</h1>

        {/* Render SearchPost component se ci sono i post*/}
        {posts.length > 0 && (
            <SearchPost search={search} handleSearch={handleSearch} />
        )}

        <Col className="d-flex flex-column mt-5">
            {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                    <Row className="card-post" key={post._id}>
                        <Link
                            to={`/post/${post._id}`}
                            className="link-post mt-5 mb-5 d-flex flex-row"
                        >
                            <Col className="post-img me-5">
                                <img src={post.cover} alt={post.title} />
                            </Col>
                            <Col className="post-body ms-5 d-flex flex-column justify-content-between">
                                <div>
                                    <h1 className="post-title my-4">{post.title}</h1>
                                </div>
                                <div>
                                    <p className="post-text my-4">Author: {post.author}</p>
                                </div>
                            </Col>
                        </Link>
                    </Row>
                ))
            ) : (
                <p className="notPosts">No Posts Loaded</p>
            )}
        </Col>
        {filteredPosts.length > 0 && (
            <Col>
                <Row>
                    <div className="setPage d-flex">
                        <div className="me-2">
                            <button
                                className="btnPrev"
                                onClick={() =>
                                    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1))
                                }
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </div>
                        <span className="counterPage">
                            {" "}
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="ms-2">
                            <button
                                className="btnNext"
                                onClick={() =>
                                    setCurrentPage((currentPage) =>
                                        Math.min(currentPage + 1, totalPages)
                                    )
                                }
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                        <div>
                            <select
                                className="counterPosts"
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                            >
                                <option value={5}> 5 for page</option>
                                <option value={10}> 10 for page</option>
                                <option value={15}> 15 for page</option>
                            </select>
                        </div>
                    </div>
                </Row>
            </Col>
        )}
    </div>
    );
}

