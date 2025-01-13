import { Colors, Fonts, FontSizes } from "@/constants/constants"
import { Input, Layout, Text } from "@ui-kitten/components"
import React from "react"
import { StyleSheet, TextStyle } from "react-native"

interface CustomInputProps {
	label: string
	placeholder: string
	value: string
	onChangeText: (value: string) => void
	disabled?: boolean
	secureTextEntry?: boolean
	accessoryRight?: (props: any) => JSX.Element
	maxLength?: number
	autoCapitalize?: "none" | "sentences" | "words" | "characters"
	autoCorrect?: boolean
	multiline?: boolean
	textStyle?: TextStyle
}

const CustomInput: React.FC<CustomInputProps> = ({
	label,
	placeholder,
	value,
	onChangeText,
	disabled = false,
	secureTextEntry = false,
	accessoryRight,
	maxLength,
	autoCapitalize = "none",
	autoCorrect = true,
	multiline = false,
	textStyle = { fontFamily: Fonts.REGULAR },
}) => {
	return (
		<Layout style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<Input
				placeholder={placeholder}
				value={value}
				onChangeText={onChangeText}
				disabled={disabled}
				secureTextEntry={secureTextEntry}
				accessoryRight={accessoryRight}
				maxLength={maxLength}
				autoCapitalize={autoCapitalize}
				autoCorrect={autoCorrect}
				multiline={multiline}
				textStyle={textStyle}
				style={styles.input}
			/>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
		width: "100%",
	},
	label: {
		color: Colors.WHITE,
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.MEDIUM,
		marginBottom: 10,
	},
	input: {
		fontFamily: Fonts.BOLD,
		borderRadius: 20,
		width: "100%",
	},
})

export default CustomInput
