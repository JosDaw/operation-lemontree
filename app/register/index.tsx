import CustomButton from "@/components/common/CustomButton"
import ErrorMessage from "@/components/common/ErrorMessage"
import Footer from "@/components/common/Footer"
import Loading from "@/components/common/Loading"
import RegistrationForm from "@/components/register/RegistrationForm"
import TermsAndConditions from "@/components/register/TermsAndConditions"
import { database } from "@/config/firebase"
import { Colors, Fonts, FontSizes, Icons } from "@/constants/constants"
import useGeocode from "@/hooks/useGeocode"
import globalStyles from "@/styles/global"
import { ISignupInfo } from "@/types"
import { registerForPushNotificationsAsync } from "@/utils/notifications"
import { firebaseErrorCodes } from "@/utils/textHelpers"
import { Ionicons } from "@expo/vector-icons"
import { Layout, Text } from "@ui-kitten/components"
import { Link, router } from "expo-router"
import {
	createUserWithEmailAndPassword,
	getAuth,
	sendEmailVerification,
} from "firebase/auth"
import { doc, setDoc, Timestamp } from "firebase/firestore"
import React, { useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

// TODO: need a re-send verify email button on verify page

/**
 * RegisterScreen component handles the user registration process.
 *
 * This component provides a form for users to create a new account. It includes
 * input fields for email, name, password, and other necessary information. The
 * component performs various validations such as checking required fields,
 * validating password and email formats, confirming password match, and ensuring
 * the user agrees to the community rules. Upon successful validation, it proceeds
 * with user registration using Firebase Authentication, sends an email verification,
 * registers the user for push notifications, and saves the user data to Firestore.
 *
 */
const RegisterScreen: React.FC = () => {
	const [signupInfo, setSignupInfo] = useState<ISignupInfo>({
		email: "",
		name: "",
		password: "",
		confirmPassword: "",
		marketingConsent: false,
		country: "United Kingdom",
		zipcode: "",
		countryCode: "GB",
	})
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [error, setError] = useState<string>("")
	const [isAgreed, setIsAgreed] = useState<boolean>(false)

	const {
		latitude,
		longitude,
		geohash,
		fetchGeolocation,
		error: geocodeError,
	} = useGeocode()

	/**
	 * Handles the signup process for a new user.
	 *
	 * This function performs the following steps:
	 * 1. Checks if all required fields are filled.
	 * 2. Validates the password format.
	 * 3. Validates the email format.
	 * 4. Confirms that the password and confirmation password match.
	 * 5. Checks if the user has agreed to the community rules.
	 * 6. Proceeds with user registration using Firebase Authentication.
	 * 7. Sends an email verification to the user.
	 * 8. Registers the user for push notifications.
	 * 9. Saves the user data to Firestore.
	 * 10. Notifies the user to verify their email.
	 *
	 */
	const handleSignup = async () => {
		setIsSaving(true)

		// Check required fields
		if (
			!signupInfo.email ||
			!signupInfo.password ||
			!signupInfo.confirmPassword ||
			!signupInfo.name
		) {
			setError("Please fill in all the fields to register.")
			setIsSaving(false)
			return
		}

		// Validate password
		const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{6,}$/
		if (!passwordRegex.test(signupInfo.password)) {
			setError(
				"Password must be at least 6 characters long, contain at least 1 uppercase letter and 1 number."
			)
			setIsSaving(false)
			return
		}

		// Validate email
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
		if (!emailRegex.test(signupInfo.email)) {
			setError("Please enter a valid email.")
			setIsSaving(false)
			return
		}

		// Check password confirmation
		if (signupInfo.password !== signupInfo.confirmPassword) {
			setError("Passwords do not match.")
			setIsSaving(false)
			return
		}

		// Check terms agreement
		if (!isAgreed) {
			setError("Please agree to the community rules.")
			setIsSaving(false)
			return
		}

		// Fetch geolocation
		await fetchGeolocation(signupInfo.zipcode, signupInfo.country)

		// Handle geocoding errors
		if (geocodeError) {
			setError(
				"Failed to fetch geolocation. This information will be used to locate items in your area. Please enter a valid zipcode and country."
			)
			setIsSaving(false)
			return
		}

		// Proceed with registration
		try {
			const auth = getAuth()
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				signupInfo.email.trim(),
				signupInfo.password
			)
			const user = userCredential.user

			// Send email verification
			await sendEmailVerification(user)

			// Get Expo Push Token
			const expoPushToken = await registerForPushNotificationsAsync()

			// Save user data to Firestore
			const userRef = doc(database, `user/${user.uid}`)
			await setDoc(userRef, {
				name: signupInfo.name.trim(),
				email: signupInfo.email.trim(),
				userID: user.uid,
				isVerified: false,
				dateCreated: Timestamp.now(),
				expoPushToken,
				allowPushNotifications: true,
				marketingConsent: signupInfo.marketingConsent,
				location: {
					latitude,
					longitude,
					zipcode: signupInfo.zipcode.toUpperCase(),
					country: signupInfo.country,
					geohash,
				},
			})

			// Notify user of verification email
			setError(
				"A verification email has been sent. Please verify your email to proceed."
			)
			setIsSaving(false)

			router.push("/verify")
		} catch (err: any) {
			console.error("Error registering user:", err)
			setError(firebaseErrorCodes(err.code))
			setIsSaving(false)
		}
	}

	return (
		<KeyboardAwareScrollView>
			<ScrollView>
				<Layout style={styles.container}>
					<Text style={styles.title} status="primary" category="h1">
						Create Account
					</Text>
					<Layout style={styles.inputContainer}>
						{isSaving ? (
							<Loading text="Saving Account" />
						) : (
							<>
								<RegistrationForm
									signupInfo={signupInfo}
									setSignupInfo={setSignupInfo}
									isSaving={isSaving}
									showPassword={showPassword}
									setShowPassword={setShowPassword}
								/>
								<TermsAndConditions
									isAgreed={isAgreed}
									setIsAgreed={setIsAgreed}
								/>
							</>
						)}

						<ErrorMessage error={error} />

						<Layout style={globalStyles.horizontalRow}>
							<CustomButton
								status="primary"
								size={"giant"}
								onPress={handleSignup}
								disabled={isSaving || !isAgreed}
								gradientColors={[Colors.PRIMARY, Colors.INFO]}
								textColor={Colors.BACKGROUND_DARK}
								accessoryLeft={() => (
									<Ionicons
										name="person-add-sharp"
										size={Icons.MEDIUM_SIZE}
										color={Colors.BACKGROUND_DARK}
									/>
								)}
							>
								Register Account
							</CustomButton>
							<Link asChild href="/">
								<CustomButton
									appearance="outline"
									status="danger"
									size={"tiny"}
									disabled={isSaving}
									accessoryLeft={() => (
										<Ionicons
											name="close-circle-outline"
											size={Icons.MEDIUM_SIZE}
											color={Colors.DANGER}
										/>
									)}
									textColor={Colors.DANGER}
								>
									Cancel
								</CustomButton>
							</Link>
						</Layout>
					</Layout>
					<Footer />
				</Layout>
			</ScrollView>
		</KeyboardAwareScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 10,
		paddingVertical: 25,
	},
	title: {
		fontFamily: Fonts.BOLD,
		marginBottom: 14,
		fontSize: FontSizes.XXLARGE,
		textAlign: "center",
	},
	inputContainer: {
		marginHorizontal: 10,
	},
})

export default RegisterScreen
