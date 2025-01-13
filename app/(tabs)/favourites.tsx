import ErrorMessage from "@/components/common/ErrorMessage"
import Loading from "@/components/common/Loading"
import Favourites from "@/components/favourites/Favourites"
import CreateAccountReminder from "@/components/register/CreateAccountReminder"
import useUserSavedItems from "@/hooks/useUserSavedItems"
import useUser from "@/store/useUser"
import { removeUserSavedItems } from "@/utils/itemHelpers"
import { Layout } from "@ui-kitten/components"

export default function FavouritesTab() {
	const { isLoggedIn, user } = useUser()

	const { savedItems, loading, error, refresh } = useUserSavedItems(user.userID)

	if (loading) {
		return <Loading />
	}

	if (error) {
		return <ErrorMessage error={error.message} />
	}

	return isLoggedIn ? (
		<Favourites
			items={savedItems}
			onRefresh={refresh}
			onUnfavourite={async (selectedItemIDs) => {
				try {
					await removeUserSavedItems(user.userID, selectedItemIDs) // Call the removal function
					await refresh() // Refresh the list after removal
				} catch (error) {
					console.error("Failed to unfavourite items:", error)
				}
			}}
		/>
	) : (
		<Layout style={{ flex: 1 }}>
			<CreateAccountReminder />
		</Layout>
	)
}
