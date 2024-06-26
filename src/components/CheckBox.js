function Checkbox({ children, disabled, checked, onChange, id}) {
  return (
    <>
    <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        id={id}
        onChange={({ target: { checked } }) => onChange(checked)}
      />
      
    <label id={id} onClick={({target: { checked }}) => onChange(checked) }>
    {children}
    </label>
    </>
  );
}

export default Checkbox;