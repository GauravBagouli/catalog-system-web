const apiKeys = {
    productList: 'product/list',
    addProduct: 'product/create',
    productTypeList: 'product/type/list',
} as const;

export default apiKeys;

export type ApiKey = keyof typeof apiKeys;