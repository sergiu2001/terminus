import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import sessionReducer from './sessionSlice';

const rootReducer = combineReducers({
    session: sessionReducer,
});

const persisted = persistReducer(
    { key: 'root', storage: ExpoFileSystemStorage, whitelist: ['session'] },
    rootReducer,
);

export const store = configureStore({
    reducer: persisted, middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist actions that carry non-serializable data
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
