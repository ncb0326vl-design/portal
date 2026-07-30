import { all, call, put, takeLatest } from 'redux-saga/effects'
import axios from 'Util/Auth'
import { renameObjectKeysOfArray } from 'Util/Utils'
import { GET_SHIPMENT_LIST, GET_INVOICE_SUMMARY, GET_SHIPMENT_EXCEPTION } from 'ActionTypes'
import {
  getShipmentListSuccess,
  getShipmentListFailure,
  getInvoiceSummarySuccess,
  getInvoiceSummaryFailure,
  getShipmentExceptionSuccess,
  getShipmentExceptionFailure,
} from './action'

const FAKE_SHIPMENT_LIST = {
  messageid: '0',
  content: {
    data: [
      { shipno: 'MF26050003', shipdate: '2026/05/02', acctno: 'SA-88130001', svctype: 'COLD_CHAIN', origin: '高雄市小港區', dest: '花蓮縣花蓮市', weight: '307.250', freight: '10780', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050004', shipdate: '2026/05/03', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '彰化縣員林市', weight: '262.250', freight: '10970', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050006', shipdate: '2026/05/03', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '南投縣草屯鎮', weight: '119.250', freight: '2510', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26050008', shipdate: '2026/05/03', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '新北市三重區', weight: '257.750', freight: '4310', status: 'EXCEPTION', excreason: '道路中斷延誤' },
      { shipno: 'MF26050010', shipdate: '2026/05/03', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '高雄市鳳山區', weight: '181.250', freight: '3280', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050012', shipdate: '2026/05/03', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '桃園市平鎮區', weight: '165.750', freight: '3680', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050001', shipdate: '2026/05/04', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '桃園市中壢區', weight: '128.500', freight: '3200', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050002', shipdate: '2026/05/04', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '台中市西屯區', weight: '42.000', freight: '2850', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050015', shipdate: '2026/05/04', acctno: 'SA-88120003', svctype: 'COLD_CHAIN', origin: '台中市南屯區', dest: '南投縣草屯鎮', weight: '227.250', freight: '8380', status: 'EXCEPTION', excreason: '溫層異常' },
      { shipno: 'MF26050005', shipdate: '2026/05/05', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '台南市仁德區', weight: '143.000', freight: '2700', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050016', shipdate: '2026/05/05', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '台北市信義區', weight: '240.500', freight: '4230', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050007', shipdate: '2026/05/06', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '新北市三重區', weight: '310.250', freight: '11400', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050018', shipdate: '2026/05/06', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '新北市新莊區', weight: '39.000', freight: '2990', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26050020', shipdate: '2026/05/06', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '台南市新營區', weight: '460.750', freight: '7930', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050009', shipdate: '2026/05/07', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '高雄市楠梓區', weight: '121.000', freight: '2250', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050022', shipdate: '2026/05/07', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '嘉義縣朴子市', weight: '29.750', freight: '2580', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26050024', shipdate: '2026/05/07', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '台北市大安區', weight: '179.250', freight: '4050', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050011', shipdate: '2026/05/08', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '高雄市前鎮區', weight: '564.000', freight: '9750', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26050026', shipdate: '2026/05/08', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '新竹縣湖口鄉', weight: '141.500', freight: '2610', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050027', shipdate: '2026/05/08', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '桃園市蘆竹區', weight: '36.250', freight: '2690', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050029', shipdate: '2026/05/08', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '屏東縣潮州鎮', weight: '461.500', freight: '7630', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050032', shipdate: '2026/05/08', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '彰化縣鹿港鎮', weight: '515.750', freight: '8410', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050034', shipdate: '2026/05/08', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '彰化縣鹿港鎮', weight: '44.000', freight: '4480', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050035', shipdate: '2026/05/09', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '高雄市楠梓區', weight: '87.750', freight: '1670', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050037', shipdate: '2026/05/09', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '新竹市東區', weight: '397.500', freight: '7740', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050039', shipdate: '2026/05/09', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '台中市烏日區', weight: '144.750', freight: '3450', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050013', shipdate: '2026/05/10', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '台北市南港區', weight: '18.600', freight: '2400', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050040', shipdate: '2026/05/10', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '嘉義縣朴子市', weight: '40.000', freight: '3750', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050042', shipdate: '2026/05/10', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '宜蘭縣宜蘭市', weight: '33.750', freight: '3430', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050044', shipdate: '2026/05/10', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '桃園市楊梅區', weight: '423.250', freight: '9570', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050045', shipdate: '2026/05/10', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '新北市新莊區', weight: '489.750', freight: '10870', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26050014', shipdate: '2026/05/11', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '嘉義市西區', weight: '88.750', freight: '2100', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050046', shipdate: '2026/05/11', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '新北市新莊區', weight: '436.250', freight: '7060', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050047', shipdate: '2026/05/11', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '嘉義市東區', weight: '235.000', freight: '3870', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050017', shipdate: '2026/05/12', acctno: 'SA-88130001', svctype: 'COLD_CHAIN', origin: '高雄市小港區', dest: '台中市烏日區', weight: '256.000', freight: '9200', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050048', shipdate: '2026/05/12', acctno: 'SA-88140001', svctype: 'COLD_CHAIN', origin: '新竹市東區', dest: '苗栗縣竹南鎮', weight: '187.250', freight: '7780', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050019', shipdate: '2026/05/13', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '台北市信義區', weight: '15.200', freight: '1650', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050049', shipdate: '2026/05/13', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '屏東縣內埔鄉', weight: '102.750', freight: '2590', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26050050', shipdate: '2026/05/13', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '宜蘭縣宜蘭市', weight: '233.500', freight: '9540', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26050051', shipdate: '2026/05/13', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '高雄市鳳山區', weight: '170.000', freight: '3550', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050052', shipdate: '2026/05/13', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '高雄市楠梓區', weight: '70.500', freight: '1520', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050021', shipdate: '2026/05/14', acctno: 'SA-88130002', svctype: 'EXPRESS', origin: '台南市安南區', dest: '台北市松山區', weight: '22.800', freight: '2800', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050053', shipdate: '2026/05/14', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '嘉義市西區', weight: '185.250', freight: '4520', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26050054', shipdate: '2026/05/14', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '苗栗縣竹南鎮', weight: '486.000', freight: '10700', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050055', shipdate: '2026/05/14', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '台南市永康區', weight: '276.250', freight: '6060', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050056', shipdate: '2026/05/14', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '台中市大里區', weight: '100.750', freight: '2600', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050023', shipdate: '2026/05/15', acctno: 'SA-88120001', svctype: 'COLD_CHAIN', origin: '台北市內湖區', dest: '宜蘭縣羅東鎮', weight: '205.000', freight: '8300', status: 'EXCEPTION', excreason: '溫層異常' },
      { shipno: 'MF26050057', shipdate: '2026/05/15', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '新北市三重區', weight: '35.000', freight: '4030', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26050058', shipdate: '2026/05/15', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '台中市大甲區', weight: '52.000', freight: '6130', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26050059', shipdate: '2026/05/16', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '台中市烏日區', weight: '188.750', freight: '6470', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050060', shipdate: '2026/05/16', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '苗栗縣頭份市', weight: '329.500', freight: '7980', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050061', shipdate: '2026/05/16', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '基隆市七堵區', weight: '302.000', freight: '6150', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050062', shipdate: '2026/05/16', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '嘉義市西區', weight: '46.250', freight: '3740', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26050025', shipdate: '2026/05/17', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '嘉義縣民雄鄉', weight: '98.500', freight: '2050', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26050063', shipdate: '2026/05/17', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '宜蘭縣宜蘭市', weight: '196.250', freight: '4960', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050064', shipdate: '2026/05/17', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '新竹縣湖口鄉', weight: '25.500', freight: '2190', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050065', shipdate: '2026/05/17', acctno: 'SA-88140001', svctype: 'COLD_CHAIN', origin: '新竹市東區', dest: '基隆市七堵區', weight: '317.000', freight: '13080', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050028', shipdate: '2026/05/18', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '南投縣草屯鎮', weight: '132.400', freight: '2450', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050066', shipdate: '2026/05/18', acctno: 'SA-88130002', svctype: 'EXPRESS', origin: '台南市安南區', dest: '嘉義縣民雄鄉', weight: '19.750', freight: '2180', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050067', shipdate: '2026/05/18', acctno: 'SA-88130002', svctype: 'COLD_CHAIN', origin: '台南市安南區', dest: '新竹縣竹北市', weight: '264.250', freight: '9580', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26050030', shipdate: '2026/05/19', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '高雄市三民區', weight: '47.500', freight: '2600', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26050068', shipdate: '2026/05/19', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '台中市西屯區', weight: '207.750', freight: '4730', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050069', shipdate: '2026/05/19', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '宜蘭縣宜蘭市', weight: '25.250', freight: '1810', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050070', shipdate: '2026/05/19', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '新北市新莊區', weight: '206.250', freight: '3760', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050031', shipdate: '2026/05/20', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '桃園市中壢區', weight: '94.000', freight: '1850', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050071', shipdate: '2026/05/20', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '苗栗縣頭份市', weight: '34.500', freight: '2670', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050072', shipdate: '2026/05/20', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '桃園市龜山區', weight: '449.750', freight: '10870', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050033', shipdate: '2026/05/21', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '新竹市東區', weight: '96.000', freight: '1980', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050073', shipdate: '2026/05/21', acctno: 'SA-88140001', svctype: 'COLD_CHAIN', origin: '新竹市東區', dest: '桃園市平鎮區', weight: '276.500', freight: '11350', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050074', shipdate: '2026/05/22', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '台中市西屯區', weight: '395.500', freight: '9070', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050075', shipdate: '2026/05/22', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '南投縣南投市', weight: '25.250', freight: '2540', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050036', shipdate: '2026/05/23', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '台中市大甲區', weight: '105.000', freight: '2150', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26050076', shipdate: '2026/05/23', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '新竹市北區', weight: '35.500', freight: '2340', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050077', shipdate: '2026/05/24', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '南投縣南投市', weight: '8.500', freight: '1150', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050078', shipdate: '2026/05/24', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '屏東縣屏東市', weight: '482.250', freight: '8070', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050079', shipdate: '2026/05/24', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '桃園市八德區', weight: '84.500', freight: '2190', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050038', shipdate: '2026/05/25', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '彰化縣和美鎮', weight: '187.000', freight: '3150', status: 'EXCEPTION', excreason: '道路中斷延誤' },
      { shipno: 'MF26050080', shipdate: '2026/05/25', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '台中市大里區', weight: '261.500', freight: '9910', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26050081', shipdate: '2026/05/25', acctno: 'SA-88130001', svctype: 'COLD_CHAIN', origin: '高雄市小港區', dest: '高雄市左營區', weight: '260.250', freight: '10410', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26050082', shipdate: '2026/05/25', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '屏東縣屏東市', weight: '286.750', freight: '4600', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050041', shipdate: '2026/05/26', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '台南市安平區', weight: '33.600', freight: '4100', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050083', shipdate: '2026/05/26', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '台南市新營區', weight: '312.000', freight: '7270', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050084', shipdate: '2026/05/26', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '雲林縣斗六市', weight: '148.750', freight: '3410', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050043', shipdate: '2026/05/27', acctno: 'SA-88140001', svctype: 'COLD_CHAIN', origin: '新竹市東區', dest: '台中市豐原區', weight: '231.000', freight: '8400', status: 'EXCEPTION', excreason: '溫層異常' },
      { shipno: 'MF26050085', shipdate: '2026/05/27', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '嘉義市東區', weight: '28.250', freight: '3370', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050086', shipdate: '2026/05/27', acctno: 'SA-88130002', svctype: 'EXPRESS', origin: '台南市安南區', dest: '新竹市北區', weight: '48.750', freight: '4890', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26050087', shipdate: '2026/05/29', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '苗栗縣竹南鎮', weight: '88.250', freight: '1500', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050088', shipdate: '2026/05/29', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '雲林縣虎尾鎮', weight: '275.250', freight: '6700', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050089', shipdate: '2026/05/29', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '台中市南區', weight: '492.750', freight: '12390', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26050090', shipdate: '2026/05/29', acctno: 'SA-88130002', svctype: 'COLD_CHAIN', origin: '台南市安南區', dest: '桃園市中壢區', weight: '228.500', freight: '8100', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060001', shipdate: '2026/06/01', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '嘉義縣民雄鄉', weight: '12.250', freight: '1150', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060002', shipdate: '2026/06/01', acctno: 'SA-88130001', svctype: 'COLD_CHAIN', origin: '高雄市小港區', dest: '高雄市左營區', weight: '252.500', freight: '9660', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060004', shipdate: '2026/06/01', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '桃園市龜山區', weight: '112.500', freight: '2730', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060003', shipdate: '2026/06/02', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '桃園市龜山區', weight: '178.900', freight: '3450', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060005', shipdate: '2026/06/02', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '高雄市楠梓區', weight: '394.500', freight: '8130', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060006', shipdate: '2026/06/03', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '台北市內湖區', weight: '28.400', freight: '3300', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060007', shipdate: '2026/06/03', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '彰化縣和美鎮', weight: '402.000', freight: '6520', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060009', shipdate: '2026/06/03', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '基隆市仁愛區', weight: '456.500', freight: '9160', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060011', shipdate: '2026/06/03', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '桃園市平鎮區', weight: '24.250', freight: '1680', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060013', shipdate: '2026/06/03', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '屏東縣潮州鎮', weight: '402.250', freight: '7040', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26060008', shipdate: '2026/06/04', acctno: 'SA-88120003', svctype: 'COLD_CHAIN', origin: '台中市南屯區', dest: '彰化縣員林市', weight: '260.500', freight: '9600', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060015', shipdate: '2026/06/04', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '台中市南區', weight: '37.750', freight: '3180', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060010', shipdate: '2026/06/05', acctno: 'SA-88130002', svctype: 'COLD_CHAIN', origin: '台南市安南區', dest: '新北市板橋區', weight: '243.500', freight: '8900', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060016', shipdate: '2026/06/05', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '台中市大里區', weight: '34.000', freight: '2630', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060018', shipdate: '2026/06/06', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '高雄市三民區', weight: '238.750', freight: '6120', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060020', shipdate: '2026/06/06', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '台南市仁德區', weight: '40.500', freight: '3520', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060022', shipdate: '2026/06/06', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '屏東縣潮州鎮', weight: '36.000', freight: '3790', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060023', shipdate: '2026/06/06', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '高雄市岡山區', weight: '266.250', freight: '6780', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060025', shipdate: '2026/06/07', acctno: 'SA-88120001', svctype: 'COLD_CHAIN', origin: '台北市內湖區', dest: '台北市南港區', weight: '260.500', freight: '10730', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26060028', shipdate: '2026/06/07', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '屏東縣內埔鄉', weight: '14.250', freight: '1150', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26060030', shipdate: '2026/06/07', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '嘉義市東區', weight: '415.000', freight: '9770', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060032', shipdate: '2026/06/07', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '新北市新莊區', weight: '445.750', freight: '9450', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060012', shipdate: '2026/06/08', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '苗栗縣頭份市', weight: '112.000', freight: '2260', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26060033', shipdate: '2026/06/08', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '高雄市鳳山區', weight: '17.750', freight: '1530', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060034', shipdate: '2026/06/08', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '苗栗縣頭份市', weight: '41.000', freight: '4790', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060036', shipdate: '2026/06/08', acctno: 'SA-88130002', svctype: 'COLD_CHAIN', origin: '台南市安南區', dest: '彰化縣和美鎮', weight: '281.500', freight: '11090', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060039', shipdate: '2026/06/08', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '新北市板橋區', weight: '44.000', freight: '4050', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26060041', shipdate: '2026/06/08', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '高雄市三民區', weight: '16.000', freight: '1850', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26060014', shipdate: '2026/06/09', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '苗栗縣竹南鎮', weight: '76.500', freight: '1650', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060042', shipdate: '2026/06/09', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '基隆市仁愛區', weight: '224.750', freight: '8510', status: 'EXCEPTION', excreason: '溫層異常' },
      { shipno: 'MF26060043', shipdate: '2026/06/09', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '新北市新店區', weight: '115.750', freight: '2360', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26060044', shipdate: '2026/06/09', acctno: 'SA-88130002', svctype: 'EXPRESS', origin: '台南市安南區', dest: '高雄市三民區', weight: '50.500', freight: '3250', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26060045', shipdate: '2026/06/09', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '台北市文山區', weight: '92.500', freight: '1480', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060017', shipdate: '2026/06/10', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '基隆市仁愛區', weight: '8.400', freight: '1200', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060046', shipdate: '2026/06/10', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '南投縣草屯鎮', weight: '28.750', freight: '1690', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060047', shipdate: '2026/06/10', acctno: 'SA-88130002', svctype: 'EXPRESS', origin: '台南市安南區', dest: '屏東縣屏東市', weight: '35.000', freight: '2360', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060048', shipdate: '2026/06/10', acctno: 'SA-88130002', svctype: 'COLD_CHAIN', origin: '台南市安南區', dest: '桃園市中壢區', weight: '294.750', freight: '10370', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060049', shipdate: '2026/06/11', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '新竹縣湖口鄉', weight: '400.250', freight: '8690', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060050', shipdate: '2026/06/11', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '嘉義市西區', weight: '214.000', freight: '4670', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060051', shipdate: '2026/06/11', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '苗栗縣竹南鎮', weight: '83.500', freight: '1480', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26060052', shipdate: '2026/06/11', acctno: 'SA-88140001', svctype: 'COLD_CHAIN', origin: '新竹市東區', dest: '台北市松山區', weight: '190.000', freight: '7250', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060019', shipdate: '2026/06/12', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '屏東縣內埔鄉', weight: '175.000', freight: '2900', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060053', shipdate: '2026/06/12', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '基隆市仁愛區', weight: '309.250', freight: '5740', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060054', shipdate: '2026/06/12', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '新北市板橋區', weight: '249.500', freight: '10560', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060055', shipdate: '2026/06/12', acctno: 'SA-88120003', svctype: 'COLD_CHAIN', origin: '台中市南屯區', dest: '桃園市楊梅區', weight: '213.000', freight: '7910', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060056', shipdate: '2026/06/12', acctno: 'SA-88140001', svctype: 'COLD_CHAIN', origin: '新竹市東區', dest: '花蓮縣花蓮市', weight: '264.500', freight: '9790', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060021', shipdate: '2026/06/13', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '嘉義市東區', weight: '88.000', freight: '1900', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060057', shipdate: '2026/06/13', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '彰化縣鹿港鎮', weight: '404.000', freight: '9510', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060058', shipdate: '2026/06/13', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '新北市板橋區', weight: '28.250', freight: '1690', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060059', shipdate: '2026/06/13', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '台北市士林區', weight: '156.750', freight: '3430', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060060', shipdate: '2026/06/13', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '台中市西屯區', weight: '167.000', freight: '4100', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060061', shipdate: '2026/06/13', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '高雄市左營區', weight: '87.000', freight: '2260', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060062', shipdate: '2026/06/14', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '嘉義縣民雄鄉', weight: '24.000', freight: '2440', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060063', shipdate: '2026/06/14', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '高雄市左營區', weight: '222.500', freight: '4780', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060064', shipdate: '2026/06/14', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '宜蘭縣宜蘭市', weight: '90.250', freight: '1710', status: 'EXCEPTION', excreason: '道路中斷延誤' },
      { shipno: 'MF26060065', shipdate: '2026/06/14', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '台中市南區', weight: '30.750', freight: '2930', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060066', shipdate: '2026/06/14', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '台東縣台東市', weight: '248.250', freight: '4380', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060024', shipdate: '2026/06/15', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '雲林縣斗六市', weight: '145.300', freight: '2680', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060067', shipdate: '2026/06/15', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '高雄市楠梓區', weight: '93.250', freight: '2370', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060068', shipdate: '2026/06/15', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '新北市三重區', weight: '459.750', freight: '8350', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060026', shipdate: '2026/06/16', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '台北市大同區', weight: '25.200', freight: '2600', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060027', shipdate: '2026/06/17', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '台南市東區', weight: '168.000', freight: '3050', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26060069', shipdate: '2026/06/17', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '台北市南港區', weight: '461.000', freight: '8320', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060070', shipdate: '2026/06/17', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '南投縣南投市', weight: '98.250', freight: '2440', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060029', shipdate: '2026/06/18', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '台北市士林區', weight: '188.750', freight: '7200', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060071', shipdate: '2026/06/18', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '高雄市前鎮區', weight: '36.250', freight: '3110', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060031', shipdate: '2026/06/19', acctno: 'SA-88130001', svctype: 'COLD_CHAIN', origin: '高雄市小港區', dest: '桃園市平鎮區', weight: '288.000', freight: '10500', status: 'EXCEPTION', excreason: '溫層異常' },
      { shipno: 'MF26060072', shipdate: '2026/06/19', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '高雄市左營區', weight: '204.750', freight: '4730', status: 'EXCEPTION', excreason: '道路中斷延誤' },
      { shipno: 'MF26060073', shipdate: '2026/06/19', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '彰化縣和美鎮', weight: '250.000', freight: '5420', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060074', shipdate: '2026/06/20', acctno: 'SA-88120003', svctype: 'COLD_CHAIN', origin: '台中市南屯區', dest: '新北市新店區', weight: '198.750', freight: '7450', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060075', shipdate: '2026/06/20', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '宜蘭縣羅東鎮', weight: '235.500', freight: '3860', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060076', shipdate: '2026/06/21', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '台中市大里區', weight: '47.750', freight: '4740', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060077', shipdate: '2026/06/21', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '雲林縣虎尾鎮', weight: '39.500', freight: '3080', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26060078', shipdate: '2026/06/21', acctno: 'SA-88140001', svctype: 'COLD_CHAIN', origin: '新竹市東區', dest: '台東縣台東市', weight: '273.500', freight: '10860', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060035', shipdate: '2026/06/22', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '花蓮縣吉安鄉', weight: '402.000', freight: '12800', status: 'EXCEPTION', excreason: '道路中斷延誤' },
      { shipno: 'MF26060079', shipdate: '2026/06/22', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '嘉義縣民雄鄉', weight: '210.250', freight: '4390', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060080', shipdate: '2026/06/22', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '屏東縣屏東市', weight: '489.250', freight: '10650', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060037', shipdate: '2026/06/23', acctno: 'SA-88130002', svctype: 'EXPRESS', origin: '台南市安南區', dest: '台中市北區', weight: '31.500', freight: '2950', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26060081', shipdate: '2026/06/23', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '高雄市鳳山區', weight: '145.250', freight: '3580', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060082', shipdate: '2026/06/23', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '新北市三重區', weight: '42.250', freight: '3890', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060038', shipdate: '2026/06/24', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '宜蘭縣宜蘭市', weight: '163.000', freight: '3400', status: 'EXCEPTION', excreason: '道路中斷延誤' },
      { shipno: 'MF26060083', shipdate: '2026/06/24', acctno: 'SA-88130002', svctype: 'EXPRESS', origin: '台南市安南區', dest: '桃園市龜山區', weight: '42.500', freight: '4420', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060040', shipdate: '2026/06/25', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '台北市大安區', weight: '21.500', freight: '2400', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060084', shipdate: '2026/06/25', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '花蓮縣花蓮市', weight: '178.750', freight: '2990', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26060085', shipdate: '2026/06/26', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '台中市烏日區', weight: '19.750', freight: '1380', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26060086', shipdate: '2026/06/26', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '宜蘭縣宜蘭市', weight: '31.000', freight: '2670', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060087', shipdate: '2026/06/26', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '花蓮縣花蓮市', weight: '381.750', freight: '7360', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26060088', shipdate: '2026/06/28', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '高雄市鳳山區', weight: '112.500', freight: '2840', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060089', shipdate: '2026/06/29', acctno: 'SA-88120001', svctype: 'COLD_CHAIN', origin: '台北市內湖區', dest: '彰化縣和美鎮', weight: '187.500', freight: '7070', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26060090', shipdate: '2026/06/29', acctno: 'SA-88130002', svctype: 'COLD_CHAIN', origin: '台南市安南區', dest: '雲林縣虎尾鎮', weight: '251.250', freight: '10000', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070002', shipdate: '2026/07/01', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '桃園市中壢區', weight: '156.200', freight: '3100', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070004', shipdate: '2026/07/02', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '台南市永康區', weight: '132.000', freight: '2400', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070006', shipdate: '2026/07/03', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '新北市新莊區', weight: '73.800', freight: '1740', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070007', shipdate: '2026/07/05', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '台中市烏日區', weight: '366.250', freight: '6540', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26070009', shipdate: '2026/07/05', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '宜蘭縣羅東鎮', weight: '108.000', freight: '2290', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070011', shipdate: '2026/07/05', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '台北市士林區', weight: '292.750', freight: '7340', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070013', shipdate: '2026/07/05', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '台北市文山區', weight: '327.500', freight: '5880', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070014', shipdate: '2026/07/05', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '台北市南港區', weight: '370.750', freight: '8950', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26070008', shipdate: '2026/07/06', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '高雄市鳥松區', weight: '116.500', freight: '2200', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070016', shipdate: '2026/07/06', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '新北市汐止區', weight: '36.500', freight: '3780', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070010', shipdate: '2026/07/07', acctno: 'SA-88120003', svctype: 'COLD_CHAIN', origin: '台中市南屯區', dest: '高雄市鳳山區', weight: '298.000', freight: '10900', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070017', shipdate: '2026/07/07', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '桃園市八德區', weight: '396.500', freight: '6700', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070019', shipdate: '2026/07/07', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '屏東縣內埔鄉', weight: '38.000', freight: '2980', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070020', shipdate: '2026/07/07', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '彰化縣鹿港鎮', weight: '14.000', freight: '1480', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070012', shipdate: '2026/07/08', acctno: 'SA-88140001', svctype: 'COLD_CHAIN', origin: '新竹市東區', dest: '高雄市左營區', weight: '267.500', freight: '10300', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070022', shipdate: '2026/07/08', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '桃園市中壢區', weight: '466.500', freight: '8640', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070023', shipdate: '2026/07/08', acctno: 'SA-88130002', svctype: 'EXPRESS', origin: '台南市安南區', dest: '新竹市北區', weight: '41.250', freight: '4020', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070015', shipdate: '2026/07/09', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '台中市北屯區', weight: '38.100', freight: '2950', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070025', shipdate: '2026/07/09', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '桃園市八德區', weight: '32.000', freight: '2120', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070028', shipdate: '2026/07/09', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '桃園市龜山區', weight: '263.500', freight: '9180', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070030', shipdate: '2026/07/09', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '新北市中和區', weight: '24.000', freight: '1450', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070031', shipdate: '2026/07/09', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '高雄市前鎮區', weight: '393.500', freight: '7300', status: 'EXCEPTION', excreason: '道路中斷延誤' },
      { shipno: 'MF26070033', shipdate: '2026/07/10', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '台北市大安區', weight: '107.750', freight: '2080', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26070035', shipdate: '2026/07/10', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '台北市士林區', weight: '27.750', freight: '2250', status: 'DELIVERED', excreason: '' },
      { shipno: 'MF26070018', shipdate: '2026/07/11', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '台中市西區', weight: '36.000', freight: '3100', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070037', shipdate: '2026/07/11', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '台南市新營區', weight: '151.750', freight: '2500', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070039', shipdate: '2026/07/11', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '新北市中和區', weight: '33.000', freight: '2630', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070041', shipdate: '2026/07/11', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '新竹縣湖口鄉', weight: '253.250', freight: '5730', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070042', shipdate: '2026/07/11', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '台北市萬華區', weight: '226.250', freight: '8380', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070043', shipdate: '2026/07/11', acctno: 'SA-88130002', svctype: 'COLD_CHAIN', origin: '台南市安南區', dest: '新北市淡水區', weight: '258.250', freight: '10090', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070045', shipdate: '2026/07/12', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '高雄市楠梓區', weight: '11.250', freight: '1150', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26070021', shipdate: '2026/07/13', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '新竹縣竹北市', weight: '124.600', freight: '2380', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26070046', shipdate: '2026/07/13', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '台北市大安區', weight: '235.250', freight: '4090', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070047', shipdate: '2026/07/13', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '台北市士林區', weight: '27.250', freight: '1950', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26070048', shipdate: '2026/07/13', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '新北市板橋區', weight: '234.750', freight: '4970', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070049', shipdate: '2026/07/13', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '新北市淡水區', weight: '496.750', freight: '11220', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26070050', shipdate: '2026/07/13', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '高雄市岡山區', weight: '457.750', freight: '9120', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070051', shipdate: '2026/07/13', acctno: 'SA-88140001', svctype: 'COLD_CHAIN', origin: '新竹市東區', dest: '花蓮縣吉安鄉', weight: '295.000', freight: '10140', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070052', shipdate: '2026/07/14', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '新北市中和區', weight: '251.500', freight: '6230', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070053', shipdate: '2026/07/14', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '高雄市楠梓區', weight: '34.250', freight: '4080', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070054', shipdate: '2026/07/14', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '基隆市仁愛區', weight: '96.250', freight: '1890', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070055', shipdate: '2026/07/14', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '新竹縣竹北市', weight: '447.000', freight: '7180', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070056', shipdate: '2026/07/14', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '嘉義縣民雄鄉', weight: '303.250', freight: '7030', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070024', shipdate: '2026/07/15', acctno: 'SA-88130002', svctype: 'COLD_CHAIN', origin: '台南市安南區', dest: '桃園市蘆竹區', weight: '274.000', freight: '10100', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070057', shipdate: '2026/07/15', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '宜蘭縣宜蘭市', weight: '14.750', freight: '1420', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070058', shipdate: '2026/07/15', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '台北市萬華區', weight: '24.500', freight: '2800', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070059', shipdate: '2026/07/15', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '新竹市東區', weight: '133.000', freight: '2510', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26070060', shipdate: '2026/07/15', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '台東縣台東市', weight: '19.000', freight: '1150', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070061', shipdate: '2026/07/15', acctno: 'SA-88130001', svctype: 'COLD_CHAIN', origin: '高雄市小港區', dest: '台南市中西區', weight: '307.000', freight: '11190', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070026', shipdate: '2026/07/16', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '台南市中西區', weight: '128.000', freight: '2500', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070027', shipdate: '2026/07/16', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '屏東縣屏東市', weight: '487.500', freight: '11250', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070062', shipdate: '2026/07/16', acctno: 'SA-88120001', svctype: 'COLD_CHAIN', origin: '台北市內湖區', dest: '新北市中和區', weight: '297.250', freight: '12620', status: 'EXCEPTION', excreason: '道路中斷延誤' },
      { shipno: 'MF26070063', shipdate: '2026/07/16', acctno: 'SA-88130001', svctype: 'COLD_CHAIN', origin: '高雄市小港區', dest: '台東縣台東市', weight: '275.000', freight: '9830', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26070064', shipdate: '2026/07/16', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '桃園市楊梅區', weight: '409.000', freight: '9500', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070029', shipdate: '2026/07/17', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '雲林縣虎尾鎮', weight: '154.500', freight: '2750', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26070065', shipdate: '2026/07/17', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '新北市三重區', weight: '226.750', freight: '3910', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070032', shipdate: '2026/07/18', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '台北市中山區', weight: '19.900', freight: '2200', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070066', shipdate: '2026/07/18', acctno: 'SA-88130001', svctype: 'COLD_CHAIN', origin: '高雄市小港區', dest: '台南市中西區', weight: '243.750', freight: '9150', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26070067', shipdate: '2026/07/18', acctno: 'SA-88140001', svctype: 'COLD_CHAIN', origin: '新竹市東區', dest: '台南市仁德區', weight: '286.000', freight: '11030', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26070034', shipdate: '2026/07/19', acctno: 'SA-88120003', svctype: 'COLD_CHAIN', origin: '台中市南屯區', dest: '屏東縣潮州鎮', weight: '212.500', freight: '8600', status: 'EXCEPTION', excreason: '溫層異常' },
      { shipno: 'MF26070068', shipdate: '2026/07/20', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '新竹市北區', weight: '23.500', freight: '1650', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070069', shipdate: '2026/07/20', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '台北市南港區', weight: '449.500', freight: '8190', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26070070', shipdate: '2026/07/20', acctno: 'SA-88120003', svctype: 'COLD_CHAIN', origin: '台中市南屯區', dest: '新竹縣湖口鄉', weight: '273.500', freight: '11210', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070071', shipdate: '2026/07/20', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '台南市仁德區', weight: '257.500', freight: '5780', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26070036', shipdate: '2026/07/21', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '台中市南屯區', weight: '33.800', freight: '2900', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26070072', shipdate: '2026/07/21', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '新北市汐止區', weight: '315.500', freight: '7740', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070073', shipdate: '2026/07/21', acctno: 'SA-88140001', svctype: 'COLD_CHAIN', origin: '新竹市東區', dest: '彰化縣員林市', weight: '267.500', freight: '10410', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070038', shipdate: '2026/07/22', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '台南市永康區', weight: '221.000', freight: '9100', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070074', shipdate: '2026/07/22', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '嘉義市東區', weight: '30.500', freight: '3270', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070075', shipdate: '2026/07/22', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '新北市板橋區', weight: '19.750', freight: '1170', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070040', shipdate: '2026/07/23', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '南投縣南投市', weight: '142.000', freight: '2650', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26070076', shipdate: '2026/07/23', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '台北市南港區', weight: '48.250', freight: '3360', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070077', shipdate: '2026/07/23', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '基隆市仁愛區', weight: '189.000', freight: '6670', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070078', shipdate: '2026/07/23', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '新北市中和區', weight: '30.000', freight: '2650', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070079', shipdate: '2026/07/24', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '花蓮縣花蓮市', weight: '8.500', freight: '1150', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070080', shipdate: '2026/07/24', acctno: 'SA-88130002', svctype: 'COLD_CHAIN', origin: '台南市安南區', dest: '台南市仁德區', weight: '257.250', freight: '9970', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26070081', shipdate: '2026/07/24', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '台南市永康區', weight: '20.250', freight: '1340', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26070044', shipdate: '2026/07/25', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '台東縣台東市', weight: '240.000', freight: '5600', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26070082', shipdate: '2026/07/25', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '嘉義縣民雄鄉', weight: '302.250', freight: '5500', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070083', shipdate: '2026/07/26', acctno: 'SA-88120001', svctype: 'COLD_CHAIN', origin: '台北市內湖區', dest: '嘉義市西區', weight: '224.750', freight: '9580', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070084', shipdate: '2026/07/26', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '台中市豐原區', weight: '69.500', freight: '1620', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070085', shipdate: '2026/07/26', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '高雄市前鎮區', weight: '33.250', freight: '3730', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070086', shipdate: '2026/07/26', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '嘉義縣朴子市', weight: '477.000', freight: '10880', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070087', shipdate: '2026/07/27', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '台南市永康區', weight: '11.500', freight: '1150', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070088', shipdate: '2026/07/27', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '嘉義縣朴子市', weight: '46.750', freight: '5040', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070089', shipdate: '2026/07/27', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '屏東縣內埔鄉', weight: '450.000', freight: '10700', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070090', shipdate: '2026/07/27', acctno: 'SA-88130002', svctype: 'COLD_CHAIN', origin: '台南市安南區', dest: '台北市松山區', weight: '255.750', freight: '10920', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070091', shipdate: '2026/07/27', acctno: 'SA-88130002', svctype: 'EXPRESS', origin: '台南市安南區', dest: '台北市中山區', weight: '28.500', freight: '1970', status: 'EXCEPTION', excreason: '道路中斷延誤' },
      { shipno: 'MF26070092', shipdate: '2026/07/27', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '台中市北屯區', weight: '123.750', freight: '2070', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070093', shipdate: '2026/07/28', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '新竹縣湖口鄉', weight: '218.250', freight: '5600', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26070094', shipdate: '2026/07/29', acctno: 'SA-88120003', svctype: 'COLD_CHAIN', origin: '台中市南屯區', dest: '彰化縣鹿港鎮', weight: '293.500', freight: '10620', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070095', shipdate: '2026/07/29', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '基隆市仁愛區', weight: '136.000', freight: '2360', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26070096', shipdate: '2026/07/29', acctno: 'SA-88140001', svctype: 'EXPRESS', origin: '新竹市東區', dest: '新竹縣竹北市', weight: '8.000', freight: '1150', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26070097', shipdate: '2026/07/30', acctno: 'SA-88120001', svctype: 'COLD_CHAIN', origin: '台北市內湖區', dest: '彰化縣鹿港鎮', weight: '200.500', freight: '7070', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070098', shipdate: '2026/07/30', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '南投縣南投市', weight: '501.000', freight: '10090', status: 'PENDING', excreason: '' },
      { shipno: 'MF26070099', shipdate: '2026/07/31', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '苗栗縣頭份市', weight: '386.750', freight: '7540', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080001', shipdate: '2026/08/01', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '苗栗縣竹南鎮', weight: '140.500', freight: '3160', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080002', shipdate: '2026/08/01', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '基隆市七堵區', weight: '46.000', freight: '3990', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26080003', shipdate: '2026/08/01', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '高雄市鳳山區', weight: '101.250', freight: '2220', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080004', shipdate: '2026/08/01', acctno: 'SA-88130002', svctype: 'COLD_CHAIN', origin: '台南市安南區', dest: '高雄市左營區', weight: '308.750', freight: '10750', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080005', shipdate: '2026/08/01', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '花蓮縣花蓮市', weight: '138.000', freight: '3150', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080006', shipdate: '2026/08/02', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '高雄市前鎮區', weight: '263.250', freight: '5400', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080007', shipdate: '2026/08/02', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '南投縣南投市', weight: '281.000', freight: '6480', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080008', shipdate: '2026/08/02', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '台南市新營區', weight: '226.000', freight: '9280', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080009', shipdate: '2026/08/02', acctno: 'SA-88120002', svctype: 'COLD_CHAIN', origin: '桃園市大園區', dest: '台中市烏日區', weight: '175.000', freight: '6330', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080010', shipdate: '2026/08/02', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '高雄市前鎮區', weight: '402.750', freight: '7880', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080011', shipdate: '2026/08/02', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '台北市松山區', weight: '19.000', freight: '1590', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26080012', shipdate: '2026/08/02', acctno: 'SA-88120003', svctype: 'EXPRESS', origin: '台中市南屯區', dest: '彰化縣員林市', weight: '26.500', freight: '2980', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26080013', shipdate: '2026/08/02', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '新北市新店區', weight: '107.250', freight: '2520', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080014', shipdate: '2026/08/02', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '新北市汐止區', weight: '214.000', freight: '4020', status: 'EXCEPTION', excreason: '收件人拒收' },
      { shipno: 'MF26080015', shipdate: '2026/08/02', acctno: 'SA-88130001', svctype: 'STANDARD', origin: '高雄市小港區', dest: '台南市中西區', weight: '291.500', freight: '6740', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080016', shipdate: '2026/08/02', acctno: 'SA-88130002', svctype: 'EXPRESS', origin: '台南市安南區', dest: '苗栗縣頭份市', weight: '43.000', freight: '3010', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26080017', shipdate: '2026/08/02', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '新竹市北區', weight: '156.000', freight: '4010', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26080018', shipdate: '2026/08/02', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '台東縣台東市', weight: '510.500', freight: '11150', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080019', shipdate: '2026/08/02', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '屏東縣內埔鄉', weight: '460.000', freight: '10030', status: 'IN_TRANSIT', excreason: '' },
      { shipno: 'MF26080020', shipdate: '2026/08/03', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '高雄市岡山區', weight: '42.250', freight: '3390', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080021', shipdate: '2026/08/03', acctno: 'SA-88120001', svctype: 'EXPRESS', origin: '台北市內湖區', dest: '南投縣南投市', weight: '33.500', freight: '2980', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26080022', shipdate: '2026/08/03', acctno: 'SA-88120001', svctype: 'STANDARD', origin: '台北市內湖區', dest: '台北市大安區', weight: '257.000', freight: '5780', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080023', shipdate: '2026/08/03', acctno: 'SA-88120002', svctype: 'STANDARD', origin: '桃園市大園區', dest: '台南市中西區', weight: '294.500', freight: '4890', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080024', shipdate: '2026/08/03', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '宜蘭縣羅東鎮', weight: '178.000', freight: '3710', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080025', shipdate: '2026/08/03', acctno: 'SA-88130001', svctype: 'EXPRESS', origin: '高雄市小港區', dest: '宜蘭縣宜蘭市', weight: '14.750', freight: '1150', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080026', shipdate: '2026/08/03', acctno: 'SA-88130002', svctype: 'EXPRESS', origin: '台南市安南區', dest: '台南市永康區', weight: '11.250', freight: '1150', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080027', shipdate: '2026/08/03', acctno: 'SA-88140001', svctype: 'STANDARD', origin: '新竹市東區', dest: '屏東縣內埔鄉', weight: '289.000', freight: '4660', status: 'EXCEPTION', excreason: '收件人地址不符' },
      { shipno: 'MF26080028', shipdate: '2026/08/04', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '台中市北屯區', weight: '50.250', freight: '5140', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080029', shipdate: '2026/08/04', acctno: 'SA-88120002', svctype: 'EXPRESS', origin: '桃園市大園區', dest: '南投縣草屯鎮', weight: '20.000', freight: '2060', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080030', shipdate: '2026/08/04', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '屏東縣屏東市', weight: '278.250', freight: '5870', status: 'EXCEPTION', excreason: '包裝破損' },
      { shipno: 'MF26080031', shipdate: '2026/08/04', acctno: 'SA-88120003', svctype: 'STANDARD', origin: '台中市南屯區', dest: '新北市三重區', weight: '485.500', freight: '12360', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080032', shipdate: '2026/08/04', acctno: 'SA-88130001', svctype: 'COLD_CHAIN', origin: '高雄市小港區', dest: '新竹市北區', weight: '246.750', freight: '9480', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080033', shipdate: '2026/08/04', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '台中市大甲區', weight: '408.000', freight: '7540', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080034', shipdate: '2026/08/04', acctno: 'SA-88130002', svctype: 'STANDARD', origin: '台南市安南區', dest: '花蓮縣吉安鄉', weight: '274.000', freight: '4990', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080035', shipdate: '2026/08/04', acctno: 'SA-88130002', svctype: 'EXPRESS', origin: '台南市安南區', dest: '雲林縣斗六市', weight: '27.000', freight: '2710', status: 'PENDING', excreason: '' },
      { shipno: 'MF26080036', shipdate: '2026/08/04', acctno: 'SA-88140001', svctype: 'COLD_CHAIN', origin: '新竹市東區', dest: '桃園市蘆竹區', weight: '229.250', freight: '9110', status: 'PENDING', excreason: '' },
    ],
  },
}

const FAKE_INVOICE_SUMMARY = {
  messageid: '0',
  content: {
    data: [
      { billmonth: '2026/05', acctno: 'SA-88120001', shipcnt: '10', totalweight: '1335.850', totalfreight: '39240', billstatus: '已結帳' },
      { billmonth: '2026/05', acctno: 'SA-88120002', shipcnt: '11', totalweight: '2196.950', totalfreight: '63750', billstatus: '已結帳' },
      { billmonth: '2026/05', acctno: 'SA-88120003', shipcnt: '12', totalweight: '2636.650', totalfreight: '59400', billstatus: '已結帳' },
      { billmonth: '2026/05', acctno: 'SA-88130001', shipcnt: '10', totalweight: '1890.000', totalfreight: '50940', billstatus: '已結帳' },
      { billmonth: '2026/05', acctno: 'SA-88130002', shipcnt: '11', totalweight: '2326.300', totalfreight: '57830', billstatus: '已結帳' },
      { billmonth: '2026/05', acctno: 'SA-88140001', shipcnt: '13', totalweight: '2672.100', totalfreight: '74160', billstatus: '已結帳' },
      { billmonth: '2026/06', acctno: 'SA-88120001', shipcnt: '12', totalweight: '2910.550', totalfreight: '65840', billstatus: '已結帳' },
      { billmonth: '2026/06', acctno: 'SA-88120002', shipcnt: '9', totalweight: '1414.250', totalfreight: '50370', billstatus: '已結帳' },
      { billmonth: '2026/06', acctno: 'SA-88120003', shipcnt: '11', totalweight: '1696.050', totalfreight: '54790', billstatus: '已結帳' },
      { billmonth: '2026/06', acctno: 'SA-88130001', shipcnt: '13', totalweight: '1405.150', totalfreight: '47370', billstatus: '已結帳' },
      { billmonth: '2026/06', acctno: 'SA-88130002', shipcnt: '13', totalweight: '2684.500', totalfreight: '78920', billstatus: '已結帳' },
      { billmonth: '2026/06', acctno: 'SA-88140001', shipcnt: '11', totalweight: '2163.950', totalfreight: '64630', billstatus: '已結帳' },
      { billmonth: '2026/07', acctno: 'SA-88120001', shipcnt: '13', totalweight: '1743.300', totalfreight: '59300', billstatus: '未結帳' },
      { billmonth: '2026/07', acctno: 'SA-88120002', shipcnt: '13', totalweight: '1879.800', totalfreight: '58680', billstatus: '未結帳' },
      { billmonth: '2026/07', acctno: 'SA-88120003', shipcnt: '13', totalweight: '3355.400', totalfreight: '86610', billstatus: '未結帳' },
      { billmonth: '2026/07', acctno: 'SA-88130001', shipcnt: '11', totalweight: '1606.250', totalfreight: '49790', billstatus: '未結帳' },
      { billmonth: '2026/07', acctno: 'SA-88130002', shipcnt: '12', totalweight: '3332.750', totalfreight: '90420', billstatus: '未結帳' },
      { billmonth: '2026/07', acctno: 'SA-88140001', shipcnt: '9', totalweight: '1517.500', totalfreight: '50750', billstatus: '未結帳' },
      { billmonth: '2026/08', acctno: 'SA-88120001', shipcnt: '5', totalweight: '984.000', totalfreight: '24210', billstatus: '未結帳' },
      { billmonth: '2026/08', acctno: 'SA-88120002', shipcnt: '6', totalweight: '1168.500', totalfreight: '35580', billstatus: '未結帳' },
      { billmonth: '2026/08', acctno: 'SA-88120003', shipcnt: '2', totalweight: '663.500', totalfreight: '16070', billstatus: '未結帳' },
      { billmonth: '2026/08', acctno: 'SA-88130001', shipcnt: '5', totalweight: '761.500', totalfreight: '22110', billstatus: '未結帳' },
      { billmonth: '2026/08', acctno: 'SA-88130002', shipcnt: '5', totalweight: '1029.000', totalfreight: '27140', billstatus: '未結帳' },
      { billmonth: '2026/08', acctno: 'SA-88140001', shipcnt: '4', totalweight: '1337.750', totalfreight: '33440', billstatus: '未結帳' },
    ],
  },
}

const getShipmentListAPI = async (formValue) =>
  IS_DEV_ENV
    ? {
        ...FAKE_SHIPMENT_LIST,
        content: {
          data: FAKE_SHIPMENT_LIST.content.data.filter((item) => {
            const matchAccount = !formValue.acctno || item.acctno === formValue.acctno
            const matchStatus = !formValue.status || item.status === formValue.status
            const matchFrom = !formValue.datefrom || item.shipdate >= formValue.datefrom
            const matchTo = !formValue.dateto || item.shipdate <= formValue.dateto
            return matchAccount && matchStatus && matchFrom && matchTo
          }),
        },
      }
    : axios.post('/shipment/getShipmentList', formValue).then((response) => response.data)

const getInvoiceSummaryAPI = async (formValue) =>
  IS_DEV_ENV
    ? {
        ...FAKE_INVOICE_SUMMARY,
        content: {
          data: FAKE_INVOICE_SUMMARY.content.data.filter((item) => {
            const matchAccount = !formValue.acctno || item.acctno === formValue.acctno
            const matchFrom = !formValue.billmonthfrom || item.billmonth >= formValue.billmonthfrom
            const matchTo = !formValue.billmonthto || item.billmonth <= formValue.billmonthto
            return matchAccount && matchFrom && matchTo
          }),
        },
      }
    : axios.post('/shipment/getInvoiceSummary', formValue).then((response) => response.data)

const getShipmentExceptionAPI = async (formValue) =>
  IS_DEV_ENV
    ? {
        ...FAKE_SHIPMENT_LIST,
        content: {
          data: FAKE_SHIPMENT_LIST.content.data.filter((item) => {
            const matchAccount = !formValue.acctno || item.acctno === formValue.acctno
            const matchFrom = !formValue.datefrom || item.shipdate >= formValue.datefrom
            const matchTo = !formValue.dateto || item.shipdate <= formValue.dateto
            const matchReason = !formValue.excreason || item.excreason === formValue.excreason
            return item.status === 'EXCEPTION' && matchAccount && matchFrom && matchTo && matchReason
          }),
        },
      }
    : axios.post('/shipment/getShipmentException', formValue).then((response) => response.data)

function* getShipmentListSaga({ payload }) {
  try {
    const formValue = {
      custcode: payload.customerCode,
      acctno: payload.accountNo,
      datefrom: payload.shipDateFrom,
      dateto: payload.shipDateTo,
      status: payload.status,
    }
    const response = yield call(getShipmentListAPI, formValue)
    if (response.messageid !== '0') throw response

    const data = renameObjectKeysOfArray(response.content.data, {
      shipno: 'shipmentNo',
      shipdate: 'shipDate',
      acctno: 'accountNo',
      svctype: 'serviceType',
      origin: 'origin',
      dest: 'destination',
      weight: 'weightKg',
      freight: 'freightAmount',
      status: 'status',
      excreason: 'exceptionReason',
    })
    yield put(getShipmentListSuccess(data))
  } catch (error) {
    yield put(getShipmentListFailure(error))
  }
}

function* getInvoiceSummarySaga({ payload }) {
  try {
    const formValue = {
      custcode: payload.customerCode,
      acctno: payload.accountNo,
      billmonthfrom: payload.billMonthFrom,
      billmonthto: payload.billMonthTo,
    }
    const response = yield call(getInvoiceSummaryAPI, formValue)
    if (response.messageid !== '0') throw response

    const data = renameObjectKeysOfArray(response.content.data, {
      billmonth: 'billMonth',
      acctno: 'accountNo',
      shipcnt: 'shipmentCount',
      totalweight: 'totalWeightKg',
      totalfreight: 'totalFreightAmount',
      billstatus: 'billStatus',
    })
    yield put(getInvoiceSummarySuccess(data))
  } catch (error) {
    yield put(getInvoiceSummaryFailure(error))
  }
}

function* getShipmentExceptionSaga({ payload }) {
  try {
    const formValue = {
      custcode: payload.customerCode,
      acctno: payload.accountNo,
      datefrom: payload.shipDateFrom,
      dateto: payload.shipDateTo,
      excreason: payload.exceptionReason,
    }
    const response = yield call(getShipmentExceptionAPI, formValue)
    if (response.messageid !== '0') throw response

    const data = renameObjectKeysOfArray(response.content.data, {
      shipno: 'shipmentNo',
      shipdate: 'shipDate',
      acctno: 'accountNo',
      dest: 'destination',
      freight: 'freightAmount',
      excreason: 'exceptionReason',
    })
    yield put(getShipmentExceptionSuccess(data))
  } catch (error) {
    yield put(getShipmentExceptionFailure(error))
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(GET_SHIPMENT_LIST, getShipmentListSaga),
    takeLatest(GET_INVOICE_SUMMARY, getInvoiceSummarySaga),
    takeLatest(GET_SHIPMENT_EXCEPTION, getShipmentExceptionSaga),
  ])
}
