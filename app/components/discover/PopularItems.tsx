import { FontSizes } from "@/constants/constants"
import globalStyles from "@/styles/global"
import { IItem } from "@/types"
import { Layout, Text } from "@ui-kitten/components"
import React from "react"
import { ScrollView, StyleSheet } from "react-native"
import ListingItem from "./ListingItem"

interface PopularItemsProps {
	listings: IItem[]
	error: string | null
}

/**
 * Displays popular items in a horizontal scroll view.
 *
 * @param {PopularItemsProps} props - The component props.
 * @returns {JSX.Element} A horizontal list of popular items or a fallback message.
 */
const PopularItems: React.FC<PopularItemsProps> = ({ listings, error }) => {
	return (
		<Layout style={styles.popularSection}>
			<Text status="info" style={globalStyles.smallHeadingText}>
				Popular
			</Text>
			{listings && listings.length > 0 ? (
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{listings.map((item) => (
						<Layout key={item.id} style={{ width: 150 }}>
							<ListingItem item={item} />
						</Layout>
					))}
				</ScrollView>
			) : (
				<Text style={styles.noItemsText} appearance="hint">
					No popular items available for your location
				</Text>
			)}
			{error && <Text status="danger">{error}</Text>}
		</Layout>
	)
}

const styles = StyleSheet.create({
	popularSection: {
		paddingHorizontal: 10,
		paddingBottom: 10,
	},
	noItemsText: {
		marginTop: 10,
		fontSize: FontSizes.SMALL,
		textAlign: "center",
	},
})

export default PopularItems
