import { database } from "@/config/firebase"
import { APP_NAME, Collections, Colors } from "@/constants/constants"
import { IItem, ItemStatus } from "@/types"
import { Filter } from "bad-words"
import { router } from "expo-router"
import {
	Timestamp,
	addDoc,
	collection,
	doc,
	getDoc,
	updateDoc,
	writeBatch,
} from "firebase/firestore"
import { Alert } from "react-native"
import { sendPushNotification } from "./notifications"
import toast from "./toast"

/**
 * Handles the rejection of an item.
 *
 * @param item - The item to be rejected.
 * @returns A promise that resolves when the item is rejected successfully, or rejects with an error if the rejection fails.
 */
export const handleAdminReject = async (item: IItem, userName: string) => {
	try {
		const listingRef = doc(database, Collections.ITEM, item.id)
		await updateDoc(listingRef, {
			status: ItemStatus.Rejected,
			isApproved: false,
			approvedBy: userName,
			dateEdited: Timestamp.now(),
			isDeleted: true,
		})

		// Send push notification to user about rejection
		if (item.itemUserName) {
			// Get user doc by userID
			const userRef = doc(database, Collections.USER, item.userID)
			const userSnap = await getDoc(userRef)
			const userData = userSnap.data()

			if (
				!userData ||
				!userData.expoPushToken ||
				!userData.allowPushNotifications
			) {
				return
			}

			// Get the user push token
			await sendPushNotification(
				userData.expoPushToken,
				`${APP_NAME}: Oh no! Your item (${item.name}) has been rejected.`,
				`Unfortunately, your item, ${item.name}, has been rejected. Please contact ${APP_NAME} for more details.`,
				{ itemID: item.id }
			)
		}

		toast({ message: "Item rejected. The user has been emailed." })
		router.push("/")
	} catch (error) {
		console.error("Error rejecting item:", error)
		toast({ message: "Failed to reject item." })
	}
}

/**
 * Handles the approval of an item.
 *
 * @param itemId - The ID of the item to be approved.
 * @returns A Promise that resolves when the item is successfully approved.
 * @throws An error if there is a failure in approving the item.
 */
export const handleAdminApprove = async (itemId: string, userName: string) => {
	try {
		const listingRef = doc(database, Collections.ITEM, itemId)
		await updateDoc(listingRef, {
			isApproved: true,
			approvedBy: userName,
			dateEdited: Timestamp.now(),
		})
		toast({ message: "Item approved!" })
		router.push("/")
	} catch (error) {
		console.error("Error approving item:", error)
		toast({ message: "Failed to approve item." })
	}
}

/**
 * Checks for profanity in the given fields.
 *
 * @param fields - An array of objects containing the name and value of each field.
 * @returns A boolean indicating whether profanity was found in any of the fields.
 */
export const checkForProfanity = (
	fields: { name: string; value: string }[]
) => {
	const filter = new Filter()

	for (const field of fields) {
		if (filter.isProfane(field.value)) {
			toast({
				message: `Please enter a valid ${field.name}. Profanity is not allowed.`,
				type: "error",
			})
			return true
		}
	}
	return false
}

/**
 * Remove items from user-saves collection and decrease their saves count.
 * @param userID - The ID of the user.
 * @param itemIDs - An array of item IDs to be removed.
 */
export const removeUserSavedItems = async (
	userID: string,
	itemIDs: string[]
) => {
	if (!userID || itemIDs.length === 0) return

	const batch = writeBatch(database) // Use a Firestore batch for atomic operations

	try {
		for (const itemID of itemIDs) {
			// Reference to the user-saves document
			const userSaveRef = doc(
				database,
				Collections.USER_SAVES,
				`${userID}_${itemID}`
			)

			// Reference to the item document
			const itemRef = doc(database, Collections.ITEM, itemID)

			// Get the current item document
			const itemSnap = await getDoc(itemRef)

			if (itemSnap.exists()) {
				const currentSavesCount = itemSnap.data().saves || 0

				// Decrease the saves count only if it's greater than 0
				const newSavesCount = Math.max(currentSavesCount - 1, 0)

				// Update the saves count in the batch
				batch.update(itemRef, { saves: newSavesCount })
			}

			// Delete the user-saves document in the batch
			batch.delete(userSaveRef)
		}

		// Commit the batch
		await batch.commit()
	} catch (error) {
		throw error // Rethrow the error to handle it in the calling function
	}
}

// Map itemStatus to border color
export const getBorderColor = (status: ItemStatus): string => {
	switch (status) {
		case ItemStatus.Available:
			return Colors.PRIMARY // Available status color
		case ItemStatus.Given:
			return Colors.GRAY // Given status color
		case ItemStatus.Rejected:
			return Colors.DANGER // Rejected status color
		case ItemStatus.Pending:
			return Colors.INFO // Pending status color
		default:
			return Colors.PRIMARY // Default color
	}
}

export const handleItemReport = (item: IItem, userID: string) => {
	Alert.alert(
		"Confirm Report",
		"Are you sure you want to report this item and block this user? You will no longer receive messages from them or see their listed items.",
		[
			{ text: "Cancel", style: "cancel" },
			{
				text: "Report",
				style: "destructive",
				onPress: () => {
					setItemAsReported(item, userID)
				},
			},
		]
	)
}

/**
 * Reports an item and blocks the user who posted it.
 *
 * This function performs the following actions:
 * 1. Adds the item to the item-reports collection.
 * 2. Blocks the user who posted the item by adding an entry to the user-blocks collection.
 * 3. Displays a success message upon completion.
 *
 * If an error occurs during the process, it logs the error and displays an error message.
 *
 * @param item - The item to be reported.
 * @param userID - The ID of the user reporting the item.
 * @returns A promise that resolves when the operation is complete.
 */
export const setItemAsReported = async (
	item: IItem,
	userID: string
): Promise<void> => {
	try {
		// Add item to item-reports collection
		const itemReportsRef = collection(database, Collections.ITEM_REPORTS)
		await addDoc(itemReportsRef, {
			reportedBy: userID,
			itemID: item.id,
			dateReported: Timestamp.now(),
		})

		// Block the user who posted the item
		const userBlocksRef = collection(database, Collections.USER_BLOCKS)
		await addDoc(userBlocksRef, {
			blockedBy: userID,
			blockedUser: item.userID,
			dateBlocked: Timestamp.now(),
		})

		// Show success message
		toast({ message: "Item has been reported and user has been blocked." })
	} catch (error) {
		// Log error and display an error toast
		console.error("Error reporting item and blocking user:", error)
		toast({
			message:
				"Failed to report the item and block the user. Please try again.",
			type: "error",
		})
	}
}
