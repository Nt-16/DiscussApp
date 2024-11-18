import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import supabase from "/supabase.js"; // Import Supabase client

const EditPost = () => {
    
  const { postId } = useParams(); // Get the postId from the URL
  const navigate = useNavigate();

  // States for managing post data in the form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [selectedTag, setSelectedTag] = useState(""); // The tag that is selected or changed
  const [tags, setTags] = useState([]); // Tags available for selection
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tags from your database (replace with your actual tags fetch)
    const fetchTags = async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("name"); // Example query for tags

      if (error) {
        console.error("Error fetching tags:", error.message);
      } else {
        setTags(data.map((tag) => tag.name)); // Set available tags
      }
    };

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single(); // Fetch the post by ID

      if (error) {
        console.error("Error fetching post:", error.message);
        setLoading(false); // Stop loading if there’s an error
      } else {
        // Populate states with fetched post data
        setTitle(data.title);
        setContent(data.content);
        setImageURL(data.image_url);
        setSelectedTag(data.tags || ""); // Set selected tag to current post's tag
        setLoading(false); // Stop loading when data is loaded
      }
    };

    fetchTags();
    fetchPost();
  }, [postId]); // Refetch when postId changes

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("posts")
      .update({
        title,
        content,
        tags: selectedTag,
        image_url: imageURL,
      })
      .eq("id", postId);

    if (error) {
      console.error("Error updating post:", error.message);
    } else {
      // After updating, navigate back to homepage or show a success message
      navigate("/");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  

  return (
    <Box height="100vh" width="100vw">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Discussion Forum
          </Typography>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <Button color="inherit">Explore</Button>
          </Link>
          <Link to="/createpost" style={{ textDecoration: "none", color: "white" }}>
            <Button color="inherit">Create Post</Button>
          </Link>
        </Toolbar>
      </AppBar>

      <Box margin="50px" border="solid" borderRadius={5} sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Edit Post
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
                {tags.map((tag, index) => (
                    <MenuItem key={index} value={tag}>
                        {tags}
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
            endIcon={<SendIcon />}
          >
            {loading ? "Updating..." : "Update Post"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default EditPost;
