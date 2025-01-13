import { isWeb } from "@/utils/helpers"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import Constants from "expo-constants"
import { getAnalytics } from "firebase/analytics"
import { getApp, getApps, initializeApp } from "firebase/app"
import { getReactNativePersistence, initializeAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Initialize Firebase
const firebaseConfig = {
	apiKey: Constants.expoConfig?.extra?.FIREBASE_APIKEY,
	authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTHDOMAIN,
	projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECTID,
	messagingSenderId: Constants.expoConfig?.extra?.FIREBASE_MESSAGINGSENDERID,
	appId: Constants.expoConfig?.extra?.FIREBASE_APPID,
	measurementId: Constants.expoConfig?.extra?.FIREBASE_MEASUREMENT_ID,
}

let app
let auth: any
let analytics: any

// Check if there are no firebase apps initialized. If none, initialize our app.
if (!getApps().length) {
	app = initializeApp(firebaseConfig)

	// Use different persistence based on platform
	if (isWeb()) {
		auth = initializeAuth(app)
	} else {
		auth = initializeAuth(app, {
			persistence: getReactNativePersistence(ReactNativeAsyncStorage),
		})
		if (Constants.expoConfig?.extra?.FIREBASE_MEASUREMENT_ID) {
			analytics = getAnalytics(app)
		}
	}
} else {
	app = getApp() // if already initialized, use that one
}

export { analytics, app, auth }
export const database = getFirestore(app)
