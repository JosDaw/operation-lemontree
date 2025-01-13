import { Colors, Fonts, FontSizes } from "@/constants/constants"
import useUser from "@/store/useUser"
import { IItem, ItemStatus } from "@/types"
import { calculateDistance, getPreferredDistanceUnit } from "@/utils/helpers"
import { Layout, Text } from "@ui-kitten/components"
import { Link } from "expo-router"
import React, { ReactElement, useEffect, useState } from "react"
import { Image, StyleSheet, TouchableOpacity } from "react-native"
import Badge from "../common/Badge"
import SavesBadge from "../common/SavesBadge"
import StatusBadge from "../common/StatusBadge"

interface ListingItemProps {
	item: IItem
}

const ListingItem = ({ item }: ListingItemProps): ReactElement => {
	const { isLoggedIn, user } = useUser()

	// State to store preferred distance unit
	const [distanceUnit, setDistanceUnit] = useState<"km" | "miles">("km")
	const [distance, setDistance] = useState<number | null>(null)

	useEffect(() => {
		// Fetch the preferred distance unit and calculate distance
		const fetchUnitAndCalculateDistance = async () => {
			const unit = await getPreferredDistanceUnit()
			setDistanceUnit(unit)

			// Calculate the distance using the preferred unit
			const calculatedDistance = calculateDistance(
				user.location,
				item.location,
				unit
			)
			setDistance(calculatedDistance)
		}

		fetchUnitAndCalculateDistance()
	}, [item.location, user.location])

	const renderBadge = () => {
		if (!item.isApproved) {
			return <Badge text={ItemStatus.Pending} badgeStyle={styles.badgeStyle} />
		}
		return <StatusBadge status={item.status} />
	}

	const itemOpacity = item.status === ItemStatus.Available ? 1 : 0.5
	const combinedStyles = {
		...styles.item,
		opacity: itemOpacity ?? 1,
	}

	return (
		<Link href={`/item/${item.id}`} asChild style={styles.itemContainer}>
			<TouchableOpacity style={combinedStyles}>
				{renderBadge()}
				<Layout style={{ position: "relative" }}>
					<Image
						source={{ uri: item.images[0] }}
						style={[styles.itemImage, { opacity: itemOpacity }]}
					/>

					<SavesBadge initialSaves={item.saves || 0} itemID={item.id} />
				</Layout>
				<Text style={[styles.itemText, { opacity: itemOpacity }]}>
					{item.name}
				</Text>
				<Text style={[styles.itemLocation, { opacity: itemOpacity }]}>
					{isLoggedIn
						? `Approx. ${distance} ${distanceUnit} away`
						: item.location.zipcode}
				</Text>
			</TouchableOpacity>
		</Link>
	)
}

const styles = StyleSheet.create({
	itemContainer: {
		marginHorizontal: 15,
		marginVertical: 10,
	},
	item: {
		paddingTop: 10,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		paddingBottom: 10,
		position: "relative",
	},
	itemImage: {
		height: 150,
		borderRadius: 20,
	},
	itemText: {
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.MEDIUM,
		textAlign: "left",
		paddingVertical: 5,
	},
	itemLocation: {
		fontSize: FontSizes.SMALL,
		fontFamily: Fonts.SEMI_BOLD,
		textAlign: "left",
	},
	badgeStyle: {
		position: "absolute",
		top: -5,
		left: 0,
		backgroundColor: Colors.INFO,
		zIndex: 10,
	},
	plusBadgeContainer: {
		marginTop: 5,
		display: "flex",
		alignItems: "flex-end",
		justifyContent: "center",
		position: "absolute",
		right: -5,
		bottom: -5,
		backgroundColor: "transparent",
	},
})

export default ListingItem
