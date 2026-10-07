function Chargement({ texte = 'Chargement...' }) {
  return (
    <div className="d-flex align-items-center gap-2 text-muted py-4">
      <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
      <span>{texte}</span>
    </div>
  );
}

export default Chargement;