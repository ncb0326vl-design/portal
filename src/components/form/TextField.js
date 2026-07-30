import React from 'react'
import FormFormat from './FormFormat'

/**
 * Takes the whole formik bag. Each field reads its own touched/errors — there is no
 * central error renderer.
 */
const TextField = ({
  formik,
  fieldName,
  label,
  required = false,
  placeholder = '',
  maxLength,
  disabled = false,
  labelWidth = 3,
}) => {
  const hasError = formik.touched[fieldName] && formik.errors[fieldName]

  return (
    <FormFormat label={label} required={required} htmlFor={fieldName} labelWidth={labelWidth}>
      <input
        id={fieldName}
        name={fieldName}
        type="text"
        className={`form-control ${hasError ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        value={formik.values[fieldName] || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <If condition={!!hasError}>
        <span className="mrd-error-text">{formik.errors[fieldName]}</span>
      </If>
    </FormFormat>
  )
}

export default TextField
