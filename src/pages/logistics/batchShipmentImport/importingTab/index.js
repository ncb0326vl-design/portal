import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingPrompt from 'Components/loading'
import { successModal, forceMessageModal, confirmModal } from 'Components/swal'
import { submitBatchShipment, resetBatchShipmentImport } from 'Redux/actions'
import {
  batchImportStagingRows,
  batchImportParsing,
  batchImportSubmitting,
  batchImportSubmitResult,
  customerInfo,
} from 'Redux/selectors'
import { hasRowError } from 'Redux/logistics/shipmentQuery/batchShipmentImport/validation'
import ImportFile from './ImportFile'
import StagingTable from './StagingTable'

const ImportingTab = () => {
  const dispatch = useDispatch()
  const rows = useSelector(batchImportStagingRows)
  const parsing = useSelector(batchImportParsing)
  const submitting = useSelector(batchImportSubmitting)
  const submitResult = useSelector(batchImportSubmitResult)
  const customer = useSelector(customerInfo)

  const errorCount = rows.filter(hasRowError).length

  const handleSubmit = async () => {
    if (errorCount > 0) {
      forceMessageModal(`尚有 ${errorCount} 筆資料有誤，請修正後再送出。`)
      return
    }
    const result = await confirmModal(`確定送出 ${rows.length} 筆託運單？`, {
      confirmButtonText: '送出',
    })
    if (result.value) {
      dispatch(submitBatchShipment({ customerCode: customer.customerCode, rows }))
    }
  }

  React.useEffect(() => {
    if (submitResult) {
      successModal(`批次編號 ${submitResult.batchno}，共受理 ${submitResult.accepted} 筆。`)
    }
  }, [submitResult])

  if (parsing || submitting) return <LoadingPrompt text={submitting ? '送出中…' : '檔案解析中…'} />

  return (
    <div>
      <ImportFile />
      <If condition={rows.length > 0}>
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <span className="mr-3">共 {rows.length} 筆</span>
              <If condition={errorCount > 0}>
                <span className="text-danger">其中 {errorCount} 筆有誤</span>
              </If>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-link"
              onClick={() => dispatch(resetBatchShipmentImport())}
            >
              清除重新上傳
            </button>
          </div>
          <StagingTable rows={rows} />
          <div className="text-center mt-4">
            <button type="button" className="btn btn-primary px-5" onClick={handleSubmit}>
              送出
            </button>
          </div>
        </div>
      </If>
    </div>
  )
}

export default ImportingTab
