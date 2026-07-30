import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingPrompt from 'Components/loading'
import { getInvoiceSummary } from 'Redux/actions'
import { shipmentInquiryTableDataLoading } from 'Redux/selectors'
import InvoiceSummarySearch from './InvoiceSummarySearch'
import InvoiceSummaryResult from './InvoiceSummaryResult'

const InvoiceSummaryTab = ({ viewMode, setViewMode }) => {
  const dispatch = useDispatch()
  const loading = useSelector(shipmentInquiryTableDataLoading)
  const [formSnapshot, setFormSnapshot] = useState(null)

  const handleSearch = (values) => {
    setFormSnapshot(values)
    dispatch(getInvoiceSummary(values))
    setViewMode('result')
  }

  return (
    <Choose>
      <When condition={loading}>
        <LoadingPrompt />
      </When>
      <When condition={viewMode === 'result'}>
        <InvoiceSummaryResult formSnapshot={formSnapshot} onBack={() => setViewMode('form')} />
      </When>
      <Otherwise>
        <InvoiceSummarySearch onSearch={handleSearch} />
      </Otherwise>
    </Choose>
  )
}

export default InvoiceSummaryTab
