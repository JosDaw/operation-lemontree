import { database } from "@/config/firebase"
import { Collections } from "@/constants/constants"
import { ILocation, ItemStatus } from "@/types"
import { getAuth } from "@firebase/auth"
import * as Location from "expo-location"
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore"
import { Platform } from "react-native"
import { deleteImageFromSupabase } from "./supabaseHelpers"
import toast from "./toast"

/**
 * Handles the deletion of an item (by user or admin)
 *
 * @returns {Promise<void>} A promise that resolves when the item is successfully deleted.
 * @throws {Error} If there is an error updating the item's status.
 */
export const handleDeleteItem = async (itemId: string): Promise<void> => {
	try {
		// Get the item document reference
		const itemRef = doc(database, Collections.ITEM, itemId)

		// Retrieve the document to get the images array and user ID before marking it as deleted
		const snapshot = await getDoc(itemRef)
		if (!snapshot.exists()) {
			throw new Error("Item does not exist")
		}

		const data = snapshot.data()
		const images = data?.images || []

		// Update the document to mark it as deleted
		const updatePromise = updateDoc(itemRef, {
			isDeleted: true,
			dateEdited: Timestamp.now(),
		})

		// Delete all images from storage if they exist
		const deleteImagePromises = images.map((imageUrl: string) => {
			const decodedUrl = decodeURIComponent(imageUrl)
			const pathMatch = decodedUrl.match(/\/o\/(.*?)\?/)
			const filePath = pathMatch ? pathMatch[1] : null

			if (filePath) {
				deleteImageFromSupabase(filePath)
			}
			return Promise.resolve() // Skip if no valid file path
		})

		// Execute all async operations in parallel
		await Promise.all([updatePromise, ...deleteImagePromises])

		toast({ message: "Item deleted successfully" })
	} catch (error) {
		toast({ message: "Failed to delete item", type: "error" })
		console.error("Error deleting item in Firebase:", error)
		throw new Error("Failed to delete item.")
	}
}

/**
 * Handles the completion of a listing.
 *
 * @param request - The request object containing the item ID.
 * @returns A promise that resolves to void.
 */
export const handleCompleteListing = async (itemID: string): Promise<void> => {
	try {
		const itemRef = doc(database, Collections.ITEM, itemID)
		await updateDoc(itemRef, {
			status: ItemStatus.Given,
			dateEdited: Timestamp.now(),
			dateGiven: Timestamp.now(),
		})

		toast({ message: "Item marked as completed!" })
	} catch (error) {
		console.error("Error marking item as completed:", error)
		toast({
			message: "Failed to mark item as completed. Please try again.",
			type: "error",
		})
	}
}

/**
 * Checks if the application is running in development mode.
 * @returns {boolean} Returns true if the application is in development mode, false otherwise.
 */
export const isDevMode = (): boolean => {
	return false
}

export const isWeb = (): boolean => {
	return Platform.OS === "web"
}

/**
 * Calculate the distance between two locations using the Haversine formula.
 * @param location1 Location 1 with latitude and longitude
 * @param location2 Location 2 with latitude and longitude
 * @returns Distance in kilometers
 */
export const calculateDistance = (
	location1: ILocation,
	location2: ILocation,
	unit: "km" | "miles" = "km"
): number => {
	// Earth's radius in kilometers and miles
	const radius = unit === "km" ? 6371 : 3958.8

	// Convert degrees to radians
	const toRadians = (deg: number) => (deg * Math.PI) / 180

	// Destructure latitude and longitude
	const { latitude: lat1, longitude: lon1 } = location1
	const { latitude: lat2, longitude: lon2 } = location2

	// Haversine formula
	const dLat = toRadians(lat2 - lat1)
	const dLon = toRadians(lon2 - lon1)
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) *
			Math.cos(toRadians(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2)

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	const distance = radius * c

	return parseFloat(distance.toFixed(1))
}

type DistanceUnit = "km" | "miles"

/**
 * Determine whether to use kilometers or miles based on the user's location or region settings.
 * @returns The distance unit ("km" or "miles").
 */
export const getPreferredDistanceUnit = async (): Promise<DistanceUnit> => {
	try {
		// Request location permissions
		const { status } = await Location.requestForegroundPermissionsAsync()
		if (status !== "granted") {
			console.warn("Permission to access location was denied.")
			return "km" // Default to kilometers
		}

		// Get the user's current location
		const location = await Location.getCurrentPositionAsync()
		const [geoInfo] = await Location.reverseGeocodeAsync({
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
		})

		// Check the user's country
		const country = geoInfo?.isoCountryCode || ""

		// List of countries using miles
		const countriesUsingMiles = ["US", "GB", "MM", "LR"]

		if (countriesUsingMiles.includes(country)) {
			return "miles"
		}

		// Use kilometers as the default unit
		return "km"
	} catch (error) {
		console.error("Error detecting distance unit:", error)
		// Default to kilometers if an error occurs
		return "km"
	}
}

/**
 * Retrieves the Firebase authentication token for the currently authenticated user.
 *
 * @returns {Promise<string | null>} A promise that resolves to the Firebase ID token if the user is authenticated, or null if no user is authenticated.
 */
export const getFirebaseToken = async () => {
	const auth = getAuth()
	const user = auth.currentUser
	if (user) {
		return await user.getIdToken()
	}
	return null
}
