import React, { useContext, useState } from "react";
import { TaskContext, ThemeContext } from "./App";
import styles from "./TaskItem.module.css";

const TaskItem = ({ task, index, completeTask, deleteTask, updateTask }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    priority: task.priority,
    dueDate: task.dueDate.split("T")[0], // Format date for input
  });
  const createdBy = useContext(TaskContext);
  const { theme } = useContext(ThemeContext);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({
      ...editedTask,
      [name]: value,
    });
  };

  const handleSaveEdit = () => {
    updateTask(task._id, editedTask);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTask({
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate.split("T")[0],
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        className={`${styles.taskItem} ${
          theme === "dark" ? styles.darkItem : styles.lightItem
        }`}
      >
        <input
          type="text"
          name="title"
          value={editedTask.title}
          onChange={handleEditChange}
          className={styles.editInput}
        />
        <select
          name="priority"
          value={editedTask.priority}
          onChange={handleEditChange}
          className={styles.editSelect}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={editedTask.dueDate}
          onChange={handleEditChange}
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
      className={`${styles.taskItem} ${
        task.completed ? styles.completed : ""
      } ${theme === "dark" ? styles.darkItem : styles.lightItem}`}
      onMouseOver={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <h2>{task.title}</h2>
      <p>Priority: {task.priority}</p>
      <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
      <p>Created by {createdBy}</p>
      {showDelete && (
        <button
          onClick={() => deleteTask(task._id)}
          className={styles.deleteBtn}
        >
          X
        </button>
      )}
      {!task.completed && (
        <>
          <button onClick={() => completeTask(index)}>Mark as Completed</button>
          <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default TaskItem;
