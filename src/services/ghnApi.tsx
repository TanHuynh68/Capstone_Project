import ENV from "@/config/env";
import axios from "axios";

const ghnApi = axios.create({
  baseURL: "https://online-gateway.ghn.vn/shiip/public-api/",
  headers: {
    "Content-Type": "application/json",
    token: "fce6015b-0b16-11f0-8509-7a5de70707ed",
  },
});

export const getProvinces = () => ghnApi.get("/master-data/province");

export const getDistricts = (provinceId: number) =>
  ghnApi.post("/master-data/district", { province_id: provinceId });

export const getWards = (districtId: number) =>
  ghnApi.post("/master-data/ward?district_id", { district_id: districtId });

export const calculateFee = (data: any) =>
  ghnApi.post("/v2/shipping-order/fee", data, {
    headers: {
      ShopId: ENV.GHN_SHOP_ID,
    },
  });

export const createOrder = (data: any) =>
  ghnApi.post("/v2/shipping-order/create", data, {
    headers: {
      ShopId: ENV.GHN_SHOP_ID,
    },
  });

export const getShops = () => ghnApi.get("/v2/shop/all");

export const getAvailableServices = (
  fromDistrict: number,
  toDistrict: number,
  shopId: number
) =>
  ghnApi.post("/v2/shipping-order/available-services", {
    shop_id: shopId,
    from_district: fromDistrict,
    to_district: toDistrict,
  });
