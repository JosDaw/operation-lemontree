import { database } from "@/config/firebase"
import {
	Collections,
	DEFAULT_PAGES,
	DEFAULT_RADIUS,
} from "@/constants/constants"
import useUser from "@/store/useUser"
import { ItemStatus } from "@/types"
import {
	collection,
	DocumentSnapshot,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from "firebase/firestore"
import { distanceBetween, geohashQueryBounds } from "geofire-common"
import { useEffect, useState } from "react"

interface UseListingsResult<T> {
	regularListings: T[]
	popularListings: T[]
	loading: boolean
	error: string | null
	fetchMore: () => Promise<void>
	hasMore: boolean
	refresh: () => void
}

interface UseListingsOptions {
	filters: any[] // Filters for regular listings
	category?: string | null // Category filter
	itemsPerPage?: number // Pagination limit
	radiusInKm?: number // Radius in kilometers for geospatial filtering
}

function useListings<T>({
	filters,
	category = null,
	itemsPerPage = DEFAULT_PAGES,
	radiusInKm = DEFAULT_RADIUS,
}: UseListingsOptions): UseListingsResult<T> {
	const { isLoggedIn, user } = useUser()

	const [regularListings, setRegularListings] = useState<T[]>([])
	const [popularListings, setPopularListings] = useState<T[]>([])
	const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [hasMore, setHasMore] = useState<boolean>(true)

	// Fetch regular listings (paginated)
	const fetchRegularListings = async (isLoadMore = false) => {
		try {
			setLoading(true)
			setError(null)

			const baseFilters = [
				where("isDeleted", "==", false),
				where("status", "==", ItemStatus.Available),
				orderBy("dateCreated", "desc"),
				...filters,
			]

			if (category) {
				baseFilters.push(where("categories", "array-contains", category))
			}

			// If the user is not an admin, add `isApproved == true` filter
			if (!user.isAdmin) {
				baseFilters.push(where("isApproved", "==", true))
			}

			let combinedListings: T[] = []

			// Geospatial filtering
			if (isLoggedIn && user.location) {
				const bounds = geohashQueryBounds(
					[user.location.latitude, user.location.longitude],
					radiusInKm * 1000 // Convert km to meters
				)

				// Create queries for each bound
				const geoQueries = bounds.map(([start, end]) => {
					return query(
						collection(database, Collections.ITEM),
						...baseFilters,
						where("location.geohash", ">=", start),
						where("location.geohash", "<=", end),
						...(isLoadMore && lastDoc ? [startAfter(lastDoc)] : []), // Add pagination if needed
						limit(itemsPerPage)
					)
				})

				const geoResults = await Promise.all(geoQueries.map((q) => getDocs(q)))

				geoResults.forEach((querySnapshot) => {
					const listings = querySnapshot.docs.map((doc) => ({
						...(doc.data() as T),
						id: doc.id,
					}))

					// Additional distance filtering
					const filteredListings = listings.filter((item: any) => {
						const distance = distanceBetween(
							[user.location.latitude, user.location.longitude],
							[item.location.latitude, item.location.longitude]
						)
						return distance <= radiusInKm
					})

					combinedListings = [...combinedListings, ...filteredListings]
				})
			} else {
				// Non-geospatial query
				const baseQuery = query(
					collection(database, Collections.ITEM),
					...baseFilters,
					...(isLoadMore && lastDoc ? [startAfter(lastDoc)] : []),
					limit(itemsPerPage)
				)

				const querySnapshot = await getDocs(baseQuery)
				combinedListings = querySnapshot.docs.map((doc) => ({
					...(doc.data() as T),
					id: doc.id,
				}))
			}

			// Update state with fetched listings
			setRegularListings((prev) =>
				isLoadMore ? [...prev, ...combinedListings] : combinedListings
			)
			setLastDoc(
				combinedListings.length > 0
					? (combinedListings[combinedListings.length - 1] as any)
					: null
			)
			setHasMore(combinedListings.length >= itemsPerPage)
		} catch (err) {
			console.error("Error fetching regular listings:", err)
			setError(
				err instanceof Error ? err.message : "Error fetching regular listings"
			)
		} finally {
			setLoading(false)
		}
	}

	// Fetch popular listings (with geospatial filtering)
	const fetchPopularListings = async () => {
		try {
			setLoading(true)
			setError(null)

			const baseFilters = [
				where("isDeleted", "==", false),
				where("status", "==", ItemStatus.Available),
				orderBy("saves", "desc"),
			]

			if (category) {
				baseFilters.push(where("categories", "array-contains", category))
			}

			if (!user.isAdmin) {
				baseFilters.push(where("isApproved", "==", true))
			}

			let combinedListings: T[] = []

			if (isLoggedIn && user.location) {
				const bounds = geohashQueryBounds(
					[user.location.latitude, user.location.longitude],
					radiusInKm * 1000 // Convert km to meters
				)

				const geoQueries = bounds.map(([start, end]) =>
					query(
						collection(database, Collections.ITEM),
						...baseFilters,
						where("location.geohash", ">=", start),
						where("location.geohash", "<=", end),
						limit(itemsPerPage)
					)
				)

				const geoResults = await Promise.all(geoQueries.map((q) => getDocs(q)))

				geoResults.forEach((querySnapshot) => {
					const listings = querySnapshot.docs.map((doc) => ({
						...(doc.data() as T),
						id: doc.id,
					}))

					// Additional distance filtering
					const filteredListings = listings.filter((item: any) => {
						const distance = distanceBetween(
							[user.location.latitude, user.location.longitude],
							[item.location.latitude, item.location.longitude]
						)
						return distance <= radiusInKm
					})

					combinedListings = [...combinedListings, ...filteredListings]
				})
			} else {
				const popularQuery = query(
					collection(database, Collections.ITEM),
					...baseFilters,
					limit(10)
				)

				const querySnapshot = await getDocs(popularQuery)
				combinedListings = querySnapshot.docs.map((doc) => ({
					...(doc.data() as T),
					id: doc.id,
				}))
			}

			setPopularListings(combinedListings)
		} catch (err) {
			console.error("Error fetching popular listings:", err)
			setError(
				err instanceof Error ? err.message : "Error fetching popular listings"
			)
		} finally {
			setLoading(false)
		}
	}

	const fetchListings = async (isLoadMore = false) => {
		if (!isLoadMore) {
			await fetchPopularListings()
		}
		await fetchRegularListings(isLoadMore)
	}

	useEffect(() => {
		fetchListings(false)
	}, [filters, category, radiusInKm])

	return {
		regularListings,
		popularListings,
		loading,
		error,
		fetchMore: () => fetchListings(true),
		hasMore,
		refresh: () => fetchListings(false),
	}
}

export default useListings
