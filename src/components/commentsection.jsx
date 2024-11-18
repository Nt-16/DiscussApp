
import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import supabase from "/supabase.js"; // Your Supabase client
import PropTypes from 'prop-types'

const CommentSection = ({ postId }) => {
  const [comment, setComment] = useState(""); // State for storing comment input
  const [comments, setComments] = useState([]); // State to store existing comments
  const [loading, setLoading] = useState(false);

  // Fetch existing comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, content, created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error.message);
      } else {
        setComments(data);
      }
    };

    fetchComments();
  }, [postId]);

  // Handle submitting a new comment
  const handleCommentSubmit = async () => {
    if (comment.trim() === "") return; // Don't submit empty comments

    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .insert([{ post_id: postId, content: comment }]);

    if (error) {
      console.error("Error submitting comment:", error.message);
    } else {
      setComments((prevComments) => [...prevComments, data[0]]); // Update UI with new comment
      setComment(""); // Clear the input
    }
    setLoading(false);
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h6">Comments</Typography>

      {comments.map((comment) => (
        <Box key={comment.id} sx={{ marginBottom: 2 }}>
          <Typography variant="body1">{comment.content}</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(comment.created_at).toLocaleString()}
          </Typography>
        </Box>
      ))}

      {/* Comment input field */}
      <TextField
        label="Add a comment"
        variant="outlined"
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCommentSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </Box>
  );
};

CommentSection.propTypes = {
    postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };

export default CommentSection;
