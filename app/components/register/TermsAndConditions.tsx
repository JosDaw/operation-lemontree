import { APP_NAME, Fonts } from "@/constants/constants"
import globalStyles from "@/styles/global"
import { A } from "@expo/html-elements"
import { CheckBox, Layout, Text } from "@ui-kitten/components"
import React from "react"
import CommunityRules from "./CommunityRules"

interface TermsAndConditionsProps {
	isAgreed: boolean
	setIsAgreed: React.Dispatch<React.SetStateAction<boolean>>
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
	isAgreed,
	setIsAgreed,
}) => (
	<Layout style={{ marginVertical: 30 }}>
		<Text category="h6" style={{ fontFamily: Fonts.REGULAR }}>
			By clicking Create Account below, you agree to the {APP_NAME}{" "}
			<A href="/privacy" style={globalStyles.linkText}>
				Privacy Policy
			</A>{" "}
			and{" "}
			<A href="/terms" style={globalStyles.linkText}>
				Terms and Conditions
			</A>
			.
		</Text>
		<CheckBox
			checked={isAgreed}
			onChange={(checked) => setIsAgreed(checked)}
			style={{ marginVertical: 10 }}
			status="info"
		>
			{() => (
				<Text style={{ fontFamily: Fonts.REGULAR, paddingLeft: 10 }}>
					I have read and agreed to the community rules below.
				</Text>
			)}
		</CheckBox>
		<CommunityRules />
	</Layout>
)

export default TermsAndConditions
