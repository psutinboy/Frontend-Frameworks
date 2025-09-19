import React, { createContext, useEffect, useState } from "react";
import styles from "./App.module.css";
import TaskItem from "./task-item";

export const TaskContext = createContext();

// Context allows us to share global state across components.

export const ThemeContext = createContext();

function App() {
  const [taskList, setTaskList] = useState([]);
  const [taskInput, setTaskInput] = useState({
    title: "",
    priority: "Medium",
    dueDate: "",
    category: "Select Category",
  });

  // Wrap the app in ThemeContext.Provider to share theme globally.

  const [theme, setTheme] = useState("light");

  const [user, setUser] = useState("DJS");

  const [categoryError, setCategoryError] = useState(false);

  // Load saved tasks when the component mounts.
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTaskList(savedTasks);
    }
  }, []);

  // Use useEffect to sync tasks with localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  // Updates localStorage every time taskList changes.

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskInput({
      ...taskInput,
      [name]: value,
    });

    // Reset category error when user selects a valid category
    if (name === "category" && value !== "Select Category") {
      setCategoryError(false);
    }

    console.log(taskInput);
  };

  // Dynamically updates the task input state based on form changes.

  // Add a new task to the task list

  // Function to add a new task when the button is clicked.
  const addTask = () => {
    if (
      taskInput.title &&
      taskInput.dueDate &&
      taskInput.category !== "Select Category"
    ) {
      setTaskList([...taskList, { ...taskInput, completed: false }]);
      setTaskInput({
        title: "",
        priority: "Medium",
        dueDate: "",
        category: "Select Category",
      }); // Reset form
      setCategoryError(false); // Reset error state on successful add
    } else if (taskInput.category === "Select Category") {
      setCategoryError(true); // Show error if no category selected
    }
  };

  // Adds a new task with title, priority, and due date.​

  // Add two functions to sort tasks by priority and due date.

  const sortTasksByPriority = () => {
    const sortedTasks = [...taskList].sort((a, b) => {
      const priorities = { High: 3, Medium: 2, Low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });
    setTaskList(sortedTasks);
  };

  const sortTasksByDueDate = () => {
    const sortedTasks = [...taskList].sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      return dateA - dateB;
    });
    setTaskList(sortedTasks);
  };

  // sortTasksByCompletion: Sorts tasks by completion status.
  const sortTasksByCompletion = () => {
    const sortedTasks = [...taskList].sort((a, b) => {
      if (a.completed === b.completed) {
        return 0;
      }
      return a.completed ? 1 : -1;
    });
    setTaskList(sortedTasks);
  };

  // sortTasksByCategory: Sorts tasks alphabetically by category.
  const sortTasksByCategory = () => {
    const sortedTasks = [...taskList].sort((a, b) => {
      return a.category.localeCompare(b.category);
    });
    setTaskList(sortedTasks);
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

  const deleteTask = (index) => {
    const updatedTasks = taskList.filter((_, i) => i !== index);
    setTaskList(updatedTasks);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <TaskContext.Provider value={user}>
        <div
          className={`${styles.App} ${
            theme === "light" ? styles.lightTheme : styles.darkTheme
          }`}
        >
          <h1>Task Manager</h1>

          {/* Add a dropdown in App.js to select between light and dark themes. */}
          <select onChange={(e) => setTheme(e.target.value)} value={theme}>
            <option value="light">Light Theme</option>
            <option value="dark">Dark Theme</option>
          </select>

          {/* Add sorting buttons in the App component. */}

          <div className="sorting-buttons">
            <button onClick={sortTasksByPriority}>Sort by Priority</button>
            <button onClick={sortTasksByDueDate}>Sort by Due Date</button>
            <button onClick={sortTasksByCompletion}>Sort by Completion</button>
            <button onClick={sortTasksByCategory}>Sort by Category</button>
          </div>

          {/* These buttons will trigger the sorting functions. */}

          <hr></hr>

          {/* Task Addition Form */}
          <div className={styles.taskForm}>
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={taskInput.title}
              onChange={handleInputChange}
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
            <select
              name="category"
              value={taskInput.category}
              onChange={handleInputChange}
              style={{
                border: categoryError ? "2px solid red" : "",
                backgroundColor: categoryError ? "#ffebee" : "",
              }}
            >
              <option value="Select Category" disabled>
                Select Category
              </option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Home">Home</option>
              <option value="Health">Health</option>
              <option value="Finance">Finance</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={taskInput.dueDate}
              onChange={handleInputChange}
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
              />
            ))}
          </div>

          {/* Loops through taskList and renders each task using TaskItem component.​ */}
        </div>
      </TaskContext.Provider>
    </ThemeContext.Provider>
  );
  // Value passed: theme and setTheme.
}

export default App;
