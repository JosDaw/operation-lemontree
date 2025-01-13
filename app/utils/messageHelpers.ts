import { database } from "@/config/firebase"
import { Collections } from "@/constants/constants"
import { IItem, IUser } from "@/types"
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	Timestamp,
	where,
} from "firebase/firestore"
import { Alert } from "react-native"
import { sendPushNotification } from "./notifications"
import toast from "./toast"

/**
 * Create a new conversation and add the initial message.
 * @param item - The item related to the conversation.
 * @param user - The user sending the message.
 * @param messageText - The content of the message.
 * @returns The conversation ID.
 */
export const createConversationWithMessage = async (
	item: IItem,
	user: IUser,
	messageText: string
) => {
	try {
		const conversationID = `${item.id}_${user.userID}_${item.userID}`
		const conversationRef = doc(
			database,
			Collections.CONVERSATION,
			conversationID
		)

		// Create a new conversation
		await setDoc(conversationRef, {
			itemID: item.id,
			participants: [user.userID, item.userID],
			deletedBy: {
				[user.userID]: false,
				[item.userID]: false,
			},
			dateCreated: Timestamp.now(),
		})

		// Add the initial message to the conversation
		const messagesRef = collection(conversationRef, Collections.MESSAGE)
		await addDoc(messagesRef, {
			senderID: user.userID,
			dateCreated: Timestamp.now(),
			message: messageText,
		})

		return conversationID
	} catch (error) {
		console.error("Error creating conversation:", error)
		throw new Error("Failed to create the conversation.")
	}
}

/**
 * Add a message to an existing conversation.
 * @param conversationID - The ID of the existing conversation.
 * @param user - The user sending the message.
 * @param messageText - The content of the message.
 */
export const addMessageToExistingConversation = async (
	conversationID: string,
	user: IUser,
	messageText: string
) => {
	try {
		const conversationRef = doc(
			database,
			Collections.CONVERSATION,
			conversationID
		)

		// Check if conversation exists
		const conversationDoc = await getDoc(conversationRef)
		if (!conversationDoc.exists()) {
			throw new Error("Conversation does not exist.")
		}

		// Add the message to the conversation
		const messagesRef = collection(conversationRef, Collections.MESSAGE)
		await addDoc(messagesRef, {
			senderID: user.userID,
			dateCreated: Timestamp.now(),
			message: messageText,
		})

		// Get the participants of the conversation
		const participants = conversationDoc.data().participants

		if (!participants || participants.length === 0) {
			throw new Error("No participants found in the conversation.")
		}

		// Filter out the current user to get the other participant
		const participant = participants.find(
			(p: IUser) => p.userID !== user.userID
		)

		// Check user blocked status on user-blocks collection
		const userBlocksQuery = query(
			collection(database, Collections.USER_BLOCKS),
			where("blockedBy", "==", participant),
			where("blockedUser", "==", user.userID)
		)

		// Check if the other participant has blocked the current user, if so, return without notification
		const userBlocksSnapshot = await getDocs(userBlocksQuery)
		if (!userBlocksSnapshot.empty) {
			return
		}

		// Get that participants info from the user collection
		const participantRef = doc(database, Collections.USER, participant)
		const participantDoc = await getDoc(participantRef)

		const { expoPushToken, allowPushNotifications } =
			participantDoc.data() as IUser

		if (!expoPushToken || !allowPushNotifications) {
			return
		}

		// Send a push notification to the other participant
		await sendPushNotification(
			expoPushToken,
			`New message from ${user.name}`,
			messageText,
			{ conversationID: conversationID }
		)
	} catch (error) {
		console.error("Error adding message to conversation:", error)
		throw new Error("Failed to add the message.")
	}
}

/**
 * Retrieves an item from the database using the provided conversation ID.
 *
 * The conversation ID is expected to be in the format "itemID_userID_otherUserID".
 * This function extracts the itemID from the conversation ID, fetches the
 * corresponding item document from the database, and returns the item data.
 *
 * @param {string} conversationID - The conversation ID from which to extract the item ID.
 * @returns {Promise<IItem>} A promise that resolves to the item data.
 * @throws {Error} If the item does not exist or if there is an error during the retrieval process.
 */
