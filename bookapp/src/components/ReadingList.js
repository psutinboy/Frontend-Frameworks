import React from "react";
import "../styles.css";
import BookCard from "./BookCard";

export default function ReadingList({ books, readingList, toggleReadingList }) {
  const readingListBooks = books.filter((book) =>
    readingList.includes(book.id)
  );

  return (
    <div className="reading-list-container">
      <div className="reading-list-header">
        <h2>📖 My Reading List</h2>
        <p className="reading-list-subtitle">
          {readingListBooks.length === 0
            ? "Your reading list is empty. Start adding some books!"
            : `${readingListBooks.length} book${
                readingListBooks.length === 1 ? "" : "s"
              } in your reading list`}
        </p>
      </div>

      {readingListBooks.length === 0 ? (
        <div className="empty-reading-list">
          <div className="empty-state">
            <h3>📚 No books in your reading list yet</h3>
            <p>Browse our collection and add books you want to read!</p>
            <div className="empty-state-icon">📖</div>
          </div>
        </div>
      ) : (
        <div className="reading-list-grid">
          {readingListBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isInReadingList={true}
              toggleReadingList={toggleReadingList}
            />
          ))}
        </div>
      )}
    </div>
  );
}
