import { database } from "@/config/firebase"
import { Collections } from "@/constants/constants"
import useUser from "@/store/useUser"
import { IItem } from "@/types"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { useCallback, useEffect, useState } from "react"

const useUserItems = () => {
	const { user } = useUser()
	const [listings, setListings] = useState<IItem[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	/**
	 * Fetches the listings for the user.
	 */
	const fetchListings = useCallback(async () => {
		try {
			setLoading(true)

			// Fetch listings where userID matches the current user
			const listingsQuery = query(
				collection(database, Collections.ITEM),
				where("userID", "==", user.userID),
				where("isDeleted", "==", false),
				orderBy("dateCreated", "desc")
			)

			const listingsSnapshot = await getDocs(listingsQuery)
			const fetchedListings: IItem[] = []
			listingsSnapshot.forEach((doc) => {
				fetchedListings.push({
					...(doc.data() as IItem),
					id: doc.id,
				})
			})

			// Set listings state
			setListings(fetchedListings)

			// If no listings found, set empty requests
			if (fetchedListings.length === 0) {
				setLoading(false)
				return
			}

			return fetchedListings
		} catch (err) {
			console.error("Error fetching listings:", err)
			setError("Failed to load listings.")
		} finally {
			setLoading(false)
		}
	}, [user.userID])

	/**
	 * Fetch listings
	 */
	useEffect(() => {
		if (user.userID) {
			;(async () => {
				await fetchListings()
			})()
		}
	}, [user.userID, fetchListings])

	return { listings, loading, error, fetchListings }
}

export default useUserItems
