import React from "react";
import { Link } from "react-router-dom";

const CommentsList = () => {
  // Mock comments data - replace with actual data from props or API
  const comments = [
    { id: 1, user: "Alice", text: "Great article!", blogId: 1 },
    { id: 2, user: "Bob", text: "Very helpful, thanks!", blogId: 1 },
    {
      id: 3,
      user: "Charlie",
      text: "Looking forward to more content!",
      blogId: 2,
    },
  ];

  return (
    <div className="comments-list-container">
      <h3>All Comments</h3>
      {comments.length === 0 ? (
        <p>No comments available.</p>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <p>
                <strong>{comment.user}:</strong> {comment.text}
              </p>
              <small>Blog ID: {comment.blogId}</small>
              <Link
                to={`/comments/detail/${comment.id}`}
                className="view-comment-link"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsList;
