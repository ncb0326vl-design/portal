import React from 'react'

const InputGroup = ({ prepend, append, children }) => (
  <div className="input-group">
    <If condition={!!prepend}>
      <div className="input-group-prepend">
        <span className="input-group-text">{prepend}</span>
      </div>
    </If>
    {children}
    <If condition={!!append}>
      <div className="input-group-append">
        <span className="input-group-text">{append}</span>
      </div>
    </If>
  </div>
)

export default InputGroup
