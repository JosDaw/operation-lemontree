import { Colors, Fonts, FontSizes, Icons } from "@/constants/constants"
import useUserItems from "@/hooks/useUserItems"
import globalStyles from "@/styles/global"
import { handleDeleteItem } from "@/utils/helpers"
import { getBorderColor } from "@/utils/itemHelpers"
import toast from "@/utils/toast"
import { AntDesign } from "@expo/vector-icons"
import { Layout, Text } from "@ui-kitten/components"
import { Link } from "expo-router"
import React from "react"
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native"
import CustomButton from "../common/CustomButton"
import ErrorMessage from "../common/ErrorMessage"
import Loading from "../common/Loading"
import StatusBadge from "../common/StatusBadge"

/**
 * Renders a list of uploaded items with options to edit or delete each item.
 *
 * @returns The rendered component.
 */
const UserUploadedItemsList: React.FC = () => {
	const { listings, loading, error, fetchListings } = useUserItems()

	const handleDelete = (itemID: string) => {
		// Confirm deletion
		Alert.alert(
			"Confirm Delete",
			"Are you sure you want to delete this item?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							toast({ message: "Item deleted successfully.", type: "success" })

							await handleDeleteItem(itemID)
							fetchListings()
						} catch (error: any) {
							toast({
								message:
									"Failed to delete item. Please try again." + error.message,
								type: "error",
							})
						}
					},
				},
			]
		)
	}

	return (
		<Layout style={styles.container}>
			<Text style={styles.sectionTitle}>Your Uploaded Items</Text>

			{loading && <Loading />}
			{error && <ErrorMessage error={error} />}
			{listings.length === 0 && (
				<Text style={globalStyles.noContentMessage}>No items yet...</Text>
			)}
			<Layout>
				{listings &&
					listings.map((item) => (
						<Layout style={styles.uploadedItemContainer} key={item.id}>
							<StatusBadge status={item.status} size="small" />
							<Link href={`/item/${item.id}`} asChild>
								<TouchableOpacity>
									<Image
										source={{ uri: item.images[0] }}
										style={[
											styles.uploadedItemImage,
											{ borderColor: getBorderColor(item.status) },
										]}
									/>
								</TouchableOpacity>
							</Link>
							<Layout style={styles.uploadedItemInfo}>
								<Text style={styles.uploadedItemName}>{item.name}</Text>
								<Text style={styles.uploadedItemDescription}>
									{item.description.length > 50
										? `${item.description.substring(0, 50)}...`
										: item.description}
								</Text>

								<Layout style={styles.uploadedItemActions}>
									<Link href={`/edit/${item.id}`} asChild>
										<CustomButton
											status="info"
											size="tiny"
											accessoryLeft={() => (
												<AntDesign
													name="edit"
													size={Icons.SMALL_SIZE}
													color={Colors.BACKGROUND_BLACK}
												/>
											)}
										>
											Edit
										</CustomButton>
									</Link>
									<CustomButton
										onPress={() => handleDelete(item.id)}
										status="danger"
										size="tiny"
										accessoryLeft={() => (
											<AntDesign
												name="delete"
												size={Icons.SMALL_SIZE}
												color={Colors.BACKGROUND_BLACK}
											/>
										)}
									>
										Delete
									</CustomButton>
								</Layout>
							</Layout>
						</Layout>
					))}
			</Layout>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		marginBottom: 40,
	},
	sectionTitle: {
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.LARGE,
		color: Colors.PRIMARY,
		marginBottom: 16,
	},
	uploadedItemsList: {
		width: "100%",
	},
	uploadedItemContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		marginVertical: 14,
		borderRadius: 10,
		backgroundColor: Colors.BACKGROUND_BLACK,
	},
	uploadedItemImage: {
		width: 50,
		height: 80,
		borderRadius: 8,
		marginRight: 10,
	},
	uploadedItemInfo: {
		flex: 1,
		backgroundColor: Colors.TRANSPARENT,
	},
	uploadedItemName: {
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.MEDIUM,
		color: Colors.WHITE,
		marginBottom: 4,
	},
	uploadedItemDescription: {
		fontFamily: Fonts.REGULAR,
		fontSize: FontSizes.SMALL,
		color: Colors.GRAY,
		marginBottom: 8,
	},
	uploadedItemActions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 10,
		backgroundColor: Colors.TRANSPARENT,
	},
})

export default UserUploadedItemsList
