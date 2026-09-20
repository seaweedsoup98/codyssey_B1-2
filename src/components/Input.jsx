export default function Input({ label, error, id, ...props }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} className={error ? 'invalid' : ''} {...props} />
      {error && <small className="field-error">{error}</small>}
    </label>
  )
}