export const getItemFromConversationID = async (
	conversationID: string
): Promise<IItem> => {
	try {
		const itemID = conversationID.split("_")[0]

		const itemRef = doc(database, Collections.ITEM, itemID)
		const itemDoc = await getDoc(itemRef)

		if (!itemDoc.exists()) {
			throw new Error("Item does not exist.")
		}

		return { ...itemDoc.data(), id: itemDoc.id } as IItem
	} catch (error) {
		console.error("Error getting item from conversation ID:", error)
		throw new Error("Failed to get the item.")
	}
}

/**
 * Get the participants of a conversation and their data.
 * @param conversationID
 * @returns
 */
export const getParticipantsFromConversationID = async (
	conversationID: string
) => {
	try {
		// Step 1: Fetch the conversation document
		const conversationRef = doc(
			database,
			Collections.CONVERSATION,
			conversationID
		)
		const conversationDoc = await getDoc(conversationRef)

		if (!conversationDoc.exists()) {
			throw new Error("Conversation does not exist.")
		}

		const participants = conversationDoc.data().participants as string[]

		if (!participants || participants.length === 0) {
			throw new Error("No participants found in the conversation.")
		}

		// Step 2: Fetch each participant's data from the user collection
		const participantDataPromises = participants.map(async (participantID) => {
			const userRef = doc(database, Collections.USER, participantID)
			const userDoc = await getDoc(userRef)

			if (!userDoc.exists()) {
				console.warn(`User with ID ${participantID} does not exist.`)
				return null
			}

			return { id: participantID, ...(userDoc.data() as IUser) }
		})

		// Wait for all user data to be fetched
		const participantData = (await Promise.all(participantDataPromises)).filter(
			(data) => data !== null
		)

		return participantData
	} catch (error) {
		console.error("Error getting participants and their data:", error)
		throw new Error("Failed to get the participants and their data.")
	}
}

/**
 * Sets a conversation as deletedBy by at least one user
 * @param conversationID
 * @param userID
 */
export const setConversationAsDeleted = async (
	conversationID: string,
	userID: string
) => {
	try {
		const conversationRef = doc(
			database,
			Collections.CONVERSATION,
			conversationID
		)
		await setDoc(
			conversationRef,
			{
				deletedBy: {
					[userID]: true, // Mark this user as having deleted the conversation
				},
			},
			{ merge: true } // Merge to avoid overwriting other fields
		)
		toast({ message: "Conversation has been deleted." })
	} catch (error) {
		console.error("Error setting conversation as deleted:", error)
		throw new Error("Failed to set the conversation as deleted.")
	}
}

/**
 * Allows a user to report a conversation and block the other user
 * @param conversationID
 * @param userID
 */
export const setConversationAsReported = async (
	conversationID: string,
	userID: string
) => {
	try {
		// Reference the conversation document
		const conversationRef = doc(database, "conversation", conversationID)

		// Get the conversation document
		const conversationSnap = await getDoc(conversationRef)

		if (!conversationSnap.exists()) {
			throw new Error("Conversation does not exist.")
		}

		// Extract participants and find the other participant
		const conversationData = conversationSnap.data()
		const participants: string[] = conversationData.participants
		const otherParticipantID = participants.find((id) => id !== userID)

		if (!otherParticipantID) {
			throw new Error("Other participant not found.")
		}

		// Mark the conversation as deleted
		await setConversationAsDeleted(conversationID, userID)

		// Add the other participant to the user-blocks collection
		const userBlocksRef = collection(database, Collections.USER_BLOCKS)
		await addDoc(userBlocksRef, {
			blockedBy: userID,
			blockedUser: otherParticipantID,
			dateBlocked: Timestamp.now(),
		})

		toast({ message: "User has been reported and blocked." })
	} catch (error) {
		console.error("Error setting conversation as reported:", error)
		throw new Error("Failed to set the conversation as reported.")
	}
}

// Handle delete confirmation
export const handleDelete = (conversationID: string, userID: string) => {
	Alert.alert(
		"Confirm Delete",
		"Are you sure you want to delete this conversation?",
		[
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => {
					setConversationAsDeleted(conversationID, userID)
				},
			},
		]
	)
}

export const handleReport = (conversationID: string, userID: string) => {
	Alert.alert(
		"Confirm Report",
		"Are you sure you want to report and block this user? You will no longer receive messages from them or see their listed items.",
		[
			{ text: "Cancel", style: "cancel" },
			{
				text: "Report",
				style: "destructive",
				onPress: () => {
					setConversationAsReported(conversationID, userID)
				},
			},
		]
	)
}
