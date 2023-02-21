import { combineReducers } from 'redux';

import { WebReducer } from './web';

export const rootReducer = combineReducers({
    web: WebReducer,
});
