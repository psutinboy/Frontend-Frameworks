import React from "react";
import "../styles.css";

export default function BookCard({ book, isInReadingList, toggleReadingList }) {
  const getRatingClass = (rating) => {
    if (rating >= 8) return "rating-good";
    if (rating >= 6 && rating < 8) return "rating-ok";
    return "rating-bad";
  };

  const handleError = (e) => {
    if (e.target.src.includes("default.jpg")) {
      return;
    }
    e.target.src = "images/default.jpg";
  };

  return (
    <div className="book-card" key={book.id}>
      <div className="book-image-container">
        <img
          src={`images/${book.image}`}
          alt={book.title}
          onError={handleError}
          className="book-image"
        />
      </div>
      <div className="book-card-info">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">by {book.author}</p>
        <div className="book-card-details">
          <span className="book-card-genre">{book.genre}</span>
          <span className={`book-card-rating ${getRatingClass(book.rating)}`}>
            ★ {book.rating}
          </span>
        </div>
        <p className="book-card-description">{book.description}</p>
        <div className="bookmark-container">
          <button
            className={`bookmark-btn ${isInReadingList ? "bookmarked" : ""}`}
            onClick={() => toggleReadingList(book.id)}
            title={
              isInReadingList
                ? "Remove from Reading List"
                : "Add to Reading List"
            }
          >
            <span className="bookmark-icon">
              {isInReadingList ? "🔖" : "🏷️"}
            </span>
            <span className="bookmark-text">
              {isInReadingList ? "In Reading List" : "Add to Reading List"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
