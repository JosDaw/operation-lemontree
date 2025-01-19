import { Colors, Fonts, FontSizes } from "@/constants/constants"
import useUser from "@/store/useUser"
import { Ionicons } from "@expo/vector-icons"
import { Layout } from "@ui-kitten/components"
import React, { useState } from "react"
import { StyleSheet, TextInput } from "react-native"

interface SearchBarProps {
	onSearch: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const [searchText, setSearchText] = useState<string>("")

	const { user } = useUser()

	const handleSearch = () => {
		onSearch(searchText)
	}

	return (
		<Layout style={styles.container}>
			<Ionicons
				name="search"
				size={20}
				color={Colors.WHITE}
				style={styles.icon}
			/>
			<TextInput
				style={styles.input}
				placeholder={`Search near ${user.location.zipcode || "you"}`}
				placeholderTextColor={Colors.GRAY}
				value={searchText}
				onChangeText={setSearchText}
				onSubmitEditing={handleSearch}
			/>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.BACKGROUND_BLACK,
		borderRadius: 25,
		paddingVertical: 10,
		paddingHorizontal: 15,
		marginHorizontal: 15,
		marginTop: 20,
	},
	icon: {
		marginRight: 10,
	},
	input: {
		flex: 1,
		color: Colors.WHITE,
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.MEDIUM,
	},
})

export default SearchBar
