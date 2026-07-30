import React from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import dayjs from 'dayjs'
import 'react-day-picker/lib/style.css'
import FormFormat from './FormFormat'

const WEEKDAYS_SHORT = ['日', '一', '二', '三', '四', '五', '六']
const MONTHS = [
  '1 月', '2 月', '3 月', '4 月', '5 月', '6 月',
  '7 月', '8 月', '9 月', '10 月', '11 月', '12 月',
]

export const DATE_FORMAT = 'YYYY/MM/DD'

const parseDate = (str) => {
  const d = dayjs(str, DATE_FORMAT)
  return d.isValid() ? d.toDate() : undefined
}
const formatDate = (date) => dayjs(date).format(DATE_FORMAT)

/** Bare picker without the label grid — used inside DateRangeSelection. */
export const DatePickerInput = ({ value, onChange, disabled = false, hasError = false, dayPickerProps = {} }) => (
  <DayPickerInput
    value={value || ''}
    formatDate={formatDate}
    parseDate={parseDate}
    placeholder={DATE_FORMAT}
    inputProps={{
      className: `form-control ${hasError ? 'is-invalid' : ''}`,
      disabled,
      readOnly: true,
    }}
    dayPickerProps={{
      months: MONTHS,
      weekdaysShort: WEEKDAYS_SHORT,
      firstDayOfWeek: 0,
      ...dayPickerProps,
    }}
    onDayChange={(day) => onChange(day ? formatDate(day) : '')}
  />
)

const DateSelection = ({
  formik,
  fieldName,
  label,
  required = false,
  disabled = false,
  labelWidth = 3,
  dayPickerProps = {},
}) => {
  const hasError = formik.touched[fieldName] && formik.errors[fieldName]

  return (
    <FormFormat label={label} required={required} htmlFor={fieldName} labelWidth={labelWidth}>
      <DatePickerInput
        value={formik.values[fieldName]}
        disabled={disabled}
        hasError={!!hasError}
        dayPickerProps={dayPickerProps}
        onChange={(value) => {
          formik.setFieldTouched(fieldName, true, false)
          formik.setFieldValue(fieldName, value, true)
        }}
      />
      <If condition={!!hasError}>
        <span className="mrd-error-text">{formik.errors[fieldName]}</span>
      </If>
    </FormFormat>
  )
}

export default DateSelection
