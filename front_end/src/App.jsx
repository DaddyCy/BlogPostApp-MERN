import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogNavbar from './components/BlogNavbar';
import BlogFooter from './components/BlogFooter';
import NewPost from './pages/NewPost';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import "./App.css";



export default function App() {
  
  
  const [search,setSearch] = useState("");// campo di ricerca
  const handleSearch = (e) => setSearch(e.target.value);//metodo di ricerca
  
  
  return (
    <Router>
      <div className="app-container">
        <BlogNavbar search={search} handleSearch={handleSearch}/>
        <div className="content-wrapper">
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/create' element={<NewPost />}></Route>
            <Route path='/post/:id' element={<PostDetail />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>
          </Routes>
        </div>
        <BlogFooter/>
      </div>
    </Router>
  )
}