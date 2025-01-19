import { Colors, Fonts, Icons } from "@/constants/constants"
import useUser from "@/store/useUser"
import { handleCompleteListing } from "@/utils/helpers"
import { handleDelete, handleReport } from "@/utils/messageHelpers"
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { Portal } from "@gorhom/portal"
import { Layout, Text } from "@ui-kitten/components"
import { router } from "expo-router"
import React, { useState } from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import CustomButton from "../common/CustomButton"

interface ConversationActionsProps {
	itemID: string
	conversationID: string
}

const ConversationActions = ({
	itemID,
	conversationID,
}: ConversationActionsProps) => {
	const [isVisible, setIsVisible] = useState<boolean>(false)
	const { user } = useUser()

	const togglePopover = () => {
		setIsVisible(!isVisible)
	}

	const handleConversationDelete = () => {
		handleDelete(conversationID, user.userID)
		setIsVisible(false)
		router.push("/message")
	}

	const handleConversationReport = () => {
		handleReport(conversationID, user.userID)
		setIsVisible(false)
		router.push("/message")
	}

	const handleItemComplete = () => {
		handleCompleteListing(itemID)
	}

	return (
		<>
			<TouchableOpacity onPress={togglePopover}>
				<Entypo
					name="dots-three-vertical"
					size={Icons.MEDIUM_SIZE}
					color={Colors.INFO}
				/>
			</TouchableOpacity>

			{isVisible && (
				<Portal>
					<Layout style={styles.overlay}>
						<Layout style={styles.popoverContent}>
							<Text category="h5" style={styles.subtitle}>
								Conversation Actions
							</Text>
							<Layout style={styles.buttonGroup}>
								<CustomButton
									onPress={handleItemComplete}
									accessoryLeft={() => (
										<Ionicons
											name="checkmark-circle"
											size={Icons.MEDIUM_SIZE}
											color={Colors.BACKGROUND_BLACK}
										/>
									)}
								>
									Mark as Complete
								</CustomButton>
								<CustomButton
									status="warning"
									onPress={handleConversationDelete}
									accessoryLeft={() => (
										<MaterialCommunityIcons
											name="trash-can"
											size={Icons.MEDIUM_SIZE}
											color={Colors.BACKGROUND_BLACK}
										/>
									)}
								>
									Delete Conversation
								</CustomButton>
								<CustomButton
									status="danger"
									onPress={handleConversationReport}
									accessoryLeft={() => (
										<MaterialCommunityIcons
											name="alert-circle"
											size={Icons.MEDIUM_SIZE}
											color={Colors.BACKGROUND_BLACK}
										/>
									)}
								>
									Report/Block User
								</CustomButton>
							</Layout>

							<CustomButton
								status="danger"
								accessoryLeft={() => (
									<Ionicons
										name="close-circle-outline"
										size={Icons.MEDIUM_SIZE}
										color={Colors.DANGER}
									/>
								)}
								appearance="outline"
								textColor={Colors.DANGER}
								onPress={togglePopover}
							>
								Close
							</CustomButton>
						</Layout>
					</Layout>
				</Portal>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	subtitle: {
		marginBottom: 16,
		color: Colors.INFO,
		fontFamily: Fonts.SEMI_BOLD,
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.8)", // Dimmed background
		zIndex: 1000,
	},
	popoverContent: {
		padding: 16,
		backgroundColor: Colors.BACKGROUND_BLACK,
		borderRadius: 8,
		width: 300,
		alignItems: "center",
	},
	buttonGroup: {
		backgroundColor: Colors.BACKGROUND_BLACK,
		display: "flex",
		gap: 12,
		marginVertical: 16,
	},
})

export default ConversationActions
