import { Colors, FontSizes, Icons } from "@/constants/constants"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { Button, Layout } from "@ui-kitten/components"
import React, { useState } from "react"
import { StyleSheet, TextInput } from "react-native"
import Loading from "../common/Loading"

interface ChatInputProps {
	onSendMessage: (message: string) => Promise<void>
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
	const [newMessage, setNewMessage] = useState<string>("")
	const [isSending, setIsSending] = useState<boolean>(false)

	const handleSendMessage = async () => {
		if (!newMessage.trim()) return
		setIsSending(true)
		try {
			await onSendMessage(newMessage)
			setNewMessage("")
		} catch (err) {
			console.error("Error sending message:", err)
		} finally {
			setIsSending(false)
		}
	}

	return (
		<Layout style={styles.inputContainer}>
			{isSending ? (
				<Loading size={40} text="Sending..." />
			) : (
				<>
					<TextInput
						style={styles.input}
						placeholder="Type your message..."
						placeholderTextColor={Colors.GRAY}
						value={newMessage}
						onChangeText={setNewMessage}
						editable={!isSending}
					/>
					<Button
						status="primary"
						onPress={handleSendMessage}
						accessoryLeft={() => (
							<MaterialIcons
								name="send"
								size={Icons.MEDIUM_SIZE}
								color={Colors.BACKGROUND_DARK}
							/>
						)}
					/>
				</>
			)}
		</Layout>
	)
}

const styles = StyleSheet.create({
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingBottom: 16,
		paddingTop: 8,
		backgroundColor: Colors.BACKGROUND_DARK,
	},
	input: {
		flex: 1,
		padding: 12,
		fontSize: FontSizes.MEDIUM,
		borderRadius: 25,
		backgroundColor: Colors.GRAY,
		color: Colors.BACKGROUND_BLACK,
		marginRight: 8,
	},
})

export default ChatInput
