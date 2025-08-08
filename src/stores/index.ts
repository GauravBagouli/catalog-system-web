import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import rootReducer from './reducers';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware: (arg0: { thunk: boolean; serializableCheck: boolean; immutableCheck: boolean; }) => any) =>
        getDefaultMiddleware({
            thunk: true,
            serializableCheck: false,
            immutableCheck: false,
        }),
});

const { dispatch } = store;
const useSelector = useAppSelector;
const useDispatch = () => useAppDispatch();

export type AppDispatch = typeof store.dispatch;

export { store, dispatch, useSelector, useDispatch };
