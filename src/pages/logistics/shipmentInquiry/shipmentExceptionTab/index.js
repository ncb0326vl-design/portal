import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingPrompt from 'Components/loading'
import { getShipmentException } from 'Redux/actions'
import { shipmentInquiryTableDataLoading } from 'Redux/selectors'
import ShipmentExceptionSearch from './ShipmentExceptionSearch'
import ShipmentExceptionResult from './ShipmentExceptionResult'

const ShipmentExceptionTab = ({ viewMode, setViewMode }) => {
  const dispatch = useDispatch()
  const loading = useSelector(shipmentInquiryTableDataLoading)
  const [formSnapshot, setFormSnapshot] = useState(null)

  const handleSearch = (values) => {
    setFormSnapshot(values)
    dispatch(getShipmentException(values))
    setViewMode('result')
  }

  return (
    <Choose>
      <When condition={loading}>
        <LoadingPrompt />
      </When>
      <When condition={viewMode === 'result'}>
        <ShipmentExceptionResult formSnapshot={formSnapshot} onBack={() => setViewMode('form')} />
      </When>
      <Otherwise>
        <ShipmentExceptionSearch onSearch={handleSearch} />
      </Otherwise>
    </Choose>
  )
}

export default ShipmentExceptionTab
