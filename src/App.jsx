

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/homepage.jsx'; 
import CreatePost from './components/createpost.jsx'
import EditPost from "./components/editpost.jsx";
import PostDetails from "./components/postdetail.jsx";
function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/editpost/:postId" element={<EditPost />} />
        <Route path="/post/:postId" element={<PostDetails />} />

      </Routes>
    </Router>

  )
}

export default App
