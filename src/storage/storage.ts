import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { configureStore, Middleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/es/storage';
import { createLogger } from 'redux-logger';
import * as Sentry from '@sentry/react';
import { rootReducer, ActionTypes } from '.';

/**
 * Redux Setting
 */
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    timeout: 100000,
};

const middleware: Middleware[] = [];
if (import.meta.env.MODE === 'development') {
    const logger = createLogger({});
    middleware.push(logger);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
const sentryReduxEnhancer = Sentry.createReduxEnhancer({
    actionTransformer: action => {
        if (action.type === ActionTypes.SET_USER) {
            return {
                ...action,
                access_token: '***',
                refresh_token: '***',
            };
        }
        return action;
    },
});

const store = configureStore({
    reducer: persistedReducer,
    middleware: gDM =>
        gDM({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(middleware),
    enhancers: [sentryReduxEnhancer],
});

const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
