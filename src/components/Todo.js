import axios from "../axiosConfig";
import React, { useEffect, useState } from "react";
import "./Todo.css";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        "/todos"
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
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const createTodo = async () => {
    const newTask = newTodo.trim();
    if (!newTask) return;

    try {
      const response = await axios.post(
        "/todos",
        {
          data: { task: newTask, complete: false },
        }
      );
      const data = response.data.data;
      setTodos((prevTodos) => [
        {
          id: data.id,
          task: data.attributes.task,
          complete: data.attributes.complete,
        },
        ...prevTodos,
      ]);
      setNewTodo("");
    } catch (error) {
      console.log("Error creating todo:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const response = await axios.delete(
        `/todos/${todoId}`
      );
      const data = response.data.data;
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== data.id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const startEditTodo = (todoId, todoTask) => {
    setNewTodo(todoTask);
    setEditTodoId(todoId);
  };

  const updateTodo = async () => {
    const newTask = newTodo.trim();
    if (!newTask) return;

    try {
      const response = await axios.put(
        `/todos/${editTodoId}`,
        { data: { task: newTask } }
      );
      const data = response.data.data;
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editTodoId
            ? { ...todo, task: data.attributes.task }
            : todo
        )
      );
      setNewTodo("");
      setEditTodoId(null);
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  const toggleTodoComplete = async (todoId, complete) => {
    try {
      const response = await axios.put(
        `/todos/${todoId}`,
        { data: { complete: !complete } }
      );
      const data = response.data.data;
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId
            ? { ...todo, complete: data.attributes.complete }
            : todo
        )
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
              onClick={() => updateTodo()}
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
              onClick={() => createTodo()}
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

export default Todo;
