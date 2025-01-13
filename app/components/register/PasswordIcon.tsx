import { Colors, Icons } from "@/constants/constants"
import { AntDesign } from "@expo/vector-icons"
import { TouchableWithoutFeedback } from "react-native"

interface PasswordIconProps {
	showPassword: boolean
	isDisabled?: boolean
	setShowPassword: (showPassword: boolean) => void
}

/**
 * A toggleable icon component for showing or hiding passwords.
 *
 * @param {PasswordIconProps} props - Component props.
 * @param {boolean} props.showPassword - Whether the password is visible.
 * @param {boolean} [props.isDisabled] - Whether the icon is disabled.
 * @param {Function} props.setShowPassword - Function to toggle password visibility.
 * @returns {JSX.Element} The rendered PasswordIcon component.
 */
const PasswordIcon: React.FC<PasswordIconProps> = ({
	showPassword,
	isDisabled = false,
	setShowPassword,
}) => {
	const iconName = showPassword ? "eye" : "eyeo"
	const iconColor = isDisabled ? Colors.PRIMARY : Colors.GRAY

	const handlePress = () => {
		if (!isDisabled) {
			setShowPassword(!showPassword)
		}
	}

	return (
		<TouchableWithoutFeedback onPress={handlePress} disabled={isDisabled}>
			<AntDesign name={iconName} size={Icons.MEDIUM_SIZE} color={iconColor} />
		</TouchableWithoutFeedback>
	)
}

export default PasswordIcon
