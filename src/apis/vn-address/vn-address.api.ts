// src/apis/vn-address.api.ts
import axios from "axios";

const http = axios.create({
  baseURL: "https://provinces.open-api.vn/api/v2",
  timeout: 15000,
});

export interface Province { code: number; name: string }
export interface Ward { code: number; name: string; province_code?: number }

export const vnAddressApi = {
  // Tỉnh/Thành
  async getProvinces(search = ""): Promise<Province[]> {
    const { data } = await http.get<Province[]>("/p/", {
      params: search ? { search } : undefined,
    });
    return data ?? [];
  },

  // (tuỳ chọn) Lấy 1 tỉnh + kèm wards bằng depth=2
  async getProvinceWithWards(province_code: number | string) {
    const { data } = await http.get(`/p/${province_code}`, { params: { depth: 2 } });
    return data; // data.wards là mảng phường/xã
  },

  // Lấy phường/xã THEO TỈNH 
  async getWardsByProvince(province_code: number | string): Promise<Ward[]> {
    const { data } = await http.get<Ward[]>("/w/", {
      params: { province: province_code }, 
    });
    return data ?? [];
  },

  // (tuỳ chọn) Lấy 1 phường/xã theo code
  async getWard(ward_code: number | string): Promise<Ward> {
    const { data } = await http.get<Ward>(`/w/${ward_code}`);
    return data;
  },
};
