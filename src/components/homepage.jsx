import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  CardMedia,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField, // Import TextField for the search bar
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import supabase from "/supabase.js"; // Import your existing Supabase client
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import DeleteIcon from "@mui/icons-material/Delete";

const Homepage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(""); // State for selected filter
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Example tags (you can adjust this based on your posts data)
  const tags = ["food", "sport", "music", "tech"];

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, content, image_url, upvotes, created_at, tags")
        .order("created_at", { ascending: false }); // Default to latest

      if (error) {
        console.error("Error fetching posts:", error.message);
      } else {
        const postsWithComments = await Promise.all(
          data.map(async (post) => {
            const { data: comments, error: commentError } = await supabase
              .from("comments")
              .select("id, content, post_id")
              .eq("post_id", post.id)
              .limit(1); // Fetch only one comment for the homepage

            if (commentError) {
              console.error("Error fetching comments:", commentError.message);
            }

            return {
              ...post,
              comments: comments || [], // Add the comments to the post
            };
          })
        );

        setPosts(postsWithComments);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handleUpvote = async (postId, currentUpvotes) => {
    const { error } = await supabase
      .from("posts")
      .update({ upvotes: currentUpvotes + 1 })
      .eq("id", postId);

    if (error) {
      console.error("Error upvoting post:", error.message);
    } else {
      // Update the local state to reflect the new upvote count
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, upvotes: currentUpvotes + 1 } : post
        )
      );
    }
  };

  const navigate = useNavigate();

  // Filter posts based on the selected tag and search query
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter) {
      if (tags.includes(selectedFilter)) {
        return post.tags && post.tags.includes(selectedFilter) && matchesSearch; // Filter by tag and search query
      } else if (selectedFilter === "latest") {
        return matchesSearch; // Only filter by search query
      } else if (selectedFilter === "oldest") {
        return matchesSearch; // Only filter by search query
      }
    }
    return matchesSearch; // If no filter is applied, only search by title
  });

  // Sort posts based on the selected filter ("latest" or "oldest")
  const sortedPosts = filteredPosts.sort((a, b) => {
    if (selectedFilter === "oldest") {
      return new Date(a.created_at) - new Date(b.created_at); // Sort by oldest
    } else {
      return new Date(b.created_at) - new Date(a.created_at); // Sort by latest
    }
  });

  const handleDelete = async (postId) => {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Error deleting post:", error.message);
    } else {
      // Remove the deleted post from the state to update the UI
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    }
  };

  return (
    <Box height="100vh" width="100vw">
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Discussion Forum
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            
          />
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <Button color="inherit">Explore</Button>
          </Link>
          <Link to="/createpost" style={{ textDecoration: "none", color: "white" }}>
            <Button color="inherit">Create Post</Button>
          </Link>
          {/* Search Bar */}
          
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Container sx={{ marginTop: 4 }}>
        {/* Filter Dropdown */}
        <FormControl fullWidth>
          <InputLabel>Filter by Tag or Sort</InputLabel>
          <Select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            label="Filter by Tag or Sort"
          >
            <MenuItem value="">All</MenuItem>
            {tags.map((tag) => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FormControl>

        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={4} marginTop={3}>
            {sortedPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card>
                  {/* Post Image */}
                  {post.image_url && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={post.image_url}
                      alt={post.title}
                    />
                  )}
                  {/* Post Content */}
                  <CardContent>
                    <Typography variant="h6">{post.title}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {post.content}
                    </Typography>
                  </CardContent>
                  {/* Actions */}
                  <CardActions>
                    <IconButton
                      aria-label="upvote"
                      onClick={() => handleUpvote(post.id, post.upvotes)}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                    <Typography>{post.upvotes} Upvotes</Typography>
                    <Button size="small" color="primary" onClick={() => navigate(`/post/${post.id}`)}>
                      Read More
                    </Button>
                    <Button size="small" color="secondary" onClick={() => navigate(`/editpost/${post.id}`)}>
                      Edit
                    </Button>

                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(post.id)} // Delete the post
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>

                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Comments:</strong>
                    </Typography>
                    <List>
                      {post.comments.map((comment) => (
                        <ListItem key={comment.id}>
                          <ListItemText primary={comment.content} secondary={`Posted on: ${comment.created_at}`} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Homepage;
