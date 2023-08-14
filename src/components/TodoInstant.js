import axios from "../axiosConfig";
import React, { useEffect, useState } from "react";
import "./Todo.css";
import toast, { Toaster } from "react-hot-toast";
import { nanoid } from "nanoid";

const TodoInstant = () => {
  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    const promise = axios.get("/todos");

    toast.promise(promise, {
      loading: "Loading",
      success: (response) => {
        const todosData = response.data.data;
        const todosList = todosData
          .map(({ id, attributes }) => ({
            id,
            task: attributes.task,
            complete: attributes.complete,
          }))
          .sort((a, b) => b.id - a.id);
        setTodos(todosList);
        return "Successfully fetched the data from Strapi!";
      },
      error: "Strapi Error!, unable to fetch.",
    });
  };

  const createTodo = () => {
    const newTask = newTodo.trim();
    const prevTodos = [...todos];
    if (!newTask) return;

    const newTodoItem = {
      id: todos.at(0).id + 1,
      task: newTask,
      complete: false,
    };

    setTodos((prevTodos) => [newTodoItem, ...prevTodos]);
    setNewTodo("");

    const promise = axios.post(
      "/todos",
      {
        data: { id: newTodoItem.id, task: newTask, complete: false },
      }
    );

    toast.promise(promise, {
      loading: "Adding...",
      success: "Successfully Added to Strapi!",
      error: () => {
        setTodos(prevTodos);
        return "Strapi Error!, unable to add.";
      },
    });
  };

  const deleteTodo = (todoId) => {
    const prevTodos = [...todos];
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));

    const promise = axios.delete(
      `/todos/${todoId}`
    );

    toast.promise(promise, {
      loading: "Deleting...",
      success: "Successfully Deleted from Strapi!",
      error: () => {
        setTodos(prevTodos);
        return "Strapi Error!, unable to delete.";
      },
    });
  };

  const startEditTodo = (todoId, todoTask) => {
    setNewTodo(todoTask);
    setEditTodoId(todoId);
    toast("You are editing a todo..");
  };

  const updateTodo = () => {
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

    const promise = axios.put(
      `/todos/${editTodoId}`,
      { data: { task: newTask } }
    );

    toast.promise(promise, {
      loading: "Updating...",
      success: "Successfully Updated to Strapi!",
      error: () => {
        setTodos(prevTodos);
        return "Strapi Error!, unable to update.";
      },
    });
  };

  const toggleTodoComplete = async (todoId, complete) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, complete: !complete } : todo
      )
    );

    try {
      await axios.put(
        `/todos/${todoId}`,
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
