import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, FormControl, Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

function TodoListApp() {
  const [todos, setTodos] = useState(loadTodosFromLocalStorage()); // Load todos from local storage
  const [showModal, setShowModal] = useState(false); // Show Model
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete modal state
  const [showTodoModal, setShowTodoModal] = useState(false); // Show details modal state
  const [selectedTodo, setSelectedTodo] = useState(null); // Store the selected todo
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoStatus, setNewTodoStatus] = useState("Uncompleted"); // Default status
  const [editingTodo, setEditingTodo] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false); // Error message state
  const [todoToDeleteId, setTodoToDeleteId] = useState(null); // ID of todo to delete

  // Load todos from local storage
  function loadTodosFromLocalStorage() {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  }

  // Save todos to local storage
  function saveTodosToLocalStorage(updatedTodos) {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

  // Handle adding a new todo
  const handleAddTodo = () => {
    if (newTodoTitle.trim() === "") {
      setShowErrorMessage(true); // Show error message
      return;
    }

    const newTodo = {
      id: Date.now(), // Simple unique ID
      title: newTodoTitle,
      status: newTodoStatus, // Status is either "Uncompleted" or "Completed"
    };

    // Update the todos array and save to local storage
    setTodos([...todos, newTodo]);
    saveTodosToLocalStorage([...todos, newTodo]);

    setNewTodoTitle("");
    setNewTodoStatus("Uncompleted"); // Reset status after adding
    setShowModal(false);
    setShowErrorMessage(false); // Hide error message
  };

  // Handle deleting a todo
  const handleDeleteTodo = (id) => {
    setTodoToDeleteId(id); // Store the ID of the todo to delete
    setShowDeleteModal(true); // Show the delete confirmation modal
  };

  // Handle confirming delete
  const handleConfirmDelete = () => {
    // Filter the todos array and save to local storage
    const updatedTodos = todos.filter((todo) => todo.id !== todoToDeleteId);
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);

    setShowDeleteModal(false);
  };

  // Handle canceling delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Handle marking a todo as completed/uncompleted
  const handleToggleComplete = (id) => {
    // Update the todos array and save to local storage
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            status: todo.status === "Uncompleted" ? "Completed" : "Uncompleted",
          }
        : todo
    );
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };

  // Handle editing a todo
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setNewTodoTitle(todo.title);
    setNewTodoStatus(todo.status);
    setShowModal(true);
  };

  // Handle showing a todo
  const handleShowTodo = (todo) => {
    setSelectedTodo(todo); // Set the selected todo
    setShowTodoModal(true); // Show the details modal
  };

  // Handle saving edited todo
  const handleSaveEdit = () => {
    if (newTodoTitle.trim() === "") {
      setShowErrorMessage(true); // Show error message
      return;
    }

    // Update the todos array and save to local storage
    const updatedTodos = todos.map((todo) =>
      todo.id === editingTodo.id
        ? { ...todo, title: newTodoTitle, status: newTodoStatus }
        : todo
    );
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);

    setEditingTodo(null);
    setNewTodoTitle("");
    setNewTodoStatus("Uncompleted"); // Reset status after editing
    setShowModal(false);
    setShowErrorMessage(false); // Hide error message
  };

  return (
    <div className="container mt-5">
      <h2>Todo List App</h2>

      {/* Add New Task Button */}
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add New Task
      </Button>

      {/* Modal for showing selected Task */}
      <Modal show={showTodoModal} onHide={() => setShowTodoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTodo && (
            <>
              <p>Title: {selectedTodo.title}</p>
              <p>Status: {selectedTodo.status}</p>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal for Adding/Editing Tasks */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTodo ? "Edit Task" : "Add New Task"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormControl
              placeholder="Task Title"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
            />
            {showErrorMessage && (
              <div className="text-danger mt-1">Please enter a task title.</div>
            )}

            <DropdownButton
              id="dropdown-basic-button"
              className="mt-3"
              title={newTodoStatus}
              variant="outline-secondary"
            >
              <Dropdown.Item onClick={() => setNewTodoStatus("Uncompleted")}>
                Uncompleted
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setNewTodoStatus("Completed")}>
                Completed
              </Dropdown.Item>
            </DropdownButton>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {editingTodo ? (
            <Button variant="primary" onClick={handleSaveEdit}>
              Save
            </Button>
          ) : (
            <Button variant="primary" onClick={handleAddTodo}>
              Add
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Uncompleted Todo List */}
      <ul className="list-group list-group-flush mt-3">
        {todos.filter((todo) => todo.status === "Uncompleted").length === 0 ? (
          <h3>Add a new task to get started!</h3>
        ) : (
          <>
            <h3>Uncompleted Tasks</h3>
            {todos
              .filter((todo) => todo.status === "Uncompleted")
              .map((todo) => (
                <li
                  key={todo.id}
                  className={`list-group-item d-flex justify-content-between align-items-center`}
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={todo.status === "Completed"}
                      onChange={() => handleToggleComplete(todo.id)}
                      className="me-2"
                    />

                    <span
                      className="btn bg-transparent border-0"
                      onClick={() => handleShowTodo(todo)} // Pass the todo to the function
                      style={{
                        textDecoration:
                          todo.status === "Completed" ? "line-through" : "none",
                      }}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="me-2"
                      onClick={() => handleEditTodo(todo)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="me-2"
                      onClick={() => handleDeleteTodo(todo.id)}
                    />
                  </div>
                </li>
              ))}
          </>
        )}
      </ul>

      {/* Completed Todo List */}
      <ul className="list-group list-group-flush mt-3">
        {todos.filter((todo) => todo.status === "Completed").length === 0 ? (
          <h3>No completed tasks yet.</h3>
        ) : (
          <>
            <h3>Completed Tasks</h3>
            {todos
              .filter((todo) => todo.status === "Completed")
              .map((todo) => (
                <li
                  key={todo.id}
                  className={`list-group-item d-flex justify-content-between align-items-center`}
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={todo.status === "Completed"}
                      onChange={() => handleToggleComplete(todo.id)}
                      className="me-2"
                    />
                    <span
                      onClick={() => handleShowTodo(todo)} // Pass the todo to the function
                      style={{ textDecoration: "line-through" }}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="me-2"
                      onClick={() => handleEditTodo(todo)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="me-2"
                      onClick={() => handleDeleteTodo(todo.id)}
                    />
                  </div>
                </li>
              ))}
          </>
        )}
      </ul>
    </div>
  );
}

export default TodoListApp;
