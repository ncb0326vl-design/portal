import { combineReducers } from 'redux'
import auth from './auth/reducers'
import common from './common/reducers'
import logistics from './logistics/reducers'

export default combineReducers({ auth, common, logistics })
