import { Colors, Fonts, FontSizes } from "@/constants/constants"
import { IItem } from "@/types"
import { getBorderColor } from "@/utils/itemHelpers"
import { getItemFromConversationID } from "@/utils/messageHelpers"
import { BlurView } from "expo-blur"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native"
import ConversationActions from "./ConversationActions"

interface MessageItemHeaderProps {
	slug: string
}

const MessageItemHeader: React.FC<MessageItemHeaderProps> = ({ slug }) => {
	const [item, setItem] = useState<IItem | null>(null)

	useEffect(() => {
		const fetchItemID = async () => {
			const item = await getItemFromConversationID(slug)
			setItem(item)
		}

		fetchItemID()
	}, [slug])

	if (!item) {
		return null // Show nothing or a loading spinner
	}

	return (
		<BlurView intensity={30} tint="light" style={styles.blurContainer}>
			<TouchableOpacity
				style={styles.link}
				onPress={() => router.push(`item/${item.id}`)}
			>
				<Text style={styles.itemName}>
					{item.name.length > 20 ? `${item.name.slice(0, 10)}...` : item.name}
				</Text>
				<Image
					source={{ uri: item.images[0] }}
					style={[styles.image, { borderColor: getBorderColor(item.status) }]}
				/>
			</TouchableOpacity>
			<ConversationActions itemID={item.id} conversationID={slug} />
		</BlurView>
	)
}

const styles = StyleSheet.create({
	link: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	image: {
		width: 35,
		height: 35,
		borderRadius: 17,
		borderWidth: 2,
		borderColor: Colors.PRIMARY,
	},
	itemName: {
		fontSize: FontSizes.MEDIUM,
		color: Colors.WHITE,
		fontFamily: Fonts.SEMI_BOLD,
	},
	blurContainer: {
		borderRadius: 50,
		overflow: "hidden",
		width: 200,
		height: 45,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		flexWrap: "nowrap",
		paddingHorizontal: 8,
		marginTop: 2,
		marginRight: -10,
	},
})

export default MessageItemHeader
