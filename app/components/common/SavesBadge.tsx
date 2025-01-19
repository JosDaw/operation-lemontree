import { database } from "@/config/firebase"
import {
	Collections,
	Colors,
	Fonts,
	FontSizes,
	Icons,
} from "@/constants/constants"
import useUser from "@/store/useUser"
import toast from "@/utils/toast"
import { MaterialIcons } from "@expo/vector-icons"
import { Layout } from "@ui-kitten/components"
import { BlurView } from "expo-blur"
import {
	collection,
	doc,
	getDocs,
	increment,
	query,
	setDoc,
	Timestamp,
	updateDoc,
	where,
} from "firebase/firestore"
import React, { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native"

interface SavesBadgeProps {
	itemID: string
	initialSaves: number
	variant?: "default" | "large"
}

const SavesBadge: React.FC<SavesBadgeProps> = ({
	itemID,
	initialSaves,
	variant = "default",
}) => {
	const [saves, setSaves] = useState(initialSaves)
	const [isSaving, setIsSaving] = useState(false)

	const { isLoggedIn, user } = useUser()

	const containerStyle: ViewStyle =
		variant === "default" ? styles.container : styles.largeContainer
	const textStyle = variant === "default" ? styles.text : styles.largeText
	const iconSize = variant === "default" ? Icons.SMALL_SIZE : Icons.MEDIUM_SIZE

	/**
	 * Handles the save action for an item.
	 *
	 * This function performs the following steps:
	 * 1. Checks if the user is logged in and if the user object is available.
	 * 2. Prevents multiple save actions by checking if a save operation is already in progress.
	 * 3. Checks if the user has already saved the item.
	 * 4. Updates the saves count on the item in Firestore.
	 * 5. Adds a new document to the user-saves collection in Firestore.
	 * 6. Updates the local saves count and displays a success message.
	 *
	 * If any error occurs during the process, an error message is displayed.
	 */
	const handleSave = async () => {
		if (!isLoggedIn || !user) {
			toast({
				message: "You must be logged in to save items.",
				type: "error",
			})
			return
		}

		if (isSaving) return
		setIsSaving(true)

		try {
			// Check if the user has already saved this item
			const userSavesRef = collection(database, Collections.USER_SAVES)
			const q = query(
				userSavesRef,
				where("itemID", "==", itemID),
				where("userID", "==", user.userID)
			)
			const querySnapshot = await getDocs(q)

			if (!querySnapshot.empty) {
				toast({
					message: "You have already saved this item.",
					type: "error",
				})
				return
			}

			// 1. Update the saves count on the item in Firestore
			const itemRef = doc(database, Collections.ITEM, itemID)
			await updateDoc(itemRef, { saves: increment(1) })

			// 2. Add a new document to the user-saves collection
			const documentID = `${user.userID}_${itemID}`
			const newSaveRef = doc(database, Collections.USER_SAVES, documentID)

			// Set the document with the custom ID
			await setDoc(newSaveRef, {
				itemID: itemID,
				userID: user.userID,
				savedAt: Timestamp.now(),
			})

			// Update local saves count
			setSaves((prev) => prev + 1)
			toast({
				message: "Item saved successfully!",
				type: "success",
			})
		} catch (error) {
			console.error("Error saving item:", error)
			toast({
				message: "An error occurred while saving the item. Please try again.",
				type: "error",
			})
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<BlurView intensity={20} tint="light" style={containerStyle}>
			<TouchableOpacity onPress={handleSave} disabled={isSaving}>
				<Layout style={styles.layout}>
					<MaterialIcons name="favorite" size={iconSize} color={Colors.PINK} />
					<Text style={textStyle}>{saves}</Text>
				</Layout>
			</TouchableOpacity>
		</BlurView>
	)
}

const styles = StyleSheet.create({
	layout: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.TRANSPARENT,
	},
	container: {
		borderRadius: 20,
		paddingHorizontal: 4,
		paddingVertical: 2,
		position: "absolute",
		bottom: -5,
		left: -5,
		overflow: "hidden",
	},
	text: {
		marginLeft: 5,
		fontSize: FontSizes.SMALL,
		color: Colors.WHITE,
		fontFamily: Fonts.BOLD,
	},
	largeContainer: {
		borderRadius: 30,
		paddingHorizontal: 10,
		paddingVertical: 6,
		overflow: "hidden",
		width: 70,
	},
	largeText: {
		marginLeft: 10,
		fontSize: FontSizes.LARGE,
		color: Colors.WHITE,
		fontFamily: Fonts.BOLD,
	},
})

export default SavesBadge
