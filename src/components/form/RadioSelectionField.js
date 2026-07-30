import React from 'react'
import FormFormat from './FormFormat'

const RadioSelectionField = ({
  formik,
  fieldName,
  label,
  options,
  required = false,
  labelWidth = 3,
}) => {
  const hasError = formik.touched[fieldName] && formik.errors[fieldName]

  return (
    <FormFormat label={label} required={required} labelWidth={labelWidth}>
      <div className="d-flex flex-wrap align-items-center pt-2">
        <For each="option" of={options}>
          <div className="form-check form-check-inline" key={option.value}>
            <input
              className="form-check-input"
              type="radio"
              id={`${fieldName}-${option.value}`}
              name={fieldName}
              value={option.value}
              checked={String(formik.values[fieldName]) === String(option.value)}
              onChange={() => formik.setFieldValue(fieldName, option.value)}
              onBlur={formik.handleBlur}
            />
            <label className="form-check-label" htmlFor={`${fieldName}-${option.value}`}>
              {option.label}
            </label>
          </div>
        </For>
      </div>
      <If condition={!!hasError}>
        <span className="mrd-error-text">{formik.errors[fieldName]}</span>
      </If>
    </FormFormat>
  )
}

export default RadioSelectionField
