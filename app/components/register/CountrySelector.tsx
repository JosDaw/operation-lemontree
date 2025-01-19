import { Colors, Fonts, FontSizes } from "@/constants/constants"
import { Layout, Text } from "@ui-kitten/components"
import React from "react"
import { StyleSheet } from "react-native"
import CountryPicker from "react-native-dropdown-country-picker"

interface CountrySelectorProps {
	countryName: string
	onSelect: (country: any) => void
	disabled?: boolean
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
	countryName,
	onSelect,
	disabled = false,
}) => {
	return (
		<Layout style={styles.container}>
			<Text style={styles.label}>Country</Text>
			<Layout style={[styles.pickerContainer, disabled && styles.disabled]}>
				<CountryPicker
					selected={countryName}
					setSelected={() => {}}
					setCountryDetails={(country: any) => onSelect(country)}
					countryCodeTextStyles={styles.text}
					countryCodeContainerStyles={styles.pickerContainer}
					dropdownStyles={styles.dropdown}
					dropdownTextStyles={styles.text}
					searchStyles={styles.pickerContainer}
					searchTextStyles={styles.text}
				/>
			</Layout>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 10,
	},
	label: {
		color: Colors.GRAY,
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.MEDIUM,
		marginBottom: 4,
	},
	pickerContainer: {
		backgroundColor: Colors.BACKGROUND_BLACK,
		borderWidth: 1,
		borderRadius: 25,
		borderColor: Colors.BACKGROUND_BLACK,
		paddingLeft: 10,
	},
	disabled: {
		opacity: 0.5,
	},
	disabledButton: {
		opacity: 0.4,
	},
	dropdown: {
		backgroundColor: Colors.BACKGROUND_BLACK,
		borderColor: Colors.BACKGROUND_BLACK,
		borderRadius: 10,
	},
	text: {
		color: Colors.WHITE,
		fontFamily: Fonts.REGULAR,
		fontSize: FontSizes.SMALL,
	},
})

export default CountrySelector
