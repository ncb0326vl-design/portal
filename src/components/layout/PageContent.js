import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { kebabCase } from 'lodash'
import { userFunctions } from 'Redux/selectors'

/** Rebuilds the breadcrumb by matching each path segment back to the menu tree. */
const useBreadcrumb = () => {
  const { pathname } = useLocation()
  const functions = useSelector(userFunctions)
  const [area, group, feature] = pathname.split('/').filter(Boolean)

  const level1 = functions.find((f) => kebabCase(f.id) === area)
  const level2 = level1 && (level1.children || []).find((f) => kebabCase(f.id) === group)
  const level3 = level2 && (level2.children || []).find((f) => kebabCase(f.id) === feature)

  return [level1, level2, level3].filter(Boolean).map((f) => f.name)
}

const PageContent = ({ children }) => {
  const crumbs = useBreadcrumb()

  return (
    <div className="p-4">
      <div className="mrd-breadcrumb mb-2">{crumbs.join('　>　')}</div>
      <div className="mrd-card p-4">{children}</div>
    </div>
  )
}

export default PageContent
