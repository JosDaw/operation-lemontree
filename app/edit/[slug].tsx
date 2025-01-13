import Loading from "@/components/common/Loading"
import UploadForm from "@/components/upload/UploadForm"
import { Collections } from "@/constants/constants"
import useItem from "@/hooks/useItem"
import { IItem } from "@/types"
import { Text } from "@ui-kitten/components"
import { useLocalSearchParams } from "expo-router"

/**
 * EditScreen component is responsible for rendering the edit screen for a specific item.
 * It fetches the item data based on the slug parameter from the URL and displays a loading
 * indicator while the data is being fetched. If an error occurs during data fetching, it
 * displays an error message. Once the data is successfully fetched, it renders the UploadForm
 * component with the item data.
 *
 * @returns {JSX.Element} The rendered edit screen component.
 */
export default function EditScreen(): JSX.Element {
	const { slug } = useLocalSearchParams()
	const itemId = slug as string

	const {
		data: item,
		loading,
		error,
	} = useItem<IItem>(Collections.ITEM, itemId)

	if (loading || !item) {
		return <Loading />
	}

	if (error) {
		return <Text status="danger">{error}</Text>
	}

	return <UploadForm item={item} />
}
