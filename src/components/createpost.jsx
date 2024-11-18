import { useState } from "react";
import { TextField, Button, Typography, Box, AppBar, Toolbar, styled, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import supabase from "/supabase.js"; // Make sure the import path is correct
import PropTypes from "prop-types";
import SendIcon from '@mui/icons-material/Send';
import { Link, useNavigate } from "react-router-dom";
const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [selectedTag, setSelectedTag] = useState(""); // State for selected tag
  const [loading, setLoading] = useState(false);

  const tags = ["food", "sport", "music", "tech"]; // Example tags, can be fetched from Supabase
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure tag is selected
    if (!selectedTag) {
      alert("Please select a tag!");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([{ title, content, image_url: imageURL, tags: [selectedTag] }]); // Add the selected tag

      if (error) {
        console.error("Error creating post:", error);
      } else {
        onPostCreated(data[0]); // Call the parent function to update the feed
        setTitle("");
        setContent("");
        setImageURL("");
        setSelectedTag(""); // Reset the tag

        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const StyledButton = styled(Button)(({ theme }) => ({
    transition: 'background-color 0.5s ease-in-out, color 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: 'emrald',
      color: 'white',
    },
    '&:active': {
      boxShadow: 'pink',
      backgroundColor: 'gray',
      borderColor: theme.palette.primary.dark,
    },
  }));

  const homepageStyle = {
    backgroundImage: "url('/public/wallpaper.jpg')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    
    
  };
  const homepageStyle2 = {
    backgroundImage: "url('/public/vintage1.jpg')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '100vh',
    
  };

  return (
    <Box height='100vh' width='100vw' style={homepageStyle2} >
      <AppBar position="static" color='string'>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
            PostMe
          </Typography>
          <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
             <Button color="inherit"><strong>Explore</strong></Button>
           </Link>
           <Link to="/createpost" style={{ textDecoration: 'none', color: 'black' }}>
             <Button color="inherit"><strong>Create Post</strong></Button>
           </Link>
        </Toolbar>
      </AppBar>

      <Box margin='90px' height='50vh' border='solid' borderRadius={5} sx={{ padding: 2 , boxShadow: '0px 10px 20px rgba(0,0,0,0.4)'}}
      style={homepageStyle}
      >
        <Typography variant="h4" gutterBottom>
          Create a New Post
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Post Title"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Post Content"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Image URL (Optional)"
            fullWidth
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          {/* Tag Selection */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Tag</InputLabel>
            <Select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              label="Tag"
              required
            >
              <MenuItem value="">None</MenuItem>
              {tags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            type="submit"
            color="primary"
            fullWidth
            disabled={loading}
            component={StyledButton}
            endIcon={<SendIcon />}
          >
            {loading ? "Creating..." : "Send Post"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

CreatePost.propTypes = {
  onPostCreated: PropTypes.func.isRequired, // Ensure onPostCreated is a required function
};

export default CreatePost;
