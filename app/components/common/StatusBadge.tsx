import { Colors, Fonts, FontSizes } from "@/constants/constants"
import { ItemStatus, RequestStatus } from "@/types"
import { Layout, useTheme } from "@ui-kitten/components"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { StyleSheet, Text, ViewStyle } from "react-native"

interface StatusBadgeProps {
	status: ItemStatus | RequestStatus
	size?: "small" | "large"
	right?: number
}

/**
 * Renders a status badge component with gradient backgrounds based on status.
 *
 * @component
 * @param {object} props - The component props.
 * @param {string} props.status - The status of the badge.
 * @param {string} [props.size] - The size of the badge, either "small" or "large". Default is "small".
 * @param {number} [props.right] - The right position of the badge.
 * @returns {JSX.Element} The rendered status badge component.
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
	status,
	size = "small",
	right = -15,
}: {
	status: string
	size?: string
	right?: number
}): JSX.Element => {
	const theme = useTheme()

	// Determine gradient colors based on status
	const getGradientColors = (): [string, string] => {
		switch (status) {
			case ItemStatus.Available:
				return [theme["color-primary-500"], theme["color-primary-500"]]
			case RequestStatus.Approved:
			case ItemStatus.Given:
			case ItemStatus.Rejected:
				return [theme["color-danger-500"], theme["color-danger-300"]]
			default:
				return [theme["color-basic-600"], theme["color-basic-500"]]
		}
	}

	// Style for the container based on size
	const getContainerStyle = (): ViewStyle => {
		if (size === "large") {
			// No positioning for large size
			return styles.largeContainer
		}
		return { ...styles.badgeContainer, right }
	}

	// Style for the badge size
	const getSizeStyle = () => {
		return size === "large" ? styles.large : styles.small
	}

	// Style for the text size
	const getTextSizeStyle = () => {
		return size === "large" ? styles.largeText : styles.badgeText
	}

	return (
		<Layout style={getContainerStyle()}>
			<LinearGradient
				colors={getGradientColors()}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={[styles.badge, getSizeStyle()]}
			>
				<Text style={[getTextSizeStyle(), styles.badgeTextColor]}>
					{status}
				</Text>
			</LinearGradient>
		</Layout>
	)
}

const styles = StyleSheet.create({
	badgeContainer: {
		position: "absolute",
		top: -10,
		borderRadius: 12,
		zIndex: 10,
		backgroundColor: Colors.TRANSPARENT,
	},
	largeContainer: {
		borderRadius: 12,
		backgroundColor: Colors.TRANSPARENT,
	},
	badge: {
		borderRadius: 12,
	},
	small: {
		paddingHorizontal: 8,
		paddingVertical: 2,
	},
	large: {
		paddingHorizontal: 20,
		paddingVertical: 4,
	},
	badgeText: {
		fontSize: FontSizes.SMALL,
		textAlign: "center",
		fontFamily: Fonts.BOLD,
	},
	largeText: {
		fontSize: FontSizes.LARGE,
		fontFamily: Fonts.BOLD,
		textAlign: "center",
	},
	badgeTextColor: {
		color: Colors.BLACK,
	},
})

export default StatusBadge
