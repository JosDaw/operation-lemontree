import { Colors, Fonts } from "@/constants/constants"
import { Layout, Text } from "@ui-kitten/components"
import React from "react"
import { PacmanIndicator } from "react-native-indicators"

interface LoadingProps {
	status?:
		| "primary"
		| "success"
		| "info"
		| "warning"
		| "danger"
		| "basic"
		| "control"
	size?: number
	text?: string
}

/**
 * Renders a loading component with customizable status, size, and text.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.status='primary'] - The status of the text.
 * @param {number} [props.size=80] - The size of the spinner.
 * @param {string} [props.text='Loading...'] - The text to display below the spinner.
 */
const Loading: React.FC<LoadingProps> = ({
	status = "primary",
	size = 80,
	text = "Loading...",
}) => {
	return (
		<Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<PacmanIndicator color={Colors.WHITE} size={size} />
			{text && (
				<Text status={status} style={{ marginTop: 16, fontFamily: Fonts.BOLD }}>
					{text}
				</Text>
			)}
		</Layout>
	)
}

export default Loading
