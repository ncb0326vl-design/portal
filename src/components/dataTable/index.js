import React from 'react'
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table'
import LoadingPrompt from 'Components/loading'
import { NoDataPage, ApiErrorMessagePage } from 'Components/formPage'
import { exportToCsv } from 'Components/exports'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

/**
 * react-table v7 wrapper used by every result table.
 *
 * Sorting is wired up via useSortBy but the header only becomes clickable when
 * `sortable` is passed — most report tables are returned pre-sorted by the backend
 * and must not be re-ordered client-side.
 */
const DataTable = ({
  columns,
  data,
  loading = false,
  error = null,
  sortable = false,
  searchable = true,
  exportFileName = '',
  initialPageSize = 10,
}) => {
  const memoColumns = React.useMemo(() => columns, [columns])
  const memoData = React.useMemo(() => data || [], [data])

  const table = useTable(
    {
      columns: memoColumns,
      data: memoData,
      initialState: { pageIndex: 0, pageSize: initialPageSize },
      disableSortBy: !sortable,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = table

  if (loading) return <LoadingPrompt />
  if (error) return <ApiErrorMessagePage error={error} />
  if (!memoData.length) return <NoDataPage />

  page.forEach(prepareRow)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <If condition={searchable}>
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ width: 220 }}
              placeholder="表格內搜尋"
              onChange={(e) => setGlobalFilter(e.target.value || undefined)}
            />
          </If>
        </div>
        <div className="d-flex align-items-center">
          <span className="text-muted small mr-2">共 {memoData.length} 筆</span>
          <If condition={!!exportFileName}>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => exportToCsv(exportFileName, memoColumns, memoData)}
            >
              匯出 CSV
            </button>
          </If>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover mrd-table mb-0" {...getTableProps()}>
          <thead>
            <For each="headerGroup" of={headerGroups}>
              <tr {...headerGroup.getHeaderGroupProps()}>
                <For each="column" of={headerGroup.headers}>
                  <th
                    {...column.getHeaderProps(sortable ? column.getSortByToggleProps() : undefined)}
                    className={sortable && column.canSort ? 'sortable' : ''}
                  >
                    {column.render('Header')}
                    <If condition={sortable && column.canSort}>
                      <span className={`ml-1 mrd-sort-indicator${column.isSorted ? ' active' : ''}`}>
                        <Choose>
                          <When condition={column.isSorted}>{column.isSortedDesc ? '▼' : '▲'}</When>
                          <Otherwise>⇅</Otherwise>
                        </Choose>
                      </span>
                    </If>
                  </th>
                </For>
              </tr>
            </For>
          </thead>
          <tbody {...getTableBodyProps()}>
            <For each="row" of={page}>
              <tr {...row.getRowProps()}>
                <For each="cell" of={row.cells}>
                  <td {...cell.getCellProps()} className={cell.column.alignRight ? 'mrd-amount' : ''}>
                    {cell.render('Cell')}
                  </td>
                </For>
              </tr>
            </For>
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-2">
        <select
          className="form-control form-control-sm"
          style={{ width: 110 }}
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <For each="size" of={PAGE_SIZE_OPTIONS}>
            <option key={size} value={size}>
              每頁 {size} 筆
            </option>
          </For>
        </select>
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary mr-1"
            disabled={!canPreviousPage}
            onClick={() => gotoPage(0)}
          >
            «
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary mr-2"
            disabled={!canPreviousPage}
            onClick={() => previousPage()}
          >
            上一頁
          </button>
          <span className="small text-muted">
            第 {pageIndex + 1} / {pageCount || 1} 頁
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary ml-2"
            disabled={!canNextPage}
            onClick={() => nextPage()}
          >
            下一頁
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
