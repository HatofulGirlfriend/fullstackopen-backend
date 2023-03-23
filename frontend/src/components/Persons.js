const Persons = ({ personName, personNumber, handleDeletePersons, id }) => {
    return (
      <div>
        {personName} {personNumber} {""}
        <button onClick={() => handleDeletePersons(id, personName)}>delete</button>
      </div>
    );
  };

  export default Persons