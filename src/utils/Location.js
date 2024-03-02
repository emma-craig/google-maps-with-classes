export async function getAddressFromCoords(coords) {
  const response = await fetch(
    `https://geocode.maps.co/reverse?lat=${coords.lat}&lon=${coords.lng}&api_key=65e1ce37a3219299911033cea04929b`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch address. Please try again");
  }
  const data = await response.json();
  if (data.error_message) throw new Error(data.error_message);
  const address = data.address.road;
  return address;
}

export async function getCoordsFromAddress(address) {
  const urlAddress = encodeURI(address);
  const response = await fetch(
    `https://geocode.maps.co/search?q=${urlAddress}&api_key=65e1ce37a3219299911033cea04929b`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch coordinates. Please try again");
  }
  const data = await response.json();
  if (data.error_message) throw new Error(data.error_message);
  const coordinates = {
    lat: +data[0].lat,
    lng: +data[0].lon,
  };
  return coordinates;
}
