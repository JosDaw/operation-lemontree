import { Timestamp } from "firebase/firestore"

/**
 * Returns the corresponding error message for a given Firebase error code.
 *
 * @param code - The Firebase error code.
 * @returns The error message associated with the given error code.
 */
export function firebaseErrorCodes(code: string): string {
	switch (code) {
		case "auth/email-already-in-use":
			return "This email has already been registered! Please log in instead."

		case "auth/invalid-email":
			return "Your email is incorrect! Please try again."

		case "auth/wrong-password":
		case "auth/invalid-credential":
			return "The password you entered was incorrect. Please try again."

		case "auth/weak-password":
			return "The password you entered was too weak. Please try another password."

		case "auth/too-many-requests":
			return "Too many login requests. Please try again later."

		default:
			return "Something went wrong. Please try again."
	}
}

// Function to convert Firebase Timestamp to formatted date and time
export function formatFirebaseTimestamp(timestamp: Timestamp): string {
	const date = new Date(
		timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
	)

	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	})
}

/**
 * Generates a unique code of a given length. (Used for secret codes)
 * @param length
 * @returns
 */
export function generateUniqueCode(length: number): string {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	const codeLength = length
	let result = ""

	for (let i = 0; i < codeLength; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length)
		result += characters[randomIndex]
	}

	return result
}
