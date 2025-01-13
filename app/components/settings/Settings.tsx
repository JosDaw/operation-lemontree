import { Colors, Fonts } from "@/constants/constants"
import globalStyles from "@/styles/global"
import { Layout, Text } from "@ui-kitten/components"
import { Link } from "expo-router"
import React, { useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import CustomButton from "../common/CustomButton"
import Footer from "../common/Footer"
import Loading from "../common/Loading"
import LogoutAccountButton from "../profile/LogoutAccountButton"
import DeleteAccountButton from "./DeleteAccountButton"
import NotificationToggles from "./NotificationToggles"

const Settings = () => {
	const [isProcessing, setIsProcessing] = useState<boolean>(false)

	return (
		<ScrollView
			contentContainerStyle={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-start",
				minHeight: "100%",
				backgroundColor: Colors.BACKGROUND_DARK,
				padding: 16,
			}}
		>
			<Text style={globalStyles.title} status="primary" category="h1">
				Settings
			</Text>

			{isProcessing ? (
				<Loading />
			) : (
				<Layout style={{ flex: 1, flexDirection: "column", gap: 46 }}>
					<NotificationToggles />

					{/* Support Section */}
					<Layout style={styles.supportSection}>
						<Text category="h5" style={styles.subtitle}>
							Support
						</Text>
						<Link href="https://example.com/help-center" asChild>
							<CustomButton status="info">Help Center</CustomButton>
						</Link>
						<Link href="https://example.com/contact-us" asChild>
							<CustomButton status="info">Contact Us</CustomButton>
						</Link>
						<Link href="https://example.com/report-problem" asChild>
							<CustomButton status="info">Report a Problem</CustomButton>
						</Link>
					</Layout>

					<LogoutAccountButton setIsProcessing={setIsProcessing} />

					<DeleteAccountButton setIsProcessing={setIsProcessing} />
				</Layout>
			)}

			<Footer />
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	supportSection: {
		padding: 16,
		borderRadius: 8,
		backgroundColor: Colors.BACKGROUND_BLACK,
		gap: 12,
	},
	subtitle: {
		marginBottom: 16,
		color: Colors.INFO,
		fontFamily: Fonts.SEMI_BOLD,
	},
})

export default Settings
