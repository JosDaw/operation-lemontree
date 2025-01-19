import CreateAccountReminder from "@/components/register/CreateAccountReminder"
import UploadForm from "@/components/upload/UploadForm"
import useUser from "@/store/useUser"
import { Layout } from "@ui-kitten/components"

/**
 * Tab component that conditionally renders content based on the user's login status.
 *
 * If the user is logged in, it displays the `UploadForm` component.
 * If the user is not logged in, it displays a layout with a `CreateAccountReminder` component.
 */
export default function Tab() {
	const { isLoggedIn } = useUser()

	return isLoggedIn ? (
		<UploadForm />
	) : (
		<Layout style={{ flex: 1 }}>
			<CreateAccountReminder />
		</Layout>
	)
}
