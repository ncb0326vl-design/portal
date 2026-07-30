import React from 'react'

export const FormLabel = ({ name, required = false, htmlFor }) => (
  <label className={`col-form-label mrd-form-label ${required ? 'required' : ''}`} htmlFor={htmlFor}>
    {name}
  </label>
)

/**
 * The 2-column label/value grid every search form is built from.
 * `labelWidth` is a bootstrap column count for the label side.
 */
const FormFormat = ({ label, required = false, htmlFor, labelWidth = 3, children }) => (
  <div className="form-group row">
    <div className={`col-${labelWidth}`}>
      <FormLabel name={label} required={required} htmlFor={htmlFor} />
    </div>
    <div className={`col-${12 - labelWidth}`}>{children}</div>
  </div>
)

export default FormFormat
