import React, { useState } from "react";
import styles from "./UserItem.module.css";

const UserItem = ({ user, deleteUser, updateUser }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    email: user.email || "",
    age: user.age || "",
    city: user.city || "",
    address: user.address || "",
    mobile: user.mobile || "",
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleSaveEdit = () => {
    updateUser(user._id, editedUser);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedUser({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      age: user.age || "",
      city: user.city || "",
      address: user.address || "",
      mobile: user.mobile || "",
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={styles.userItem}>
        <input
          type="text"
          name="firstname"
          value={editedUser.firstname}
          onChange={handleEditChange}
          placeholder="First Name"
          className={styles.editInput}
        />
        <input
          type="text"
          name="lastname"
          value={editedUser.lastname}
          onChange={handleEditChange}
          placeholder="Last Name"
          className={styles.editInput}
        />
        <input
          type="email"
          name="email"
          value={editedUser.email}
          onChange={handleEditChange}
          placeholder="Email"
          className={styles.editInput}
        />
        <input
          type="number"
          name="age"
          value={editedUser.age}
          onChange={handleEditChange}
          placeholder="Age"
          className={styles.editInput}
        />
        <input
          type="text"
          name="city"
          value={editedUser.city}
          onChange={handleEditChange}
          placeholder="City"
          className={styles.editInput}
        />
        <input
          type="text"
          name="address"
          value={editedUser.address}
          onChange={handleEditChange}
          placeholder="Address"
          className={styles.editInput}
        />
        <input
          type="number"
          name="mobile"
          value={editedUser.mobile}
          onChange={handleEditChange}
          placeholder="Mobile"
          className={styles.editInput}
        />
        <div className={styles.editButtons}>
          <button onClick={handleSaveEdit} className={styles.saveBtn}>
            Save
          </button>
          <button onClick={handleCancelEdit} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.userItem}
      onMouseOver={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <h2>
        {user.firstname || "N/A"} {user.lastname || ""}
      </h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      {user.age && (
        <p>
          <strong>Age:</strong> {user.age}
        </p>
      )}
      {user.city && (
        <p>
          <strong>City:</strong> {user.city}
        </p>
      )}
      {user.address && (
        <p>
          <strong>Address:</strong> {user.address}
        </p>
      )}
      {user.mobile && (
        <p>
          <strong>Mobile:</strong> {user.mobile}
        </p>
      )}
      {showDelete && (
        <button
          onClick={() => deleteUser(user._id)}
          className={styles.deleteBtn}
        >
          X
        </button>
      )}
      <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
        Edit
      </button>
    </div>
  );
};

export default UserItem;
