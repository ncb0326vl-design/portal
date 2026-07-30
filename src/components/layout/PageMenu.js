import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { kebabCase } from 'lodash'
import { userFunctions } from 'Redux/selectors'

const PageMenu = () => {
  const functions = useSelector(userFunctions)

  return (
    <nav className="mrd-sidebar py-2">
      <For each="level1" of={functions}>
        <div key={level1.id}>
          <div className="mrd-menu-group">{level1.name}</div>
          <For each="level2" of={level1.children || []}>
            <ul className="nav flex-column mb-2" key={level2.id}>
              <For each="level3" of={level2.children || []}>
                <li className="nav-item" key={level3.id}>
                  <NavLink
                    className="nav-link"
                    to={`/${kebabCase(level1.id)}/${kebabCase(level2.id)}/${kebabCase(level3.id)}`}
                  >
                    {level3.name}
                  </NavLink>
                </li>
              </For>
            </ul>
          </For>
        </div>
      </For>
    </nav>
  )
}

export default PageMenu
