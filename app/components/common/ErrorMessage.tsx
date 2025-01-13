import { Fonts } from "@/constants/constants"
import { Text } from "@ui-kitten/components"
import React from "react"

interface ErrorMessageProps {
	error: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) =>
	error && (
		<Text
			status="danger"
			style={{
				textAlign: "center",
				paddingVertical: 10,
				fontFamily: Fonts.SEMI_BOLD,
			}}
		>
			{error}
		</Text>
	)

export default ErrorMessage
