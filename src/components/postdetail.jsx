
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // for accessing the post ID from the URL
import { Box, Typography, CircularProgress, CardMedia, AppBar, Toolbar, Button } from "@mui/material";
import supabase from "/supabase.js"; // Import your existing Supabase client
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import CommentSection from "./commentsection.jsx";

const PostDetails = () => {
  const { postId } = useParams(); // Get postId from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the details of the post
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, content, image_url")
        .eq("id", postId)
        .single();

      if (error) {
        console.error("Error fetching post:", error.message);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <CircularProgress />;
  }

  const homepageStyle = {
    backgroundImage: "url('/public/wallpaper.jpg')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '100vh',
    
  };

  return (
    <Box height='100vh' width='100vw'>
        <AppBar position="static" color='string'>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PostMe
          </Typography>
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            <Button color="inherit"><strong>Explore</strong></Button>
          </Link>
          <Link to="/createpost" style={{ textDecoration: "none", color: "black" }}>
            <Button color="inherit"><strong>Create Post</strong></Button>
          </Link>
        </Toolbar>
      </AppBar>

        <Box sx={{ padding: 4 }} style={homepageStyle}>
        {post && (
        <div>
            {/* Display post image if it exists */}
            {post.image_url && (
            <CardMedia
                
                component="img"
                height="800"
                image={post.image_url}
                alt={post.title}
            />
            )}
            <Typography variant="h1" sx={{ marginTop: 2 }}>
            {post.title}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
            {post.content}
            </Typography>

            <CommentSection postId ={post.id} />
        </div>
        )}
    </Box>

    </Box>

    
  );
};

PostDetails.propTypes = {
    postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };

export default PostDetails;
