import {
	APP_NAME,
	Colors,
	Fonts,
	FontSizes,
	Icons,
} from "@/constants/constants"
import globalStyles from "@/styles/global"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Layout, Text } from "@ui-kitten/components"
import React from "react"
import { Modal, ScrollView, StyleSheet } from "react-native"
import CustomButton from "../common/CustomButton"

interface FoodSafetyModalProps {
	isOpen: boolean
	onAgree: () => void
	onCancel: () => void
}

const FoodSafetyModal = ({
	isOpen,
	onAgree,
	onCancel,
}: FoodSafetyModalProps) => {
	return (
		<Modal visible={isOpen} animationType="slide">
			<ScrollView style={styles.container}>
				<Text style={globalStyles.title} status="primary" category="h1">
					Food Safety Rules and Liability
				</Text>

				<Text category="s2" style={styles.mainText}>
					• {APP_NAME} is a platform to facilitate conversations and exchanges
					between users.
				</Text>
				<Text category="s2" style={styles.mainText}>
					• {APP_NAME} will not be liable or responsible for any food, health,
					or safety issues that may arise when food is given or received as a
					result of these interactions.
				</Text>
				<Text category="s2" style={styles.mainText}>
					• Users are fully responsible for ensuring the safety and quality of
					the food they share or consume.
				</Text>
				<Text category="s2" style={styles.mainText}>
					• By proceeding and clicking the "I Agree" button below, you agree to
					assume all risks associated with these exchanges and interactions.
				</Text>

				<Text category="h4" style={styles.headingText} status="danger">
					All users must read and agree to the content below to proceed.
				</Text>

				<Layout style={styles.buttonContainer}>
					<CustomButton
						onPress={onAgree}
						size="giant"
						accessoryLeft={() => (
							<Ionicons
								name="checkmark-circle-outline"
								size={Icons.MEDIUM_SIZE}
								color={Colors.BACKGROUND_BLACK}
							/>
						)}
					>
						I Agree
					</CustomButton>
					<CustomButton
						onPress={onCancel}
						appearance="outline"
						status="danger"
						size="small"
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
			</ScrollView>
		</Modal>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		marginVertical: 60,
		backgroundColor: Colors.BACKGROUND_DARK,
	},
	mainText: {
		fontSize: FontSizes.MEDIUM,
		paddingVertical: 10,
		fontFamily: Fonts.REGULAR,
	},
	headingText: {
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.LARGE,
		paddingVertical: 10,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		backgroundColor: "transparent",
		marginVertical: 8,
		paddingHorizontal: 10,
	},
})

export default FoodSafetyModal
