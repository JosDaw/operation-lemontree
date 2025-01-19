import { APP_NAME, Colors, Fonts, FontSizes } from "@/constants/constants"
import useUser from "@/store/useUser"
import { Layout, Text } from "@ui-kitten/components"
import { StyleSheet } from "react-native"

/**
 * Logo component
 */
const Logo = () => {
	const { user } = useUser()
	return (
		<Layout style={styles.logoContainer}>
			<Text style={styles.logoTitle}>{APP_NAME}</Text>
			{user.isAdmin && (
				<Text status="danger" style={styles.logoText}>
					Admin
				</Text>
			)}
		</Layout>
	)
}

const styles = StyleSheet.create({
	logoContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		margin: "auto",
		backgroundColor: Colors.PRIMARY,
		width: "100%",
		padding: 10,
	},
	logoText: {
		fontSize: FontSizes.LARGE,
		fontFamily: Fonts.BOLD,
	},
	logoTitle: {
		fontSize: FontSizes.LARGE,
		fontFamily: Fonts.BOLD,
		color: Colors.WHITE,
	},
})

export default Logo
