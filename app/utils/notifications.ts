import { database } from "@/config/firebase"
import { APP_NAME, Collections, EXPO_PUSH_API } from "@/constants/constants"
import Constants from "expo-constants"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { collection, getDocs, query, where } from "firebase/firestore"
import toast from "./toast"

/**
 * Sets the notification handler for the app.
 */
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: true,
	}),
})

/**
 * Registers the device for push notifications.
 *
 * @returns {Promise<string>} The push notification token.
 */
export async function registerForPushNotificationsAsync(): Promise<
	string | undefined
> {
	let token

	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync()
		let finalStatus = existingStatus
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync()
			finalStatus = status
		}
		if (finalStatus !== "granted") {
			toast({
				message:
					"You have not enabled notifications. Please enable notifications to receive alerts.",
				type: "error",
			})
			token = ""
		}
		token = (
			await Notifications.getExpoPushTokenAsync({
				projectId: Constants.expoConfig?.extra?.eas.projectId,
			})
		).data
	} else {
		toast({
			message: "Must use physical device for Push Notifications",
			type: "error",
		})
	}

	return token
}

/**
 * Sends a push notification using the Expo push notification service.
 * NOTE: this implementation is for MVP purposes only as it only permits one device token per user.
 * For production, you should store multiple tokens per user and send notifications to all of them.
 *
 * @param expoPushToken - The Expo push token of the recipient device.
 * @param title - The title of the notification.
 * @param body - The body text of the notification.
 * @param data - Additional data to include with the notification.
 * @returns A promise that resolves when the notification has been sent.
 */
export async function sendPushNotification(
	expoPushToken: string,
	title: string,
	body: string,
	data: object
) {
	const message = {
		to: expoPushToken,
		sound: "default",
		title: title,
		body: body,
		data: data,
	}

	try {
		const response = await fetch(EXPO_PUSH_API, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Accept-encoding": "gzip, deflate",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(message),
		})

		if (!response.ok) {
			// Handle response errors
			throw new Error(
				`Failed to send push notification: ${response.statusText}`
			)
		}
	} catch (error) {
		console.error("Error sending push notification:", error)
	}
}

/**
 * Sends a push notification to admins about a new item waiting for approval.
 *
 * @returns {Promise<void>} A promise that resolves when the push notification is sent.
 */
export const handleAdminNotifier = async (): Promise<void> => {
	const adminsQuery = query(
		collection(database, Collections.USER),
		where("isAdmin", "==", true),
		where("allowPushNotifications", "==", true)
	)

	const adminsSnapshot = await getDocs(adminsQuery)

	if (adminsSnapshot.empty) {
		throw new Error("No admin users found.")
	}

	// Loop through admin users and send a push notification to each
	adminsSnapshot.forEach(async (doc) => {
		const data = doc.data()
		const expoPushToken = data?.expoPushToken

		await sendPushNotification(
			expoPushToken,
			`New item on ${APP_NAME}!`,
			`A user has posted a new item waiting for your approval!`,
			{ itemID: null }
		)
	})
}
