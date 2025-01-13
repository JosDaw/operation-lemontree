import { CATEGORIES } from "@/constants/categories"
import { Colors, Fonts, FontSizes } from "@/constants/constants"
import { Ionicons } from "@expo/vector-icons"
import { Layout, Text } from "@ui-kitten/components"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native"
interface CategoriesProps {
	selectedCategory: string | null
	onSelectCategory: (category: string | null) => void
}

const Categories: React.FC<CategoriesProps> = ({
	selectedCategory,
	onSelectCategory,
}) => {
	// Reorganize categories with "All" or "Reset Filter" at the front
	const categories = [
		{
			name: "All",
			iconComponent: Ionicons,
			iconName: "filter-sharp",
		},
		...CATEGORIES,
	]

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.scrollContainer}
		>
			{categories.map((category, index) => {
				// "All" is active when no category is selected
				const isActive =
					selectedCategory === category.name ||
					(category.name === "All" && !selectedCategory)
				const IconComponent = category.iconComponent

				return (
					<TouchableOpacity
						key={index}
						onPress={() =>
							onSelectCategory(category.name === "All" ? null : category.name)
						}
					>
						{isActive ? (
							<LinearGradient
								colors={[Colors.PRIMARY, Colors.INFO]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={styles.activeCategory}
							>
								<Text style={[styles.text, styles.activeText]}>
									{category.name}
								</Text>
								{IconComponent && (
									<IconComponent
										name={category.iconName}
										color={Colors.BACKGROUND_DARK}
										size={FontSizes.LARGE}
										style={styles.icon}
									/>
								)}
							</LinearGradient>
						) : (
							<Layout style={styles.category}>
								<Text style={styles.text}>{category.name}</Text>
								{IconComponent && (
									<IconComponent
										name={category.iconName}
										color={Colors.WHITE}
										size={FontSizes.LARGE}
										style={styles.icon}
									/>
								)}
							</Layout>
						)}
					</TouchableOpacity>
				)
			})}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	scrollContainer: {
		flexDirection: "row",
		paddingHorizontal: 10,
		gap: 10,
		paddingVertical: 20,
	},
	category: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.BACKGROUND_BLACK,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: Colors.BACKGROUND_DARK,
	},
	activeCategory: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 25,
	},
	text: {
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.MEDIUM,
		color: Colors.WHITE,
	},
	activeText: {
		color: Colors.BACKGROUND_DARK,
	},
	icon: {
		marginLeft: 8,
	},
})

export default Categories
