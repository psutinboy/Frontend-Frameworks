import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import styles from "./App.module.css";
import Notification from "./Notification";
import TaskItem from "./task-item";
import UserManager from "./UserManager";

export const TaskContext = createContext();

// Context allows us to share global state across components.

export const ThemeContext = createContext();

function App() {
  const [currentView, setCurrentView] = useState("tasks"); // "tasks" or "users"
  const [taskList, setTaskList] = useState([]);
  const [taskInput, setTaskInput] = useState({
    title: "",
    priority: "Medium",
    dueDate: "",
  });
  const [notification, setNotification] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Wrap the app in ThemeContext.Provider to share theme globally.

  const [theme, setTheme] = useState("light");

  const user = "Jackson";

  // Load saved tasks when the component mounts.
  useEffect(() => {
    getTaskList();
  }, []);

  // Updates localStorage every time taskList changes.

  const getTaskList = () => {
    axios
      .get("http://localhost:3000/tasks")
      .then((response) => {
        setTaskList(response.data);
      })
      .catch((error) => console.error(error));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskInput({
      ...taskInput,
      [name]: value,
    });

    console.log(taskInput);
  };

  // Dynamically updates the task input state based on form changes.

  // Add a new task to the task list

  // Function to add a new task when the button is clicked.
  const addTask = () => {
    // Validate form
    const errors = {};
    if (!taskInput.title.trim()) {
      errors.title = true;
    }
    if (!taskInput.dueDate) {
      errors.dueDate = true;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setNotification({
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    setFormErrors({});

    axios
      .post("http://localhost:3000/tasks", taskInput)
      .then((response) => {
        setTaskList([...taskList, response.data]);
        setTaskInput({ title: "", priority: "Medium", dueDate: "" });
        setNotification({
          message: `Task "${response.data.title}" created successfully!`,
          type: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setNotification({
          message: "Error creating task. Please try again.",
          type: "error",
        });
      });
  };

  // Adds a new task with title, priority, and due date.​

  // Add two functions to sort tasks by priority and due date.

  const sortTasksByPriority = () => {
    axios
      .get("http://localhost:3000/tasks/SortBy/Priority")
      .then((response) => setTaskList(response.data))
      .catch((error) => console.error(error));
  };

  const sortTasksByDueDate = () => {
    axios
      .get("http://localhost:3000/tasks/SortBy/DueDate")
      .then((response) => setTaskList(response.data))
      .catch((error) => console.error(error));
  };

  // sortTasksByPriority: Sorts by high, medium, and low.​

  // sortTasksByDueDate: Sorts tasks by the due date.

  // Mark task as completed
  const completeTask = (index) => {
    const updatedTasks = taskList.map((task, i) =>
      i === index ? { ...task, completed: true } : task
    );
    setTaskList(updatedTasks);
  };

  const deleteTask = (id) => {
    const taskToDelete = taskList.find((task) => task._id === id);
    axios
      .delete(`http://localhost:3000/tasks/${id}`)
      .then((response) => {
        console.log(response.data);
        getTaskList();
        setNotification({
          message: `Task "${taskToDelete?.title || ""}" deleted successfully!`,
          type: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setNotification({
          message: "Error deleting task. Please try again.",
          type: "error",
        });
      });
  };

  const updateTask = (id, updatedData) => {
    axios
      .put(`http://localhost:3000/tasks/${id}`, updatedData)
      .then((response) => {
        console.log("Task updated:", response.data);
        getTaskList();
        setNotification({
          message: `Task "${response.data.title}" updated successfully!`,
          type: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setNotification({
          message: "Error updating task. Please try again.",
          type: "error",
        });
      });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <TaskContext.Provider value={user}>
        <div
          className={`${styles.App} ${
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
          {/* Navigation Header */}
          <div className={styles.header}>
            <h1>Management System</h1>
            <div className={styles.navigation}>
              <button
                onClick={() => setCurrentView("tasks")}
                className={currentView === "tasks" ? styles.activeNav : ""}
              >
                Tasks
              </button>
              <button
                onClick={() => setCurrentView("users")}
                className={currentView === "users" ? styles.activeNav : ""}
              >
                Users
              </button>
            </div>
            {/* Theme selector */}
            <select
              onChange={(e) => setTheme(e.target.value)}
              value={theme}
              className={styles.themeSelector}
            >
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
            </select>
          </div>

          {currentView === "tasks" ? (
            <>
              <h2>Task Manager</h2>
              {/* Add sorting buttons in the App component. */}
              <div className={styles.sortingButtons}>
                <button onClick={sortTasksByPriority}>Sort by Priority</button>
                <button onClick={sortTasksByDueDate}>Sort by Due Date</button>
              </div>

              <hr></hr>

              {/* Task Addition Form */}
              <div className={styles.taskForm}>
                <input
                  type="text"
                  name="title"
                  placeholder="Task Title *"
                  value={taskInput.title}
                  onChange={handleInputChange}
                  className={formErrors.title ? styles.inputError : ""}
                />
                <select
                  name="priority"
                  value={taskInput.priority}
                  onChange={handleInputChange}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <input
                  type="date"
                  name="dueDate"
                  value={taskInput.dueDate}
                  onChange={handleInputChange}
                  className={formErrors.dueDate ? styles.inputError : ""}
                />
                <button onClick={addTask}>Add Task</button>
              </div>

              {/* Task List Display */}
              <div className={styles.taskList}>
                {taskList.map((task, index) => (
                  <TaskItem
                    key={index}
                    task={task}
                    index={index}
                    completeTask={completeTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                ))}
              </div>
            </>
          ) : (
            <UserManager />
          )}
        </div>
      </TaskContext.Provider>
    </ThemeContext.Provider>
  );
  // Value passed: theme and setTheme.
}

export default App;
