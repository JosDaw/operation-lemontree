import { Colors, Fonts } from "@/constants/constants"
import globalStyles from "@/styles/global"
import { Layout, Text } from "@ui-kitten/components"
import { Link } from "expo-router"
import { StyleSheet } from "react-native"
import CustomButton from "../common/CustomButton"

const CreateAccountReminder = () => {
	return (
		<Layout style={styles.container}>
			<Link href="/register" asChild>
				<CustomButton status="info" size="large">
					Create My Account
				</CustomButton>
			</Link>

			<Text style={{ marginVertical: 20, fontFamily: Fonts.REGULAR }}>
				Already have an account?{` `}
				<Link href="/login" style={globalStyles.linkText}>
					Log In
				</Link>
			</Text>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
		justifyContent: "space-evenly",
		alignItems: "center",
		paddingVertical: 10,
		backgroundColor: Colors.TRANSPARENT,
	},
})

export default CreateAccountReminder
