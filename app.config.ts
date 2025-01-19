export default ({ config }: { config: any }) => ({
	...config,
	expo: {
		name: "Lemontree",
		slug: "operationlemontree",
		scheme: "operationlemontree",
		version: "0.0.1",
		orientation: "portrait",
		icon: "./assets/icon.png",
		userInterfaceStyle: "light",
		ios: {
			buildNumber: "1",
			supportsTablet: true,
			infoPlist: {
				NSCameraUsageDescription:
					"This may app may ask for access to your camera to uploading items.",
			},
			bundleIdentifier: "com.operationlemontree",
		},
		android: {
			versionCode: 1,
			adaptiveIcon: {
				foregroundImage: "./assets/adaptive-icon.png",
				backgroundColor: "#FFF",
			},
			package: "com.operationlemontree",
			googleServicesFile: "./google-services.json",
			permissions: ["com.google.android.gms.permission.AD_ID"],
		},
		web: {
			favicon: "./assets/favicon.png",
			output: "single",
			bundler: "metro",
		},
		newArchEnabled: true,
		plugins: [
			[
				"expo-splash-screen",
				{
					backgroundColor: "#FFF",
					image: "./assets/splash.png",
					dark: {
						image: "./assets/splash.png",
						backgroundColor: "#FFF",
					},
					imageWidth: 200,
				},
			],
			[
				"expo-build-properties",
				{
					ios: {
						deploymentTarget: "15.1",
						useFrameworks: "static",
					},
				},
			],
			[
				"expo-image-picker",
				{
					photosPermission:
						"The app accesses your photos to let you upload items you want to give away.",
				},
			],
			"expo-secure-store",
			"expo-font",
			"expo-router",
			[
				"expo-tracking-transparency",
				{
					userTrackingPermission:
						"This identifier will be used to deliver personalized content to you.",
				},
			],
		],
		extra: {
			eas: {
				projectId: "19bc5c3d-6477-40bc-903c-2c2924a5dc79",
			},
			FIREBASE_APIKEY: process.env.FIREBASE_APIKEY,
			FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID,
			FIREBASE_MESSAGINGSENDERID: process.env.FIREBASE_MESSAGINGSENDERID,
			FIREBASE_AUTHDOMAIN: process.env.FIREBASE_AUTHDOMAIN,
			FIREBASE_APPID: process.env.FIREBASE_APPID,
			FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
			GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
			SUPABASE_API_KEY: process.env.SUPABASE_API_KEY,
			SUPABASE_URL: process.env.SUPABASE_URL,
			SUPABASE_BUCKET_NAME: process.env.SUPABASE_BUCKET_NAME,
		},
	},
})
