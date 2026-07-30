# Meridian Freight 企業託運平台（前端）

企業客戶用來查詢託運單、請款彙總，以及批次建立託運單的 Web 平台。

## 環境需求

- Node.js 16（見 `.nvmrc`；較新的 Node 也可以跑，npm scripts 已帶入 `--openssl-legacy-provider`）
- npm

## 安裝與啟動

```bash
npm install          # .npmrc 已設 legacy-peer-deps，直接裝即可
npm start            # http://localhost:3000
```

`npm start` 會以 `HOST=local` 啟動，此模式下 `IS_DEV_ENV` 為 `true`，**所有 saga 都走內建的假資料，不需要後端也不需要連 VPN**。登入頁已預先帶好測試帳號，直接按「登入」即可。

其他指令：

```bash
npm run start:proxy              # 走 proxy 打真實後端（本機通常用不到）
npm run build                    # production build
./node_modules/.bin/jest         # 跑測試（package.json 目前沒有 test script）
```

## 目錄結構

同一個功能的檔案會平行散在四棵樹裡，新增功能時四邊都要動：

```
src/routes/<area>/<group>/index.js                    路由定義（lazy load）
src/pages/<area>/<feature>/                           畫面：index.js + 各頁籤
src/redux/<area>/<group>/<feature>/                   action.js / reducer.js / saga.js / selector.js
src/constants/actionTypes/<area>/index.js             action type 常數
src/constants/pageTab/<area>/<group>/<feature>/       頁籤常數
```

注意 `pages` 只有兩層（area/feature），但 `redux`、`routes` 有三層（area/group/feature），中間多一層 group。

以「託運單查詢」為例，一次查詢會經過：

```
routes/logistics/shipmentQuery/index.js
  → pages/logistics/shipmentInquiry/index.js
    → shipmentListTab/ShipmentListSearch.js   （formik + yup）
      → dispatch getShipmentList()
        → redux/logistics/shipmentQuery/shipmentInquiry/saga.js   （API 呼叫寫在 saga 裡）
          → reducer.js
            → selector.js
              → shipmentListTab/ShipmentListResult.js  （Components/dataTable）
```

## 開發慣例

- **Redux 一個功能四個檔案**：`action.js`、`reducer.js`、`saga.js`、`selector.js`（單數）。每一層 group 另有 `actions.js`、`reducers.js`、`sagas.js`、`selectors.js` 這四個 barrel（複數）負責往上串。
- **沒有獨立的 api.js**，API 呼叫直接寫在 saga 檔案上方：
  ```js
  const getShipmentListAPI = async (formValue) =>
    IS_DEV_ENV ? FAKE_SHIPMENT_LIST : axios.post('/shipment/getShipmentList', formValue).then((r) => r.data)
  ```
- **Action 四件組**：`GET_X` / `GET_X_SUCCESS` / `GET_X_FAILURE` / `RESET_X`。
- **Selector 是手寫的完整路徑**，沒有用 reselect。
- **查詢頁的結構固定是 `Search` → `Result`**，由頁面元件用一個 `viewMode` state 切換。
- **結果表格不做前端排序**：所有查詢結果的排序皆由後端決定，`dataTable` 未提供排序功能。若 ticket 要求排序，需於頁面層自行實作。
- **表單元件吃整包 formik**：欄位元件收到 `formik` 這個 prop，自己讀 `formik.touched[name] && formik.errors[name]`。
- **JSX 控制結構**用的是 `babel-plugin-jsx-control-statements` 提供的 `<If>`、`<For>`、`<Choose>/<When>/<Otherwise>`，它們是 Babel 編譯期的語法，不是 React 元件，不用 import。
- **環境變數是 webpack DefinePlugin 的全域變數**（`API_HOST`、`IS_DEV_ENV`、`IS_PROD_ENV`、`USE_CONSOLE`），不是 `process.env`，所以引用到它們的模組沒辦法脫離 webpack／jest 直接執行。

## 共用元件

| 路徑 | 說明 |
| --- | --- |
| `Components/layout` | 頁首、側邊選單、麵包屑、頁尾 |
| `Components/dataTable` | react-table v7 包裝，含分頁／表格內搜尋／CSV 匯出。**不支援欄位排序**：查詢結果一律由後端排序後回傳，前端不再處理 |
| `Components/form/*` | `SelectionField`、`TextField`、`DateSelection`、`DateRangeSelection`、`RadioSelectionField` 等 |
| `Components/swal` | sweetalert2 包裝（`forceMessageModal`、`confirmModal`、`successModal`） |
| `Components/formPage` | `NoDataPage`、`ApiErrorMessagePage` |
| `Util/Utils.js` | `numberWithCommas`、`amountFormat`、`renameObjectKeysOfArray` 等 |

## 待辦事項

`docs/tickets/` 底下是目前排進來的 ticket。
