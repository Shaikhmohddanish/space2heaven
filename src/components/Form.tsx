"use client"
import { useState } from "react"
import Input from "./Input"

const Form = ({ formType = "signin" }: { formType: string }) => {
    const [authDetails, setAuthDetails] = useState({
        name: "",
        email: "",
        password: "",
        phoneNo: "",
    })
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setAuthDetails(prevDetails => ({ ...prevDetails, [name]: value }))
    }

    const submitDetails = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(authDetails)
    }

    return (
        <form onSubmit={submitDetails}>
            {formType === "signup" && (
                <>
                    <Input
                        title="Full Name"
                        value={authDetails.name}
                        placeholder="Enter your name"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                    />

                    <Input
                        title="Phone No"
                        value={authDetails.phoneNo}
                        placeholder="Enter your Phone No"
                        type="text"
                        name="phoneNo"
                        onChange={handleInputChange}
                    />
                </>
            )}

            <Input
                title="Email ID"
                value={authDetails.email}
                placeholder="Enter your Email ID"
                type="email"
                name="email"
                onChange={handleInputChange}
            />

            <Input
                title="Password"
                value={authDetails.password}
                placeholder="Enter your password"
                type="password"
                name="password"
                onChange={handleInputChange}
            />

            {formType === "signup" && (
                <Input
                    title="Confirm Password"
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            )}

            <button type="submit" className="btn-class">
                {formType === "signup" ? "Sign Up" : "Sign In"}
            </button>
        </form>
    )
}

export default Form
