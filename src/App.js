import React, { useState } from "react";
import Todo from "./components/Todo";
import TodoInstant from "./components/TodoInstant";
import "./App.css";

function App() {
  const [useInstantTodo, setUseInstantTodo] = useState(false);

  const toggleTodoType = () => {
    setUseInstantTodo((prevValue) => !prevValue);
  };

  return (
    <div className="App">
      <div className="toggle-icon-container">
        <i
          className={
            useInstantTodo
              ? "fa-solid fa-toggle-on fa-2xl"
              : "fa-solid fa-toggle-off fa-2xl"
          }
          onClick={toggleTodoType}
        ></i>
      </div>
      <p>
        {useInstantTodo
          ? "Using Instant Todo: Real-Time Updates!"
          : "Using Regular Todo: Manual Updates Required"}
      </p>
      {useInstantTodo ? <TodoInstant /> : <Todo />}
    </div>
  );
}

export default App;
