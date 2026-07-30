/**
 * Client-side CSV export. Prepends a BOM so Excel on Windows reads UTF-8 correctly.
 */
export const exportToCsv = (fileName, columns, rows) => {
  const cols = columns.filter((c) => c.accessor)
  const escape = (value) => {
    const str = value === null || value === undefined ? '' : String(value)
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }

  const header = cols.map((c) => escape(c.Header)).join(',')
  const body = rows
    .map((row) => cols.map((c) => escape(row[c.accessor])).join(','))
    .join('\n')

  const blob = new Blob([`﻿${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${fileName}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default { exportToCsv }
