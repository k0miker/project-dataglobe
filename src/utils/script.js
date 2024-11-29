const urls = [
  { url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/pr71467088.geojson' },
  { url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/pr71467078.geojson' },
  { url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/nc75092021.geojson' },
  { url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us7000nupk.geojson' },
  { url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us7000nuny.geojson' }
  // ...weitere URLs...
];

console.log("test");

let completedRequests = 0;

async function fetchData(url) {
  console.log(`Fetching data from: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Received data: ${JSON.stringify(data)}`);
    if (data.properties && data.properties.products && data.properties.products.origin) {
      const { latitude, longitude, magnitude } = data.properties.products.origin[0].properties;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Magnitude: ${magnitude}`);
    } else {
      console.error('Unerwartete Datenstruktur:', data);
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
  } finally {
    completedRequests++;
    console.log(`Fortschritt: ${completedRequests}/${urls.length} Anfragen abgeschlossen`);
  }
}

urls.forEach(item => {
  fetchData(item.url);
});
