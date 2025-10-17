import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./App";
import Notification from "./Notification";
import UserItem from "./UserItem";
import styles from "./UserManager.module.css";

function UserManager() {
  const [userList, setUserList] = useState([]);
  const [userInput, setUserInput] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    age: "",
    city: "",
    address: "",
    mobile: "",
  });
  const [notification, setNotification] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const { theme } = useContext(ThemeContext);

  // Load users when component mounts
  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = () => {
    axios
      .get("http://localhost:3000/user")
      .then((response) => {
        setUserList(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  // Email validation helper
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Add a new user
  const addUser = () => {
    // Validate form
    const errors = {};
    if (!userInput.firstname.trim()) {
      errors.firstname = true;
    }
    if (!userInput.email.trim()) {
      errors.email = true;
    } else if (!validateEmail(userInput.email)) {
      errors.email = true;
      setNotification({
        message: "Please enter a valid email address",
        type: "error",
      });
      setFormErrors(errors);
      return;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setNotification({
        message: "Please fill in all required fields correctly",
        type: "error",
      });
      return;
    }

    setFormErrors({});

    axios
      .post("http://localhost:3000/user", userInput)
      .then((response) => {
        setUserList([...userList, response.data]);
        setUserInput({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          age: "",
          city: "",
          address: "",
          mobile: "",
        });
        setNotification({
          message: `User ${response.data.firstname} ${
            response.data.lastname || ""
          } created successfully!`,
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        setNotification({
          message: "Error creating user. Please try again.",
          type: "error",
        });
      });
  };

  const deleteUser = (id) => {
    const userToDelete = userList.find((user) => user._id === id);
    axios
      .delete(`http://localhost:3000/user/${id}`)
      .then((response) => {
        console.log(response.data);
        getUserList();
        setNotification({
          message: `User ${userToDelete?.firstname || ""} ${
            userToDelete?.lastname || ""
          } deleted successfully!`,
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        setNotification({
          message: "Error deleting user. Please try again.",
          type: "error",
        });
      });
  };

  const updateUser = (id, updatedData) => {
    axios
      .put(`http://localhost:3000/user/${id}`, updatedData)
      .then((response) => {
        console.log("User updated:", response.data);
        getUserList();
        setNotification({
          message: `User ${response.data.firstname} ${
            response.data.lastname || ""
          } updated successfully!`,
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        setNotification({
          message: "Error updating user. Please try again.",
          type: "error",
        });
      });
  };

  return (
    <div
      className={`${styles.userManager} ${
        theme === "light" ? styles.lightTheme : styles.darkTheme
      }`}
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <h1>User Management</h1>

      {/* User Addition Form */}
      <div className={styles.userForm}>
        <input
          type="text"
          name="firstname"
          placeholder="First Name *"
          value={userInput.firstname}
          onChange={handleInputChange}
          className={formErrors.firstname ? styles.inputError : ""}
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={userInput.lastname}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={userInput.email}
          onChange={handleInputChange}
          className={formErrors.email ? styles.inputError : ""}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userInput.password}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={userInput.age}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={userInput.city}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={userInput.address}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="mobile"
          placeholder="Mobile"
          value={userInput.mobile}
          onChange={handleInputChange}
        />
        <button onClick={addUser}>Add User</button>
      </div>

      {/* User List Display */}
      <div className={styles.userList}>
        {userList.length === 0 ? (
          <p className={styles.noUsers}>No users found. Add your first user!</p>
        ) : (
          userList.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              deleteUser={deleteUser}
              updateUser={updateUser}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default UserManager;
