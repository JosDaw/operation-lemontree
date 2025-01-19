import { database } from "@/config/firebase"
import { Collections } from "@/constants/constants"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"

export const useMessages = (conversationID: string) => {
	const [messages, setMessages] = useState<any[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!conversationID) return

		setLoading(true)
		setError(null)

		const messagesRef = collection(
			database,
			`${Collections.CONVERSATION}/${conversationID}/${Collections.MESSAGE}`
		)

		const messagesQuery = query(messagesRef, orderBy("dateCreated", "asc"))

		// Set up a Firestore real-time listener
		const unsubscribe = onSnapshot(
			messagesQuery,
			(querySnapshot) => {
				const messagesData = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))
				setMessages(messagesData)
				setLoading(false) // Stop loading after initial data fetch
			},
			(error) => {
				console.error("Error fetching messages for conversation:", error)
				setError("Failed to load messages.")
				setLoading(false)
			}
		)

		// Cleanup listener on unmount or when conversationID changes
		return () => unsubscribe()
	}, [conversationID])

	return { messages, loading, error }
}
