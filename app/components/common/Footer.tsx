import { Colors, Fonts, FontSizes } from "@/constants/constants"
import globalStyles from "@/styles/global"
import { A } from "@expo/html-elements"
import { Layout, Text } from "@ui-kitten/components"
import Constants from "expo-constants"
import { StyleSheet } from "react-native"

/**
 * Footer component that displays the application's footer information.
 *
 * @remarks
 * This component includes:
 * - Links to the contact page and privacy policy.
 * - The current application version.
 */
const Footer = () => {
	const appVersion = Constants.expoConfig?.version || "Unknown"
	return (
		<Layout style={styles.container}>
			<Text category="s2" status="warning" style={globalStyles.boldText}>
				Copyright Lemontree 2024 |{" "}
				<A href="https://example.com/contact" style={globalStyles.linkText}>
					Contact
				</A>{" "}
				|{" "}
				<A href="https://example.com/privacy" style={globalStyles.linkText}>
					Privacy Policy
				</A>
			</Text>
			<Text style={styles.versionText}>App Version: {appVersion}</Text>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
		marginVertical: 20,
	},
	versionText: {
		fontSize: FontSizes.XSMALL,
		color: Colors.GRAY,
		paddingVertical: 10,
		textAlign: "center",
		fontFamily: Fonts.REGULAR,
	},
})

export default Footer
