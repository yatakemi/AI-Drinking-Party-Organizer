import { PlacesClient } from '@googlemaps/places'
import { google } from '@googlemaps/places/build/protos/protos'

const apiKey = process.env.PLACE_API_KEY

const placesClient = new PlacesClient({ apiKey })

/**
 * Place API呼び出し
 * @param textQuery
 * @returns
 */
export async function callPlaceSearchText(textQuery: string) {
  // Construct request
  const request = {
    textQuery,
    languageCode: 'ja',
  }

  // Run request
  const response = await placesClient.searchText(request, {
    otherArgs: {
      headers: {
        'X-Goog-FieldMask':
          'places.id,places.formattedAddress,places.rating,places.googleMapsUri,places.websiteUri,places.regularOpeningHours,places.userRatingCount,places.businessStatus,places.priceLevel,places.displayName,places.primaryTypeDisplayName,places.reviews,places.delivery,places.dineIn,places.reservable,places.servesBreakfast,places.servesDinner,places.servesBeer,places.servesWine,places.servesVegetarianFood,places.photos,places.outdoorSeating,places.liveMusic,places.menuForChildren,places.servesDessert,places.servesCoffee,places.goodForChildren,places.allowsDogs,places.restroom,places.goodForGroups,places.goodForWatchingSports,places.paymentOptions,places.accessibilityOptions',
      },
    },
  })
  // console.dir(response, { depth: null })
  return response
}

/**
 * tokenサイズ削減用変換
 * @param placeData
 * @returns
 */
export const convertReductionForPrompt = (
  placeData: [
    google.maps.places.v1.ISearchTextResponse,
    google.maps.places.v1.ISearchTextRequest | undefined,
    {} | undefined
  ]
) => {
  return placeData[0].places?.map((place) => {
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
}
