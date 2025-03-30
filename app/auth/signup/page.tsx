"use client";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";

export default function Home() {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gender: "male",
        weight: "",
        height: "",
        age: "",
        activityLevel: "",
        dietaryPreference: "",
        dietaryRestrictions: [] as string[],
        digestiveIssues: [] as string[],
        foodsAggravating: [] as string[],
        foodAllergies: [] as string[]
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayToggle = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field as keyof typeof prev].includes(value)
                ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
                : [...(prev[field as keyof typeof prev] as string[]), value]
        }));
    };

    const renderBadges = (items: string[], field: string) => {
        return items.map(item => (
            <Badge key={item} className="bg-purple-100 text-purple-800 mr-2 mb-2">
                {item}
                <button
                    onClick={() => handleArrayToggle(field, item)}
                    className="ml-1 hover:text-purple-950"
                >
                    <X size={14} />
                </button>
            </Badge>
        ));
    };
    const handleSignup = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            alert("Please fill out all fields.");
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            email: formData.email,
            username: formData.name,
            password: formData.password
        });

        const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect // ✅ Correct type
        };


        try {
            const response = await fetch("https://friskaaiapi.azurewebsites.net/signup", requestOptions);
            const result = await response.json();

            console.log("Signup API response:", result);

            if (response.ok) {
                setStep(2);
            } else {
                alert(result.message || "Signup failed. Try again.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred. Please try again.");
        }
        setStep(2) ;
    };

  

    return (
        <div className="min-h-screen bg-gradient-to-b text-black from-purple-50 to-yellow-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white  rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-2">Sign Up</h1>
                <p className="text-muted-foreground text-center mb-8">
                    Enter details to create your account
                </p>

                <div className="flex items-center justify-between mb-8">
                    {/* Step 1 */}
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${step >= 1 ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                            1
                        </div>
                        <div className="ml-3">Personal Details</div>
                    </div>

                    {/* Line */}
                    <div className={`h-[2px] w-72 ${step >= 2 ? "bg-purple-500" : "bg-gray-200"}`}></div>

                    {/* Step 2 */}
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${step >= 2 ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                            2
                        </div>
                        <div className="ml-3">Health Profile</div>
                    </div>
                </div>


                {step === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                type="text"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className="w-full text-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Id</label>
                            <Input
                                type="email"
                                placeholder="Enter your email id"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    className="w-full pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I have read and agree to the{" "}
                                <a href="#" className="text-purple-500 hover:underline">
                                    User agreement
                                </a>
                            </label>
                        </div>

                        <Button
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                            onClick={() =>  handleSignup()}
                        >
                            Next
                        </Button>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <a href="#" className="text-purple-500 hover:underline">
                                Sign In
                            </a>
                        </p>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-6 rounded-lg ">
                        <div className="space-y-8 text-black">
                            {/* Gender Selection */}
                            <div className="space-y-2">
                                <Label className="text-lg font-medium">Gender</Label>
                                <RadioGroup
                                    defaultValue={formData.gender}
                                    onValueChange={(value) => handleInputChange("gender", value)}
                                    className="flex space-x-6 mt-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="male" id="male" />
                                        <Label htmlFor="male">Male</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="female" id="female" />
                                        <Label htmlFor="female">Female</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Grid Layout for Input Fields */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label>Weight</Label>
                                    <Input
                                        type="text"
                                        placeholder="60 lbs"
                                        value={formData.weight}
                                        onChange={(e) => handleInputChange("weight", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label>Height</Label>
                                    <Input
                                        type="text"
                                        placeholder="5 ft, 11 in"
                                        value={formData.height}
                                        onChange={(e) => handleInputChange("height", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label>Age</Label>
                                    <Input
                                        type="number"
                                        placeholder="40"
                                        value={formData.age}
                                        onChange={(e) => handleInputChange("age", e.target.value)}
                                    />
                                </div>

                                {/* Activity Level */}
                                <div className="space-y-4">
                                    <Label>Activity Level</Label>
                                    <Select
                                        value={formData.activityLevel}
                                        onValueChange={(value) => handleInputChange("activityLevel", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select activity level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sedentary">Sedentary</SelectItem>
                                            <SelectItem value="lightly-active">Lightly Active</SelectItem>
                                            <SelectItem value="moderately-active">Moderately Active</SelectItem>
                                            <SelectItem value="very-active">Very Active</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Dietary Preferences */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-6 flex flex-col">
                                    <Label>Dietary Preference</Label>
                                    <Select
                                        value={formData.dietaryPreference}
                                        onValueChange={(value) => handleInputChange("dietaryPreference", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select dietary preference" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="halal">Halal</SelectItem>
                                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                            <SelectItem value="vegan">Vegan</SelectItem>
                                            <SelectItem value="none">None</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label>Dietary Restrictions</Label>
                                    <div className="flex flex-wrap gap-2">{renderBadges(formData.dietaryRestrictions, "dietaryRestrictions")}</div>
                                    <Select onValueChange={(value) => handleArrayToggle("dietaryRestrictions", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select restrictions" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gluten-free">Gluten-free diet</SelectItem>
                                            <SelectItem value="low-fat">Low-fat diet</SelectItem>
                                            <SelectItem value="dairy-free">Dairy-free</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Digestive Issues & Food Allergies */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label>Digestive Issues</Label>
                                    <div className="flex flex-wrap gap-2">{renderBadges(formData.digestiveIssues, "digestiveIssues")}</div>
                                    <Select onValueChange={(value) => handleArrayToggle("digestiveIssues", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select issues" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="diarrhea">Diarrhea</SelectItem>
                                            <SelectItem value="stomach-pain">Stomach pain</SelectItem>
                                            <SelectItem value="bloating">Bloating</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label>Food Allergies</Label>
                                    <div className="flex flex-wrap gap-2">{renderBadges(formData.foodAllergies, "foodAllergies")}</div>
                                    <Select onValueChange={(value) => handleArrayToggle("foodAllergies", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select allergies" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tree-nuts">Tree nuts</SelectItem>
                                            <SelectItem value="eggs">Eggs</SelectItem>
                                            <SelectItem value="dairy">Dairy</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-6 mt-8">
                                <Button variant="outline" className="flex-1 text-white" onClick={() => setStep(1)}>Back</Button>
                                <Button
                                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                                    onClick={() => console.log("Form submitted:", formData)}
                                >
                                    Save
                                </Button>                            </div>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
}