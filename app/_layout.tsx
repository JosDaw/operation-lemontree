import * as eva from "@eva-design/eva"
import { PortalProvider } from "@gorhom/portal"
import { ApplicationProvider, Text } from "@ui-kitten/components"
import * as Device from "expo-device"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import React, { useEffect } from "react"
import { LogBox, StatusBar as NativeStatusBar } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { RootSiblingParent } from "react-native-root-siblings"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import BackButton from "./components/common/BackButton"
import MessageItemHeader from "./components/message/MessageItemHeader"
import { Colors, DeviceTypes, Fonts } from "./constants/constants"
import useCachedResources from "./hooks/useCachedResources"
import { default as mapping } from "./styles/fonts.json"
import { default as theme } from "./styles/theme.json"
import { isDevMode, isWeb } from "./utils/helpers"

LogBox.ignoreLogs([
	"ReactNativeTracing",
	'You appear to have multiple versions of the "promise" package installed',
	"`getStorage`, `serialize` and `deserialize` options are deprecated.",
	"Analytics instance not found",
	"Possible unhandled promise rejection",
	"Function components cannot be given refs",
	"@firebase/analytics: Analytics: Firebase Analytics is not supported in this environment.",
	"@firebase/analytics: Analytics: IndexedDB unavailable or restricted in this environment.",
])

SplashScreen.preventAutoHideAsync()

function RootLayout() {
	const isLoadingComplete = useCachedResources()

	useEffect(() => {
		if (isLoadingComplete) {
			SplashScreen.hideAsync()
		}
	}, [isLoadingComplete])

	const isWebOrDev = isDevMode() || isWeb()

	return (
		<RootSiblingParent>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<SafeAreaProvider>
					<ApplicationProvider
						{...eva}
						theme={{ ...eva.dark, ...theme }}
						customMapping={mapping as any}
					>
						<SafeAreaView
							style={{
								flex: 1,
								backgroundColor: isWebOrDev
									? Colors.DANGER
									: Colors.BACKGROUND_DARK,
								paddingTop:
									Device.osName === DeviceTypes.ANDROID
										? NativeStatusBar.currentHeight
										: 0,
							}}
							edges={["right", "top", "left"]}
						>
							<StatusBar style="light" />
							{isWebOrDev && (
								<Text
									style={{
										textAlign: "center",
										color: Colors.WHITE,
										fontFamily: Fonts.SEMI_BOLD,
									}}
								>
									DEVELOPMENT MODE{" "}
									{isWeb()
										? "(WEB) - WARNING: This app is not optimized for web and may not work as expected."
										: "(APP)"}
								</Text>
							)}
							<PortalProvider>
								<Stack
									screenOptions={({
										route,
									}: {
										route: { name: string; params?: { slug?: string } }
									}) => {
										const isConversationView =
											route.name === "conversation/[slug]"

										return {
											headerShown: true,
											headerTitle: "",
											headerTransparent: true,
											headerTintColor: Colors.PRIMARY,
											headerBackButtonDisplayMode: "minimal",
											headerLeft: () => <BackButton />,
											headerRight: isConversationView
												? () => (
														<MessageItemHeader
															slug={route.params?.slug || ""}
														/>
													)
												: undefined,
										}
									}}
								>
									<Stack.Screen
										name="(tabs)"
										options={{ headerShown: false, headerTitle: "Home" }}
									/>
								</Stack>
							</PortalProvider>
						</SafeAreaView>
					</ApplicationProvider>
				</SafeAreaProvider>
			</GestureHandlerRootView>
		</RootSiblingParent>
	)
}

export default RootLayout
