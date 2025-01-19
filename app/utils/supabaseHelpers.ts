import { createClient } from "@supabase/supabase-js"
import Constants from "expo-constants"
import * as FileSystem from "expo-file-system"

/**
 * Uploads the image to Supabase storage.
 * @param imageUri - The URI of the image to upload.
 * @param userId - The ID of the user uploading the image.
 * @param itemImage - Optional existing image URL to check against.
 * @returns {Promise<string | null>} A promise that resolves with the image URL or null if the upload fails.
 */
export const uploadImageToSupabase = async (
	imageUri: string | null,
	userId: string,
	itemImage?: string
): Promise<string | null> => {
	if (!imageUri || imageUri === itemImage) return imageUri

	const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL
	const supabaseKey = Constants.expoConfig?.extra?.SUPABASE_API_KEY
	const bucketName = Constants.expoConfig?.extra?.SUPABASE_BUCKET_NAME

	if (!supabaseUrl || !supabaseKey || !bucketName) {
		console.error("Supabase credentials are not configured properly.")
		return null
	}

	const supabase = createClient(supabaseUrl, supabaseKey)

	const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1)
	const filePath = `${userId}/${filename}`

	try {
		// Read the file as base64
		const fileBase64 = await FileSystem.readAsStringAsync(imageUri, {
			encoding: FileSystem.EncodingType.Base64,
		})

		// Convert base64 to a Uint8Array
		const uint8Array = Uint8Array.from(atob(fileBase64), (c) => c.charCodeAt(0))

		// Upload the file to Supabase
		const { error } = await supabase.storage
			.from(bucketName)
			.upload(filePath, uint8Array, {
				contentType: "image/jpeg", // Adjust based on your file type
				upsert: false,
			})

		if (error) {
			console.error("Upload error:", error)
			return null
		}

		// Retrieve the public URL
		const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)

		if (!data) {
			console.error("Error generating public URL.")
			return null
		}

		return data.publicUrl
	} catch (error) {
		console.error("Error uploading to Supabase:", error)
		return null
	}
}

/**
 * Deletes an image from Supabase storage.
 * @param {string} filePath - The path to the file in the storage bucket.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion is successful, otherwise false.
 */
export const deleteImageFromSupabase = async (
	filePath: string
): Promise<boolean> => {
	const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL
	const supabaseKey = Constants.expoConfig?.extra?.SUPABASE_API_KEY

	const supabase = createClient(supabaseUrl, supabaseKey)

	const bucketName = Constants.expoConfig?.extra?.SUPABASE_BUCKET_NAME

	try {
		// Delete the file from Supabase storage
		const { error } = await supabase.storage.from(bucketName).remove([filePath])

		if (error) {
			console.error("Delete error:", error)
			return false
		}

		return true
	} catch (error) {
		console.error("Error deleting from Supabase:", error)
		return false
	}
}
