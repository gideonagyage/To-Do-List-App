import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Modal,
  Form,
  FormControl,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faAdd } from "@fortawesome/free-solid-svg-icons";

function TodoListApp() {
  const [todos, setTodos] = useState(loadTodosFromLocalStorage());
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoStatus, setNewTodoStatus] = useState("Uncompleted");
  const [editingTodo, setEditingTodo] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [todoToDeleteId, setTodoToDeleteId] = useState(null);

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

    setEditingTodo(null);
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
    <div className="container mt-5 mb-5 d-flex flex-column justify-content-center align-items-center">
      <div className="top-card mb-3">
        <div className="row mx-3">
          <h3 className="col text-start text-white">Todo List App</h3>
          {/* Add New Task button */}
          <FontAwesomeIcon
            onClick={() => setShowModal(true)}
            icon={faAdd}
            className="text-end me-2 btn-add"
            size="2x"
            title="Add New Task"
          />
        </div>
      </div>

      {/* Uncompleted & Completed List */}
      <div className="main-card d-flex flex-column justify-content-center align-items-center">
        {/* Uncompleted Todo List */}
        <div className="card inner-card border-0 inner-card w-100">
          <ul className="list-group list-group-flush mt-3">
            {todos.filter((todo) => todo.status === "Uncompleted").length ===
            0 ? (
              <h6 className="text-center text-white">Your tasks will show here</h6>
            ) : (
              <>
                <h6 className="text-center text-white">Uncompleted Tasks</h6>
                {todos
                  .filter((todo) => todo.status === "Uncompleted")
                  .map((todo) => (
                    <li
                      key={todo.id}
                      className={`list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 text-white`}
                    >
                      <input
                        type="checkbox"
                        checked={todo.status === "Completed"}
                        onChange={() => handleToggleComplete(todo.id)}
                        className="me-2 form-check-input"
                      />

                      <span
                        className="truncate text-white text-start"
                        onClick={() => handleShowTodo(todo)} // Pass the todo to the function
                        style={{
                          textDecoration:
                            todo.status === "Completed"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {todo.title}
                      </span>

                      <FontAwesomeIcon
                        icon={faPencil}
                        onClick={() => handleEditTodo(todo)}
                        className="mx-4 list-icon"
                        title="Edit Task"
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="me-2 list-icon"
                        title="Delete Task"
                      />
                    </li>
                  ))}
              </>
            )}
          </ul>
        </div>

        {/* Completed Todo List */}
        <div className="card inner-card border-0 inner-card w-100">
          <ul className="list-group list-group-flush mt-3">
            {todos.filter((todo) => todo.status === "Completed").length ===
            0 ? (
              <>
                <h6 className="text-center text-white">
                  No task completed yet
                </h6>
              </>
            ) : (
              <>
                <h6 className="text-center text-white">Completed Tasks</h6>
                {todos
                  .filter((todo) => todo.status === "Completed")
                  .map((todo) => (
                    <li
                      key={todo.id}
                      className={`list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 text-white`}
                    >
                      <input
                        type="checkbox"
                        checked={todo.status === "Completed"}
                        onChange={() => handleToggleComplete(todo.id)}
                        className="me-2 form-check-input"
                      />
                      <span
                        className="truncate text-white text-start"
                        onClick={() => handleShowTodo(todo)} // Pass the todo to the function
                        style={{ textDecoration: "line-through" }}
                      >
                        {todo.title}
                      </span>

                      <FontAwesomeIcon
                        icon={faPencil}
                        onClick={() => handleEditTodo(todo)}
                        className="mx-4 list-icon"
                        title="Edit Task"
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="me-2 list-icon"
                        title="Delete Task"
                      />
                    </li>
                  ))}
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Modal for showing selected Task */}
      <Modal show={showTodoModal} onHide={() => setShowTodoModal(false)}>
        <Modal.Header className="modal-bg" closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-bg modal-body">
          {selectedTodo && (
            <>
              <h4 className="fw-bold fs-5">{selectedTodo.title}</h4>
              <br />
              <span className="fs-6 fw-medium">
                Status of Task:{" "}
                <p className="fw-normal"> {selectedTodo.status}</p>
              </span>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal for Adding/Editing Tasks */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header className="modal-bg" closeButton>
          <Modal.Title>
            {editingTodo ? "Edit Task" : "Add New Task"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-bg">
          <Form>
            {/* Render input fields only if adding a new task */}
            {!editingTodo && (
              <FormControl
                placeholder="Task Title"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
              />
            )}

            {/* Render input fields only if editing a task */}
            {editingTodo && (
              <FormControl
                placeholder="Task Title"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
              />
            )}
            {showErrorMessage && (
              <div className="text-danger mt-1">Please enter a task title.</div>
            )}

            <DropdownButton
              id="dropdown-basic-button"
              className="mt-3 dropdown-list btn-success"
              title={newTodoStatus}
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
        <Modal.Footer className="modal-bg">
          <button className="btn-cancel" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          {editingTodo ? (
            <button className="btn-save" onClick={handleSaveEdit}>
              Save
            </button>
          ) : (
            <button className="btn-save" onClick={handleAddTodo}>
              Add
            </button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header className="modal-bg" closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-bg">
          Are you sure you want to delete this task?
        </Modal.Body>
        <Modal.Footer className="modal-bg">
          <button className="btn-cancel" onClick={handleCancelDelete}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleConfirmDelete}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TodoListApp;
