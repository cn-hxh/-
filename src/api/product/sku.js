import request from '@/utils/request.js';

export const reqSkuList = (page, limit) => request({
  url: `/admin/product/list/${page}/${limit}`,
  method: 'get'
});

export const reqSale = (skuId) => request({
  url: `/admin/product/onSale/${skuId}`,
  method: 'get'
});

export const reqCancel = (skuId) => request({
  url: `/admin/product/cancelSale/${skuId}`,
  method: 'get'
});

export const reqSkuById = (skuId) => request({
  url: `/admin/product/getSkuById/${skuId}`,
  method: 'get'
});