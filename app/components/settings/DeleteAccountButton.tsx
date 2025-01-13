import { database } from "@/config/firebase"
import { APP_NAME, Collections, Colors, Icons } from "@/constants/constants"
import useUser from "@/store/useUser"
import toast from "@/utils/toast"
import AntDesign from "@expo/vector-icons/AntDesign"
import { Layout } from "@ui-kitten/components"
import { router } from "expo-router"
import { deleteUser, getAuth } from "firebase/auth"
import {
	Timestamp,
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore"
import React from "react"
import { Alert, StyleSheet } from "react-native"
import CustomButton from "../common/CustomButton"

interface IDeleteAccountButtonProps {
	setIsProcessing: (isProcessing: boolean) => void
}

const DeleteAccountButton = ({
	setIsProcessing,
}: IDeleteAccountButtonProps) => {
	const { logoutUser } = useUser()

	/**
	 * Displays an alert to confirm the deletion of the user's account.
	 * This action is irreversible.
	 *
	 * @returns void
	 */
	const confirmDeleteAccount = () => {
		Alert.alert(
			"Delete Account",
			"Are you sure you want to delete your account? This action is irreversible.",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Delete", style: "destructive", onPress: handleDeleteAccount },
			]
		)
	}

	/**
	 * Handles the deletion of a user account.
	 *
	 * This function deletes the user document from Firestore and the user account from Firebase Auth.
	 * It also clears the user data from the global state and redirects to the login page after account deletion.
	 *
	 * @returns {Promise<void>} A promise that resolves when the account deletion is complete.
	 * @throws {Error} If there is an error during the account deletion process.
	 */
	const handleDeleteAccount = async (): Promise<void> => {
		setIsProcessing(true)
		const auth = getAuth()
		const user = auth.currentUser

		if (user) {
			try {
				// Set all user listings as deleted
				const userItemsQuery = query(
					collection(database, Collections.ITEM),
					where("userID", "==", user.uid)
				)

				const userItemsSnapshot = await getDocs(userItemsQuery)

				const deleteItemPromises = userItemsSnapshot.docs.map((doc) => {
					const itemRef = doc.ref
					return updateDoc(itemRef, {
						isDeleted: true,
						dateEdited: Timestamp.now(),
					})
				})

				await Promise.all(deleteItemPromises)

				// Set user document as isDeleted
				const userRef = doc(database, Collections.USER, user.uid)
				await updateDoc(userRef, {
					isDeleted: true,
					expoPushToken: "",
					dateEdited: Timestamp.now(),
				})

				// Delete user account from Firebase Auth
				await deleteUser(user)

				logoutUser() // Clear user data from the global state
				router.push("/login") // Redirect to login page after account deletion
			} catch (error) {
				toast({
					message:
						`Failed to delete the account. Please try again or contact ${APP_NAME} for assistance. Error: ` +
						JSON.stringify(error),
					type: "error",
				})
			} finally {
				setIsProcessing(false)
			}
		} else {
			setIsProcessing(false)
			toast({
				message: `Failed to delete the account. Please try again or contact ${APP_NAME} for assistance.`,
				type: "error",
			})
		}
	}

	return (
		<Layout style={styles.deleteContainer}>
			<CustomButton
				status="danger"
				appearance="outline"
				size="small"
				onPress={confirmDeleteAccount}
				accessoryLeft={() => (
					<AntDesign
						name="deleteuser"
						size={Icons.MEDIUM_SIZE}
						color={Colors.DANGER}
					/>
				)}
				textColor={Colors.DANGER}
			>
				Delete Account
			</CustomButton>
		</Layout>
	)
}

const styles = StyleSheet.create({
	deleteContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 50,
		marginHorizontal: 10,
	},
})

export default DeleteAccountButton
