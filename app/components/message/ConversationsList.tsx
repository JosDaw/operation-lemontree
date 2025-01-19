import { Colors } from "@/constants/constants"
import globalStyles from "@/styles/global"
import { IConversation, IMessage, IUser } from "@/types"
import { Layout, Text } from "@ui-kitten/components"
import React from "react"
import { FlatList, StyleSheet } from "react-native"
import MessageCard from "./MessageCard"

interface ConversationListProps {
	conversations: IConversation[]
	user: IUser
}

export default function ConversationList({
	conversations,
	user,
}: ConversationListProps) {
	return (
		<Layout style={styles.container}>
			<Text style={globalStyles.title} status="primary" category="h1">
				Conversations
			</Text>
			<FlatList
				data={conversations}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => {
					if (item.recentMessage) {
						return (
							<MessageCard
								message={item.recentMessage as IMessage}
								conversationID={item.id}
								user={user}
							/>
						)
					}
					return null
				}}
				contentContainerStyle={[
					styles.listContent,
					conversations.length === 0 && {
						flex: 1,
						justifyContent: "flex-start",
					},
				]}
				ListEmptyComponent={() => (
					<Text style={globalStyles.noContentMessage}>No messages yet</Text>
				)}
			/>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: Colors.BACKGROUND_DARK,
	},
	listContent: {
		paddingBottom: 20,
	},
})
