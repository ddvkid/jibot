import axios from "axios";

const foodAxios = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api',
  headers: {
    Accept: 'application/json',
    ContentType: 'application/json'
  },
  params: {
    location: '-33.8833092,151.2066895',
    radius: '2000',
    type: 'type',
    key: 'AIzaSyBWcOtEHyGy6SAmd7MzWfVQ1KayOecj9cA'
  }
});

export async function getFoods  () {
  console.log('foods');
  return foodAxios.get('/place/nearbysearch/json').then(response => ({
    ...response,
  }))
}
