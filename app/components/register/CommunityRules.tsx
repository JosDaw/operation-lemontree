import {
	APP_NAME,
	Colors,
	Fonts,
	FontSizes,
	Icons,
} from "@/constants/constants"
import globalStyles from "@/styles/global"
import { Ionicons } from "@expo/vector-icons"
import { Layout, Text } from "@ui-kitten/components"
import React, { useRef, useState } from "react"
import { Animated, StyleSheet } from "react-native"
import CustomButton from "../common/CustomButton"

const CommunityRules = () => {
	const [isVisible, setIsVisible] = useState<boolean>(false)
	const animatedOpacity = useRef(new Animated.Value(0)).current

	const animatedStyle = {
		opacity: animatedOpacity,
		marginVertical: 10,
		backgroundColor: Colors.BACKGROUND_BLACK,
		paddingHorizontal: 5,
		borderRadius: 10,
	}

	/**
	 * Toggles the visibility of a component with an animation.
	 *
	 * If the component is currently visible, it will animate to an opacity of 0
	 * over 300 milliseconds and then set the visibility to false.
	 *
	 * If the component is currently not visible, it will set the visibility to true
	 * and then animate to an opacity of 1 over 300 milliseconds.
	 *
	 */
	const toggleVisibility = () => {
		if (isVisible) {
			Animated.timing(animatedOpacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false,
			}).start(() => setIsVisible(false))
		} else {
			setIsVisible(true)
			Animated.timing(animatedOpacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: false,
			}).start()
		}
	}
	return (
		<Layout style={styles.container}>
			<CustomButton
				status="info"
				onPress={toggleVisibility}
				accessoryLeft={() => (
					<Ionicons
						name={isVisible ? "arrow-up" : "arrow-down"}
						size={Icons.SMALL_SIZE}
						color={Colors.BACKGROUND_DARK}
					/>
				)}
			>
				{isVisible ? "Hide Community Rules" : "Show Community Rules"}
			</CustomButton>
			<Layout style={styles.container}>
				{isVisible && (
					<Animated.View style={[animatedStyle, { overflow: "hidden" }]}>
						<Text category="s2" style={globalStyles.smallHeadingText}>
							{APP_NAME} Community Rules
						</Text>
						<Animated.ScrollView>
							{[
								{
									rule: "Give Responsibly",
									text: "Donate items that are safe, clean, and in good condition.",
								},
								{
									rule: "Take What You Need",
									text: "Please only request items you truly need to ensure fairness for everyone.",
								},
								{
									rule: "No Illegal Items",
									text: "Do not donate or request items that are prohibited by law (e.g., drugs, alcohol, weapons, items that have an age restriction).",
								},
								{
									rule: "Respect Others",
									text: "Be courteous and respectful towards other users both digitally and in peron.",
								},
								{
									rule: "No Selling",
									text: `Items on ${APP_NAME} are strictly for personal use. Do not resell donated items.`,
								},
								{
									rule: "Food Safety",
									text: "Only donate food items that are non-perishable, unopened, and within their expiration date.",
								},
								{
									rule: "No Live Animals",
									text: "Do not donate or take live animals of any kind.",
								},
								{
									rule: "No Quality Guarantee",
									text: `${APP_NAME} takes no responsibility for the quality, safety, or condition of items donated.`,
								},
								{
									rule: "Report Issues",
									text: `If you notice unsafe or inappropriate items, please report them to ${APP_NAME} or use the 'Flag' button.`,
								},
							].map((item, index) => (
								<Text key={index} category="p2" style={styles.mainText}>
									<Text style={globalStyles.boldText}>{item.rule}:</Text>{" "}
									{item.text}
								</Text>
							))}
						</Animated.ScrollView>
					</Animated.View>
				)}
			</Layout>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
	},
	mainText: {
		fontSize: FontSizes.MEDIUM,
		fontFamily: Fonts.REGULAR,
		paddingVertical: 15,
		paddingHorizontal: 10,
	},
})

export default CommunityRules
