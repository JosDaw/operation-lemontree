import { database } from "@/config/firebase"
import { Collections } from "@/constants/constants"
import { IConversation } from "@/types"
import {
	collection,
	doc,
	DocumentData,
	FirestoreError,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from "firebase/firestore"
import { useEffect, useState } from "react"

const useUserConversations = (userID: string) => {
	const [conversations, setConversations] = useState<IConversation[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchConversations = async () => {
			if (!userID) {
				setLoading(false)
				setError("User ID is required.")
				return
			}

			setLoading(true)
			setError(null)

			try {
				const conversationsRef = collection(database, Collections.CONVERSATION)

				// Fetch conversations where the user is a participant
				const conversationsQuery = query(
					conversationsRef,
					where("participants", "array-contains", userID)
				)

				const querySnapshot = await getDocs(conversationsQuery)

				// Fetch recent messages for each conversation
				const conversationPromises = querySnapshot.docs.map(
					async (docSnapshot) => {
						const conversationData = docSnapshot.data() as DocumentData
						const conversationID = docSnapshot.id

						// Check if the conversation is deleted by the user
						if (conversationData.deletedBy?.[userID] === true) {
							// Skip this conversation if the user deleted it
							return null
						}

						// Get the most recent message from the messages subcollection
						const messagesRef = collection(
							database,
							`${Collections.CONVERSATION}/${conversationID}/${Collections.MESSAGE}`
						)
						const recentMessageQuery = query(
							messagesRef,
							orderBy("dateCreated", "desc"),
							limit(1)
						)
						const recentMessageSnapshot = await getDocs(recentMessageQuery)

						const recentMessage = recentMessageSnapshot.docs.length
							? {
									id: recentMessageSnapshot.docs[0].id,
									...(recentMessageSnapshot.docs[0].data() as {
										senderID: string
										dateCreated: any
										message: string
									}),
									dateCreated: recentMessageSnapshot.docs[0]
										.data()
										.dateCreated.toDate(),
								}
							: null

						// Get item details for the conversation
						const itemRef = doc(
							database,
							`${Collections.ITEM}/${conversationData.itemID}`
						)
						const itemSnapshot = await getDoc(itemRef)

						const itemData = itemSnapshot.data() as DocumentData

						return {
							id: conversationID,
							itemID: conversationData.itemID,
							participants: conversationData.participants,
							recentMessage: recentMessage
								? {
										id: recentMessage.id,
										senderID: recentMessage.senderID,
										dateCreated: recentMessage.dateCreated,
										message: recentMessage.message,
										itemName: itemData.name,
										itemImage: itemData.images[0],
										itemStatus: itemData.status,
									}
								: null,
						} as IConversation
					}
				)

				const conversationsWithMessages = await Promise.all(
					conversationPromises
				)
					.then((results) =>
						results.filter((conversation) => conversation !== null)
					) // Filter out null values
					.catch((error) => {
						console.error("Error processing conversations:", error)
						return [] // Return an empty array in case of an error
					})

				if (conversationsWithMessages && conversationsWithMessages.length > 0) {
					setConversations(conversationsWithMessages)
				} else {
					setConversations([]) // Clear the state
				}

				setConversations(conversationsWithMessages)
			} catch (err) {
				const error = err as FirestoreError
				console.error("Error fetching conversations:", error)
				setError(error.message || "Failed to load conversations.")
			} finally {
				setLoading(false)
			}
		}

		fetchConversations()
	}, [userID])

	return { conversations, loading, error }
}

export default useUserConversations
