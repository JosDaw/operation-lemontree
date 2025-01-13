import { Fonts } from "@/constants/constants"
import { StyleSheet } from "react-native"
import CustomInput from "../common/CustomInput"

interface UploadInputsProps {
	name: string
	setName: (text: string) => void
	description: string
	setDescription: (text: string) => void
	zipcode: string
	setZipcode: (text: string) => void
}

const UploadInputs = ({
	name,
	setName,
	description,
	setDescription,
	zipcode,
	setZipcode,
}: UploadInputsProps) => {
	return (
		<>
			<CustomInput
				label="Title"
				placeholder="Choose a title for your item"
				value={name}
				onChangeText={setName}
				maxLength={150}
			/>

			<CustomInput
				label="Description"
				placeholder="Describe your item in detail - at least 10 characters"
				value={description}
				onChangeText={setDescription}
				multiline
				textStyle={styles.textArea}
				maxLength={1000}
			/>

			<CustomInput
				label="Pickup Zipcode"
				placeholder="Approx. pickup zipcode (publicly visible)"
				value={zipcode}
				onChangeText={setZipcode}
				maxLength={100}
			/>
		</>
	)
}

const styles = StyleSheet.create({
	textArea: {
		minHeight: 100,
		textAlignVertical: "top",
		fontFamily: Fonts.REGULAR,
	},
})

export default UploadInputs
