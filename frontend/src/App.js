import { useState, useEffect } from "react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import personService from "./services/persons"
import Notification from "./components/Notification";
import ErrorNotification from "./components/ErrorNotification";
import "./styles.css"

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [selected, setSelected] = useState(persons);
  const [newSearch, setNewSearch] = useState("");
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setSelected(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault();
    
    if (doesNameExist()) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const updatedObject = {
          name: persons.find(p => p.name.toLowerCase() === newName.toLowerCase()).name,
          number: newNumber,
          id: persons.find(p => p.name.toLowerCase() === newName.toLowerCase()).id
        }

        personService
          .update(updatedObject.id, updatedObject)
          .then(() =>{
            setSelected(persons.filter(p => p.id !== updatedObject.id).concat(updatedObject))
            setMessage(`${updatedObject.name} has been updated`)
            setTimeout(() => {
              setMessage(null)
            }, 2000)
          })
          .catch(() => {
            setErrorMessage(
              `'${updatedObject.name}' was already removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)})
            setSelected(persons.filter(p => p.id !== updatedObject.id))
      }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      };
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setSelected(persons.concat(returnedPerson))
          setMessage(`${returnedPerson.name} has been added`)
            setTimeout(() => {
              setMessage(null)
            }, 2000)
        })
    }
    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNameSearch = (event) => {
    setNewSearch(event.target.value);
    const entriesToShow = newSearch
      ? persons.filter(person =>
        (person.name.toLowerCase().includes(event.target.value.toLowerCase())))
      : persons
     setSelected(entriesToShow);
  }

  const doesNameExist = () => {
    for (let i = 0; i < persons.length; i++) {
      if (newName.toLowerCase() === persons[i].name.toLowerCase()) {
        return true;
      }
    }
  };

  const deletePerson = (idToDelete, personToDelete) => {
    if (window.confirm(`Delete ${personToDelete}?`)) {
      personService
        .remove(idToDelete)
        .then(() => {
          setPersons(persons.filter(p => p.id !== idToDelete))
          setSelected(persons.filter(p => p.id !== idToDelete))
        })
    }
  }

console.log(persons)
  return (

    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <ErrorNotification errorMessage={errorMessage} />
      <Filter newSearch={newSearch} handleNameSearch={handleNameSearch} />
      <h3>Add a new</h3>
      <PersonForm addName={addName} newName={newName} newNumber={newNumber}
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      {selected.map((person) => (
        <Persons
          key={person.id}
          personName={person.name}
          personNumber={person.number}
          handleDeletePersons={deletePerson}
          id={person.id}
        />
      ))}
    </div>
  );
};

export default App;
