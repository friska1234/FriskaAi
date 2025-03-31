// "use client"
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";

// const PageTransition = ({ children }: { children: React.ReactNode }) => {
//     const [progress, setProgress] = useState(0);

//     // Simulate a loading progress
//     useEffect(() => {
//         const timer = setInterval(() => {
//             setProgress((prev) => {
//                 if (prev >= 100) {
//                     clearInterval(timer);  // Stop the progress bar when it reaches 100
//                     return 100;
//                 }
//                 return prev + 1;
//             });
//         }, 10); // Update the progress bar every 10 ms

//         return () => clearInterval(timer);  // Clean up the interval on unmount
//     }, []);

//     return (
       
//             {/* Progress Bar */}
//             <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden absolute top-0 left-0">
//                 <motion.div
//                     className="bg-green-600 h-full"
//                     initial={{ width: 0 }}
//                     animate={{ width: `${progress}%` }}
//                     transition={{ duration: 0.1 }}  // Smooth transition for progress bar
//                 />
//             </div>

//             <div className="relative z-10">
//                 {children}
//             </div>
       
//     );
// };

// export default PageTransition;
