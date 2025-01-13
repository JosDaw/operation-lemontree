import Categories from "@/components/discover/Categories"
import Listings from "@/components/discover/Listings"
import PopularItems from "@/components/discover/PopularItems"
import SearchBar from "@/components/discover/SearchBar"
import CreateAccountReminder from "@/components/register/CreateAccountReminder"
import { Colors } from "@/constants/constants"
import useListings from "@/hooks/useListings"
import useUser from "@/store/useUser"
import { IItem } from "@/types"
import { Layout, Text } from "@ui-kitten/components"
import { where } from "firebase/firestore"
import React, { useMemo, useState } from "react"
import { StyleSheet } from "react-native"
import { FlatList } from "react-native-gesture-handler"

/**
 * @returns The Home tab screen, which displays the categories and listings.
 */
export default function Tab() {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState<string>("")

	const { isLoggedIn } = useUser()

	const filters = useMemo(() => {
		const baseFilters = []

		if (searchQuery.trim()) {
			baseFilters.push(where("name", ">=", searchQuery))
			baseFilters.push(where("name", "<=", searchQuery + "\uf8ff"))
		}

		return baseFilters
	}, [searchQuery])

	const {
		regularListings,
		popularListings,
		loading,
		error,
		fetchMore,
		hasMore,
		refresh,
	} = useListings<IItem>({
		filters,
		category: selectedCategory,
	})

	const renderItem = ({ item }: { item: string }) => {
		switch (item) {
			case "searchBar":
				return <SearchBar onSearch={(query) => setSearchQuery(query)} />
			case "categories":
				return (
					<Categories
						selectedCategory={selectedCategory}
						onSelectCategory={(category) => setSelectedCategory(category)}
					/>
				)
			case "popularItems":
				return <PopularItems listings={popularListings} error={error} />
			case "createAccountReminder":
				return !isLoggedIn ? <CreateAccountReminder /> : null
			case "listings":
				return (
					<Listings
						listings={regularListings}
						fetchMore={fetchMore}
						loading={loading}
						hasMore={hasMore}
						refresh={refresh}
					/>
				)
			default:
				return null
		}
	}

	const sections = [
		"searchBar",
		"categories",
		"popularItems",
		"createAccountReminder",
		"listings",
	]

	return (
		<Layout style={styles.background}>
			<FlatList
				data={sections}
				renderItem={renderItem}
				keyExtractor={(item: any) => item}
				ListFooterComponent={
					error ? <Text status="danger">{error}</Text> : null
				}
			/>
		</Layout>
	)
}

const styles = StyleSheet.create({
	background: {
		backgroundColor: Colors.BACKGROUND_DARK,
		minHeight: "100%",
	},
})
