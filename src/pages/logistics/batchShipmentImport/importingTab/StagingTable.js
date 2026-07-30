import React from 'react'
import { useDispatch } from 'react-redux'
import { updateStagingRow, removeStagingRow } from 'Redux/actions'
import {
  IMPORT_COLUMNS,
  hasRowError,
} from 'Redux/logistics/shipmentQuery/batchShipmentImport/validation'

/**
 * Hand-written editable table — the DataTable wrapper is read-only, so the staging grid
 * predates it and was never migrated.
 */
const StagingTable = ({ rows }) => {
  const dispatch = useDispatch()

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-sm mrd-table mb-0">
        <thead>
          <tr>
            <th style={{ width: 50 }}>#</th>
            <For each="col" of={IMPORT_COLUMNS}>
              <th key={col.field}>{col.header}</th>
            </For>
            <th style={{ width: 60 }}>操作</th>
          </tr>
        </thead>
        <tbody>
          <For each="row" of={rows} index="index">
            <tr key={row.rowNo} className={hasRowError(row) ? 'mrd-row-invalid' : ''}>
              <td>{row.rowNo}</td>
              <For each="col" of={IMPORT_COLUMNS}>
                <td key={col.field}>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
                      row.errors[col.field] ? 'is-invalid' : ''
                    }`}
                    value={row[col.field] || ''}
                    onChange={(e) =>
                      dispatch(
                        updateStagingRow({ index, field: col.field, value: e.target.value })
                      )
                    }
                  />
                  <If condition={!!row.errors[col.field]}>
                    <span className="mrd-error-text">{row.errors[col.field]}</span>
                  </If>
                </td>
              </For>
              <td className="text-center">
                <button
                  type="button"
                  className="btn btn-sm btn-link text-danger p-0"
                  onClick={() => dispatch(removeStagingRow(index))}
                >
                  刪除
                </button>
              </td>
            </tr>
          </For>
        </tbody>
      </table>
    </div>
  )
}

export default StagingTable
