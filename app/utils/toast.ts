import { Colors, Fonts } from "@/constants/constants"
import Toast from "react-native-root-toast"

interface IToast {
	message: string
	type?: "success" | "error"
}

/**
 * Displays a toast notification with the specified message and type.
 *
 * @param {Object} params - The parameters for the toast notification.
 * @param {string} params.message - The message to display in the toast.
 * @param {string} params.type - The type of the toast, which determines the background color.
 *                               Use "error" for a red background, otherwise a secondary color is used.
 *
 */
export default function toast({ message, type }: IToast) {
	Toast.show(message, {
		duration: Toast.durations.LONG,
		shadow: true,
		animation: true,
		hideOnPress: true,
		backgroundColor: type === "error" ? Colors.DANGER : Colors.SECONDARY,
		textColor: Colors.WHITE,
		opacity: 1,
		textStyle: { fontFamily: Fonts.BOLD },
	})
}
