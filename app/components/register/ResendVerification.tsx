import CustomButton from "@/components/common/CustomButton"
import { Colors, Icons } from "@/constants/constants"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Layout, Text } from "@ui-kitten/components"
import { getAuth, sendEmailVerification } from "firebase/auth"
import React, { useState } from "react"
import { StyleSheet } from "react-native"

/**
 * ResendVerification Component.
 * Handles the functionality to resend the email verification.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onComplete - Callback to be triggered after successful resend.
 */
const ResendVerification = ({ onComplete }: { onComplete: () => void }) => {
	const [isSending, setIsSending] = useState<boolean>(false)
	const [message, setMessage] = useState<string>("")
	const [error, setError] = useState<string>("")

	const handleResendVerification = async () => {
		setIsSending(true)
		setMessage("")
		setError("")

		try {
			const auth = getAuth()
			const user = auth.currentUser

			if (!user) {
				throw new Error("No user is currently logged in.")
			}

			await sendEmailVerification(user)
			setMessage("Verification email has been sent. Please check your inbox.")
			onComplete()
		} catch (err: any) {
			setError(err.message || "Failed to resend verification email.")
		} finally {
			setIsSending(false)
		}
	}

	return (
		<Layout style={styles.container}>
			{message ? (
				<Text style={styles.message} status="success">
					{message}
				</Text>
			) : error ? (
				<Text style={styles.error} status="danger">
					{error}
				</Text>
			) : null}

			<CustomButton
				status="primary"
				appearance="outline"
				disabled={isSending}
				onPress={handleResendVerification}
				accessoryLeft={() => (
					<MaterialCommunityIcons
						name="email-send"
						size={Icons.MEDIUM_SIZE}
						color={isSending ? Colors.GRAY : Colors.PRIMARY}
					/>
				)}
				textColor={isSending ? Colors.GRAY : Colors.PRIMARY}
			>
				{isSending ? "Sending..." : "Resend Verification Email"}
			</CustomButton>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		alignItems: "center",
	},
	message: {
		marginBottom: 10,
		textAlign: "center",
		fontSize: 14,
	},
	error: {
		marginBottom: 10,
		textAlign: "center",
		fontSize: 14,
	},
})

export default ResendVerification
