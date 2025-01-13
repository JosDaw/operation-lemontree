import { Colors, Fonts, FontSizes, Icons, Images } from "@/constants/constants"
import globalStyles from "@/styles/global"
import toast from "@/utils/toast"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { Layout, Text } from "@ui-kitten/components"
import * as ImageManipulator from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import React from "react"
import { Image, StyleSheet, TouchableOpacity } from "react-native"
import CustomButton from "../common/CustomButton"

interface ImageSelectorProps {
	imageUri: string | null
	setImageUri: (uri: string | null) => void
}

const ImageSelector = ({ imageUri, setImageUri }: ImageSelectorProps) => {
	/**
	 * Function to pick an image from the media library.
	 *
	 * @returns {Promise<void>} A promise that resolves when the image is picked.
	 */
	const pickImage = async (): Promise<void> => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (permissionResult.granted === false) {
			toast({
				message:
					"You've refused to allow this app to access your photos! Please update your settings.",
				type: "error",
			})
			return
		}

		// Reset the selected image URI temporarily to clear cache
		setImageUri(null)

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1, // Original quality (before compression)
			selectionLimit: 1, // Limit to 1 image
		})

		if (!result.canceled) {
			const imageUri = result.assets[0].uri

			// Validate file type
			const fileType = imageUri
				.substring(imageUri.lastIndexOf(".") + 1)
				.toLowerCase()
			if (
				fileType !== Images.JPG &&
				fileType !== Images.JPEG &&
				fileType !== Images.PNG
			) {
				toast({ message: "Please select a JPG or PNG image.", type: "error" })
				return
			}

			// Compress the image to reduce size
			const compressedImage = await ImageManipulator.manipulateAsync(
				imageUri,
				[{ resize: { width: 700 } }],
				{
					compress: Images.COMPRESSION,
					format: ImageManipulator.SaveFormat.JPEG,
				} // Compress image and save as JPEG
			)

			setImageUri(compressedImage.uri) // Set the compressed image URI
		}
	}

	return (
		<Layout>
			<Text style={styles.label}>Image</Text>
			<TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
				{imageUri ? (
					<Image source={{ uri: imageUri }} style={styles.image} />
				) : (
					<Layout style={globalStyles.textRow}>
						<MaterialIcons
							name="photo"
							color={Colors.WHITE}
							size={Icons.EXTRA_LARGE_SIZE}
						/>
						<Text style={styles.imagePickerText} category="h6">
							Upload Image
						</Text>
					</Layout>
				)}
			</TouchableOpacity>
			{imageUri && (
				<Layout style={styles.rightContainer}>
					<CustomButton
						appearance="outline"
						status="danger"
						size="tiny"
						onPress={() => {
							setImageUri("")
						}}
						accessoryLeft={() => (
							<Ionicons
								name="close-circle-outline"
								size={Icons.MEDIUM_SIZE}
								color={Colors.DANGER}
							/>
						)}
						textColor={Colors.DANGER}
					>
						Remove Image
					</CustomButton>
				</Layout>
			)}
		</Layout>
	)
}

export default ImageSelector

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
	},
	imagePicker: {
		alignItems: "center",
		justifyContent: "center",
		minHeight: 150,
		borderRadius: 8,
		marginBottom: 20,
		backgroundColor: Colors.BACKGROUND_BLACK,
	},
	image: {
		width: 150,
		height: 150,
	},
	imagePickerText: {
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.MEDIUM,
		textAlign: "center",
		backgroundColor: Colors.TRANSPARENT,
	},
	rightContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		marginBottom: 20,
	},
	label: {
		color: Colors.WHITE,
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.MEDIUM,
		marginBottom: 10,
	},
})
