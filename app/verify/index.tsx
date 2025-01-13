import CustomButton from "@/components/common/CustomButton"
import ResendVerification from "@/components/register/ResendVerification"
import { database } from "@/config/firebase"
import { Collections } from "@/constants/constants"
import useUser from "@/store/useUser"
import globalStyles from "@/styles/global"
import toast from "@/utils/toast"
import { Layout, Text } from "@ui-kitten/components"
import { useRouter } from "expo-router"
import { getAuth } from "firebase/auth"
import {
	collection,
	getDocs,
	limit,
	query,
	Timestamp,
	updateDoc,
	where,
} from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { StyleSheet } from "react-native"

/**
 * Renders a component for verifying the user's email address.
 *
 * @returns The VerifyEmail component.
 */
const VerifyScreen = () => {
	const [isVerified, setIsVerified] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()
	const loginUser = useUser((state: any) => state.loginUser)

	useEffect(() => {
		const auth = getAuth()
		const user = auth.currentUser

		/**
		 * Checks if the user's email is verified and performs necessary actions.
		 *
		 * @returns {Promise<void>} A promise that resolves once the verification process is complete.
		 */
		const checkEmailVerification = async (): Promise<void> => {
			if (user) {
				try {
					await user.reload() // Reloads user info from Firebase
					if (user.emailVerified) {
						// Get user details from firebase
						const userQuery = query(
							collection(database, Collections.USER),
							where("userID", "==", user.uid),
							limit(1)
						)
						const querySnapshot = await getDocs(userQuery)

						if (!querySnapshot.empty) {
							const userDoc = querySnapshot.docs[0]

							if (userDoc.data().isDeleted) {
								setError(
									"Your account has been deleted. Please register again to log in."
								)
								return
							}

							// Update lastLogin and set isVerified to true
							await updateDoc(userDoc.ref, {
								lastLogin: Timestamp.now(),
								isVerified: true, // Set isVerified to true in the database
							})

							// Save user details with zustand
							loginUser({
								userID: user.uid,
								name: userDoc.data().name,
								email: userDoc.data().email,
								userDoc: userDoc.id,
								isAdmin: userDoc.data().isAdmin,
								isVerified: true,
								expoPushToken: userDoc.data().expoPushToken,
								allowPushNotifications: true,
								location: {
									latitude: userDoc.data().location.latitude,
									longitude: userDoc.data().location.longitude,
									zipcode: userDoc.data().location.zipcode,
									country: userDoc.data().location.country,
								},
							})

							setIsVerified(true)
						} else {
							setError("User not found. Please log out and try again.")
						}
					}
				} catch (error) {
					setError(
						"Failed to reload user info. Please try again later. Error: " +
							JSON.stringify(error)
					)
				}
			}
		}

		// Poll for email verification every 5 seconds until verified
		if (!isVerified) {
			const intervalId = setInterval(() => {
				checkEmailVerification()
			}, 2000)

			// Clean up the interval when the component is unmounted or user is verified
			return () => clearInterval(intervalId)
		}
	}, [loginUser, isVerified])

	useEffect(() => {
		if (isVerified) {
			toast({
				message:
					"Email verified successfully. You will now be redirected to the discovery page.",
				type: "success",
			})

			// Redirect the user to the main app after verification
			router.push("/")
		}
	}, [isVerified, router])

	return (
		<Layout style={styles.container}>
			<Text style={globalStyles.smallHeadingText} status="primary">
				Verify Your Email
			</Text>
			<Text category="p1" style={styles.marginVertical}>
				A verification email has been sent to your email address. Please verify
				your email to continue.
			</Text>
			<Text category="p2" appearance="hint">
				Please check your spam folder if you do not see the email in your inbox.
			</Text>
			<Text category="p2" appearance="hint">
				This page will automatically redirect you once your email is verified.
			</Text>
			{error && <Text status="danger">{error}</Text>}
			{!isVerified && (
				<CustomButton
					onPress={() => {
						const auth = getAuth()
						const user = auth.currentUser
						if (user) {
							user.reload()
						}
					}}
				>
					Reload and Check Now
				</CustomButton>
			)}
			<ResendVerification onComplete={() => {}} />
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 40,
		paddingHorizontal: 30,
		flex: 1,
		gap: 14,
	},
	marginVertical: {
		marginVertical: 10,
	},
})

export default VerifyScreen
