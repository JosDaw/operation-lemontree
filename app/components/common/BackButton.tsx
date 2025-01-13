import { Colors, Icons } from "@/constants/constants"
import { AntDesign } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { useRouter } from "expo-router"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"

const BackButton: React.FC = () => {
	const router = useRouter()

	return (
		<BlurView intensity={30} tint="light" style={styles.blurContainer}>
			<TouchableOpacity style={styles.button} onPress={() => router.back()}>
				<AntDesign
					name="arrowleft"
					size={Icons.MEDIUM_SIZE}
					color={Colors.PRIMARY}
				/>
			</TouchableOpacity>
		</BlurView>
	)
}

const styles = StyleSheet.create({
	blurContainer: {
		borderRadius: 50,
		overflow: "hidden",
		width: 35,
		height: 35,
	},
	button: {
		borderRadius: 50,
		padding: 5,
	},
})

export default BackButton
