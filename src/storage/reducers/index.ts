import { combineReducers } from 'redux';

import webReducer from '../slices/webSlice';
import uiReducer from '../slices/uiSlice';

export const rootReducer = combineReducers({
    web: webReducer,
    ui: uiReducer,
});
