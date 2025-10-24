import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./App.css";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AddBlog from "./components/Blog/AddBlog";
import BlogDetail from "./components/Blog/BlogDetail";
import BlogList from "./components/Blog/BlogList";
import Footer from "./components/Layout/Footer";
import Header from "./components/Layout/Header";
import About from "./pages/About";
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import Unauthorized from "./pages/Unauthorized";
import { hasRole } from "./utils/roleCheck";

function PrivateRoute({ element }) {
  const isAuthenticated = !!localStorage.getItem("user");
  return isAuthenticated ? element : <Navigate to="/login" />;
}

function RoleBasedRoute({ element, allowedRoles }) {
  const isAuthenticated = !!localStorage.getItem("user");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
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
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Private Routes - Accessible by all authenticated users */}
          <Route path="/" element={<PrivateRoute element={<Home />} />} />
          <Route path="/about" element={<PrivateRoute element={<About />} />} />
          <Route
            path="/profile"
            element={<PrivateRoute element={<Profile />} />}
          />
          <Route
            path="/blogs"
            element={<PrivateRoute element={<BlogList />} />}
          />
          <Route
            path="/blogs/:id"
            element={<PrivateRoute element={<BlogDetail />} />}
          />
          <Route
            path="/add-blog"
            element={<PrivateRoute element={<AddBlog />} />}
          />

          {/* Role-Based Routes - Admin only (role 1) */}
          <Route
            path="/admin"
            element={
              <RoleBasedRoute element={<AdminPanel />} allowedRoles={[1]} />
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};
export default App;
