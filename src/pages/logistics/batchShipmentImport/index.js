import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Layout from 'Components/layout'
import CardPageTopToolBar from 'Components/cardPageTopToolBar'
import { getCustomers, resetBatchShipmentImport } from 'Redux/actions'
import ImportingTab from './importingTab'

const BatchShipmentImport = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCustomers())
    return () => dispatch(resetBatchShipmentImport())
  }, [])

  return (
    <Layout>
      <CardPageTopToolBar
        title="批次託運匯入"
        description="上傳 CSV 批次建立託運單，單次上限 200 筆。"
      />
      <ImportingTab />
    </Layout>
  )
}

export default BatchShipmentImport
