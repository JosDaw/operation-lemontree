import { Colors, Fonts } from "@/constants/constants"
import {
	ButtonProps,
	Button as KittenButton,
	Text,
} from "@ui-kitten/components"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { StyleProp, ViewStyle } from "react-native"

interface CustomButtonProps extends ButtonProps {
	customBorderRadius?: number
	style?: StyleProp<ViewStyle>
	onPress?: () => void
	gradientColors?: [string, string, ...string[]] // Tuple for at least two gradient colors
	gradientStyle?: StyleProp<ViewStyle> // Custom styles for gradient container
	textColor?: string // Custom text color
}

/**
 * CustomButton component with gradient background support and conditional border removal.
 *
 * @component
 * @param {CustomButtonProps} props - Props for customization.
 */
const CustomButton: React.FC<CustomButtonProps> = ({
	style,
	customBorderRadius,
	children,
	onPress,
	gradientColors,
	gradientStyle,
	textColor = Colors.BACKGROUND_BLACK,
	disabled,
	...props
}) => {
	const buttonStyles = [
		style,
		{
			borderRadius: customBorderRadius || 50,
			borderWidth: gradientColors ? 0 : undefined, // Remove border for gradient buttons
			opacity: disabled ? 0.6 : 1, // Apply opacity when disabled
		},
	]

	const gradientStyles = [
		{
			borderRadius: customBorderRadius || 50,
			opacity: disabled ? 0.6 : 1, // Apply opacity to the gradient when disabled
		},
		gradientStyle,
	]

	const handlePress = () => {
		if (!disabled && onPress) {
			onPress()
		}
	}

	// Wrap in LinearGradient if gradientColors are provided
	if (gradientColors) {
		return (
			<LinearGradient
				colors={gradientColors}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={gradientStyles}
			>
				<KittenButton
					style={[buttonStyles, { backgroundColor: "transparent" }]}
					{...props}
					onPress={handlePress}
					disabled={disabled} // Pass disabled prop to KittenButton
				>
					{(evaProps) => (
						<Text
							{...evaProps}
							style={{
								color: textColor,
								fontFamily: Fonts.BOLD,
								marginLeft: props.accessoryLeft ? 10 : 0,
								marginRight: props.accessoryRight ? 10 : 0,
							}}
						>
							{children?.toString()}
						</Text>
					)}
				</KittenButton>
			</LinearGradient>
		)
	}

	// Render without gradient
	return (
		<KittenButton
			style={buttonStyles}
			{...props}
			onPress={handlePress}
			disabled={disabled}
		>
			{(evaProps) => (
				<Text
					{...evaProps}
					style={{
						color: textColor,
						fontFamily: Fonts.BOLD,
						marginLeft: props.accessoryLeft ? 10 : 0,
						marginRight: props.accessoryRight ? 10 : 0,
					}}
				>
					{children?.toString()}
				</Text>
			)}
		</KittenButton>
	)
}

export default CustomButton
