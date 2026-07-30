import React from 'react'
import Select from 'react-select'
import FormFormat from './FormFormat'

const customStyles = (hasError) => ({
  control: (base) => ({
    ...base,
    minHeight: 38,
    borderColor: hasError ? '#d0342c' : base.borderColor,
  }),
  menu: (base) => ({ ...base, zIndex: 5 }),
})

/**
 * react-select wrapper. `options` is [{ value, label }].
 * Pass `isLoading` while the lookup request is in flight.
 */
const SelectionField = ({
  formik,
  fieldName,
  label,
  options,
  required = false,
  isLoading = false,
  isDisabled = false,
  isClearable = false,
  placeholder = '請選擇',
  labelWidth = 3,
  onSelected,
}) => {
  const hasError = formik.touched[fieldName] && formik.errors[fieldName]
  const selected = options.find((o) => String(o.value) === String(formik.values[fieldName])) || null

  const handleChange = (option) => {
    // Mark touched without validating first, then validate against the new value —
    // the reverse order leaves a stale "required" error on screen.
    formik.setFieldTouched(fieldName, true, false)
    formik.setFieldValue(fieldName, option ? option.value : '', true)
    if (onSelected) onSelected(option)
  }

  return (
    <FormFormat label={label} required={required} htmlFor={fieldName} labelWidth={labelWidth}>
      <Select
        inputId={fieldName}
        name={fieldName}
        options={options}
        value={selected}
        isLoading={isLoading}
        isDisabled={isDisabled}
        isClearable={isClearable}
        placeholder={placeholder}
        noOptionsMessage={() => '無可選項目'}
        loadingMessage={() => '載入中…'}
        styles={customStyles(!!hasError)}
        onChange={handleChange}
        onBlur={() => formik.setFieldTouched(fieldName, true)}
      />
      <If condition={!!hasError}>
        <span className="mrd-error-text">{formik.errors[fieldName]}</span>
      </If>
    </FormFormat>
  )
}

export default SelectionField
