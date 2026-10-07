function MessageErreur({ message }) {
  return (
    <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
      <span aria-hidden="true">⚠</span>
      <span>{message}</span>
    </div>
  );
}

export default MessageErreur;