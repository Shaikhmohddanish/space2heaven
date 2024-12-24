"use client";

import axios from "axios";
import Input from "../Input";
import { useState } from "react";
import { authTabData } from "@/constants";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"
import { AuthInputs } from "@/types";



const FormTabs = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [secretKey, setSecretKey] = useState("")
    const { toast } = useToast()
    const [isHidden, setIsHidden] = useState(false)
    const [hideSecret, setHideSecret] = useState(true)
    const [signupInputs, setSignupInputs] = useState<AuthInputs>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [signinInputs, setSigninInputs] = useState<AuthInputs>({
        email: "",
        password: ""
    })
    const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (activeTab === "signup") {
            setSignupInputs(prev => ({
                ...prev, [name]: value
            }))
        } else {
            setSigninInputs(prev => ({
                ...prev, [name]: value
            }))
        }
    };

    const adminAuth = async (path: string, formInput: object) => {
        if (secretKey === process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY) {
            try {
                setLoading(true)

                const response = await axios.post(`/api/auth/admin/${path}`, formInput, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                })

                toast({
                    description: response?.data?.msg
                })
                console.log("Response : ", response);
                
                if (path === "signup" && response?.statusText === "OK") {
                    setActiveTab("signin");
                    setSecretKey("")
                } else if (path === "signin" && response?.statusText === "OK") {
                    const adminDetails = response?.data;
                    toast({
                        description: "Login successful! Redirecting to home page..."
                    })
                    if (adminDetails) {
                        localStorage.setItem("adminDetails", JSON.stringify(adminDetails));
                        router.push("/admin/dashboard");
                    } else {
                        toast({
                            description: "Unable to retrieve admin details",
                        })
                    }
                }
            } catch (error: any) {
                console.log("Error : ", error);
                const errorMessage = error?.response?.data?.error || error?.message || "An error occurred";
                toast({
                    description: errorMessage,
                })
            } finally {
                setLoading(false)
            }
        } else {
            toast({
                description: "Access forbidden..!",
            })
            router.push("/")
        }
    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        activeTab === "signup" ? adminAuth("signup", signupInputs)
            : adminAuth("signin", signinInputs)
    };

    return (
        <>
            <h1 className="text-2xl font-bold text-center text-home uppercase">
                Admin Only
            </h1>
            <Tabs value={activeTab}
                onValueChange={value => setActiveTab(value as "signin" | "signup")}
                className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    {authTabData.map(({ value, title }) => (
                        <TabsTrigger key={value} value={value}>
                            {title}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {authTabData.map(({
                    value,
                    description,
                    // title 
                }) => (
                    <TabsContent key={value} value={value}>
                        <Card>
                            <CardHeader className="text-center">
                                {/* <CardTitle>{title}</CardTitle> */}
                                <CardDescription>{description}</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit} className="text-sm">
                                <CardContent className="py-3 space-y-2">
                                    {activeTab === "signup" && <Input
                                        title="Name"
                                        name="name"
                                        value={signupInputs.name}
                                        placeholder="Enter your Full Name"
                                        type="text"
                                        onChange={handleInputChange}
                                    />}
                                    <Input
                                        title="Email ID"
                                        name="email"
                                        value={activeTab === "signup" ? signupInputs.email : signinInputs.email}
                                        placeholder="Enter your Email ID"
                                        type="email"
                                        onChange={handleInputChange}
                                    />
                                    <div className="flex w-full relative">
                                        <Input
                                            title="Password"
                                            name="password"
                                            value={activeTab === "signup" ? signupInputs.password : signinInputs.password}
                                            placeholder="Enter your password"
                                            type={showPassword ? "text" : "password"}
                                            onChange={handleInputChange}
                                        />
                                        <span
                                            className="absolute right-4 top-8 bottom-5 h-fit"
                                            onClick={() => setShowPassword(!showPassword)}
                                            role="button"
                                            aria-label="Toggle for visibility"
                                        >
                                            {showPassword ? <Eye size={20}
                                            /> : <EyeOff size={20} />}
                                        </span>
                                    </div>
                                    {activeTab === "signup" &&
                                        <div className="flex w-full relative">
                                            <Input
                                                name="confirmPassword"
                                                title="Confirm Password"
                                                value={signupInputs.confirmPassword}
                                                onChange={handleInputChange}
                                                type={isHidden ? "text" : "password"}
                                                placeholder="Confirm Password"
                                            />
                                            <span
                                                className="absolute right-4 top-8 bottom-5 h-fit"
                                                onClick={() => setIsHidden(!isHidden)}
                                                role="button"
                                                aria-label="Toggle for visibility"
                                            >
                                                {isHidden ? <Eye size={20}
                                                /> : <EyeOff size={20} />}
                                            </span>
                                        </div>}
                                    <div className="flex w-full relative">
                                        <Input
                                            title="Secret Key"
                                            name="secretKey"
                                            value={secretKey}
                                            placeholder="Enter secret key to verify"
                                            type={isHidden ? "text" : "password"}
                                            onChange={(e) => setSecretKey(e.target.value)}
                                        />
                                        <span
                                            className="absolute right-4 top-8 bottom-5 h-fit"
                                            onClick={() => setHideSecret(!hideSecret)}
                                            role="button"
                                            aria-label="Toggle for visibility"
                                        >
                                            {isHidden ? <Eye size={20}
                                            /> : <EyeOff size={20} />}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <button type="submit" className="btn-class w-full flex justify-center" disabled={loading}>
                                        {loading ? (<div className="w-6 h-6 loader-common-styles" />)
                                            : activeTab === "signup" ? "Sign Up" : "Sign In"
                                        }
                                    </button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </>
    );
};

export default FormTabs;
