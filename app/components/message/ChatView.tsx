import { APP_NAME, DeviceTypes, Fonts } from "@/constants/constants"
import { useMessages } from "@/hooks/useMessages"
import useUser from "@/store/useUser"
import { IUser } from "@/types"
import {
	addMessageToExistingConversation,
	getParticipantsFromConversationID,
} from "@/utils/messageHelpers"
import { Layout, Text } from "@ui-kitten/components"
import * as Device from "expo-device"
import React, { useEffect, useRef, useState } from "react"
import { FlatList, KeyboardAvoidingView, StyleSheet } from "react-native"
import ErrorMessage from "../common/ErrorMessage"
import Loading from "../common/Loading"
import ChatInput from "./ChatInput"
import ChatMessage from "./ChatMessage"

interface ChatViewProps {
	conversationID: string
}

const ChatView: React.FC<ChatViewProps> = ({ conversationID }) => {
	const { user } = useUser()
	const { messages, error } = useMessages(conversationID)
	const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true)
	const flatListRef = useRef<FlatList>(null)
	const [participants, setParticipants] = useState<IUser[] | null>(null)

	// Handle initial loading state
	useEffect(() => {
		const loadInitialMessages = async () => {
			setIsInitialLoading(true)

			const tempParticipants =
				await getParticipantsFromConversationID(conversationID)
			const validParticipants = tempParticipants.filter(
				(p): p is IUser => p !== null
			)
			setParticipants(validParticipants)

			setIsInitialLoading(false)
		}

		loadInitialMessages()
	}, [conversationID])

	const handleSendMessage = async (message: string) => {
		await addMessageToExistingConversation(conversationID, user, message)
	}

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Device.osName === DeviceTypes.IOS ? "padding" : "height"}
			keyboardVerticalOffset={Device.osName === DeviceTypes.IOS ? 70 : 60}
		>
			<Layout style={styles.chatContainer}>
				{/* Render the item at the top of the chat */}
				{isInitialLoading ? (
					<Loading />
				) : error ? (
					<ErrorMessage error={error} />
				) : (
					<FlatList
						ref={flatListRef}
						data={messages}
						renderItem={({ item }) => (
							<ChatMessage
								message={item}
								isCurrentUser={item.senderID === user.userID}
								participants={participants}
							/>
						)}
						keyExtractor={(item) => item.id}
						contentContainerStyle={styles.messageList}
						keyboardShouldPersistTaps="handled"
						onContentSizeChange={() =>
							flatListRef.current?.scrollToEnd({ animated: true })
						}
					/>
				)}
				<Text style={styles.warningText} appearance="hint">
					Warning: {APP_NAME} is not responsible for any content sent in the
					chat. Please do not share personal information and conduct all
					exchanges responsibly.
				</Text>
			</Layout>
			{!isInitialLoading && <ChatInput onSendMessage={handleSendMessage} />}
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	chatContainer: {
		flex: 1,
	},
	messageList: {
		paddingHorizontal: 8,
		paddingBottom: 10,
	},
	warningText: {
		marginVertical: 10,
		textAlign: "center",
		fontFamily: Fonts.REGULAR,
	},
})

export default ChatView
