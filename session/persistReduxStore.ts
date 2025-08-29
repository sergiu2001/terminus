import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import sessionReducer from './game/gameSessionSlice';

const rootReducer = combineReducers({
    session: sessionReducer
});

const persisted = persistReducer(
    { 
        key: 'root', 
        storage: ExpoFileSystemStorage, 
        whitelist: ['session'], // Only persist game session, not auth
    },
    rootReducer,
);

export const store = configureStore({
    reducer: persisted, 
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
