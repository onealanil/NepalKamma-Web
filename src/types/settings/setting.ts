//dashboard/job-seeker/settings/page.tsx

export interface Geometry {
  coordinates: number[];
  type: string;
}

export interface Place {
  geometry: Geometry;
  properties: {
    city: string;
    country: string;
    formatted?: string;
  };
  type: string;
}

export interface GeoapifyResponse {
  features: Place[];
}