import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./App.css";
import Login from "./components/Auth/Login";
import {
  AdminRoute,
  PrivateRoute,
  PublicRoute,
} from "./components/Auth/RouteGuards";
import AddBlog from "./components/Blog/AddBlog";
import BlogDetail from "./components/Blog/BlogDetail";
import BlogList from "./components/Blog/BlogList";
import AddComment from "./components/Comments/AddComment";
import CommentDetail from "./components/Comments/CommentDetail";
import Comments from "./components/Comments/Comments";
import CommentsList from "./components/Comments/CommentsList";
import Footer from "./components/Layout/Footer";
import Header from "./components/Layout/Header";
import { AuthProvider } from "./contexts/AuthContext";
import About from "./pages/About";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Unauthorized from "./pages/Unauthorized";

const blogs = [
  {
    id: 1,
    title: "How to Learn React",
    content:
      "React is a powerful JavaScript library for building user interfaces...",
    createdAt: "2023-09-28T10:00:00Z",
    author: "John Doe",
    categories: ["JavaScript", "Frontend", "React"],
    comments: [
      { user: "Alice", text: "Great article!" },
      { user: "Bob", text: "Very helpful, thanks!" },
    ],
  },
  {
    id: 2,
    title: "Understanding CSS Flexbox",
    content:
      "Flexbox is a layout model that allows elements to align and distribute...",
    createdAt: "2023-10-01T12:30:00Z",
    author: "Jane Smith",
    categories: ["CSS", "Frontend"],
    comments: [],
  },
];

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <AnimatedRoutes />
        <Footer />
      </Router>
    </AuthProvider>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation(); // Capture current route location

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} timeout={3000} classNames="fade">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Private Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <PrivateRoute>
                <BlogList blogs={blogs} />
              </PrivateRoute>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <PrivateRoute>
                <BlogDetail blogs={blogs} />
              </PrivateRoute>
            }
          />

          {/* Admin Only Routes */}
          <Route
            path="/add-blog"
            element={
              <AdminRoute>
                <AddBlog />
              </AdminRoute>
            }
          />

          {/* Comments Routes - Protected */}
          <Route
            path="/comments"
            element={
              <PrivateRoute>
                <Comments />
              </PrivateRoute>
            }
          >
            <Route path="list" element={<CommentsList />} />
            <Route
              path="add"
              element={
                <AdminRoute>
                  <AddComment />
                </AdminRoute>
              }
            />
            <Route path="detail/:id" element={<CommentDetail />} />
          </Route>

          {/* Error Pages */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};
export default App;
