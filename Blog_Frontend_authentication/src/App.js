import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Home from "./pages/Home";
import About from "./pages/About";
import BlogList from "./components/Blog/BlogList";
import BlogDetail from "./components/Blog/BlogDetail";
import AddBlog from "./components/Blog/AddBlog";
import Login from "./components/Auth/Login";
import PageNotFound from "./pages/PageNotFound";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import "./App.css";

function PrivateRoute({ element }) {
  const isAuthenticated = !!localStorage.getItem('user');
  return isAuthenticated ? element : <Navigate to="/login" />;
}

const App = () => {
  return (
    <>

      <Router>
        <Header></Header>
        <AnimatedRoutes />
        <Footer></Footer>
      </Router>

    </>
  );
};

const AnimatedRoutes = () => {

  const location = useLocation(); // Capture current route location

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} timeout={3000} classNames="fade">
        <Routes>
          <Route path="/" element={<PrivateRoute element={<Home />} />} />
          <Route path="/about" element={<PrivateRoute element={<About />} />} />
          <Route path="/blogs" element={<PrivateRoute element={<BlogList />} />} />
          <Route path="/blogs/:id" element={<PrivateRoute element={<BlogDetail />} />} />
          <Route path="/add-blog" element={<PrivateRoute element={<AddBlog />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}
export default App;