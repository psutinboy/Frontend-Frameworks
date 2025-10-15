import React, { useState, useContext } from 'react';
import styles from './TaskItem.module.css';
import { TaskContext,ThemeContext } from './App';

const TaskItem = ({ task, index, completeTask, deleteTask }) => {
  const [showDelete, setShowDelete] = useState(false);
  const createdBy = useContext(TaskContext);
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${styles.taskItem} ${task.completed ? styles.completed : ''} ${theme === 'dark' ? styles.darkItem : styles.lightItem}`}
      onMouseOver={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <h2>{task.title}</h2>
      <p>Priority: {task.priority}</p>
      <p>Due Date: {task.dueDate}</p>
      <p>Created by {createdBy}</p>
      {showDelete && <button onClick={() => deleteTask(task._id)} className={styles.deleteBtn}>X</button>}
      {!task.completed && (
        <button onClick={() => completeTask(index)}>Mark as Completed</button>
      )}
    </div>
  );
};

export default TaskItem;
