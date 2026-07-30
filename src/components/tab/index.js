import React from 'react'

/**
 * Hash-driven tab bar. `tabs` is [{ id, name }]; the active tab comes from location.hash.
 */
const Tab = ({ tabs, activeTab, onChange }) => (
  <ul className="nav nav-tabs mb-3">
    <For each="tab" of={tabs}>
      <li className="nav-item" key={tab.id}>
        <button
          type="button"
          className={`nav-link btn btn-link ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.name}
        </button>
      </li>
    </For>
  </ul>
)

export default Tab
