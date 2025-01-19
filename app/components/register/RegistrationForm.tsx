import CustomInput from "@/components/common/CustomInput"
import PasswordIcon from "@/components/register/PasswordIcon"
import { Fonts } from "@/constants/constants"
import { ISignupInfo } from "@/types"
import { Text } from "@ui-kitten/components"
import React from "react"
import CountrySelector from "./CountrySelector"

interface RegistrationFormProps {
	signupInfo: ISignupInfo
	setSignupInfo: React.Dispatch<React.SetStateAction<ISignupInfo>>
	isSaving: boolean
	showPassword: boolean
	setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
	signupInfo,
	setSignupInfo,
	isSaving,
	showPassword,
	setShowPassword,
}) => {
	return (
		<>
			<CustomInput
				label="Email"
				placeholder="Email"
				value={signupInfo.email}
				onChangeText={(value) => setSignupInfo({ ...signupInfo, email: value })}
				disabled={isSaving}
				autoCapitalize="none"
			/>
			<CustomInput
				label="Name"
				placeholder="Name"
				value={signupInfo.name}
				onChangeText={(value) => setSignupInfo({ ...signupInfo, name: value })}
				disabled={isSaving}
			/>
			<CountrySelector
				countryName={signupInfo.country}
				onSelect={(country: { name: string; code: string }) => {
					setSignupInfo({
						...signupInfo,
						countryCode: country.code,
						country: country.name as string,
					})
				}}
				disabled={isSaving}
			/>
			<CustomInput
				label="Zipcode"
				placeholder="Your Zipcode"
				value={signupInfo.zipcode}
				onChangeText={(value) =>
					setSignupInfo({ ...signupInfo, zipcode: value })
				}
				disabled={isSaving}
				autoCapitalize="characters"
			/>
			<CustomInput
				label="Password"
				placeholder="Password"
				value={signupInfo.password}
				onChangeText={(value) =>
					setSignupInfo({ ...signupInfo, password: value })
				}
				disabled={isSaving}
				secureTextEntry={!showPassword}
				accessoryRight={() => (
					<PasswordIcon
						showPassword={showPassword}
						setShowPassword={setShowPassword}
						isDisabled={isSaving}
					/>
				)}
				maxLength={50}
			/>
			<CustomInput
				label="Confirm Password"
				placeholder="Confirm Password"
				value={signupInfo.confirmPassword}
				onChangeText={(value) =>
					setSignupInfo({ ...signupInfo, confirmPassword: value })
				}
				disabled={isSaving}
				secureTextEntry={!showPassword}
				maxLength={50}
			/>
			<Text
				category="p2"
				appearance="hint"
				status="danger"
				style={{ fontFamily: Fonts.SEMI_BOLD }}
			>
				Password must be at least 6 characters long, contain at least 1
				uppercase letter and 1 number.
			</Text>
		</>
	)
}

export default RegistrationForm
