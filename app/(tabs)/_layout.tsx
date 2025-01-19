import { Colors, Icons } from "@/constants/constants"
import useUser from "@/store/useUser"
import {
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons"
import { Layout } from "@ui-kitten/components"
import { Tabs } from "expo-router"

/**
 * TabLayout component renders a tab navigation layout using the `Tabs` component.
 *
 * The tab layout includes the following screens:
 * - `index`: Displays a search screen with a search icon.
 * - `upload`: Displays a give screen with a heart icon.
 * - `requests`: Displays a requests screen with a tasks icon.
 * - `user`: Displays a profile screen with a user icon.
 */
export default function TabLayout() {
	const { isLoggedIn } = useUser()

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.INFO,
				headerShown: false,
				tabBarStyle: {
					backgroundColor: Colors.BACKGROUND_BLACK,
					padding: 0,
					margin: 0,
					height: 60,
					borderTopWidth: 0,
				},
				tabBarInactiveTintColor: Colors.WHITE,
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="upload"
				options={{
					title: "GIVE",
					href: isLoggedIn ? "/upload" : null,
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="hand-heart"
							size={Icons.LARGE_SIZE}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="conversations"
				options={{
					title: "CONVERSATIONS",
					href: isLoggedIn ? "/conversations" : null,
					tabBarIcon: ({ color }) => (
						<MaterialIcons
							name="message"
							size={Icons.LARGE_SIZE}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="index"
				options={{
					title: "SEARCH",
					tabBarIcon: ({ color, focused }) => (
						<Layout
							style={{
								backgroundColor: Colors.BACKGROUND_BLACK,
								padding: 5,
								borderRadius: 35,
								marginBottom: 25,
								width: 70,
								height: 70,
							}}
						>
							<Layout
								style={{
									backgroundColor: focused ? color : Colors.WHITE,
									borderRadius: 30,
									padding: 5,
									width: 60,
									height: 60,
									justifyContent: "center",
									alignItems: "center",
									shadowColor: Colors.BLACK,
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.25,
									shadowRadius: 3.84,
									elevation: 5,
								}}
							>
								<Ionicons
									name="compass"
									size={Icons.EXTRA_LARGE_SIZE}
									color={focused ? Colors.WHITE : Colors.BACKGROUND_BLACK}
								/>
							</Layout>
						</Layout>
					),
				}}
			/>
			<Tabs.Screen
				name="favourites"
				options={{
					title: "FAVOURITES",
					href: isLoggedIn ? "/favourites" : null,
					tabBarIcon: ({ color }) => (
						<MaterialIcons
							name="favorite"
							size={Icons.LARGE_SIZE}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="user"
				options={{
					title: "PROFILE",
					href: isLoggedIn ? "/user" : null,
					tabBarIcon: ({ color }) => (
						<Ionicons
							name="person-circle"
							size={Icons.LARGE_SIZE}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	)
}
