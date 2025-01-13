// RequestButton.tsx
import { Colors, Icons } from "@/constants/constants"
import { IItem, ItemStatus, IUser } from "@/types"
import { handleAdminApprove, handleAdminReject } from "@/utils/itemHelpers"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Layout } from "@ui-kitten/components"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import CustomButton from "../common/CustomButton"
import FoodSafetyModal from "./FoodSafetyModal"

interface RequestButtonProps {
	item: IItem
	isLoggedIn: boolean
	user: IUser
	handleRequest: () => void
}

const RequestButton = ({
	item,
	isLoggedIn,
	user,
	handleRequest,
}: RequestButtonProps) => {
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

	if (user.isAdmin && !item.isApproved) {
		return (
			<Layout style={styles.buttonContainer}>
				<CustomButton
					onPress={() => handleAdminApprove(item.id, user.name)}
					accessoryLeft={() => (
						<Ionicons
							name="checkmark-circle-outline"
							size={Icons.MEDIUM_SIZE}
							color={Colors.WHITE}
						/>
					)}
				>
					Approve
				</CustomButton>
				<CustomButton
					onPress={() => handleAdminReject(item, user.name)}
					appearance="outline"
					status="danger"
					accessoryLeft={() => (
						<Ionicons
							name="close-circle-outline"
							size={Icons.MEDIUM_SIZE}
							color={Colors.DANGER}
						/>
					)}
					textColor={Colors.DANGER}
				>
					Reject
				</CustomButton>
			</Layout>
		)
	}

	if (item.status === ItemStatus.Available && item.isApproved) {
		return (
			<>
				<Layout style={styles.stickyContainer}>
					<CustomButton
						disabled={!isLoggedIn || item.isRequestedByUser}
						gradientColors={[Colors.PINK, Colors.DANGER]}
						textColor={Colors.WHITE}
						size="giant"
						onPress={() => {
							if (
								item.categories.some((category) => category.includes("Food"))
							) {
								setIsOpenModal(true)
							} else {
								handleRequest()
							}
						}}
						accessoryLeft={() => (
							<Ionicons
								name={
									item.isRequestedByUser
										? "checkmark-circle-outline"
										: "chatbubbles"
								}
								size={Icons.MEDIUM_SIZE}
								color={Colors.WHITE}
							/>
						)}
					>
						{item.isRequestedByUser
							? "Requested"
							: `Contact ${item.itemUserName}`}
					</CustomButton>
				</Layout>

				<FoodSafetyModal
					isOpen={isOpenModal}
					onAgree={() => {
						handleRequest()
						setIsOpenModal(false)
					}}
					onCancel={() => setIsOpenModal(false)}
				/>
			</>
		)
	}

	return <CustomButton disabled>{item.status}</CustomButton>
}

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		backgroundColor: "transparent",
		marginVertical: 8,
		paddingHorizontal: 10,
	},
	stickyContainer: {
		backgroundColor: Colors.TRANSPARENT,
		marginHorizontal: 10,
		marginVertical: 20,
	},
})

export default RequestButton
