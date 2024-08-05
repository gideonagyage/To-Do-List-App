import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function TodoListApp() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    title: "",
    status: "uncompleted",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Show modal for adding/editing tasks
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTask({ title: "", status: "uncompleted" });
    setEditIndex(null);
  };

  // Show modal for deleting tasks
  const handleShowDeleteModal = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // Handle input changes for task form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({ ...currentTask, [name]: value });
  };

  // Add or edit task
  const handleAddTask = () => {
    if (currentTask.title.trim() === "") {
      alert("Task title cannot be empty");
      return;
    }
    if (editIndex !== null) {
      const updatedTasks = tasks.map((task, index) =>
        index === editIndex ? currentTask : task
      );
      setTasks(updatedTasks);
    } else {
      setTasks([...tasks, currentTask]);
    }
    handleCloseModal();
  };

  // Delete task
  const handleDeleteTask = () => {
    const updatedTasks = tasks.filter((_, i) => i !== deleteIndex);
    setTasks(updatedTasks);
    handleCloseDeleteModal();
  };

  // Edit task
  const handleEditTask = (index) => {
    setCurrentTask(tasks[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  // Toggle task completion status
  const handleCompleteTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index
        ? {
            ...task,
            status: task.status === "completed" ? "uncompleted" : "completed",
          }
        : task
    );
    setTasks(updatedTasks);
  };

  // Filter tasks based on their status
  const uncompletedTasks = tasks.filter(
    (task) => task.status === "uncompleted"
  );
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="container">
      <h2 className="my-4">Todo List App</h2>
      <Button variant="primary" onClick={handleShowModal}>
        Add New Task
      </Button>
      <div className="row my-4">
        <div className="col-md-6">
          <h4>Uncompleted Tasks</h4>
          <ul className="list-group">
            {uncompletedTasks.map((task, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => handleCompleteTask(index)}
                    className="mr-2"
                  />
                  {task.title}
                </div>
                <div>
                  <Button
                    variant="warning"
                    onClick={() => handleEditTask(index)}
                    className="mr-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleShowDeleteModal(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h4>Completed Tasks</h4>
          <ul className="list-group">
            {completedTasks.map((task, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => handleCompleteTask(index)}
                    className="mr-2"
                  />
                  <span style={{ textDecoration: "line-through" }}>
                    {task.title}
                  </span>
                </div>
                <div>
                  <Button
                    variant="warning"
                    onClick={() => handleEditTask(index)}
                    className="mr-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleShowDeleteModal(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal for adding/editing tasks */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editIndex !== null ? "Edit Task" : "Add New Task"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentTask.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={currentTask.status}
                onChange={handleInputChange}
              >
                <option value="uncompleted">Uncompleted</option>
                <option value="completed">Completed</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            {editIndex !== null ? "Save Changes" : "Add Task"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for deleting tasks */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTask}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TodoListApp;
