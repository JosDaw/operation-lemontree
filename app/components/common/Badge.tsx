import { Colors, Fonts, FontSizes } from "@/constants/constants"
import { Layout, Text, useTheme } from "@ui-kitten/components"
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native"

interface BadgeProps {
	text: string
	badgeStyle?: StyleProp<ViewStyle>
	badgeTextStyle?: StyleProp<TextStyle>
	color?: string
}

/**
 * Badge component that displays a text inside a styled layout.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.text - The text to be displayed inside the badge.
 * @param {Object} [props.badgeStyle] - Optional custom styles for the badge layout.
 * @param {Object} [props.badgeTextStyle] - Optional custom styles for the badge text.
 * @param {string} [props.color="color-primary-500"] - The color of the badge.
 *
 * @returns {JSX.Element} The rendered Badge component.
 */
const Badge = ({
	text,
	badgeStyle,
	badgeTextStyle,
	color = "color-primary-500",
}: BadgeProps): JSX.Element => {
	const theme = useTheme()
	return (
		<Layout
			style={[{ backgroundColor: theme[color] }, badgeStyle, styles.badge]}
		>
			<Text style={[styles.badgeText, { color: Colors.WHITE }, badgeTextStyle]}>
				{text}
			</Text>
		</Layout>
	)
}

const styles = StyleSheet.create({
	badge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 12,
	},
	badgeText: {
		fontSize: FontSizes.SMALL,
		fontFamily: Fonts.BOLD,
	},
})

export default Badge
