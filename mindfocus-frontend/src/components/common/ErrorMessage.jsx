function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="circle" role="alert">
      <span className="block">{message}</span>
    </div>
  );
}

export default ErrorMessage; 