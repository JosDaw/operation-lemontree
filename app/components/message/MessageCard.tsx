import { Colors, Fonts, FontSizes, Icons } from "@/constants/constants"
import { IMessage, ItemStatus, IUser } from "@/types"
import { getBorderColor } from "@/utils/itemHelpers"
import { handleDelete, handleReport } from "@/utils/messageHelpers"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Layout } from "@ui-kitten/components"
import { Link } from "expo-router"
import React, { useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native"
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable"
import StatusBadge from "../common/StatusBadge"

interface MessageCardProps {
	message: IMessage
	conversationID: string
	user: IUser
}

export default function MessageCard({
	message,
	conversationID,
	user,
}: MessageCardProps) {
	const [isVisible, setIsVisible] = useState<boolean>(true)

	// Handle delete confirmation
	const handleConversationDelete = async () => {
		handleDelete(conversationID, user.userID)
		setIsVisible(false)
	}

	// Handle report confirmation
	const handleConversationReport = () => {
		handleReport(conversationID, user.userID)
		setIsVisible(false)
	}

	// Render the delete action
	const renderDeleteAction = () => (
		<TouchableOpacity
			style={[styles.actionContainer, styles.deleteAction]}
			onPress={handleConversationDelete}
		>
			<MaterialCommunityIcons
				name="trash-can"
				size={Icons.MEDIUM_SIZE}
				color={Colors.WHITE}
			/>
			<Text style={styles.actionText}>Delete</Text>
		</TouchableOpacity>
	)

	// Render the report/block action
	const renderReportAction = () => (
		<TouchableOpacity
			style={[styles.actionContainer, styles.reportAction]}
			onPress={handleConversationReport}
		>
			<MaterialCommunityIcons
				name="alert-circle"
				size={Icons.MEDIUM_SIZE}
				color={Colors.WHITE}
			/>
			<Text style={styles.actionText}>Report & Block User</Text>
		</TouchableOpacity>
	)

	// If the card is not visible, don't render anything
	if (!isVisible) {
		return null
	}

	return (
		<Swipeable
			renderLeftActions={renderDeleteAction}
			renderRightActions={renderReportAction}
			leftThreshold={50}
			rightThreshold={50}
		>
			<Link href={`/conversation/${conversationID}`} asChild>
				<TouchableOpacity style={styles.card}>
					<StatusBadge status={message.itemStatus} />

					<Layout style={styles.leftContainer}>
						<Image
							source={{ uri: message.itemImage }}
							style={[
								styles.image,
								{ borderColor: getBorderColor(message.itemStatus) },
							]}
						/>
						<Layout style={{ backgroundColor: Colors.TRANSPARENT }}>
							<Text style={styles.senderName}>{message.itemName}</Text>
							<Text style={styles.messagePreview}>{message.message}</Text>
						</Layout>
					</Layout>
					<MaterialCommunityIcons
						name="message"
						size={Icons.MEDIUM_SIZE}
						color={
							message.itemStatus === ItemStatus.Available
								? Colors.PRIMARY
								: Colors.GRAY
						}
						style={styles.icon}
					/>
				</TouchableOpacity>
			</Link>
		</Swipeable>
	)
}

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 12,
		backgroundColor: Colors.BACKGROUND_BLACK,
		borderRadius: 25,
		margin: 16,
	},
	leftContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		backgroundColor: Colors.TRANSPARENT,
	},
	image: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 2,
		borderColor: Colors.PRIMARY,
	},
	senderName: {
		fontSize: FontSizes.MEDIUM,
		color: Colors.WHITE,
		fontFamily: Fonts.SEMI_BOLD,
	},
	messagePreview: {
		fontSize: FontSizes.SMALL,
		color: Colors.GRAY,
		fontFamily: Fonts.REGULAR,
	},
	icon: {
		marginLeft: 8,
	},
	actionContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 25,
		margin: 16,
	},
	deleteAction: {
		backgroundColor: Colors.WARNING,
	},
	reportAction: {
		backgroundColor: Colors.DANGER,
	},
	actionText: {
		color: Colors.WHITE,
		fontSize: FontSizes.MEDIUM,
		fontFamily: Fonts.BOLD,
		marginTop: 4,
	},
})
