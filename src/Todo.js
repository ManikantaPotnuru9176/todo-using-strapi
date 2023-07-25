import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Todo.css";

const Todo = () => {
  // State to hold the list of todos
  const [todos, setTodos] = useState([]);
  // State to keep track of the todo being edited
  const [editTodoId, setEditTodoId] = useState(null);
  // State to store the value of the new todo input field
  const [newTodo, setNewTodo] = useState("");

  // Function to fetch todos from the server on component render
  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to fetch todos from the server
  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        "https://strapi-production-7efd.up.railway.app/api/todos"
      );
      const todosData = response.data.data;
      // Map the todos data to setTodos state
      setTodos(
        todosData.map(({ id, attributes }) => ({
          id,
          task: attributes.task,
          complete: attributes.complete,
        }))
      );
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Function to create a new todo
  const createTodo = async () => {
    const newTask = newTodo.trim();
    if (!newTask) return;

    try {
      // Send a POST request to the server to create a new todo
      const response = await axios.post(
        "https://strapi-production-7efd.up.railway.app/api/todos",
        {
          data: { task: newTask, complete: false },
        }
      );
      const data = response.data.data;
      // Update the todos state with the new todo
      setTodos((prevTodos) => [
        ...prevTodos,
        {
          id: data.id,
          task: data.attributes.task,
          complete: data.attributes.complete,
        },
      ]);
      // Clear the newTodo input field
      setNewTodo("");
    } catch (error) {
      console.log("Error creating todo:", error);
    }
  };

  // Function to delete a todo
  const deleteTodo = async (todoId) => {
    try {
      // Send a DELETE request to the server to delete the todo
      await axios.delete(
        `https://strapi-production-7efd.up.railway.app/api/todos/${todoId}`
      );
      // Update the todos state to remove the deleted todo
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  // Function to start editing a todo
  const startEditTodo = (todoId) => {
    // Set the todoId to indicate which todo is being edited
    setEditTodoId(todoId);
  };

  // Function to update a todo
  const updateTodo = async () => {
    const todoToUpdate = todos.find((todo) => todo.id === editTodoId);
    const updatedTask = todoToUpdate.task.trim();
    if (!updatedTask) return;

    try {
      // Send a PUT request to the server to update the todo
      await axios.put(
        `https://strapi-production-7efd.up.railway.app/api/todos/${editTodoId}`,
        {
          data: {
            task: updatedTask,
          },
        }
      );
      // Update the todos state to reflect the updated task
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editTodoId ? { ...todo, task: updatedTask } : todo
        )
      );
      // Reset the editTodoId to stop editing
      setEditTodoId(null);
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  // Function to toggle the completion status of a todo
  const toggleTodoComplete = async (todoId) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === todoId);
      const updatedCompleteStatus = !todoToUpdate.complete;
      // Send a PUT request to the server to update the completion status
      await axios.put(
        `https://strapi-production-7efd.up.railway.app/api/todos/${todoId}`,
        {
          data: {
            complete: updatedCompleteStatus,
          },
        }
      );
      // Update the todos state to reflect the updated completion status
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId
            ? { ...todo, complete: updatedCompleteStatus }
            : todo
        )
      );
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  // Function to handle changes in the input fields
  const handleInputChange = (event) => {
    if (editTodoId !== null) {
      // Update the task value in the todos state when editing a todo
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editTodoId ? { ...todo, task: event.target.value } : todo
        )
      );
    } else {
      // Update the newTodo input field value when adding a new todo
      setNewTodo(event.target.value);
    }
  };

  return (
    <div className="todo-container">
      {editTodoId !== null ? (
        // Show the edit form when editing a todo
        <div>
          <div className="edit-form">
            <input
              type="text"
              value={todos.find((todo) => editTodoId === todo.id).task}
              onChange={handleInputChange}
              className="edit-input"
            />
            <button onClick={updateTodo} className="update-button">
              Update
            </button>
          </div>
        </div>
      ) : (
        // Show the input form and todo list when not editing
        <div>
          <div className="add-form">
            <input
              type="text"
              value={newTodo}
              onChange={handleInputChange}
              className="todo-input"
            />
            <button onClick={createTodo} className="add-button">
              Add
            </button>
          </div>
          {todos.map(({ id, task, complete }) => (
            <div key={id} className="todo-item">
              {/* Checkbox to toggle the completion status of the todo */}
              <input
                type="checkbox"
                checked={complete}
                onChange={() => toggleTodoComplete(id)}
                className="todo-checkbox"
              />
              {/* Strike-through style for completed tasks */}
              <span
                className={complete ? "completed-task" : "uncompleted-task"}
              >
                {task}
              </span>
              <div className="todo-buttons">
                <button
                  onClick={() => startEditTodo(id)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Todo;
