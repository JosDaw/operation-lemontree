import { Colors, Fonts, FontSizes } from "@/constants/constants"
import { IItem, IUser } from "@/types"
import { Layout, Text } from "@ui-kitten/components"
import React from "react"
import { Image, StyleSheet } from "react-native"
import SavesBadge from "../common/SavesBadge"

interface ItemPosterProps {
	item: IItem
	user: IUser
}

const ItemPoster = ({ item, user }: ItemPosterProps) => {
	// Determine if it's the current user's post or someone else's
	const isCurrentUser = user.userID === item.userID

	return (
		<Layout style={styles.container}>
			<Image
				source={require("../../../assets/lemon-avatar.png")}
				style={styles.avatar}
			/>
			<Layout style={styles.textContainer}>
				<Text style={styles.username}>
					{isCurrentUser ? "You" : item.itemUserName || "Anonymous"}
				</Text>
				<Text style={styles.date}>
					{`Uploaded: ${new Date(item.dateCreated.toMillis()).toLocaleDateString()}`}
				</Text>
			</Layout>
			<SavesBadge
				initialSaves={item.saves || 0}
				itemID={item.id}
				variant="large"
			/>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		backgroundColor: Colors.BACKGROUND_BLACK,
		borderRadius: 10,
		marginVertical: 20,
		marginHorizontal: 10,
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		borderWidth: 2,
		borderColor: Colors.PRIMARY,
	},
	textContainer: {
		marginHorizontal: 10,
		flex: 1,
		gap: 10,
		backgroundColor: Colors.TRANSPARENT,
	},
	username: {
		fontSize: FontSizes.MEDIUM,
		fontFamily: Fonts.BOLD,
		color: Colors.WHITE,
	},
	date: {
		fontSize: FontSizes.SMALL,
		color: Colors.GRAY,
		fontFamily: Fonts.REGULAR,
	},
})

export default ItemPoster
