import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
});
