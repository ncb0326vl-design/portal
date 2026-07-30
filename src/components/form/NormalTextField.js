import React from 'react'
import FormFormat from './FormFormat'

/** Read-only display row — same visual grid as an editable field. */
const NormalTextField = ({ label, value, labelWidth = 3 }) => (
  <FormFormat label={label} labelWidth={labelWidth}>
    <div className="col-form-label">{value || '—'}</div>
  </FormFormat>
)

export default NormalTextField
