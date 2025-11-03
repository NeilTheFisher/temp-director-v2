export interface LocationInfoInterface {
  location: string|null;
  location_ips: string;
  on_location_access: boolean;
  on_location_feature: boolean;
  location_access_range: number;
  location_lock: boolean;
  location_qr_code: boolean;
  location_latitude: number;
  location_longitude: number
}