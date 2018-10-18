export function geoJSONFactory(originMap) {
  const result = {
    type: 'FeatureCollection',
    features: [],
  }
  originMap.entries().forEach(([key, value]) => {
    result.features.push({
      type: 'Feature',
      properties: {
        name: key,
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: value,
      },
    })
  })
  return result
}
