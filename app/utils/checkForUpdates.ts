import { checkForUpdateAsync, fetchUpdateAsync } from "expo-updates"
import { isWeb } from "./helpers"

/**
 * Checks for application updates and fetches them if available.
 *
 * This function performs the following steps:
 * 1. If the application is in development mode (`__DEV__`), it exits early.
 * 2. Attempts to check for updates using `checkForUpdateAsync`.
 * 3. If an update is available, it fetches the update using `fetchUpdateAsync`.
 * 4. If no update is available, it exits early.
 *
 * @returns {Promise<boolean>} Resolves to `true` if an update was fetched, otherwise `false`.
 */
export default function checkForUpdates(): Promise<boolean> {
	// Return early if in development or running on the web
	if (__DEV__ || isWeb()) {
		return Promise.resolve(false)
	}

	// Check for updates
	return checkForUpdateAsync()
		.then((update) => {
			if (update.isAvailable) {
				return fetchUpdateAsync().then(() => {
					console.log("Update fetched successfully.")
					return true
				})
			} else {
				console.log("No updates available.")
				return false
			}
		})
		.catch((error) => {
			console.error("Error checking for updates:", error)
			return false
		})
}
