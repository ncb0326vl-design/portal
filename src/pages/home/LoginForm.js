import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { login } from 'Redux/actions'
import { loginLoading, loginError } from 'Redux/selectors'

const validationSchema = Yup.object({
  customerCode: Yup.string().required('請輸入客戶代碼'),
  operatorId: Yup.string().required('請輸入使用者代號'),
  password: Yup.string().required('請輸入密碼'),
})

const initForm = IS_DEV_ENV
  ? { customerCode: 'MRD1001', operatorId: 'demo01', password: 'demo1234' }
  : { customerCode: '', operatorId: '', password: '' }

const LoginForm = () => {
  const dispatch = useDispatch()
  const loading = useSelector(loginLoading)
  const error = useSelector(loginError)

  const formik = useFormik({
    initialValues: initForm,
    validationSchema,
    onSubmit: (values) => dispatch(login(values)),
  })

  const fieldError = (name) => formik.touched[name] && formik.errors[name]

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-group">
        <label htmlFor="customerCode">客戶代碼</label>
        <input
          id="customerCode"
          name="customerCode"
          className={`form-control ${fieldError('customerCode') ? 'is-invalid' : ''}`}
          value={formik.values.customerCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <If condition={!!fieldError('customerCode')}>
          <span className="mrd-error-text">{formik.errors.customerCode}</span>
        </If>
      </div>
      <div className="form-group">
        <label htmlFor="operatorId">使用者代號</label>
        <input
          id="operatorId"
          name="operatorId"
          className={`form-control ${fieldError('operatorId') ? 'is-invalid' : ''}`}
          value={formik.values.operatorId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <If condition={!!fieldError('operatorId')}>
          <span className="mrd-error-text">{formik.errors.operatorId}</span>
        </If>
      </div>
      <div className="form-group">
        <label htmlFor="password">密碼</label>
        <input
          id="password"
          name="password"
          type="password"
          className={`form-control ${fieldError('password') ? 'is-invalid' : ''}`}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <If condition={!!fieldError('password')}>
          <span className="mrd-error-text">{formik.errors.password}</span>
        </If>
      </div>
      <If condition={!!error}>
        <div className="alert alert-danger py-2 small">登入失敗，請確認輸入的資料是否正確。</div>
      </If>
      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? '登入中…' : '登入'}
      </button>
    </form>
  )
}

export default LoginForm
