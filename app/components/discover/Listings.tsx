import { Colors, FontSizes } from "@/constants/constants"
import globalStyles from "@/styles/global"
import { IItem } from "@/types"
import { Layout, List, Text } from "@ui-kitten/components"
import React, { ReactElement, useCallback } from "react"
import { RefreshControl, StyleSheet } from "react-native"
import Loading from "../common/Loading"
import ListingItem from "./ListingItem"

interface ListingsProps {
	listings: IItem[]
	fetchMore: () => void
	loading: boolean
	hasMore: boolean
	refresh: () => void
}

/**
 * Displays a list of listings with a "load more" feature
 *
 * @param listings The listings to display
 * @param fetchMore The function to fetch more listings
 * @param loading Whether more listings are currently being fetched
 * @param hasMore Whether there are more listings to fetch
 * @returns A list of listings
 */
const Listings = ({
	listings,
	fetchMore,
	loading,
	hasMore,
	refresh,
}: ListingsProps): ReactElement => {
	const handleEndReached = useCallback(() => {
		if (!loading && hasMore) {
			fetchMore()
		}
	}, [loading, hasMore, fetchMore])

	return (
		<Layout style={styles.container}>
			<Text status="info" style={globalStyles.smallHeadingText}>
				Recently Added
			</Text>
			<List
				ListEmptyComponent={() => (
					<Text style={styles.noItemsText} appearance="hint">
						No recent items available for your location.
					</Text>
				)}
				data={listings}
				contentContainerStyle={{
					flexGrow: 1,
				}}
				renderItem={({ item }) => (
					<Layout style={{ width: 150 }}>
						<ListingItem item={item} />
					</Layout>
				)}
				numColumns={3}
				onEndReached={handleEndReached}
				onEndReachedThreshold={0.1}
				refreshControl={
					<RefreshControl refreshing={loading} onRefresh={refresh} />
				}
				ListFooterComponent={loading && hasMore ? <Loading /> : null}
			/>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		marginBottom: 150,
		paddingHorizontal: 10,
		paddingBottom: 10,
	},
	noItemsText: {
		fontSize: FontSizes.SMALL,
		textAlign: "center",
		backgroundColor: Colors.BACKGROUND_DARK,
	},
})

export default Listings
