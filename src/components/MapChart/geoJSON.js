export function geoJSONFactory(originMap) {
  const result = {
    type: 'FeatureCollection',
    features: [],
  }
  Array.from(originMap.entries()).forEach(([key, value]) => {
    result.features.push({
      type: 'Feature',
      properties: {
        name: key,
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: value.split('|').map(str => str.split(';').map(point => point.split(','))),
      },
    })
  })
  return result
}
