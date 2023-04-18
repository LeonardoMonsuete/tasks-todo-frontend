import React, { useEffect, useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import './App.css';
import axios from 'axios';

function App() {

const Todos = ({ todos }) => {
  return (
    <div className="todos">
      {todos.map((todo) => {
          return (
            <div className="todo">
                <button onClick={() => updateTaskStatus(todo)} className='checkbox' style={{backgroundColor: todo.status ? "#A879E6" : "white", cursor: 'pointer'}}></button>
                <p>{todo.name}</p>
                <button onClick={() => openFieldToEditNameTask(todo)}>
                  <AiOutlineEdit size={20} color={"#64697b"}>

                  </AiOutlineEdit>
                </button>

                <button onClick={() => deleteTask(todo)}>
                  <AiOutlineDelete size={20} color={"#64697b"}>

                  </AiOutlineDelete>
                </button>
            </div>
          )
        }) }
    </div>
  )
}

  async function openFieldToEditNameTask(task)
  {
    setUpdatingVisibility(task)
    setInputVisibility(true)
    setInputValue(task.name)
  }

  async function updateTaskName()
  {
    if(window.confirm(`Deseja realmente alterar a tarefa: ${updatingVisibility.name} ? ` )){
      const res = axios.put(`http://127.0.0.1:3333/updateToDoName/${updatingVisibility.id}`, {name: inputValue})
      console.log(res)
      getAllTasks()
    }
  }

  async function updateTaskStatus(task)
  {
    const newStatus = !task.status ? 'Concluída' : 'À Fazer'
    if(window.confirm(`Deseja realmente alterar o status para ${newStatus} ? `)){
      const res = await axios.put(`http://127.0.0.1:3333/updateToDoStatus/${task.id}`, {status: !task.status})
      console.log(res)
      getAllTasks()
    }
  }

  async function deleteTask(task)
  {
    if(window.confirm(`Deseja realmente excluir permanentemente a tarefa: ${task.name} ? ` )){
      await axios.delete(`http://127.0.0.1:3333/deleteToDo/${task.id}`);
      getAllTasks()
    }
  }

  async function createNewTask()
  {
    if(updatingVisibility){
      updateTaskName()
      setUpdatingVisibility(false)
    } else {
      const res = await axios.post("http://127.0.0.1:3333/newToDo", {name: inputValue})
      console.log(res)
    }
    getAllTasks()
    setInputValue("")
    setInputVisibility(!inputVisibility)
  }
  async function handleWithAddTaskButton()
  {
    setInputVisibility(!inputVisibility)
  }

  async function getAllTasks()
  {
    const response = await axios.get("http://127.0.0.1:3333/toDos")
    setTodos(response.data)
  }

  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [inputVisibility, setInputVisibility] = useState(false)
  const [updatingVisibility, setUpdatingVisibility] = useState()

  useEffect(() => {
    getAllTasks()
  }, [])
  return (
    <div className="App">
      <header className="container">
        <div className='header'>
          <h1>Bora ser produtivo !</h1>
        </div>
          <Todos todos={todos}></Todos>
          <input 
            value={inputValue} 
            style={{display: inputVisibility ? "block" : "none"}}
            onChange={(event) => {
              setInputValue(event.target.value)
            }} 
            className='inputName'
          ></input>
          <button onClick={inputVisibility ? createNewTask : handleWithAddTaskButton} className='newTaskButton'>
            {inputVisibility ? 'Save' : '+ Add Task'}</button>
      </header>
    </div>
  );
}

export default App;
