import { database } from "@/config/firebase"
import { CATEGORIES } from "@/constants/categories"
import {
	APP_NAME,
	Collections,
	Colors,
	Fonts,
	Icons,
} from "@/constants/constants"
import useGeocode from "@/hooks/useGeocode"
import useUser from "@/store/useUser"
import globalStyles from "@/styles/global"
import { IItem, ItemStatus } from "@/types"
import { checkForProfanity } from "@/utils/itemHelpers"
import { handleAdminNotifier } from "@/utils/notifications"
import { uploadImageToSupabase } from "@/utils/supabaseHelpers"
import toast from "@/utils/toast"
import { Octicons } from "@expo/vector-icons"
import { IndexPath, Layout, Text } from "@ui-kitten/components"
import { router } from "expo-router"
import {
	addDoc,
	collection,
	doc,
	Timestamp,
	updateDoc,
} from "firebase/firestore"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import CustomButton from "../common/CustomButton"
import Footer from "../common/Footer"
import Loading from "../common/Loading"
import CategorySelector from "./CategorySelector"
import ImageSelector from "./ImageSelector"
import UploadInputs from "./UploadInputs"

interface IUploadFormProps {
	item?: IItem
}

/**
 * UploadForm component for uploading an item.
 *
 */
const UploadForm = ({ item }: IUploadFormProps) => {
	const [name, setName] = useState<string>(item?.name || "")
	const [description, setDescription] = useState<string>(
		item?.description || ""
	)
	const [zipcode, setZipcode] = useState<string>(item?.location.zipcode || "")
	const [imageUri, setImageUri] = useState<string | null>(
		item?.images?.[0] || null
	)

	const [selectedCategoryIndexes, setSelectedCategoryIndexes] = useState<
		IndexPath[]
	>(
		item
			? item.categories.map((category) => {
					const categoryIndex = CATEGORIES.findIndex((c) => c.name === category)
					return new IndexPath(categoryIndex)
				})
			: []
	)

	const [isUploading, setIsUploading] = useState<boolean>(false)

	const { user } = useUser()

	const {
		latitude,
		longitude,
		geohash,
		fetchGeolocation,
		error: geocodeError,
	} = useGeocode()

	/**
	 * Handles the form submission.
	 *
	 * @returns {Promise<void>} A promise that resolves when the submission is complete.
	 */
	const handleSubmit = async (): Promise<void> => {
		if (
			!name ||
			!description ||
			!zipcode ||
			!selectedCategoryIndexes.length ||
			!imageUri
		) {
			toast({ message: "Please fill in all of the fields.", type: "error" })
			return
		}

		// Define an array of objects to check for profanity
		const fieldsToCheck = [
			{ name: "name", value: name },
			{ name: "description", value: description },
			{ name: "zipcode", value: zipcode },
		]

		// Check fields for profanity and handle accordingly
		if (checkForProfanity(fieldsToCheck)) {
			return
		}

		if (description.length < 10) {
			toast({
				message: "Description must be at least 10 characters.",
				type: "error",
			})
			return
		}

		await fetchGeolocation(zipcode, user.location.country)
		if (geocodeError) {
			toast({
				message: "Failed to fetch location. Please try again.",
				type: "error",
			})
			return
		}

		const imageUrl = await uploadImageToSupabase(
			imageUri,
			user.userID,
			item?.images?.[0]
		)

		if (imageUrl) {
			const selectedCategoryTitles = selectedCategoryIndexes.map(
				(index) => CATEGORIES[index.row].name
			)

			// Construct the updated item data
			const itemData = {
				approvedBy: "",
				categories: selectedCategoryTitles,
				description,
				images: [imageUrl],
				isApproved: user.isAdmin ? true : false,
				isDeleted: false,
				name,
				status: ItemStatus.Available,
				userID: user.userID,
				dateEdited: Timestamp.now(),
				location: {
					latitude,
					longitude,
					zipcode: zipcode.trim().toUpperCase(),
					country: user.location.country,
					geohash: geohash,
				},
			}

			if (item) {
				// If editing, update the existing document
				const itemRef = doc(database, Collections.ITEM, item.id)
				await updateDoc(itemRef, itemData)
					.then(() => {
						toast({ message: "Item updated successfully!" })
						router.push("/requests") // Redirect after update
					})
					.catch((error) => {
						toast({
							message: "Failed to update item. Please try again.",
							type: "error",
						})
						console.error("Error updating document: ", error)
					})
			} else {
				await addDoc(collection(database, Collections.ITEM), {
					approvedBy: "",
					categories: selectedCategoryTitles,
					description,
					images: [imageUrl],
					isApproved: false,
					isDeleted: false,
					zipcode: zipcode.trim().toUpperCase(),
					name: name.trim(),
					status: ItemStatus.Available,
					userID: user.userID,
					dateCreated: Timestamp.now(),
					dateEdited: Timestamp.now(),
					location: {
						latitude: latitude,
						longitude: longitude,
						zipcode: zipcode.trim().toUpperCase(),
						country: user.location.country,
						geohash: geohash,
					},
					saves: 1,
				})
					.then(() => {
						toast({
							message: `Item uploaded! It will be reviewed by ${APP_NAME} shortly.`,
						})

						// Notify Admins about new listing
						handleAdminNotifier()

						// Reset form
						setName("")
						setDescription("")
						setZipcode("")
						setImageUri(null)
						setSelectedCategoryIndexes([])
						setIsUploading(false)

						router.push("/user")
					})
					.catch((error) => {
						toast({
							message: "Failed to upload item. Please try again later.",
							type: "error",
						})
						console.error("Error adding entry: ", error)
					})
			}
		} else {
			toast({
				message: "Failed to upload image. Please try again later.",
				type: "error",
			})
		}
	}

	return (
		<KeyboardAwareScrollView>
			<Layout style={styles.container}>
				<Text style={globalStyles.title} status="primary" category="h1">
					{item ? "Edit Item" : "Upload Item"}
				</Text>

				{isUploading ? (
					<Loading
						text={item ? `Saving changes to your ${name}` : `Uploading ${name}`}
					/>
				) : (
					<>
						<UploadInputs
							name={name}
							setName={setName}
							description={description}
							setDescription={setDescription}
							zipcode={zipcode}
							setZipcode={setZipcode}
						/>

						<CategorySelector
							label="Categories"
							categories={CATEGORIES}
							selectedIndexes={selectedCategoryIndexes}
							onSelect={(indexArray: any) =>
								setSelectedCategoryIndexes(indexArray)
							}
						/>

						<ImageSelector imageUri={imageUri} setImageUri={setImageUri} />

						<CustomButton
							size="large"
							onPress={handleSubmit}
							disabled={isUploading}
							gradientColors={[Colors.PRIMARY, Colors.INFO]}
							accessoryLeft={() => (
								<Octicons
									name="upload"
									size={Icons.MEDIUM_SIZE}
									color={Colors.BACKGROUND_BLACK}
								/>
							)}
						>
							{item ? `Update ${name}` : `Upload ${name}`}
						</CustomButton>
					</>
				)}

				<Text category="s2" style={styles.warningMessage}>
					Notice: All uploads will be reviewed before the {APP_NAME} community
					can view them.
				</Text>

				<Footer />
			</Layout>
		</KeyboardAwareScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	rightContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	warningMessage: {
		marginTop: 20,
		textAlign: "center",
		fontFamily: Fonts.REGULAR,
	},
})

export default UploadForm
