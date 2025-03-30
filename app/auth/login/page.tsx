"use client";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '@/app/redux/authSlice';
import { motion } from 'framer-motion';
import { RootState } from '@/app/redux/store';
import { API_URL } from '@/app/features/config';
  
const initialValues = {
    email: '',
    password: '',
};

const loginSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const authState = useSelector((state: RootState) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
    }, []);

    const handleSubmit = async (values: { email: string; password: string }) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('userData', JSON.stringify(data));
                dispatch(loginUser({ user: values.email, password: values.password }));
                router.push('/chat');
            } else {
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };
return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-purple-200 to-yellow-200 px-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
                {loading ? (
                    <div className="animate-pulse rounded-xl bg-gray-300 h-40"></div>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h1>
                        <p className="text-gray-500 mb-6">Sign in to continue</p>

                        <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
                            {({ values, errors, touched, handleChange, handleBlur }) => (
                                <Form>
                                    {/* Email Input */}
                                    <div className="mb-4">
                                        <Field
                                            type="email"
                                            name="email"
                                            placeholder="Email Id"
                                            className={`w-full px-4 py-2 rounded-lg border ${touched.email && errors.email ? "border-red-500" : "border-gray-300 focus:border-purple-500"} text-black outline-none`}
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                     <div className="mb-4 relative">
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Password"
                                            className={`w-full px-4 py-2 rounded-lg border ${touched.password && errors.password ? "border-red-500" : "border-gray-300 focus:border-purple-500"} text-black  outline-none`}
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />

                                        {/* Show/Hide Password Button */}
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-3 flex items-center focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 3C4 3 1 10 1 10s3 7 9 7 9-7 9-7-3-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 3C4 3 1 10 1 10s3 7 9 7 9-7 9-7-3-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm-6-5a6 6 0 0112 0 6 6 0 01-12 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* Forgot Password Link */}
                                    <div className="text-right mb-4">
                                        <Link href="/forgot-password" className="text-purple-700 hover:underline text-sm">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    {/* Sign-in Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="w-full py-3 rounded-lg bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition duration-300"
                                    >
                                        {authState.loading ? "Signing in..." : "Sign in"}
                                    </motion.button>

                                    {/* Sign-up Link */}
                                    <p className="text-sm mt-3 text-gray-600">
                                        Don't have an account?{" "}
                                        <Link href="/signup" className="text-purple-700 hover:underline">
                                            Sign Up
                                        </Link>
                                    </p>

                                    {/* Error Message */}
                                    {authState.error && <p className="text-red-500 text-sm mt-2">{authState.error}</p>}
                                </Form>
                            )}
                        </Formik>
                    </>
                )}
            </div>
        </motion.div>
    </div>
)
   
};

export default LoginPage; 