const Spinner = ({ color = null, textClass = 'text-primary' }) => (
  <div
    className={`spinner-border${!color && textClass}`}
    role='status'
    style={color && { color: color }}>
    <span class='visually-hidden'>Loading...</span>
  </div>
);

export default Spinner;
