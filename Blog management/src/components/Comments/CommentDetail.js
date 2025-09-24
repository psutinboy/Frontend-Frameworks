import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const CommentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock comment data - replace with actual data from props or API
  const comments = [
    {
      id: 1,
      user: "Alice",
      text: "Great article!",
      blogId: 1,
      createdAt: "2023-09-28T10:00:00Z",
    },
    {
      id: 2,
      user: "Bob",
      text: "Very helpful, thanks!",
      blogId: 1,
      createdAt: "2023-09-28T11:00:00Z",
    },
    {
      id: 3,
      user: "Charlie",
      text: "Looking forward to more content!",
      blogId: 2,
      createdAt: "2023-09-29T09:00:00Z",
    },
  ];

  const comment = comments.find((comment) => comment.id === parseInt(id));

  if (!comment) {
    return (
      <div className="comment-detail-container">
        <h3>Comment Not Found</h3>
        <p>
          The comment you are looking for does not exist or has been removed.
        </p>
        <button onClick={() => navigate("/comments/list")} className="btn-back">
          Back to Comments
        </button>
      </div>
    );
  }

  return (
    <div className="comment-detail-container">
      <h3>Comment Details</h3>
      <div className="comment-detail">
        <p>
          <strong>User:</strong> {comment.user}
        </p>
        <p>
          <strong>Comment:</strong> {comment.text}
        </p>
        <p>
          <strong>Blog ID:</strong> {comment.blogId}
        </p>
        <p>
          <strong>Posted on:</strong>{" "}
          {new Date(comment.createdAt).toLocaleDateString()}
        </p>
      </div>

      <button onClick={() => navigate("/comments/list")} className="btn-back">
        Back to Comments
      </button>
    </div>
  );
};

export default CommentDetail;
