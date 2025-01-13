import Badge from "@/components/common/Badge"
import CustomButton from "@/components/common/CustomButton"
import Loading from "@/components/common/Loading"
import StatusBadge from "@/components/common/StatusBadge"
import ImageCarousel from "@/components/item/ImageCarousel"
import ItemPoster from "@/components/item/ItemPoster"
import RequestButton from "@/components/item/RequestButton"
import { database } from "@/config/firebase"
import {
	APP_NAME,
	Collections,
	Colors,
	Fonts,
	FontSizes,
	Icons,
} from "@/constants/constants"
import useItem from "@/hooks/useItem"
import useUser from "@/store/useUser"
import { IItem, ItemStatus } from "@/types"
import { calculateDistance, getPreferredDistanceUnit } from "@/utils/helpers"
import { handleItemReport } from "@/utils/itemHelpers"
import { createConversationWithMessage } from "@/utils/messageHelpers"
import { sendPushNotification } from "@/utils/notifications"
import toast from "@/utils/toast"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { Layout, Text } from "@ui-kitten/components"
import { router, useLocalSearchParams } from "expo-router"
import { doc, getDoc } from "firebase/firestore"
import React, { ReactElement, useEffect, useState } from "react"
import { ScrollView, StyleSheet } from "react-native"

/**
 * Renders the screen for displaying an item and handling the reservation process.
 *
 * @returns {ReactElement} The rendered ItemScreen component.
 */
