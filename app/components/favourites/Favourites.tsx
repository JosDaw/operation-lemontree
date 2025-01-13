import { Colors, Icons } from "@/constants/constants"
import globalStyles from "@/styles/global"
import { IItem } from "@/types"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { CheckBox, Layout, Text } from "@ui-kitten/components"
import { useState } from "react"
import { RefreshControl, ScrollView } from "react-native-gesture-handler"
import CustomButton from "../common/CustomButton"
import ListingItem from "../discover/ListingItem"

interface FavouritesProps {
	items: IItem[]
	onRefresh: () => Promise<void>
	onUnfavourite: (selectedItemIDs: string[]) => void
}

const Favourites = ({ items, onRefresh, onUnfavourite }: FavouritesProps) => {
	const [refreshing, setRefreshing] = useState<boolean>(false)
	const [selectedItems, setSelectedItems] = useState<string[]>([])
	const [selectAll, setSelectAll] = useState<boolean>(false)
	const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false)

	/**
	 * Handles the refresh action by setting the refreshing state to true,
	 * awaiting the onRefresh function, and then setting the refreshing state to false.
	 *
	 * @async
	 * @function handleRefresh
	 * @returns {Promise<void>} A promise that resolves when the refresh action is complete.
	 */
	const handleRefresh = async (): Promise<void> => {
		setRefreshing(true)
		await onRefresh()
		setRefreshing(false)
	}

	/**
	 * Toggles the selection state of all items.
	 *
	 * If `selectAll` is true, it will deselect all items by setting `selectedItems` to an empty array.
	 * If `selectAll` is false, it will select all items by setting `selectedItems` to an array of all item IDs.
	 *
	 * After toggling the selection state, it updates the `selectAll` state to its opposite value.
	 */
	const toggleSelectAll = () => {
		if (selectAll) {
			// Deselect all
			setSelectedItems([])
		} else {
			// Select all
			const allItemIDs = items.map((item) => item.id)
			setSelectedItems(allItemIDs)
		}
		setSelectAll(!selectAll)
	}

	/**
	 * Toggles the selection state of an item by its ID.
	 * If the item is already selected, it will be removed from the selection.
	 * If the item is not selected, it will be added to the selection.
	 *
	 * @param {string} itemID - The ID of the item to toggle selection for.
	 */
	const toggleSelectItem = (itemID: string) => {
		if (selectedItems.includes(itemID)) {
			// Remove the item from selection
			setSelectedItems(selectedItems.filter((id) => id !== itemID))
		} else {
			// Add the item to selection
			setSelectedItems([...selectedItems, itemID])
		}
	}

	/**
	 * Handles the unfavourite action for the selected items.
	 *
	 * This function performs the following actions:
	 * - Calls the `onUnfavourite` function with the currently selected items.
	 * - Clears the selection by setting `selectedItems` to an empty array.
	 * - Resets the "select all" state by setting `setSelectAll` to false.
	 * - Exits the selection mode by setting `setIsSelectionMode` to false.
	 */
	const handleUnfavourite = () => {
		onUnfavourite(selectedItems) // Call the unfavourite function
		setSelectedItems([]) // Clear the selection
		setSelectAll(false) // Reset the select all state
		setIsSelectionMode(false) // Exit selection mode
	}

	return (
		<ScrollView
			contentContainerStyle={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-start",
				minHeight: "100%",
				padding: 16,
				backgroundColor: Colors.BACKGROUND_DARK,
			}}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
			}
		>
			<Text style={globalStyles.title} status="primary" category="h1">
				Favourites
			</Text>

			{/* Remove Favourites Button */}
			<Layout
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "flex-end",
					marginBottom: 16,
				}}
			>
				{!isSelectionMode && (
					<CustomButton
						onPress={() => setIsSelectionMode(true)}
						status="danger"
						accessoryLeft={() => (
							<MaterialIcons
								name="delete-forever"
								size={Icons.MEDIUM_SIZE}
								color={Colors.BACKGROUND_BLACK}
							/>
						)}
					>
						Remove Favourites
					</CustomButton>
				)}
			</Layout>

			{/* Select All and Unfavourite Buttons */}
			{isSelectionMode && (
				<Layout
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						marginBottom: 16,
					}}
				>
					<CheckBox
						checked={selectAll}
						onChange={toggleSelectAll}
						style={{ marginRight: 16 }}
					>
						Select All
					</CheckBox>
					<CustomButton
						onPress={handleUnfavourite}
						status="danger"
						accessoryLeft={() => (
							<MaterialIcons
								name="delete-forever"
								size={Icons.MEDIUM_SIZE}
								color={Colors.BACKGROUND_BLACK}
							/>
						)}
					>
						Unfavourite
					</CustomButton>
					<CustomButton
						onPress={() => setIsSelectionMode(false)}
						appearance="outline"
						status="danger"
						size="small"
						accessoryLeft={() => (
							<Ionicons
								name="close-circle-outline"
								size={Icons.MEDIUM_SIZE}
								color={Colors.DANGER}
							/>
						)}
						textColor={Colors.DANGER}
					>
						Cancel
					</CustomButton>
				</Layout>
			)}

			{/* Display the user's favourite items */}
			<Layout
				style={{
					display: "flex",
					flexDirection: "row",
					flexWrap: "wrap",
					gap: 8,
				}}
			>
				{items &&
					items.map((item) => (
						<Layout
							key={item.id}
							style={{
								width: 170,
								marginBottom: 16,
								borderWidth:
									isSelectionMode && selectedItems.includes(item.id) ? 1 : 0,
								borderRadius: 8,
								borderColor: Colors.DANGER,
								padding: 8,
							}}
						>
							{/* Only show checkboxes in selection mode */}
							{isSelectionMode && (
								<CheckBox
									checked={selectedItems.includes(item.id)}
									onChange={() => toggleSelectItem(item.id)}
									style={{ marginBottom: 8 }}
									status="danger"
								/>
							)}
							<ListingItem item={item} />
						</Layout>
					))}
			</Layout>

			{/* Display a message if the user has no favourites */}
			{!items.length && (
				<Text style={globalStyles.noContentMessage}>
					You haven't saved any items yet.
				</Text>
			)}
		</ScrollView>
	)
}

export default Favourites
