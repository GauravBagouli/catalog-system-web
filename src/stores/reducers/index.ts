import { combineReducers } from 'redux';
import product from './product';

const appReducer = combineReducers({
    product,
});

const rootReducer = (state: any, action: any) => {
    if (action.type === 'LOGOUT') {
        state = {};
    }
    return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
