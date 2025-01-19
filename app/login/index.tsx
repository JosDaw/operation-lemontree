import CustomButton from "@/components/common/CustomButton"
import CustomInput from "@/components/common/CustomInput"
import Footer from "@/components/common/Footer"
import Loading from "@/components/common/Loading"
import PasswordIcon from "@/components/register/PasswordIcon"
import ResendVerification from "@/components/register/ResendVerification"
import ResetPassword from "@/components/register/ResetPassword"
import { database } from "@/config/firebase"
import {
	Collections,
	Colors,
	Fonts,
	FontSizes,
	Icons,
} from "@/constants/constants"
import useUser from "@/store/useUser"
import globalStyles from "@/styles/global"
import { ILoginInfo } from "@/types"
import { isWeb } from "@/utils/helpers"
import { registerForPushNotificationsAsync } from "@/utils/notifications"
import { firebaseErrorCodes } from "@/utils/textHelpers"
import toast from "@/utils/toast"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Layout, Text } from "@ui-kitten/components"
import { Link, router } from "expo-router"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import {
	collection,
	doc,
	getDocs,
	limit,
	query,
	Timestamp,
	updateDoc,
	where,
} from "firebase/firestore"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

/**
 * Renders a component for user login.
 *
 * @returns The Login component.
 */
const LoginScreen = () => {
	const [loginInfo, setLoginInfo] = useState<ILoginInfo>({
		email: "",
		password: "",
	})

	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [isResetOpen, setIsResetOpen] = useState<boolean>(false)
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [error, setError] = useState<string>("")
	const [isVerifyAllowed, setIsVerifiedAllowed] = useState<boolean>(false)
	const [resendVerification, setResendVerification] = useState<boolean>(false)
	const loginUser = useUser((state: any) => state.loginUser)

	/**
	 * Handles the login functionality.
	 *
	 * @returns {Promise<void>} A promise that resolves when the login process is complete.
	 */
	const handleLogin = async (): Promise<void> => {
		if (!loginInfo.email || !loginInfo.password)
			return setError("Please enter your email and password.")

		setIsSaving(true)

		const auth = getAuth()

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				loginInfo.email.trim(),
				loginInfo.password
			)

			const userQuery = query(
				collection(database, Collections.USER),
				where("userID", "==", userCredential.user.uid),
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

				if (!userDoc.data().isVerified) {
					setError(
						"Your account is not verified. Please check your email for the verification link, or verify again with the button below."
					)
					setIsVerifiedAllowed(true)
					return
				}

				// Proceed to successful login
				loginUser({
					userID: userCredential.user.uid,
					name: userDoc.data().name,
					email: userDoc.data().email,
					isVerified: userDoc.data().isVerified,
					isAdmin: userDoc.data().isAdmin || false,
					expoPushToken: userDoc.data().expoPushToken,
					allowPushNotifications: userDoc.data().allowPushNotifications,
					location: {
						latitude: userDoc.data().location.latitude,
						longitude: userDoc.data().location.longitude,
						zipcode: userDoc.data().location.zipcode,
						country: userDoc.data().location.country,
					},
				})

				// Update last login and expo push token
				try {
					let expoPushToken = await registerForPushNotificationsAsync()
					const userRef = doc(
						database,
						Collections.USER,
						userCredential.user.uid
					)
					await updateDoc(userRef, {
						lastLogin: Timestamp.now(),
						expoPushToken: expoPushToken,
					})
				} catch (error: any) {
					setError(firebaseErrorCodes(error.code))
				}

				router.push("/")

				if (isWeb()) {
					toast({
						message:
							"Warning: Login does not persist on this web demo. Some features may break or require logging in again.",
						type: "error",
					})
				}
			} else {
				setError("User not found. Please log out and try again.")
			}
		} catch (error: any) {
			setError(firebaseErrorCodes(error.code))
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<KeyboardAwareScrollView
			contentContainerStyle={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				minHeight: "100%",
				backgroundColor: Colors.BACKGROUND_DARK,
			}}
		>
			<Layout style={styles.layout}>
				<Text style={styles.title} status="primary" category="h1">
					Login
				</Text>
				<Layout style={styles.formContainer}>
					{!isResetOpen && (
						<>
							<CustomInput
								label="Email"
								placeholder="Your email"
								value={loginInfo.email}
								onChangeText={(value) =>
									setLoginInfo({ ...loginInfo, email: value })
								}
								disabled={isSaving}
								autoCapitalize="none"
							/>

							<CustomInput
								label="Password"
								placeholder="Your password"
								value={loginInfo.password}
								onChangeText={(value) =>
									setLoginInfo({ ...loginInfo, password: value })
								}
								secureTextEntry={!showPassword}
								disabled={isSaving}
								autoCapitalize="none"
								autoCorrect={false}
								accessoryRight={() => (
									<PasswordIcon
										showPassword={showPassword}
										setShowPassword={setShowPassword}
										isDisabled={isSaving}
									/>
								)}
							/>
							<Layout style={styles.resetContainer}>
								<CustomButton
									status="danger"
									appearance="outline"
									size="small"
									disabled={isSaving}
									onPress={() => setIsResetOpen(true)}
									accessoryLeft={() => (
										<MaterialCommunityIcons
											name="lock-reset"
											size={Icons.MEDIUM_SIZE}
											color={Colors.DANGER}
										/>
									)}
									textColor={Colors.DANGER}
								>
									Reset Password
								</CustomButton>
							</Layout>
						</>
					)}

					{isResetOpen && (
						<ResetPassword handleClose={() => setIsResetOpen(false)} />
					)}

					{error && error !== "" && (
						<Text status="danger" style={styles.errorMessage}>
							{error}
						</Text>
					)}

					{isVerifyAllowed && (
						<CustomButton
							status="info"
							size="small"
							disabled={isSaving}
							onPress={() => setResendVerification(true)}
						>
							Resend Verification Email
						</CustomButton>
					)}

					{resendVerification && (
						<ResendVerification
							onComplete={() => {
								setResendVerification(false)
								setError(
									"Email verification sent. Please check your inbox/spam inbox."
								)
								router.push("/verify")
							}}
						/>
					)}

					{isSaving ? (
						<Loading />
					) : (
						!isResetOpen && (
							<Layout style={styles.buttonContainer}>
								<CustomButton
									status="primary"
									size="giant"
									onPress={handleLogin}
								>
									Login
								</CustomButton>
							</Layout>
						)
					)}

					<Layout style={styles.createAccountContainer}>
						<Text style={globalStyles.smallHeadingText}>
							Need to create an account?{` `}
							<Link href="/register" style={globalStyles.linkText}>
								Sign Up
							</Link>
						</Text>
					</Layout>
				</Layout>
			</Layout>
			<Footer />
		</KeyboardAwareScrollView>
	)
}

const styles = StyleSheet.create({
	layout: {
		paddingHorizontal: 10,
		paddingVertical: 25,
	},
	title: {
		fontFamily: Fonts.BOLD,
		marginBottom: 14,
		fontSize: FontSizes.XXLARGE,
		textAlign: "center",
	},
	formContainer: {
		marginHorizontal: 10,
	},
	input: {
		margin: 10,
	},
	buttonContainer: {
		marginTop: 100,
	},
	createAccountContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginTop: 50,
	},
	errorMessage: {
		textAlign: "center",
		paddingVertical: 10,
		fontFamily: Fonts.SEMI_BOLD,
	},
	resetContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 10,
		marginHorizontal: 10,
	},
})

export default LoginScreen
