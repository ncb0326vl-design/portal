import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Layout from 'Components/layout'
import CardPageTopToolBar from 'Components/cardPageTopToolBar'
import Tab from 'Components/tab'
import { getCustomers, resetShipmentInquiry } from 'Redux/actions'
import {
  SHIPMENT_INQUIRY_TABS,
  INVOICE_SUMMARY_TAB,
  SHIPMENT_EXCEPTION_TAB,
  SHIPMENT_LIST_TAB,
} from 'Constants/pageTab/logistics/shipmentQuery/shipmentInquiry'
import ShipmentListTab from './shipmentListTab'
import InvoiceSummaryTab from './invoiceSummaryTab'
import ShipmentExceptionTab from './shipmentExceptionTab'

const ShipmentInquiry = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(SHIPMENT_LIST_TAB)
  const [viewMode, setViewMode] = useState('form')

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setViewMode('form')
    dispatch(resetShipmentInquiry())
  }

  useEffect(() => {
    dispatch(getCustomers())
    return () => dispatch(resetShipmentInquiry())
  }, [])

  return (
    <Layout>
      <CardPageTopToolBar
        title="託運單查詢"
        description="查詢貴公司各託運帳號的託運單明細、每月請款彙總與配送異常。"
      />
      <Tab tabs={SHIPMENT_INQUIRY_TABS} activeTab={activeTab} onChange={handleTabChange} />
      <Choose>
        <When condition={activeTab === SHIPMENT_LIST_TAB}>
          <ShipmentListTab viewMode={viewMode} setViewMode={setViewMode} />
        </When>
        <When condition={activeTab === INVOICE_SUMMARY_TAB}>
          <InvoiceSummaryTab viewMode={viewMode} setViewMode={setViewMode} />
        </When>
        <When condition={activeTab === SHIPMENT_EXCEPTION_TAB}>
          <ShipmentExceptionTab viewMode={viewMode} setViewMode={setViewMode} />
        </When>
        <Otherwise>
          <ShipmentListTab viewMode={viewMode} setViewMode={setViewMode} />
        </Otherwise>
      </Choose>
    </Layout>
  )
}

export default ShipmentInquiry
