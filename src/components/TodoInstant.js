import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Todo.css";
import toast, { Toaster } from "react-hot-toast";

const TodoInstant = () => {
  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const notifySuccess = (msg) => toast.success(msg);

  const notifyError = (msg) => toast.error(msg);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        "https://strapi-production-7efd.up.railway.app/api/todos"
      );
      const todosData = response.data.data;
      const todosList = todosData
        .map(({ id, attributes }) => ({
          id,
          task: attributes.task,
          complete: attributes.complete,
        }))
        .sort((a, b) => b.id - a.id);
      setTodos(todosList);
      notifySuccess("Successfully fetched the data form Strapi!");
    } catch (error) {
      notifyError("Strapi Error!, unable to fetch.");
      console.error("Error fetching todos:", error);
    }
  };

  const createTodo = async () => {
    const newTask = newTodo.trim();
    const prevTodos = [...todos];
    if (!newTask) return;

    const newTodoItem = {
      id: Date.now(),
      task: newTask,
      complete: false,
    };

    setTodos((prevTodos) => [newTodoItem, ...prevTodos]);
    setNewTodo("");

    try {
      await axios.post(
        "https://strapi-production-7efd.up.railway.app/api/todos",
        {
          data: { task: newTask, complete: false },
        }
      );
      notifySuccess("Successfully Added to Strapi!");
    } catch (error) {
      notifyError("Strapi Error!, unable to add.");
      setTodos(prevTodos);
      console.log("Error creating todo:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    const prevTodos = [...todos];
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));

    try {
      await axios.delete(
        `https://strapi-production-7efd.up.railway.app/api/todos/${todoId}`
      );
      notifySuccess("Successfully Delete from Strapi!");
    } catch (error) {
      notifyError("Strapi Error!, unable to delete.");
      setTodos(prevTodos);
      console.log("Error deleting todo:", error);
    }
  };

  const startEditTodo = (todoId, todoTask) => {
    setNewTodo(todoTask);
    setEditTodoId(todoId);
  };

  const updateTodo = async () => {
    const newTask = newTodo.trim();
    const prevTodos = [...todos];
    if (!newTask) return;

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === editTodoId ? { ...todo, task: newTask } : todo
      )
    );
    setNewTodo("");
    setEditTodoId(null);

    try {
      await axios.put(
        `https://strapi-production-7efd.up.railway.app/api/todosee/${editTodoId}`,
        { data: { task: newTask } }
      );
      notifySuccess("Successfully Updated to Strapi!");
    } catch (error) {
      notifyError("Strapi Error!, unable to update.");
      setTodos(prevTodos);
      console.log("Error updating todo:", error);
    }
  };

  const toggleTodoComplete = async (todoId, complete) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, complete: !complete } : todo
      )
    );

    try {
      await axios.put(
        `https://strapi-production-7efd.up.railway.app/api/todos/${todoId}`,
        { data: { complete: !complete } }
      );
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  return (
    <div className="todo-container">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="todo-heading">Todo List</h1>
      {editTodoId !== null ? (
        <div>
          <div className="edit-form">
            <div className="input-container">
              <input
                type="text"
                value={newTodo}
                onChange={(event) => setNewTodo(event.target.value)}
                className="edit-input"
              />
              {newTodo !== "" && (
                <i
                  className="fa-solid fa-xmark fa-sm cancel-button"
                  onClick={() => setNewTodo("")}
                ></i>
              )}
            </div>
            <i
              className="fa-solid fa-floppy-disk fa-2xl update-button"
              onClick={updateTodo}
            ></i>
          </div>
        </div>
      ) : (
        <div>
          <div className="add-form">
            <div className="input-container">
              <input
                type="text"
                value={newTodo}
                onChange={(event) => handleInputChange(event)}
                className="todo-input"
              />
              {newTodo !== "" && (
                <i
                  className="fa-solid fa-xmark fa-sm cancel-button"
                  onClick={() => setNewTodo("")}
                ></i>
              )}
            </div>
            <i
              className="fa-solid fa-square-plus fa-2xl add-button"
              onClick={createTodo}
            ></i>
          </div>
          <div className="display-todos">
            {todos.map(({ id, task, complete }) => (
              <div key={id} className="todo-item">
                <i
                  className={
                    !complete
                      ? "fa-regular fa-square-check fa-xl todo-checkbox"
                      : "fa-solid fa-square-check fa-xl todo-checkbox"
                  }
                  onClick={() => toggleTodoComplete(id, complete)}
                ></i>
                <span
                  className={complete ? "completed-task" : "uncompleted-task"}
                >
                  {task}
                </span>
                <div className="todo-buttons">
                  <i
                    className="fa-solid fa-pen-to-square fa-xl edit-button"
                    onClick={() => startEditTodo(id, task)}
                  ></i>
                  <i
                    className="fa-solid fa-trash fa-xl delete-button"
                    onClick={() => deleteTodo(id)}
                  ></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoInstant;
