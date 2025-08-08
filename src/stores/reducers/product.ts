import type { Product } from "../types/product";

interface ProductState {
  productList: Product[];
  productListLoading: boolean;
}

const INITIAL_STATE: ProductState = {
  productList: [],
  productListLoading: true,
};

interface RequestProductListAction {
    type: "REQUEST_PRODUCT_LIST";
}

interface SetProductListAction {
    type: "SET_PRODUCT_LIST";
    payload: Product[];
}

type ProductAction = RequestProductListAction | SetProductListAction;


const bookingsReducer = (state = INITIAL_STATE, action: ProductAction) => {
    switch (action.type) {
        case 'REQUEST_PRODUCT_LIST':
            return {
                ...state,
                productList: [],
                productListLoading: true,
            };
        case 'SET_PRODUCT_LIST':
            return {
                ...state,
                productList: action.payload,
                productListLoading: false,
            };
        default:
            return state;
    }
};

export default bookingsReducer;