export default function ItemScreen(): ReactElement {
	const { slug } = useLocalSearchParams()
	const itemId = slug as string

	const { isLoggedIn, user } = useUser()
	const {
		data: item,
		loading,
		error,
	} = useItem<IItem>(Collections.ITEM, itemId)
	const [isRequesting, setIsRequesting] = useState<boolean>(false)
	// State to store preferred distance unit
	const [distanceUnit, setDistanceUnit] = useState<"km" | "miles">("km")
	const [distance, setDistance] = useState<number | null>(null)

	useEffect(() => {
		if (!item) {
			return
		}

		// Fetch the preferred distance unit and calculate distance
		const fetchUnitAndCalculateDistance = async () => {
			const unit = await getPreferredDistanceUnit()
			setDistanceUnit(unit)

			// Calculate the distance using the preferred unit
			const calculatedDistance = calculateDistance(
				user.location,
				item.location,
				unit
			)
			setDistance(calculatedDistance)
		}

		fetchUnitAndCalculateDistance()
	}, [item, user.location])

	/**
	 * Handles the request process for an item.
	 *
	 * @returns {Promise<void>} A promise that resolves when the reservation process is complete.
	 * @throws {Error} An error is thrown if the item is not available for reservation.
	 */
	const handleRequest = async (): Promise<void> => {
		try {
			setIsRequesting(true)

			if (!item) {
				throw new Error("No item available to request.")
			}

			let conversationID
			try {
				conversationID = await createConversationWithMessage(
					item,
					user,
					"Hello! Is this still available?"
				)

				if (!conversationID) {
					throw new Error("Failed to create a conversation.")
				}
			} catch (error) {
				console.error("Error creating conversation:", error)
				throw new Error("Unable to start a conversation for this item.")
			}

			// Get notification and email of owner
			let ownerData
			try {
				const userRef = doc(database, Collections.USER, item.userID)
				const docSnap = await getDoc(userRef)

				if (!docSnap.exists()) {
					throw new Error("Owner document does not exist.")
				}

				ownerData = docSnap.data()
			} catch (error) {
				console.error("Error retrieving owner data:", error)
				throw new Error("Failed to retrieve the owner's information.")
			}

			const { expoPushToken, allowPushNotifications } = ownerData

			// Send notification to owner
			try {
				if (allowPushNotifications) {
					await sendPushNotification(
						expoPushToken,
						"Your item has been requested!",
						`Your item, ${item.name}, has been requested! Please check "Your Listings" on the ${APP_NAME} app for more details.`,
						{ itemID: item.id }
					)
				}
			} catch (error) {
				console.error("Error sending notification:", error)
				throw new Error("Failed to send notification to the owner.")
			}

			// Successfully requested the item
			toast({ message: "Item requested successfully!" })

			if (conversationID) {
				router.push(`/messages/${conversationID}`)
			}
		} catch (error: any) {
			console.error("An error occurred during the reservation process:", error)
			toast({ message: error.message || "Failed to request the item." })
		} finally {
			setIsRequesting(false)
		}
	}

	return (
		<>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					backgroundColor: Colors.TRANSPARENT,
					justifyContent: "flex-start",
				}}
			>
				{error && <Text status="danger">{error}</Text>}
				{loading || !item ? (
					<Loading />
				) : (
					<Layout style={[styles.item]}>
						<Layout style={styles.imageCarouselContainer}>
							<ImageCarousel images={item.images} />
						</Layout>
						{!item.isApproved ? (
							<Badge
								text={ItemStatus.Pending}
								badgeStyle={{
									position: "absolute",
									top: -5,
									left: 0,
									backgroundColor: Colors.INFO,
								}}
							/>
						) : (
							<StatusBadge status={item.status} size="large" />
						)}

						<ItemPoster item={item} user={user} />

						<Layout style={styles.titleContainer}>
							<Text category="h4" style={styles.itemText}>
								{item.name}
							</Text>
							<Text style={[styles.itemLocation]}>
								<MaterialIcons name="near-me" size={Icons.SMALL_SIZE} />{" "}
								{isLoggedIn
									? `Approx. ${distance || "Unknown "}${distanceUnit} away`
									: item.location.zipcode}
							</Text>
						</Layout>

						<Text category="p1" style={styles.itemDescription}>
							{item.description}
						</Text>
						{(user.userID !== item.userID || user.isAdmin) && (
							<CustomButton
								status="danger"
								onPress={() => {
									if (!isLoggedIn) {
										toast({
											message: "You must be logged in to report an item.",
											type: "error",
										})
										return
									}
									handleItemReport(item, user.userID)
									router.push("/")
								}}
								accessoryLeft={() => (
									<MaterialCommunityIcons
										name="alert-circle"
										size={Icons.MEDIUM_SIZE}
										color={Colors.BACKGROUND_BLACK}
									/>
								)}
							>
								Report Item & Block User
							</CustomButton>
						)}
					</Layout>
				)}
			</ScrollView>
			{!isLoggedIn ? null : isRequesting ? (
				<Loading text="Requesting" />
			) : (
				<Layout style={styles.stickyContainer}>
					{item && (user.userID !== item.userID || user.isAdmin) ? (
						<RequestButton
							item={item}
							handleRequest={handleRequest}
							isLoggedIn={isLoggedIn}
							user={user}
						/>
					) : null}
				</Layout>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	item: {
		justifyContent: "flex-start",
		alignItems: "center",
		width: "100%",
		position: "relative",
		flex: 1,
	},
	imageCarouselContainer: {
		height: 250, // Match the carousel height
		marginBottom: 10,
		position: "relative",
	},
	itemImage: {
		height: 250,
		width: "100%",
		marginBottom: 10,
	},
	titleContainer: {
		width: "95%",
		paddingBottom: 20,
	},
	itemText: {
		fontFamily: Fonts.SEMI_BOLD,
		textAlign: "left",
		paddingTop: 20,
		fontSize: FontSizes.LARGE,
	},
	itemLocation: {
		fontSize: FontSizes.MEDIUM,
		textAlign: "right",
		width: "100%",
		fontFamily: Fonts.SEMI_BOLD,
	},
	itemDescription: {
		fontSize: FontSizes.MEDIUM,
		fontFamily: Fonts.REGULAR,
		textAlign: "left",
		paddingHorizontal: 20,
		width: "100%",
		marginVertical: 20,
	},
	itemRequestLayout: {
		marginVertical: 20,
		width: "100%",
		paddingHorizontal: 10,
	},
	buttonContainer: {
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
	},
	stickyContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: 10,
		zIndex: 10,
		backgroundColor: Colors.TRANSPARENT,
	},
})
