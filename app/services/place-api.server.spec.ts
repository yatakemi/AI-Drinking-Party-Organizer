import { google } from '@googlemaps/places/build/protos/protos'
import fs from 'fs'
import { describe, it } from 'vitest'

describe('place-api.server', () => {
  describe('convertReductionForPrompt', () => {
    it.skip('検証用', () => {
      const placeData = JSON.parse(
        fs.readFileSync('placeData.json', 'utf-8')
      ) as unknown as [
        google.maps.places.v1.ISearchTextResponse,
        google.maps.places.v1.ISearchTextRequest | undefined,
        {} | undefined
      ]

      const places = placeData[0].places?.map((place) => {
        return {
          id: place.id,
          name: place.displayName?.text,
          primaryTypeDisplayName: place.primaryTypeDisplayName?.text,
          formattedAddress: place.formattedAddress,
          rating: place.rating,
          reviews: place.reviews?.map((review) => {
            return { text: review.text?.text, rating: review.rating }
          }),
          regularOpeningHours: place.regularOpeningHours?.weekdayDescriptions,
          priceLevel: place.priceLevel,
        }
      })
      // fs.writeFileSync('places.json', JSON.stringify(places, null, 2))
      console.dir(places, { depth: null })
    })
  })
})
