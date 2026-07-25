mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listingData.geometry.coordinates,
    zoom: 12
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listingData.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4>${listingData.location}</h4>`)
    )
    .addTo(map);