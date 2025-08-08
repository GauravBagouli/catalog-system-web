import API from '../../helpers/api';
import toast, { type Renderable, type Toast, type ValueFunction } from 'react-hot-toast';

export function getProductList() {
    return (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
        dispatch({ type: 'REQUEST_PRODUCT_LIST' });
        API.apiGet('productList')
            .then((response: { data: any; }) => {
                if (response.data) {
                    dispatch({ type: `SET_PRODUCT_LIST`, payload: response.data.data });
                }
            })
            .catch((err: { message: Renderable | ValueFunction<Renderable, Toast>; }) => {
                dispatch({ type: `REQUEST_FAIL` });
                toast.error(err.message);
            });
    };
}
