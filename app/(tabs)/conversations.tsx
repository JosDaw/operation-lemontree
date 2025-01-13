import ErrorMessage from "@/components/common/ErrorMessage"
import Loading from "@/components/common/Loading"
import ConversationList from "@/components/message/ConversationsList"
import CreateAccountReminder from "@/components/register/CreateAccountReminder"
import useUserConversations from "@/hooks/useUserConversations"
import useUser from "@/store/useUser"
import { Layout } from "@ui-kitten/components"

export default function ConversationsTab() {
	const { isLoggedIn, user } = useUser()

	const { conversations, loading, error } = useUserConversations(user.userID)

	if (loading) {
		return <Loading />
	}

	if (error) {
		return <ErrorMessage error={error} />
	}

	return isLoggedIn ? (
		<ConversationList conversations={conversations} user={user} />
	) : (
		<Layout style={{ flex: 1 }}>
			<CreateAccountReminder />
		</Layout>
	)
}
