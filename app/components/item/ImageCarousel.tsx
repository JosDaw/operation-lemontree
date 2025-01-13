import { Colors, Icons } from "@/constants/constants"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Layout } from "@ui-kitten/components"
import { BlurView } from "expo-blur"
import React, { useState } from "react"
import {
	Dimensions,
	Image,
	Modal,
	StyleSheet,
	TouchableOpacity,
} from "react-native"
import Swiper from "react-native-swiper"
import CustomButton from "../common/CustomButton"

const { width } = Dimensions.get("window")

interface ImageCarouselProps {
	images: string[] // Array of image URLs
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
	const [fullscreenVisible, setFullscreenVisible] = useState(false)
	const [selectedImage, setSelectedImage] = useState<string | null>(null)

	const openFullscreen = (image: string) => {
		setSelectedImage(image)
		setFullscreenVisible(true)
	}

	const closeFullscreen = () => {
		setFullscreenVisible(false)
		setSelectedImage(null)
	}

	return (
		<Layout>
			{/* Swiper Carousel */}
			<Swiper
				showsPagination={true}
				loop={true}
				autoplay={true}
				autoplayTimeout={3}
				style={styles.swiper}
			>
				{images.map((image, index) => (
					<TouchableOpacity key={index} onPress={() => openFullscreen(image)}>
						<Image source={{ uri: image }} style={styles.carouselImage} />
					</TouchableOpacity>
				))}
			</Swiper>

			{/* Fullscreen Modal */}
			{selectedImage && (
				<Modal
					visible={fullscreenVisible}
					transparent={true}
					animationType="fade"
					onRequestClose={closeFullscreen}
				>
					<Layout style={styles.modalContainer}>
						{/* Blur Background */}
						<BlurView
							intensity={80}
							tint="dark"
							style={StyleSheet.absoluteFillObject}
						/>

						{/* Close Button */}
						<CustomButton
							status="danger"
							accessoryLeft={() => (
								<Ionicons
									name="close-circle-outline"
									size={Icons.MEDIUM_SIZE}
									color={Colors.BACKGROUND_BLACK}
								/>
							)}
							onPress={closeFullscreen}
							style={styles.closeButton}
						>
							Close
						</CustomButton>

						{/* Fullscreen Image */}
						<Image
							source={{ uri: selectedImage }}
							style={styles.fullscreenImage}
						/>
					</Layout>
				</Modal>
			)}
		</Layout>
	)
}

const styles = StyleSheet.create({
	swiper: {
		height: 250, // Height of the carousel
	},
	carouselImage: {
		height: 250,
		width: width,
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		alignSelf: "center",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	fullscreenImage: {
		width: "100%",
		height: "80%",
		resizeMode: "contain",
	},
	closeButton: {
		position: "absolute",
		top: 40,
		right: 20,
		zIndex: 1,
	},
})

export default ImageCarousel
