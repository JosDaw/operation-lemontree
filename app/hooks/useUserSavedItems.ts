import { database } from "@/config/firebase"
import { Collections } from "@/constants/constants"
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore"
import { useEffect, useState } from "react"

const useUserSavedItems = (userID: string) => {
	const [savedItems, setSavedItems] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchSavedItems = async () => {
		try {
			const userSavesQuery = query(
				collection(database, Collections.USER_SAVES),
				where("userID", "==", userID)
			)
			const userSavesSnapshot = await getDocs(userSavesQuery)
			const itemIDs = userSavesSnapshot.docs.map((doc) => doc.data().itemID)

			const itemsPromises = itemIDs.map((itemID) =>
				getDoc(doc(database, Collections.ITEM, itemID))
			)
			const itemSnapshots = await Promise.all(itemsPromises)

			const items = itemSnapshots
				.filter((snapshot) => snapshot.exists())
				.map((snapshot) => ({
					id: snapshot.id,
					...snapshot.data(),
				}))

			setSavedItems(items)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}

	const refresh = async () => {
		setLoading(true)
		setError(null)
		await fetchSavedItems()
		setLoading(false)
	}

	useEffect(() => {
		if (userID) {
			fetchSavedItems()
		}
	}, [userID])

	return { savedItems, loading, error, refresh }
}

export default useUserSavedItems
