import { Colors, Fonts, FontSizes, Icons } from "@/constants/constants"
import useUser from "@/store/useUser"
import globalStyles from "@/styles/global"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { Layout, Text } from "@ui-kitten/components"
import { Link } from "expo-router"
import React, { useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import Badge from "../common/Badge"
import CustomButton from "../common/CustomButton"
import Footer from "../common/Footer"
import EditAccount from "./EditAccount"
import UserUploadedItemsList from "./UserUploadedItemsList"

/**
 * Renders the user profile page with an editable option.
 *
 * @returns The rendered user profile component.
 */
const Profile = () => {
	const [isEditing, setIsEditing] = useState<boolean>(false)

	const { user } = useUser((state: any) => ({
		user: state.user,
		loginUser: state.loginUser,
	}))

	return (
		<ScrollView
			contentContainerStyle={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				minHeight: "100%",
				paddingHorizontal: 5,
				backgroundColor: Colors.BACKGROUND_DARK,
			}}
		>
			<Layout style={styles.container}>
				<Layout style={globalStyles.horizontalRow}>
					<Link href="/settings" asChild>
						<CustomButton
							status="info"
							accessoryLeft={() => (
								<Ionicons
									name="settings"
									size={Icons.MEDIUM_SIZE}
									color={Colors.BACKGROUND_BLACK}
								/>
							)}
						>
							Settings
						</CustomButton>
					</Link>
					<Text style={globalStyles.title} status="primary" category="h1">
						Profile
					</Text>
				</Layout>

				<Layout style={styles.infoContainer}>
					{isEditing ? (
						<EditAccount user={user} onCancel={() => setIsEditing(false)} />
					) : (
						<>
							<Text style={styles.infoLabel}>Name:</Text>
							<Text style={styles.infoValue}>{user.name}</Text>
							<Text style={styles.infoLabel}>Email:</Text>
							<Text style={styles.infoValue}>{user.email}</Text>
							<Text style={styles.infoLabel}>Country:</Text>
							<Text style={styles.infoValue}>{user.location.country}</Text>
							<Text style={styles.infoLabel}>Zipcode:</Text>
							<Text style={styles.infoValue}>{user.location.zipcode}</Text>
							<CustomButton
								onPress={() => setIsEditing(true)}
								status="info"
								accessoryLeft={() => (
									<MaterialCommunityIcons
										name="account-edit"
										size={Icons.MEDIUM_SIZE}
										color={Colors.BACKGROUND_BLACK}
									/>
								)}
							>
								Edit Profile
							</CustomButton>
						</>
					)}

					{user.isAdmin && <Badge text="Admin" color="color-danger-500" />}
				</Layout>

				<UserUploadedItemsList />
			</Layout>
			<Footer />
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
	title: {
		fontFamily: Fonts.SEMI_BOLD,
		marginBottom: 24,
	},
	infoContainer: {
		marginVertical: 40,
		alignItems: "flex-start",
		width: "100%",
	},
	infoLabel: {
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.MEDIUM,
		marginBottom: 4,
	},
	infoValue: {
		fontFamily: Fonts.REGULAR,
		fontSize: FontSizes.MEDIUM,
		marginBottom: 16,
		color: Colors.WHITE,
	},
})

export default Profile
