import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingPrompt from 'Components/loading'
import { getShipmentList } from 'Redux/actions'
import { shipmentInquiryTableDataLoading } from 'Redux/selectors'
import ShipmentListSearch from './ShipmentListSearch'
import ShipmentListResult from './ShipmentListResult'

const ShipmentListTab = ({ viewMode, setViewMode }) => {
  const dispatch = useDispatch()
  const loading = useSelector(shipmentInquiryTableDataLoading)
  const [formSnapshot, setFormSnapshot] = useState(null)

  const handleSearch = (values) => {
    setFormSnapshot(values)
    dispatch(getShipmentList(values))
    setViewMode('result')
  }

  return (
    <Choose>
      <When condition={loading}>
        <LoadingPrompt />
      </When>
      <When condition={viewMode === 'result'}>
        <ShipmentListResult formSnapshot={formSnapshot} onBack={() => setViewMode('form')} />
      </When>
      <Otherwise>
        <ShipmentListSearch onSearch={handleSearch} />
      </Otherwise>
    </Choose>
  )
}

export default ShipmentListTab
