import { database } from "@/config/firebase"
import { Collections, Colors, Icons } from "@/constants/constants"
import useGeocode from "@/hooks/useGeocode"
import useUser from "@/store/useUser"
import globalStyles from "@/styles/global"
import { IUser } from "@/types"
import toast from "@/utils/toast"
import { Ionicons } from "@expo/vector-icons"
import { Layout } from "@ui-kitten/components"
import { doc, updateDoc } from "firebase/firestore"
import React, { useState } from "react"
import CustomButton from "../common/CustomButton"
import CustomInput from "../common/CustomInput"

interface EditAccountProps {
	user: IUser
	onCancel: () => void
}

/**
 * EditAccount component allows users to edit their profile information including name, email, country, and zipcode.
 * It also handles geolocation fetching based on the provided zipcode and country.
 *
 * @component
 * @param {EditAccountProps} props - The properties for the EditAccount component.
 * @param {Object} props.user - The current user object containing profile information.
 * @param {Function} props.onCancel - The function to call when the cancel button is pressed.
 *
 * @returns {JSX.Element} The rendered EditAccount component.
 *
 * @example
 * <EditAccount user={currentUser} onCancel={handleCancel} />
 *
 * @typedef {Object} EditAccountProps
 * @property {Object} user - The current user object containing profile information.
 * @property {Function} onCancel - The function to call when the cancel button is pressed.
 */
const EditAccount = ({ user, onCancel }: EditAccountProps) => {
	const [profile, setProfile] = useState({
		name: user?.name || "",
		zipcode: user?.location.zipcode || "",
		country: user?.location.country || "",
		email: user?.email || "",
	})

	const [isSaving, setIsSaving] = useState<boolean>(false)

	const {
		latitude,
		longitude,
		geohash,
		fetchGeolocation,
		error: geocodeError,
	} = useGeocode()

	const { loginUser } = useUser((state: any) => ({
		loginUser: state.loginUser,
	}))

	/**
	 * Handles the save operation for updating the user's profile.
	 *
	 * This function performs the following steps:
	 * 1. Validates that all required profile fields are filled.
	 * 2. Fetches geolocation data based on the provided zipcode and country.
	 * 3. Updates the user's profile in the database with the new information.
	 * 4. Displays appropriate toast messages based on the success or failure of the operations.
	 *
	 * @returns {Promise<void>} A promise that resolves when the save operation is complete.
	 */
	const handleSave = async (): Promise<void> => {
		if (
			!profile.name ||
			!profile.zipcode ||
			!profile.country ||
			!profile.email
		) {
			toast({
				message: "All fields are required.",
				type: "error",
			})
			return
		}

		await fetchGeolocation(profile.zipcode, profile.country)

		if (geocodeError || !latitude || !longitude || !geohash) {
			toast({
				message:
					"Failed to fetch geolocation. Please enter a valid zipcode/country.",
				type: "error",
			})
			setIsSaving(false)
			return
		}

		setIsSaving(true)

		try {
			const userRef = doc(database, Collections.USER, user.userID)
			await updateDoc(userRef, {
				name: profile.name,
				location: {
					latitude,
					longitude,
					zipcode: profile.zipcode,
					country: profile.country,
					geohash,
				},
				email: profile.email,
			})

			loginUser({
				...user,
				name: profile.name,
				email: profile.email,
				location: {
					latitude,
					longitude,
					zipcode: profile.zipcode,
					country: profile.country,
					geohash,
				},
			})

			toast({
				message: "Profile updated successfully.",
				type: "success",
			})

			setIsSaving(false)
			onCancel()
		} catch (error) {
			console.error("Error updating profile:", error)
			toast({
				message: "Failed to update profile. Please try again.",
				type: "error",
			})
			setIsSaving(false)
		}
	}

	/**
	 * Updates the profile state with the given key-value pair.
	 *
	 * @param {string} key - The key of the profile property to update.
	 * @param {string} value - The new value to set for the specified key.
	 */
	const handleInputChange = (key: string, value: string) => {
		setProfile((prevProfile) => ({
			...prevProfile,
			[key]: value,
		}))
	}

	return (
		<Layout>
			<CustomInput
				value={profile.name}
				onChangeText={(text) => handleInputChange("name", text)}
				placeholder="Enter your name"
				label="Name"
			/>
			<CustomInput
				value={profile.email}
				onChangeText={(text) => handleInputChange("email", text)}
				placeholder="Enter your email"
				label="Email"
			/>
			<CustomInput
				value={profile.country}
				onChangeText={(text) => handleInputChange("country", text)}
				placeholder="Enter your country"
				label="Country"
			/>
			<CustomInput
				value={profile.zipcode}
				onChangeText={(text) => handleInputChange("zipcode", text)}
				placeholder="Enter your zipcode"
				label="Zipcode"
				autoCapitalize="characters"
			/>
			<Layout style={globalStyles.horizontalRow}>
				<CustomButton
					status="info"
					onPress={handleSave}
					disabled={isSaving}
					accessoryLeft={() => (
						<Ionicons
							name="checkmark-circle-outline"
							size={Icons.MEDIUM_SIZE}
							color={Colors.BACKGROUND_BLACK}
						/>
					)}
				>
					{isSaving ? "Saving..." : "Save Changes"}
				</CustomButton>
				<CustomButton
					onPress={onCancel}
					appearance="outline"
					size="small"
					status="danger"
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
		</Layout>
	)
}

export default EditAccount
