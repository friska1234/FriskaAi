"use client"
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

type Step = 'email' | 'verify' | 'password';

function App() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '','' ,'']);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("https://friskaaiapi.azurewebsites.net/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const result = await response.text();
            const a=JSON.parse(result);
            console.log(a.otp);
            localStorage.setItem('email', email);
            localStorage.setItem('otp', a.otp);
            toast.success("OTP sent successfully");
            setStep('verify');
        } catch (error) {
            console.error(error);
            toast.error("Failed to send OTP");
        }
    };
    const handleVerificationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const enteredOtp = verificationCode.join("");
        const storedOtp = localStorage.getItem("otp");
        if (enteredOtp === storedOtp) {
            toast.success("OTP verified!");
            setStep("password");
        } else {
            toast.error("Invalid OTP");
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            const email = localStorage.getItem("email");
            const response = await fetch("https://friskaaiapi.azurewebsites.net/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, new_password: password })
            });
            await response.text();
            toast.success("Password reset successful!");
            window.location.href = "/auth/login";
            localStorage.removeItem("email");
            localStorage.removeItem("otp");

        } catch (error) {
            toast.error("Failed to reset password");
            console.error(error);
        }
    };
    const handleCodeChange = (index: number, value: string) => {
        if (value.length <= 1) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);
            if (value && index < 5) {
                document.getElementById(`code-${index + 1}`)?.focus();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-yellow-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                {step === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
                            <p className="mt-2 text-gray-600">No worries, we will send you the reset instruction</p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Id
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
                        >
                            Confirm
                        </button>

                        <div className="text-center">
                            <span className="text-gray-600">Back to </span>
                            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                                Sign In
                            </a>
                        </div>
                    </form>
                )}

                {step === 'verify' && (
                    <form onSubmit={handleVerificationSubmit} className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900">Verify Email</h1>
                            <p className="mt-2 text-gray-600">
                                We have sent a 6-digit code to {email}, please provide us the code.
                            </p>
                        </div>

                        <div className="flex justify-center gap-3">
                            {verificationCode.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`code-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    className="w-14 h-14 text-center text-2xl border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
                        >
                            Verify
                        </button>

                        <div className="text-center">
                            <span className="text-gray-600">Did not receive the code? </span>
                            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                                Resend
                            </a>
                        </div>
                    </form>
                )}

                {step === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900">Create New Password</h1>
                            <p className="mt-2 text-gray-600">
                                Your new password must be different from previous used passwords
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Confirm password"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
                        >
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default App;