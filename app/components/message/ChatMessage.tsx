import { Colors, Fonts, FontSizes } from "@/constants/constants"
import { IUser } from "@/types"
import { Layout, Text } from "@ui-kitten/components"
import { Timestamp } from "firebase/firestore"
import React from "react"
import { Image, StyleSheet } from "react-native"

interface ChatMessageProps {
	message: {
		id: string
		message: string
		senderID: string
		dateCreated: Timestamp
	}
	isCurrentUser: boolean
	participants: IUser[] | null
}

const ChatMessage: React.FC<ChatMessageProps> = ({
	message,
	isCurrentUser,
	participants,
}) => {
	// Find the participant whose id matches the senderID
	const participant = participants?.find((p) => p.userID === message.senderID)

	return (
		<Layout
			style={[
				styles.messageContainer,
				isCurrentUser ? styles.userMessage : styles.otherMessage,
			]}
		>
			{/* Render the participant's name above the avatar and message */}
			{participant && (
				<Text style={styles.userName}>
					{isCurrentUser ? "You" : participant.name || "Unknown User"}
				</Text>
			)}

			{/* Avatar and message row */}
			<Layout
				style={[
					styles.rowContainer,
					isCurrentUser
						? { flexDirection: "row-reverse" }
						: { flexDirection: "row" },
				]}
			>
				<Layout style={isCurrentUser ? styles.userAvatar : styles.otherAvatar}>
					<Image
						source={require("../../../assets/lemon-avatar.png")}
						style={[styles.avatarImage, !isCurrentUser && styles.flippedAvatar]}
					/>
				</Layout>

				<Layout
					style={[
						styles.messageBubble,
						isCurrentUser ? styles.userBubble : styles.otherBubble,
					]}
				>
					<Text style={styles.messageText}>{message.message}</Text>
					<Text style={styles.timestamp}>
						{message.dateCreated.toDate().toLocaleTimeString([], {
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</Text>
				</Layout>
			</Layout>
		</Layout>
	)
}

const styles = StyleSheet.create({
	messageContainer: {
		marginVertical: 8,
		alignItems: "flex-start",
	},
	rowContainer: {
		alignItems: "center",
	},
	messageBubble: {
		maxWidth: "85%",
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	userMessage: {
		alignItems: "flex-end",
	},
	otherMessage: {
		alignItems: "flex-start",
	},
	userBubble: {
		backgroundColor: Colors.BACKGROUND_BLACK,
		borderColor: Colors.PRIMARY + "80",
		borderWidth: 1,
	},
	otherBubble: {
		backgroundColor: Colors.BACKGROUND_BLACK,
		borderColor: Colors.INFO + "80",
		borderWidth: 1,
	},
	userAvatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: Colors.PRIMARY,
		marginLeft: 8,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	otherAvatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: Colors.INFO,
		marginRight: 8,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	messageText: {
		color: Colors.WHITE,
		fontSize: FontSizes.MEDIUM,
		fontFamily: Fonts.REGULAR,
	},
	timestamp: {
		color: Colors.GRAY,
		fontSize: FontSizes.SMALL,
		fontFamily: Fonts.REGULAR,
		marginTop: 4,
	},
	avatarImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.TRANSPARENT,
	},
	flippedAvatar: {
		transform: [{ scaleX: -1 }],
	},
	userName: {
		color: Colors.GRAY,
		fontSize: FontSizes.SMALL,
		fontFamily: Fonts.REGULAR,
		textAlign: "center",
	},
})

export default ChatMessage
