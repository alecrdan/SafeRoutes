function convertToGPX(coordinates: number[][], name = "Route") {
  const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="SafeRoutes - Alec Daniels"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1
     http://www.topografix.com/GPX/1/1/gpx.xsd">
<trk><name>${name}</name><trkseg>`;

  const gpxPoints = coordinates
    .map((coord) => `<trkpt lon="${coord[0]}" lat="${coord[1]}"></trkpt>`)
    .join("");

  const gpxFooter = `</trkseg></trk></gpx>`;

  return gpxHeader + gpxPoints + gpxFooter;
}

