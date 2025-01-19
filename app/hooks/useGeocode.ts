import { GOOGLE_MAPS_API } from "@/constants/constants"
import axios from "axios"
import Constants from "expo-constants"
import { geohashForLocation } from "geofire-common"
import { useState } from "react"

interface GeocodeResponse {
	latitude: number | null
	longitude: number | null
	geohash: string | null
	error: string | null
	fetchGeolocation: (zipcode: string, country: string) => Promise<void>
}

/**
 * Custom hook to fetch geolocation data based on a given zipcode and country.
 *
 * @returns {GeocodeResponse} An object containing latitude, longitude, geohash, error, and fetchGeolocation function.
 *
 * @example
 * const { latitude, longitude, geohash, error, fetchGeolocation } = useGeocode();
 *
 * useEffect(() => {
 *   fetchGeolocation("12345", "United States");
 * }, []);
 *
 * @typedef {Object} GeocodeResponse
 * @property {number | null} latitude - The latitude of the geocoded location.
 * @property {number | null} longitude - The longitude of the geocoded location.
 * @property {string | null} geohash - The geohash of the geocoded location.
 * @property {string | null} error - Error message if the geocoding fails.
 * @property {function} fetchGeolocation - Function to fetch geolocation data based on zipcode and country.
 */
const useGeocode = (): GeocodeResponse => {
	const [latitude, setLatitude] = useState<number | null>(null)
	const [longitude, setLongitude] = useState<number | null>(null)
	const [geohash, setGeohash] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const fetchGeolocation = async (zipcode: string, country: string) => {
		// Replace South Korea with Korea, Republic of South Korea
		if (country === "Korea, Republic of South Korea") {
			country = "South Korea"
		}
		try {
			setError(null) // Reset error before making a request

			const address = `${zipcode}, ${country}`

			const response = await axios.get(GOOGLE_MAPS_API, {
				params: {
					address,
					key: Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY || "",
				},
			})

			const results = response.data.results
			if (!results || results.length === 0) {
				setError("Invalid Zipcode. Please enter a valid zipcode.")
				setLatitude(null)
				setLongitude(null)
				setGeohash(null)
				return
			}

			const location = results[0].geometry.location
			const lat = location.lat
			const lng = location.lng

			setLatitude(lat)
			setLongitude(lng)

			// Calculate geohash
			const hash = geohashForLocation([lat, lng])
			setGeohash(hash)

			if (!lat || !lng || !hash) {
				setError("Failed to fetch geolocation. Please try again.")
			}
		} catch (err: any) {
			setError(err.response?.data?.error_message || "Something went wrong.")
			setLatitude(null)
			setLongitude(null)
			setGeohash(null)
		}
	}

	return { latitude, longitude, geohash, error, fetchGeolocation }
}

export default useGeocode
