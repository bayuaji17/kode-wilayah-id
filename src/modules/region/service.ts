import path from "path";
import { readFileSync } from "fs";
import { status } from "elysia";
import type { Province, Regency, District, Village } from "./model";

class RegionService {
  private provinces = new Map<string, Province>();
  private regencies = new Map<string, Regency>();
  private districts = new Map<string, District>();
  private villages = new Map<string, Village>();

  private regenciesByProvince = new Map<string, Regency[]>();
  private districtsByRegency = new Map<string, District[]>();
  private villagesByDistrict = new Map<string, Village[]>();

  constructor() {
    this.loadData();
  }

  private loadData() {
    const filePath = path.join(process.cwd(), "src/assets/base.csv");
    const csv = readFileSync(filePath, "utf-8");
    const lines = csv.trim().split("\n");

    for (const line of lines) {
      const [code, name] = line.split(",");
      const parts = code.split(".");

      if (parts.length === 1) {
        this.provinces.set(code, { code, name });
      } else if (parts.length === 2) {
        const province_code = parts[0];
        this.regencies.set(code, { code, name, province_code });

        if (!this.regenciesByProvince.has(province_code)) {
          this.regenciesByProvince.set(province_code, []);
        }
        this.regenciesByProvince
          .get(province_code)!
          .push({ code, name, province_code });
      } else if (parts.length === 3) {
        const regency_code = `${parts[0]}.${parts[1]}`;
        this.districts.set(code, { code, name, regency_code });

        if (!this.districtsByRegency.has(regency_code)) {
          this.districtsByRegency.set(regency_code, []);
        }
        this.districtsByRegency
          .get(regency_code)!
          .push({ code, name, regency_code });
      } else if (parts.length === 4) {
        const district_code = `${parts[0]}.${parts[1]}.${parts[2]}`;
        this.villages.set(code, { code, name, district_code });

        if (!this.villagesByDistrict.has(district_code)) {
          this.villagesByDistrict.set(district_code, []);
        }
        this.villagesByDistrict
          .get(district_code)!
          .push({ code, name, district_code });
      }
    }

    console.log(
      `Loaded: ${this.provinces.size} provinces, ${this.regencies.size} regencies, ${this.districts.size} districts, ${this.villages.size} villages`,
    );
  }

  getProvinces() {
    const data = Array.from(this.provinces.values());
    return { success: true as const, data, count: data.length };
  }

  getRegencies(provinceId: string) {
    if (!this.provinces.has(provinceId)) {
      return status(404, {
        success: false as const,
        error: "Province not found",
      });
    }

    const data = this.regenciesByProvince.get(provinceId) || [];
    return { success: true as const, data, count: data.length };
  }

  getDistricts(regencyId: string) {
    const data = this.districtsByRegency.get(regencyId);
    if (!data) {
      return status(404, {
        success: false as const,
        error: "Regency not found",
      });
    }

    return { success: true as const, data, count: data.length };
  }

  getVillages(districtId: string) {
    const data = this.villagesByDistrict.get(districtId);
    if (!data) {
      return status(404, {
        success: false as const,
        error: "District not found",
      });
    }

    return { success: true as const, data, count: data.length };
  }
}

export const regionService = new RegionService();
