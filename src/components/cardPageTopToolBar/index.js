import React from 'react'

const CardPageTopToolBar = ({ title, description, children }) => (
  <div className="d-flex justify-content-between align-items-start mb-3">
    <div>
      <h1 className="mrd-page-title">{title}</h1>
      <If condition={!!description}>
        <div className="text-muted small mt-1">{description}</div>
      </If>
    </div>
    <div>{children}</div>
  </div>
)

export default CardPageTopToolBar
