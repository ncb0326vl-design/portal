import React from 'react'
import FormFormat from './FormFormat'
import { DatePickerInput } from './DateSelection'

/**
 * Start/end pair. Validation of the ordering lives in the caller's Yup schema.
 */
const DateRangeSelection = ({
  formik,
  startFieldName,
  endFieldName,
  label,
  required = false,
  disabled = false,
  labelWidth = 3,
}) => {
  const startError = formik.touched[startFieldName] && formik.errors[startFieldName]
  const endError = formik.touched[endFieldName] && formik.errors[endFieldName]

  const setField = (name, value) => {
    formik.setFieldTouched(name, true, false)
    formik.setFieldValue(name, value, true)
  }

  return (
    <FormFormat label={label} required={required} labelWidth={labelWidth}>
      <div className="d-flex align-items-start">
        <div style={{ maxWidth: 170 }}>
          <DatePickerInput
            value={formik.values[startFieldName]}
            disabled={disabled}
            hasError={!!startError}
            onChange={(value) => setField(startFieldName, value)}
          />
        </div>
        <span className="mx-2 pt-2">～</span>
        <div style={{ maxWidth: 170 }}>
          <DatePickerInput
            value={formik.values[endFieldName]}
            disabled={disabled}
            hasError={!!endError}
            onChange={(value) => setField(endFieldName, value)}
          />
        </div>
      </div>
      <If condition={!!(startError || endError)}>
        <span className="mrd-error-text">{startError || endError}</span>
      </If>
    </FormFormat>
  )
}

export default DateRangeSelection
