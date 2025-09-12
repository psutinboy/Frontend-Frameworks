import { useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BookGrid from "./components/bookGrid";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ReadingList from "./components/ReadingList";
import "./styles.css";

function App() {
  const [books, setBooks] = useState([]);
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("books.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        return response.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Load reading list from localStorage on component mount
  useEffect(() => {
    const savedReadingList = localStorage.getItem("bookReadingList");
    if (savedReadingList) {
      try {
        setReadingList(JSON.parse(savedReadingList));
      } catch (err) {
        console.error("Error loading reading list from localStorage:", err);
      }
    }
  }, []);

  // Save reading list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bookReadingList", JSON.stringify(readingList));
  }, [readingList]);

  const toggleReadingList = (bookId) => {
    setReadingList((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">
          <h2>📚 Loading books...</h2>
          <p>Please wait while we fetch your book collection.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="error">
          <h2>❌ Error loading books</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />

      <Router>
        <nav className="main-navigation">
          <div className="nav-container">
            <ul className="nav-links">
              <li>
                <Link to="/" className="nav-link">
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link to="/reading-list" className="nav-link">
                  📖 Reading List
                  {readingList.length > 0 && (
                    <span className="nav-badge">{readingList.length}</span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <BookGrid
                  books={books}
                  readingList={readingList}
                  toggleReadingList={toggleReadingList}
                />
              }
            />
            <Route
              path="/reading-list"
              element={
                <ReadingList
                  books={books}
                  readingList={readingList}
                  toggleReadingList={toggleReadingList}
                />
              }
            />
          </Routes>
        </main>
      </Router>

      <Footer />
    </div>
  );
}

export default App;
