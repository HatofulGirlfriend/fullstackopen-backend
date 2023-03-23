const ErrorNotification = ({ errorMessage }) => {
    if (errorMessage === null) {
      return null
    }
  
    return (
      <div className='error'>
        {errorMessage}
      </div>
    )
  }

  export default ErrorNotification