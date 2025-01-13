import { Colors, Fonts, FontSizes } from "@/constants/constants"
import { StyleSheet } from "react-native"

const globalStyles = StyleSheet.create({
	linkText: {
		textDecorationLine: "underline",
		fontFamily: Fonts.BOLD,
	},
	boldText: {
		fontFamily: Fonts.BOLD,
	},
	title: {
		fontFamily: Fonts.BOLD,
		marginBottom: FontSizes.LARGE,
		textAlign: "right",
	},
	smallHeadingText: {
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.LARGE,
		paddingVertical: 10,
	},
	horizontalRow: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginVertical: 10,
	},
	textRow: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		alignContent: "center",
		justifyContent: "center",
		gap: 4,
		backgroundColor: Colors.TRANSPARENT,
	},
	noContentMessage: {
		textAlign: "center",
		fontSize: FontSizes.MEDIUM,
		color: Colors.GRAY,
		marginVertical: 10,
		fontFamily: Fonts.REGULAR,
	},
})

export default globalStyles
