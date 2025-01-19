import { database } from "@/config/firebase"
import { Collections, Colors, Icons } from "@/constants/constants"
import useUser from "@/store/useUser"
import toast from "@/utils/toast"
import AntDesign from "@expo/vector-icons/AntDesign"
import { router } from "expo-router"
import { getAuth } from "firebase/auth"
import { doc, Timestamp, updateDoc } from "firebase/firestore"
import React from "react"
import CustomButton from "../common/CustomButton"

interface ILogoutAccountButtonProps {
	setIsProcessing: (isProcessing: boolean) => void
}

const LogoutAccountButton = ({
	setIsProcessing,
}: ILogoutAccountButtonProps) => {
	const { user, logoutUser } = useUser()

	/**
	 * Handles the logout functionality.
	 *
	 * @returns {Promise<void>} A promise that resolves when the logout process is complete.
	 */
	const handleLogout = async (): Promise<void> => {
		setIsProcessing(true)
		try {
			// Revoke expoPushToken from Firebase to prevent further push notifications
			const userRef = doc(database, Collections.USER, user.userID)
			await updateDoc(userRef, {
				expoPushToken: "",
				dateEdited: Timestamp.now(),
			})

			logoutUser()

			const auth = getAuth()
			await auth.signOut()

			router.push("/")
		} catch (error: any) {
			toast({
				message:
					"Failed to log out. Please try again. Error: " +
					JSON.stringify(error),
				type: "error",
			})
			setIsProcessing(false)
		}
	}

	return (
		<CustomButton
			status="danger"
			onPress={handleLogout}
			accessoryLeft={() => (
				<AntDesign
					name="logout"
					size={Icons.MEDIUM_SIZE}
					color={Colors.BACKGROUND_BLACK}
				/>
			)}
		>
			Log Out
		</CustomButton>
	)
}

export default LogoutAccountButton
