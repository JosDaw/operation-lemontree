import ChatView from "@/components/message/ChatView"
import { useLocalSearchParams } from "expo-router"

export default function ConversationScreen() {
	const { slug } = useLocalSearchParams()

	return <ChatView conversationID={slug as string} />
}
