import { Colors, Fonts, FontSizes } from "@/constants/constants"
import {
	IndexPath,
	Layout,
	Select,
	SelectItem,
	Text,
} from "@ui-kitten/components"
import React from "react"
import { StyleSheet } from "react-native"

interface CategorySelectorProps {
	label: string
	categories: { name: string }[]
	selectedIndexes: IndexPath[]
	onSelect: (indexes: IndexPath[]) => void
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
	label,
	categories,
	selectedIndexes,
	onSelect,
}) => {
	const selectedValues = selectedIndexes
		.map((index) => categories[index.row].name)
		.join(", ")

	const renderCategoryOption = (category: { name: string }, index: number) => (
		<SelectItem
			key={index}
			title={(evaProps) => (
				<Text {...evaProps} style={styles.selectItemText}>
					{category.name}
				</Text>
			)}
		/>
	)

	return (
		<Layout style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<Select
				multiSelect
				selectedIndex={selectedIndexes}
				onSelect={(indexes) => onSelect(indexes as IndexPath[])} // Explicit cast to match the type
				value={(evaProps) => (
					<Text {...evaProps} style={styles.selectValue}>
						{selectedValues}
					</Text>
				)}
				style={styles.select}
			>
				{categories.map(renderCategoryOption)}
			</Select>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
	},
	label: {
		color: Colors.WHITE,
		fontFamily: Fonts.BOLD,
		fontSize: FontSizes.MEDIUM,
		marginBottom: 10,
	},
	select: {
		borderRadius: 25,
		overflow: "hidden",
	},
	selectValue: {
		fontFamily: Fonts.REGULAR,
		color: Colors.WHITE,
	},
	selectItemText: {
		fontFamily: Fonts.REGULAR,
		color: Colors.WHITE,
		textAlign: "left",
		width: "100%",
	},
})

export default CategorySelector
