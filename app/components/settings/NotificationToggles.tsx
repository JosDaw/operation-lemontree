import { database } from "@/config/firebase"
import { Collections, Colors, Fonts } from "@/constants/constants"
import useUser from "@/store/useUser"
import toast from "@/utils/toast"
import { Layout, Text, Toggle } from "@ui-kitten/components"
import { doc, Timestamp, updateDoc } from "firebase/firestore"
import React, { ReactElement } from "react"
import { StyleSheet } from "react-native"

const NotificationToggles = (): ReactElement => {
	const { user, updatePushNotifications } = useUser((state: any) => ({
		user: state.user,
		updatePushNotifications: state.updatePushNotifications,
	}))

	const onPushCheckedChange = async (isChecked: boolean): Promise<void> => {
		// Update local state
		updatePushNotifications(isChecked)

		// Update Firebase
		try {
			const userRef = doc(database, Collections.USER, user.userID)
			await updateDoc(userRef, {
				allowPushNotifications: isChecked,
				dateEdited: Timestamp.now(),
			})
		} catch (error) {
			toast({
				message: "Error updating push notifications" + JSON.stringify(error),
				type: "error",
			})
		}
	}

	return (
		<Layout>
			<Text style={styles.infoLabel} category="h5">
				Notifications
			</Text>

			<Toggle
				style={styles.toggle}
				checked={user.allowPushNotifications}
				onChange={onPushCheckedChange}
				status="info"
			>
				{() => (
					<Text style={{ fontFamily: Fonts.REGULAR, paddingLeft: 10 }}>
						Allow Push Notifications
					</Text>
				)}
			</Toggle>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
		flexWrap: "wrap",
		marginVertical: 14,
		padding: 16,
	},
	toggle: {
		margin: 2,
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-start",
		fontFamily: Fonts.REGULAR,
	},
	infoLabel: {
		marginBottom: 16,
		color: Colors.INFO,
		fontFamily: Fonts.SEMI_BOLD,
	},
})

export default NotificationToggles
