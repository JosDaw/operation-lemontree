import checkForUpdates from "@/utils/checkForUpdates"
import {
	Quicksand_400Regular,
	Quicksand_600SemiBold,
	Quicksand_700Bold,
} from "@expo-google-fonts/quicksand"

import * as Font from "expo-font"
import { useEffect, useState } from "react"

/**
 * Custom hook that loads necessary resources and data asynchronously.
 *
 * This hook performs the following actions:
 * - Loads fonts asynchronously using `Font.loadAsync`.
 * - Checks for updates by calling `checkForUpdates`.
 *
 * Once the resources and data are loaded, it sets the loading state to complete.
 *
 * @returns {boolean} - A boolean indicating whether the loading is complete.
 */
export default function useCachedResources(): boolean {
	const [isLoadingComplete, setLoadingComplete] = useState(false)
	useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				await Font.loadAsync({
					Quicksand_400Regular,
					Quicksand_600SemiBold,
					Quicksand_700Bold,
				})
				const updateApp = async () => {
					await checkForUpdates()
				}

				updateApp()
			} finally {
				setLoadingComplete(true)
			}
		}

		loadResourcesAndDataAsync()
	}, [])

	return isLoadingComplete
}
