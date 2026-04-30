export const mapsConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
  defaultCenter: {
    lat: 55.7558,
    lng: 37.6173,
  },
  defaultZoom: 10,
}
