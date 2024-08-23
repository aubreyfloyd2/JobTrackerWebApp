
const FormField = ({labelFor, labelText, typeText, inputVariable, placeholderText, changeFunction}) => {
  return ( 
    <div>
      <label htmlFor={labelFor}>{labelText}</label>
      <input
        type={typeText}
        name={labelFor}
        value={inputVariable}
        placeholder={placeholderText}
        onChange={changeFunction}
      />
    </div>
   );
}
 
export default FormField;