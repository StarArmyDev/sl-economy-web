import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { configureStore, Middleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/es/storage';
import { createLogger } from 'redux-logger';
import * as Sentry from '@sentry/react';
import { rootReducer } from './reducers';
import { setUser } from './slices/webSlice';

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
        if (action.type === setUser.type) {
            // Check if payload has tokens and mask them if necessary
            // Assuming payload is the user object which might contain tokens
            if (action.payload && typeof action.payload === 'object') {
                return {
                    ...action,
                    payload: {
                        ...action.payload,
                        accessToken: '***',
                        refreshToken: '***',
                    },
                };
            }
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
    enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(sentryReduxEnhancer),
});

const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
