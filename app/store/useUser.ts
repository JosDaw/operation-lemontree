import { IUser } from "@/types"
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// Define the state structure
interface UserState {
	user: IUser
	isLoggedIn: boolean
}

// Define the actions
interface UserActions {
	loginUser: (values: IUser) => void
	logoutUser: () => void
	updatePushNotifications: (value: boolean) => void
}

// Combine state and actions for the complete store type
type UserStore = UserState & UserActions

const initialUser: IUser = {
	name: "",
	email: "",
	userID: "",
	isAdmin: false,
	isVerified: false,
	expoPushToken: "",
	allowPushNotifications: true,
	location: {
		latitude: 0,
		longitude: 0,
		zipcode: "",
		country: "",
		geohash: "",
	},
}

const useUser = create<UserStore>()(
	persist(
		(set, get) => ({
			user: initialUser,
			isLoggedIn: false,

			loginUser: (values: IUser) => {
				set({ user: values, isLoggedIn: true })
			},
			logoutUser: () => {
				set({ user: initialUser, isLoggedIn: false })
			},
			updatePushNotifications: (value: boolean) => {
				const currentUser = get().user
				if (currentUser) {
					set({ user: { ...currentUser, allowPushNotifications: value } })
				}
			},
		}),
		{
			name: "user",
			getStorage: () => ({
				setItem: setItemAsync,
				getItem: getItemAsync,
				removeItem: deleteItemAsync,
			}),
		}
	)
)

export default useUser
