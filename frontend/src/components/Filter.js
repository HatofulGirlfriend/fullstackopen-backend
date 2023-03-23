const Filter = ({ newSearch, handleNameSearch }) => {

    return (
       <div>filter shown with <input value={newSearch} onChange={handleNameSearch}/></div> 
    )

}

export default Filter