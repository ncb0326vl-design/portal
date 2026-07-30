export const batchImportFileName = (state) =>
  state.logistics.shipmentQuery.batchShipmentImport.fileName

export const batchImportStagingRows = (state) =>
  state.logistics.shipmentQuery.batchShipmentImport.stagingRows

export const batchImportParsing = (state) =>
  state.logistics.shipmentQuery.batchShipmentImport.parsing

export const batchImportParseError = (state) =>
  state.logistics.shipmentQuery.batchShipmentImport.parseError

export const batchImportSubmitting = (state) =>
  state.logistics.shipmentQuery.batchShipmentImport.submitting

export const batchImportSubmitResult = (state) =>
  state.logistics.shipmentQuery.batchShipmentImport.submitResult
