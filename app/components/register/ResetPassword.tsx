import { Colors, Icons } from "@/constants/constants"
import globalStyles from "@/styles/global"
import { Ionicons } from "@expo/vector-icons"
import { Layout, Text } from "@ui-kitten/components"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import React, { useState } from "react"
import CustomButton from "../common/CustomButton"
import CustomInput from "../common/CustomInput"
import Loading from "../common/Loading"

interface ResetPasswordProps {
	handleClose: () => void
}

/**
 * Represents a component for resetting a password.
 *
 * @param handleClose - A function to handle the close event.
 */
const ResetPassword = ({ handleClose }: ResetPasswordProps) => {
	const [email, setEmail] = useState<string>("")
	const [isSaving, setIsSaving] = useState<boolean>(false)

	/**
	 * Sends a password reset email via Firebase
	 */
	const handlePasswordReset = () => {
		if (email !== "") {
			setIsSaving(true)
			const auth = getAuth()

			sendPasswordResetEmail(auth, email)
				.then(() => {
					handleClose()
				})
				.catch((error: any) => {})
		}
	}

	return (
		<Layout
			style={{
				width: "100%",
				backgroundColor: "transparent",
				marginBottom: 50,
			}}
		>
			<Text style={globalStyles.smallHeadingText}>Reset Password</Text>
			<CustomInput
				label="Email"
				placeholder="Your email"
				value={email}
				onChangeText={(value) => {
					setEmail(value)
				}}
				disabled={isSaving}
			/>
			<Layout
				style={[
					{
						marginVertical: 20,
						flexDirection: "row",
						justifyContent: "space-evenly",
					},
				]}
			>
				<CustomButton
					onPress={handlePasswordReset}
					status="info"
					disabled={isSaving}
				>
					Send Reset Password
				</CustomButton>
				<CustomButton
					onPress={handleClose}
					status="danger"
					appearance="outline"
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
			</Layout>

			{isSaving && <Loading />}
		</Layout>
	)
}

export default ResetPassword
