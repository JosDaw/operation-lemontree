import { database } from "@/config/firebase"
import { Collections } from "@/constants/constants"
import { doc, DocumentData, getDoc } from "firebase/firestore"
import { useCallback, useEffect, useState } from "react"

interface UseItemDocResult<T> {
	data: T | null
	loading: boolean
	error: string | null
	refresh: () => void // Added refresh control
}

/**
 * Custom hook for fetching a specific item from a Firestore collection
 * and checking if the current user has requested it.
 *
 * @template T - The type of the document data.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} docId - The ID of the document to fetch.
 * @returns {UseItemDocResult<T>} - An object containing the fetched document data, loading state, and error message.
 */
const useItem = <T extends DocumentData>(
	collectionName: string,
	docId: string
): UseItemDocResult<T> => {
	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	// Define fetch function with useCallback to avoid re-creating it every render
	const fetchDocumentAndCheckRequest = useCallback(async () => {
		setLoading(true)
		try {
			const docRef = doc(database, collectionName, docId)

			// Fetch the item
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				const docData = docSnap.data() as T
				const itemID = docSnap.id
				const itemUserID = docData.userID

				let isRequestedByUser = false
				let itemUserName = ""
				let itemEmail = ""

				// Fetch the username of the person who posted the item
				if (itemUserID) {
					const userDocRef = doc(database, Collections.USER, itemUserID)
					const userDocSnap = await getDoc(userDocRef)

					if (userDocSnap.exists()) {
						const userDocData = userDocSnap.data()
						itemUserName = userDocData?.name || null
						itemEmail = userDocData?.email
					}
				}

				// Set the data, including the `isRequestedByUser` flag
				setData({
					id: itemID,
					...docData,
					isRequestedByUser,
					itemUserName,
					itemEmail,
				})
			} else {
				setError("Document does not exist")
			}
		} catch (err) {
			console.error("Error fetching document:", err)
			setError(err instanceof Error ? err.message : "Error fetching document")
		} finally {
			setLoading(false)
		}
	}, [collectionName, docId])

	// Automatically fetch on mount and when docId changes
	useEffect(() => {
		fetchDocumentAndCheckRequest()
	}, [fetchDocumentAndCheckRequest])

	// Return the refresh function along with other states
	return { data, loading, error, refresh: fetchDocumentAndCheckRequest }
}

export default useItem
