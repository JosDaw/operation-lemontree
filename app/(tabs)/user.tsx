import Profile from "@/components/profile/Profile"
import CreateAccountReminder from "@/components/register/CreateAccountReminder"
import useUser from "@/store/useUser"
import { Layout } from "@ui-kitten/components"

/**
 * A functional component that renders different content based on the user's login status.
 *
 * If the user is logged in, it displays the `Profile` component.
 * If the user is not logged in, it displays a `CreateAccountReminder` component within a styled `Layout`.
 */
export default function Tab() {
	const { isLoggedIn } = useUser()

	return isLoggedIn ? (
		<Profile />
	) : (
		<Layout style={{ flex: 1 }}>
			<CreateAccountReminder />
		</Layout>
	)
}
