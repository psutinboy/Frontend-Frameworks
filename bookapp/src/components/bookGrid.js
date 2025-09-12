import React, { useState } from "react";
import "../styles.css";
import BookCard from "./BookCard";

export default function BookGrid({ books, readingList, toggleReadingList }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("All Genres");
  const [rating, setRating] = useState("All Ratings");
  const [author, setAuthor] = useState("All Authors");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
  };

  // Get unique genres from books
  const getUniqueGenres = () => {
    const genres = books.map((book) => book.genre);
    return [...new Set(genres)].sort();
  };

  // Get unique authors from books
  const getUniqueAuthors = () => {
    const authors = books.map((book) => book.author);
    return [...new Set(authors)].sort();
  };

  const matchesGenre = (book, genre) => {
    return (
      genre === "All Genres" || book.genre.toLowerCase() === genre.toLowerCase()
    );
  };

  const matchesSearchTerm = (book, searchTerm) => {
    return (
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const matchesRating = (book, rating) => {
    switch (rating) {
      case "All Ratings":
        return true;
      case "Excellent":
        return book.rating >= 8.5;
      case "Very Good":
        return book.rating >= 8.0 && book.rating < 8.5;
      case "Good":
        return book.rating >= 7.0 && book.rating < 8.0;
      case "Average":
        return book.rating >= 6.0 && book.rating < 7.0;
      case "Below Average":
        return book.rating < 6.0;
      default:
        return true;
    }
  };

  const matchesAuthor = (book, author) => {
    return (
      author === "All Authors" ||
      book.author.toLowerCase() === author.toLowerCase()
    );
  };

  const filteredBooks = books.filter(
    (book) =>
      matchesSearchTerm(book, searchTerm) &&
      matchesGenre(book, genre) &&
      matchesRating(book, rating) &&
      matchesAuthor(book, author)
  );

  const clearFilters = () => {
    setSearchTerm("");
    setGenre("All Genres");
    setRating("All Ratings");
    setAuthor("All Authors");
  };

  return (
    <div className="books-container">
      <div className="search-and-filter-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search books by title, author, or description..."
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <div className="filter-bar">
          <div className="filter-slot">
            <label>Genre:</label>
            <select
              className="filter-dropdown"
              value={genre}
              onChange={handleGenreChange}
            >
              <option value="All Genres">All Genres</option>
              {getUniqueGenres().map((genreOption) => (
                <option key={genreOption} value={genreOption}>
                  {genreOption}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-slot">
            <label>Author:</label>
            <select
              className="filter-dropdown"
              value={author}
              onChange={handleAuthorChange}
            >
              <option value="All Authors">All Authors</option>
              {getUniqueAuthors().map((authorOption) => (
                <option key={authorOption} value={authorOption}>
                  {authorOption}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-slot">
            <label>Rating:</label>
            <select
              className="filter-dropdown"
              value={rating}
              onChange={handleRatingChange}
            >
              <option value="All Ratings">All Ratings</option>
              <option value="Excellent">Excellent (8.5+)</option>
              <option value="Very Good">Very Good (8.0-8.4)</option>
              <option value="Good">Good (7.0-7.9)</option>
              <option value="Average">Average (6.0-6.9)</option>
              <option value="Below Average">Below Average (&lt;6.0)</option>
            </select>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="results-info">
        <p>
          Showing {filteredBooks.length} of {books.length} books
        </p>
      </div>

      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard
              book={book}
              key={book.id}
              isInReadingList={readingList.includes(book.id)}
              toggleReadingList={toggleReadingList}
            />
          ))
        ) : (
          <div className="no-results">
            <h3>No books found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
