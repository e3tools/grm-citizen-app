import {useEffect, useState} from 'react'
import {Image} from 'react-native'

export default function StaticMap({regionName}: {regionName: string}) {
  const [mapUrl, setMapUrl] = useState<string | null>(null)

  useEffect(() => {
    // 1. Geocode the region name to get coordinates
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURI(regionName)}`,
      {
        headers: {
          'User-Agent': 'TheAppName/1.0 (your@email.com)',
          Referer: 'https://your-app.example.com',
        },
      },
    )
      .then(async res => {
        // Check that response is JSON before calling .json()
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          return await res.json()
        } else {
          const text = await res.text()
          throw new Error(`Expected JSON but got: ${text.slice(0, 100)}`)
        }
      })
      .then(data => {
        if (data && data.length > 0) {
          const {lat, lon} = data[0]
          // 2. Build a static map URL ( using Mapbox Static Images API as an example)
          // You need a free Mapbox access token for this
          const MAPBOX_TOKEN = ''
          const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lon},${lat},13/400x200?access_token=${MAPBOX_TOKEN}`
          setMapUrl(url)
        }
      })
      .catch(e => console.error(e))
  }, [regionName])

  if (!mapUrl) return null

  return (
    <>
      <Image
        source={{uri: mapUrl}}
        style={{width: 400, height: 200, borderRadius: 8}}
        resizeMode="cover"
      />
    </>
  )
}
