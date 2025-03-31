"use client"

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { setCookie } from 'cookies-next';

interface ChatLog {
    Chat_Id: string;
    Chat_Log: string;
}

interface ProcessedChatLog {
    id: string;
    timestamp: dayjs.Dayjs;
    preview: string;
    fullChat: string; // 🔹 Add this line
}
const page = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [messages, setMessages] = useState<{ text: string; sender: "user" | "system" }[]>([]);
    const [showChat, setShowChat] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chatLogs, setChatLogs] = useState<{
        today: ProcessedChatLog[];
        yesterday: ProcessedChatLog[];
        thisWeek: ProcessedChatLog[];
        lastMonth: ProcessedChatLog[];
    }>({
        today: [],
        yesterday: [],
        thisWeek: [],
        lastMonth: [],
    });

    const [selectedChat, setSelectedChat] = useState<ProcessedChatLog | null>(null);
    const [filteredLogs, setFilteredLogs] = useState<ProcessedChatLog[]>([]);
    const [timeframe, setTimeframe] = useState<string>("Today");
    const [loadingLogs, setLoadingLogs] = useState<boolean>(true);
    const [loadingNewChat, setLoadingNewChat] = useState<boolean>(false);  
    const [userQuery, setUserQuery] = useState<string>(""); 
    const [modifyingMeal, setModifyingMeal] = useState<boolean>(false); 
   

  

   

  

    const renderChatHistory = () => {
        if (!selectedChat?.id) return null;

        const storedChatHistory = localStorage.getItem(`chat_history_${selectedChat.id}`);
        if (!storedChatHistory) return null;

        let chatHistory;

        try {
            chatHistory = JSON.parse(storedChatHistory);
        } catch (error) {
            console.error("Error parsing chat history:", error);
            return null;
        }

        if (chatHistory.length <= 1) return null;

        return (
            <div className="space-y-4 mb-6 border-b border-gray-300 pb-4">
                {/* <h6 className="text-md font-semibold text-blue-600">Previous Modifications</h6> */}

                {chatHistory.slice(1).map((interaction: any, index: any) => (
                    <div key={index} className="mb-4">
                        {/* User Query */}
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="flex justify-end"
                        >
                            <div className="bg-blue-500 text-white p-3 rounded-2xl max-w-md shadow-lg">
                                <p className="text-sm">{interaction.inputs?.question}</p>
                            </div>
                        </motion.div>

                    
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-start"
                        >
                            {interaction.outputs?.answer
                                .split("### ")
                                .filter(Boolean)
                                .map((section:any) => {
                                    const [titleLine, ...items] = section.split("\n").filter(Boolean); // First line = Title, rest = Items
                                    const title = titleLine.replace(":", "").trim(); // Remove extra ":" from title
                                    const parsedItems = items
                                        .filter((item:any) => item.startsWith("-")) // Filter only valid meal items
                                        .map((item:any) => {
                                            const match = item.match(
                                                /- (.+) \(Protein: ([\d.]+)g, Carbohydrates: ([\d.]+)g, Fiber: ([\d.]+)g, Fat: ([\d.]+)g, .*Calories: ([\d.]+) kcal\)/
                                            );
                                            return match
                                                ? {
                                                    name: match[1],
                                                    protein: match[2],
                                                    carbs: match[3],
                                                    fiber: match[4],
                                                    fat: match[5],
                                                    calories: match[6],
                                                }
                                                : null;
                                        })
                                        .filter(Boolean);

                                    return { title, items: parsedItems };
                                })
                                .map((section:any, secIndex:any) => (
                                    <div
                                        key={secIndex}
                                        className="bg-gradient-to-r from-gray-100 to-gray-300 text-black p-4 rounded-2xl max-w-md shadow-lg mb-4"
                                    >
                                        <h5 className="text-xl font-bold text-orange-700 flex items-center">🍽 {section.title}</h5>
                                        <div className="mt-3 space-y-2">
                                            {section.items.map((item:any, itemIndex:any) => (
                                                <div
                                                    key={itemIndex}
                                                    className="bg-white p-4flex-row rounded-lg shadow-md border border-gray-300 flex flex-col"
                                                >
                                                    <p className="text-gray-700 font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-semibold">Protein:</span> {item.protein}g &bull;
                                                        <span className="font-semibold"> Carbs:</span> {item.carbs}g &bull;
                                                        <span className="font-semibold"> Fiber:</span> {item.fiber}g &bull;
                                                        <span className="font-semibold"> Fat:</span> {item.fat}g &bull;
                                                        <span className="font-semibold"> Calories:</span> {item.calories} kcal
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </motion.div>

                    </div>
                ))}
            </div>
        );
    };

    const handleLogout = () => {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("chat_history_")) {
                localStorage.removeItem(key);
            }
        });
        setCookie("userId", "", { expires: new Date(0) });
        localStorage.removeItem("authToken"); 
        localStorage.removeItem("user"); 
        localStorage.removeItem("userData"); 
        localStorage.removeItem("userInfo"); 
        console.log("User logged out, all chat history removed");
        window.location.href = "/auth/login";
    };

    const handleModifyMeal = async () => {
        if (!selectedChat || userQuery.trim() === "") return;
        setModifyingMeal(true);

        try {
            console.log("Modifying meal with:", userQuery);

            const storedUserInfo = localStorage.getItem("userData");
            if (!storedUserInfo) {
                console.warn("⚠ No user info found.");
                setModifyingMeal(false);
                return;
            }

            let userId, userProfile;
            try {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                userId = parsedUserInfo.user?.id;
                userProfile = parsedUserInfo.user;
                if (!userId) throw new Error("User ID missing.");
            } catch (error) {
                console.error("❌ Error parsing user data:", error);
                setModifyingMeal(false);
                return;
            }

            let chatHistory = [];
            const storedChatHistory = localStorage.getItem(`chat_history_${selectedChat.id}`);

            if (storedChatHistory) {
                try {
                    chatHistory = JSON.parse(storedChatHistory);
                    console.log("Loaded existing chat history:", chatHistory);
                } catch (error) {
                    console.error("Error parsing stored chat history:", error);
                }
            }

            let cleanedFoodDatabase = selectedChat.fullChat;
            try {
                const parsedData = JSON.parse(cleanedFoodDatabase);
                if (parsedData.answer) {
                    cleanedFoodDatabase = parsedData.answer;
                }
            } catch (error) {
                console.error("Error parsing selected chat food database:", error);
            }

            const aiResponse = await fetch("https://friskaaiapi.azurewebsites.net/aiprompt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: encodeURIComponent("YOUR_API_KEY"),
                },
                body: JSON.stringify({
                    chat_history: chatHistory,
                    question: userQuery,
                    food_database: cleanedFoodDatabase,
                }),
                redirect: "follow",
            });

            if (!aiResponse.ok) throw new Error("Failed to fetch AI meal plan");

            const aiResult = await aiResponse.text();
            let parsedResult;

            try {
                parsedResult = JSON.parse(aiResult);
                console.log("Parsed modified meal response:", parsedResult);
            } catch (error) {
                console.error("Error parsing AI response:", error);
            }

            const newInteraction = {
                inputs: { question: userQuery },
                outputs: { answer: parsedResult?.answer || aiResult }
            };

            chatHistory.push(newInteraction);
            const updatedChatHistory = [...chatHistory, newInteraction];
            localStorage.setItem(`chat_history_${selectedChat.id}`, JSON.stringify(chatHistory));
            console.log("✅ Updated chat history saved");

            setSelectedChat(prev => {
                if (!prev) return null;
                const updatedChat = { ...prev, fullChat: aiResult };

                 setChatLogs(prevLogs => ({
                    today: prevLogs.today.map(log => log.id === prev.id ? updatedChat : log),
                    yesterday: prevLogs.yesterday.map(log => log.id === prev.id ? updatedChat : log),
                    thisWeek: prevLogs.thisWeek.map(log => log.id === prev.id ? updatedChat : log),
                    lastMonth: prevLogs.lastMonth.map(log => log.id === prev.id ? updatedChat : log),
                }));

                return updatedChat;
            });
            setUserQuery("");

            // Integrate update-chat-log API
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "User_Id": userId,
                "Chat_Id": selectedChat.id,
                "Chat_Log": JSON.stringify(chatHistory)
            });

            const requestOptions: RequestInit = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow" as RequestRedirect, // Fix applied here
            };


            fetch("https://friskaaiapi.azurewebsites.net/update-chat-log", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log("✅ Chat log updated:", result))
                .catch((error) => console.error("❌ Error updating chat log:", error));

        } catch (error) {
            console.error("❌ Error modifying meal:", error);
        } finally {
            setModifyingMeal(false);
        }
    };

    useEffect(() => {
      
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        fetchChatLogs();
    }, []);
    useEffect(() => {
        console.log("Updated selectedChat:", selectedChat);
    }, [selectedChat]);
    const fetchChatLogs = async (): Promise<void> => {
        setLoadingLogs(true);
        try {
            
            const storedUserInfo = localStorage.getItem("userData");
            if (!storedUserInfo) {
                console.warn("⚠ No user info found. Cannot fetch chat logs.");
                setLoadingLogs(false);
                return;
            }

            let userId;
            try {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                userId = parsedUserInfo.user?.id;
                if (!userId) {
                    throw new Error("User ID not found in stored user data.");
                }
            } catch (error) {
                console.error("❌ Error parsing user info from localStorage:", error);
                setLoadingLogs(false);
                return;
            }

            console.log("✅ Retrieved User ID:", userId);

            // Fetch chat logs with the user ID
            const response = await fetch(`https://friskaaiapi.azurewebsites.net/get-chat-logs/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                redirect: "follow",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chat logs");
            }

            const data = await response.json();
            console.log("Full Chat Logs Response:", data );

            if (data && Array.isArray(data.data)) {
                const now = dayjs();
                const yesterday = now.subtract(1, "day").startOf("day");
                const thisWeek = now.subtract(7, "day").startOf("day");
                const lastMonth = now.subtract(1, "month").startOf("month");

                const processedLogs: ProcessedChatLog[] = data.data.map((log: ChatLog) => {
                    // console.log("Processing log:", log.Chat_Log);
                    let preview = "No preview available";
                    let timestamp = dayjs(log.Chat_Id);
                    let fullChat = "No chat data available";
                    try {
                        const parsedLog = JSON.parse(log.Chat_Log);
                        if (parsedLog && Array.isArray(parsedLog) && parsedLog.length > 0) {
                            // console.log("Processings", parsedLog);
                            parsedLog.forEach((log, index) => {
                                console.log(`Log ${index + 1}:`);

                                if (typeof log === "string") {
                                    // Check if it looks like a JSON string and try to parse it
                                    if (log.startsWith("{") || log.startsWith("[")) {
                                        try {
                                            const parsedEntry = JSON.parse(log);
                                            // console.log("Parsed Entry:", parsedEntry);

                                            // console.log("Question:", parsedEntry?.inputs?.question || "No question available");
                                            // console.log("Answer:", parsedEntry?.outputs?.answer || "No answer available");
                                        } catch (error) {
                                            // console.log("⚠ JSON Parse Error, Raw Log:", log);
                                        }
                                    }
                                    // Check if it's a direct text entry (e.g., meal plan request)
                                    else if (log.includes("meal plan") || log.includes("Please create")) {
                                        // console.log("Question:", log);
                                    }
                                    // Otherwise, treat it as an error or unknown format
                                    else {
                                        // console.log("Unknown Format:", log);
                                    }
                                }
                                else if (typeof log === "object") {
                                    // console.log("Question:", log.inputs?.question || "No question available");
                                    // console.log("Answer:", log.outputs?.answer || "No answer available");
                                }
                                else {
                                    // console.log("Unhandled Data Type:", log);
                                }

                                console.log("----------------------------------");
                            });

                            preview = parsedLog[0]?.inputs?.question?.slice(0, 50) + "...";
                            fullChat = parsedLog[0]?.outputs?.answer || "No response available";
                            // console.log("Preview", preview, fullChat);
 
                        }
                    } catch (error) {
                        console.error("❌ Error parsing Chat_Log:", error);
                    }

                    return {
                        id: log.Chat_Id,
                        timestamp,
                        preview,
                        fullChat,
                    };
                });

                // 🔹 Sort logs by timestamp in descending order (latest first)
                processedLogs.sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf());

                // Categorizing logs based on date
                setChatLogs({
                    today: processedLogs.filter((log) => log.timestamp.isAfter(now.startOf("day"))),
                    yesterday: processedLogs.filter((log) => log.timestamp.isAfter(yesterday) && log.timestamp.isBefore(now.startOf("day"))),
                    thisWeek: processedLogs.filter((log) => log.timestamp.isAfter(thisWeek) && log.timestamp.isBefore(yesterday)),
                    lastMonth: processedLogs.filter((log) => log.timestamp.isAfter(lastMonth) && log.timestamp.isBefore(thisWeek)),
                });

                setFilteredLogs(processedLogs);
                setSelectedChat(processedLogs.length > 0 ? processedLogs[0] : null);
            } else {
                console.error("Unexpected API response format:", data);
            }
        } catch (error) {
            console.error("Error fetching chat logs:", error);
        }
        setLoadingLogs(false);
    };

 
    const handleTimeframeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTimeframe(event.target.value);
        if (event.target.value === "Today") {
            setFilteredLogs(chatLogs.today);
        } else if (event.target.value === "Yesterday") {
            setFilteredLogs(chatLogs.yesterday);
        } else if (event.target.value === "This Week") {
            setFilteredLogs(chatLogs.thisWeek);
        } else {
            setFilteredLogs(chatLogs.lastMonth);
        }
    };



    const handleStartChat = () => {
        setShowChat(true);
    };
 
    const handleNewChat = async () => {
        try {
            setLoadingNewChat(true);

            // **Retrieve user data from localStorage**
            const storedUserInfo = localStorage.getItem("userData");
            console.log("Stored User Info:", storedUserInfo);
            if (!storedUserInfo) {
                console.warn("⚠ No user info found. Skipping API calls.");
                setLoadingNewChat(false);
                return;
            }

            let userId, userProfile;
            try {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                userId = parsedUserInfo.user?.id;
                userProfile = parsedUserInfo.user;

                if (!userId) throw new Error("User ID not found in stored user data.");
            } catch (error) {
                console.error("❌ Error parsing userInfo from localStorage:", error);
                setLoadingNewChat(false);
                return;
            }

            console.log("✅ Retrieved User ID:", userId);
            console.log("✅ User Profile Data:", userProfile.data);
            let chatHistory = [];
            const storedChatHistory = localStorage.getItem(`chat_history_${userId}`);
            if (storedChatHistory) {
                try {
                    chatHistory = JSON.parse(storedChatHistory);
                    console.log("Loaded existing chat history:", chatHistory);
                } catch (error) {
                    console.error("❌ Error parsing stored chat history:", error);
                }
            }

            // **Step 1: Fetch Food Database**
            const foodDatabaseResponse = await fetch("https://friskaaiapi.azurewebsites.net/generate_food_menu", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: encodeURIComponent("YOUR_API_KEY"),
                },
                body: JSON.stringify({
                    question: `Please create a personalized meal plan based on the following profile: Gender: ${userProfile.data.Gender || "Not provided"} Age: ${userProfile.data.Age || "Not provided"} years Weight: ${userProfile.data.Weight || "Not provided"} kg Height: ${userProfile.data.Height_ft || "Not provided"} cm BMI: ${userProfile.data.BMI || "Not provided"} TDEE: ${userProfile.data.TDEE || "Not provided"} calories/day Activity Level: ${userProfile.data.ActivityLevel || "Not provided"} Dietary Preference: ${userProfile.data.DietaryPreference || "Not provided"} Dietary Restrictions: ${userProfile.data.DietaryRestrictions || "None"} Digestive Issues: ${userProfile.data.DigestiveIssues || "None"} Aggravating Foods: ${userProfile.data.AggravatingFoods || "None"} Food Allergies: ${userProfile.data.FoodAllergies || "None"}  Please provide a detailed one-day meal plan with specific portions, timing, and a nutritional breakdown.`,
                }),
                redirect: "follow",
            });

            if (!foodDatabaseResponse.ok) throw new Error("Failed to fetch food database");

            let foodDatabase = await foodDatabaseResponse.text();

            // **Step 2: Clean "answer" prefix from food_database**
            try {
                const jsonData = JSON.parse(foodDatabase);
                if (jsonData.answer) {
                    foodDatabase = jsonData.answer.replace(/^"|"$/g, ''); // Remove surrounding quotes
                }
            } catch (error) {
                console.error("❌ Error cleaning food_database response:", error);
            }

            // **Step 3: Generate AI Meal Plan Dynamically**
            const aiResponse = await fetch("https://friskaaiapi.azurewebsites.net/aiprompt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: encodeURIComponent("YOUR_API_KEY"),
                },
                body: JSON.stringify({
                    chat_history: [],
                    question: `Please create a personalized meal plan based on the following profile:  Gender: ${userProfile.data.Gender || "Not provided"} Age: ${userProfile.data.Age || "Not provided"} years Weight: ${userProfile.data.Weight || "Not provided"} kg Height: ${userProfile.data.Height_ft || "Not provided"} cm BMI: ${userProfile.data.BMI || "Not provided"} TDEE: ${userProfile.data.TDEE || "Not provided"} calories/day Activity Level: ${userProfile.data.ActivityLevel || "Not provided"} Dietary Preference: ${userProfile.data.DietaryPreference || "Not provided"} Dietary Restrictions: ${userProfile.data.DietaryRestrictions || "None"} Digestive Issues: ${userProfile.data.DigestiveIssues || "None"} Aggravating Foods: ${userProfile.data.AggravatingFoods || "None"} Food Allergies: ${userProfile.data.FoodAllergies || "None"}  Please provide a detailed one-day meal plan with specific portions, timing, and a nutritional breakdown.`,
     food_database: foodDatabase,
                }),
                redirect: "follow",
            });

            if (!aiResponse.ok) throw new Error("Failed to fetch AI meal plan");

            const aiResult = await aiResponse.text();

            // **Step 4: Store & Display AI Response**
            const chatId = dayjs().format("YYYY-MM-DD HH:mm:ss");

            const newChat: ProcessedChatLog = {
                id: chatId,
                timestamp: dayjs(),
                preview: "New AI Meal Plan",
                fullChat: aiResult,
            };

            setChatLogs((prevLogs) => ({
                today: [newChat, ...prevLogs.today],
                yesterday: prevLogs.yesterday,
                thisWeek: prevLogs.thisWeek,
                lastMonth: prevLogs.lastMonth,
            }));

            setFilteredLogs([newChat, ...filteredLogs]);
            setSelectedChat(newChat);

            const initialChatHistory = [{
                inputs: {
                    question: `Please create a personalized meal plan based on the following profile: Gender: ${userProfile.data.Gender || "Not provided"} Age: ${userProfile.data.Age || "Not provided"} years Weight: ${userProfile.data.Weight || "Not provided"} kg Height: ${userProfile.data.Height_in || "Not provided"} cm Dietary Preference: ${userProfile.data.DietaryPreference || "Not provided"} Dietary Restrictions: ${userProfile.data.DietaryRestrictions || "None"} Digestive Issues: ${userProfile.data.DigestiveIssues || "None"}`,
                 },
                outputs: {
                    answer: aiResult
                }
            }];

            localStorage.setItem(`chat_history_${chatId}`, JSON.stringify(initialChatHistory));
            console.log("✅ Initial chat history saved for chat ID:", chatId);

            // **Step 5: Save Chat Log to Server**
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", `authenticated=true; user_id=${userId}`);

            const saveChatResponse = await fetch("https://friskaaiapi.azurewebsites.net/create-chat-log/", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({
                    User_Id: userId,
                    Chat_Id: chatId,
                    Chat_Log: JSON.stringify(initialChatHistory),
                    Food_menu: foodDatabase,
                }),
                redirect: "follow",
            });

            if (!saveChatResponse.ok) throw new Error("Failed to save chat log");

            console.log("✅ Chat Log Saved:", await saveChatResponse.text());

            // **Step 6: Update Chat Log**
            // const updateChatResponse = await fetch("https://friskaaiapi.azurewebsites.net/update/chat-log", {
            //     method: "POST",
            //     headers: myHeaders,
            //     body: JSON.stringify({
            //         User_Id: userId,
            //         Chat_Id: chatId,
            //         Chat_Log: JSON.stringify(initialChatHistory),
            //         Food_menu: foodDatabase,
            //     }),
            //     redirect: "follow",
            // });

            // if (!updateChatResponse.ok) throw new Error("Failed to update chat log");

            // console.log("✅ Chat Log Updated:", await updateChatResponse.text());

        } catch (error) {
            console.error("❌ Error creating new chat:", error);
        } finally {
            setLoadingNewChat(false);
        }
    };

    // Add this function to handle chat selection with history loading
    const handleChatSelection = (log:any) => {
        console.log("Clicked Chat:", log);

        // Load chat history from localStorage if it exists
        const storedChatHistory = localStorage.getItem(`chat_history_${log.id}`);
        let chatHistory = [];

        if (storedChatHistory) {
            try {
                chatHistory = JSON.parse(storedChatHistory);
                console.log("Loaded chat history:", chatHistory);
            } catch (error) {
                console.error("Error parsing stored chat history:", error);
            }
        } else {
            // Initialize chat history with first interaction if available
            try {
                const parsedLog = JSON.parse(log.fullChat);
                if (parsedLog) {
                    const initialQuestion = log.preview?.replace("...", "") || "";
                    const initialAnswer = parsedLog.answer || "";

                    if (initialQuestion && initialAnswer) {
                        chatHistory = [{
                            inputs: { question: initialQuestion },
                            outputs: { answer: initialAnswer }
                        }];

                        // Save this initial chat history
                        localStorage.setItem(`chat_history_${log.id}`, JSON.stringify(chatHistory));
                        console.log("Initialized chat history:", chatHistory);
                    }
                }
            } catch (error) {
                console.error("Error initializing chat history:", error);
            }
        }

        setSelectedChat({ ...log });
    };
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUserQuery(e.target.value);
    }, []);

// console.log(selectedChat);
  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 w-screen h-screen min-h-screen flex overflow-hidden bg-gradient-to-br from-[#F0E5F5] to-[#F9FAE0]"
      >
          {/* Sidebar */}
          <div className="w-[260px] flex-shrink-0 z-10 bg-white text-gray-800 p-4 shadow-md border-r border-gray-300 h-screen flex flex-col justify-between">
              <div>
                  <h5 className="text-xl font-semibold text-center mb-10">Friska NutriAI</h5>
                  <hr className="my-2 border-gray-300" />
                  <button
                      onClick={handleNewChat}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors"
                  >
                      {loadingNewChat ? (
                          <div className="flex items-center justify-center">
                              <span className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></span>
                          </div>
                      ) : (
                          "+ New Chat"
                      )}
                  </button>
                  <div className="w-full mt-3">
                      <select
                          value={timeframe}
                          onChange={handleTimeframeChange}
                          className="w-full rounded-md p-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                          <option value="Today">Today</option>
                          <option value="Yesterday">Yesterday</option>
                          <option value="This Week">This Week</option>
                          <option value="Last Month">Last Month</option>
                      </select>
                  </div>
                  {/* Chat Logs List */}
                  <div className="max-h-[300px] overflow-y-auto mt-3 border border-gray-300 p-2 rounded-md">
                      {loadingLogs ? (
                          [...Array(5)].map((_, i) => (
                              <div key={i} className="h-10 my-1 bg-gray-200 rounded-md animate-pulse"></div>
                          ))
                      ) : filteredLogs.length > 0 ? (
                          filteredLogs.map((log) => (
                              <div
                                  key={log.id}
                                  onClick={() => handleChatSelection(log)}
                                  className={`py-2 px-2 rounded-md cursor-pointer transition-colors ${selectedChat?.id === log.id ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                                      }`}
                              >
                                  <p className="text-sm font-medium">{log.id}</p>
                              </div>
                          ))
                      ) : (
                          <p className="text-center text-gray-400">No chat logs available</p>
                      )}
                  </div>
              </div>

              {/* Logout Button at Bottom */}
              <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition-colors"
              >
                  Logout
              </button>
          </div>

          {/* Main Content */}
          <div className="flex-grow flex flex-col items-center justify-center text-center px-4">

              {selectedChat ? (
                  <div
                      ref={chatContainerRef}
                      className="mt-3 w-full flex flex-col h-[90vh] overflow-y-auto px-4 py-4 rounded-lg bg-gradient-to-br from-[#f9fafb] to-[#e3f2fd] shadow-md"
                  >
                      <h4 className="text-4xl font-bold text-[#1e40af]">Friska NutriAI Chat</h4>


                      {(() => {
                          let parsedResponse;
 
                          try {
                              parsedResponse =JSON.parse(selectedChat.fullChat)
                           } catch (error) {
                              console.error("Error parsing AI response:", error);
                          }

                          if (!parsedResponse) {
                              return <p className="text-gray-500 text-center">No valid response available</p>;
                          }
                          console.log("Parsed Selected Response :", selectedChat.fullChat); 
                          console.log("Parsed AI Response:", parsedResponse);
                        //   const formattedResponse = parsedResponse.answer
                        //       .split("### ") 
                        //       .filter((section: string) => section.trim() !== "") 
                        //       .map((section: string, index: number) => { 
                        //           const lines: string[] = section.split("\n").filter((line: string) => line.trim() !== ""); 
                        //           const title: string | undefined = lines.shift(); 
                        //           const mealItems = lines.map((item: string, i: number) => ( // Define `item` and `i` properly
                        //               <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 mt-2">
                        //                   <p className="text-gray-700">{item}</p>
                        //               </div>
                        //           ));

                        //           return (
                        //               <motion.div
                        //                   key={index}
                        //                   initial={{ y: 20, opacity: 0 }}
                        //                   animate={{ y: 0, opacity: 1 }}
                        //                   transition={{ duration: 0.3, delay: index * 0.1 }}
                        //                   className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md"
                        //               >
                        //                   <h5 className="text-lg font-semibold text-blue-600 flex items-center">
                        //                       🍽 {title}
                        //                   </h5>
                        //                   <div className="mt-2">{mealItems}</div>
                        //               </motion.div>
                        //           );
                        //       });


                          return (
                              <div className="space-y-4">
                                  {/* User Query */}
                                  <motion.div
                                      initial={{ x: 100, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ duration: 0.4 }}
                                      className="flex justify-end"
                                  >
                                      {/* <div className="bg-blue-500 text-white p-4 rounded-2xl max-w-2xl shadow-lg">
                                          <p className="text-sm">{selectedChat.preview}</p>
                                      </div> */}
                                  </motion.div>

                            
                                  {/* <div className="flex flex-col items-start">
                                      {(() => {
                                          console.log("Parsing meal plan...");
                                          const mealPlanString = parsedResponse.answer;
                                          const sections = mealPlanString.split("### ").filter(Boolean);

                                          const parsedMealPlan = sections.map((section:any) => {
                                              const [titleLine, ...items] = section.split("\n").filter(Boolean);
                                              const title = titleLine.replace(":", "").trim();
                                              const parsedItems = items
                                                  .filter((item:any) => item.startsWith("-"))
                                                  .map((item:any) => {
                                                      const match = item.match(
                                                          /- (.+) \(Protein: ([\d.]+)g, Carbohydrates: ([\d.]+)g, Fiber: ([\d.]+)g, Fat: ([\d.]+)g, .*Calories: ([\d.]+) kcal\)/
                                                      );
                                                      return match
                                                          ? {
                                                              name: match[1],
                                                              protein: match[2],
                                                              carbs: match[3],
                                                              fiber: match[4],
                                                              fat: match[5],
                                                              calories: match[6],
                                                          }
                                                          : null;
                                                  })
                                                  .filter(Boolean);

                                              return { title, items: parsedItems };
                                          });

                                          return (
                                              <motion.div
                                                  initial={{ x: -100, opacity: 0 }}
                                                  animate={{ x: 0, opacity: 1 }}
                                                  transition={{ duration: 0.4 }}
                                                  className="flex flex-col items-start"
                                              >
                                                  {parsedMealPlan.map((section:any, secIndex:any) => (
                                                      <div key={secIndex} className="bg-gradient-to-r from-gray-100 to-gray-300 text-black p-4 rounded-2xl max-w-md shadow-lg mb-4">
                                                          <h5 className="text-xl font-bold text-orange-700 flex items-center">🍽 {section.title}</h5>
                                                          <div className="mt-3 space-y-2">
                                                              {section.items.map((item: any, itemIndex:any) => (
                                                                  <div key={itemIndex} className="bg-white p-4 rounded-lg shadow-md border border-gray-300 flex flex-col">
                                                                      <p className="text-gray-700 font-medium">{item.name}</p>
                                                                      <p className="text-sm text-gray-500">
                                                                          <span className="font-semibold">Protein:</span> {item.protein}g &bull;
                                                                          <span className="font-semibold"> Carbs:</span> {item.carbs}g &bull;
                                                                          <span className="font-semibold"> Fiber:</span> {item.fiber}g &bull;
                                                                          <span className="font-semibold"> Fat:</span> {item.fat}g &bull;
                                                                          <span className="font-semibold"> Calories:</span> {item.calories} kcal
                                                                      </p>
                                                                  </div>
                                                              ))}
                                                          </div>
                                                      </div>
                                                  ))}
                                              </motion.div>
                                          );
                                      })()}
                                  </div> */}
                                  {/* <MealPlan mealPlan={parsedResponse.answer} /> */}
                                  <motion.div
                                      initial={{ x: -100, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ duration: 0.4 }}
                                      className="flex flex-col items-start"
                                  >
                                      {parsedResponse.answer
                                          .split("### ")
                                          .filter(Boolean) // Split sections by "###" and filter out empty sections
                                          .map((section: any) => {
                                              const [titleLine, ...items] = section.split("\n").filter(Boolean); // First line = Title, rest = Items
                                              const title = titleLine.replace(":", "").trim(); // Remove extra ":" from title
                                              const parsedItems = items
                                                  .filter((item: any) => item.startsWith("-")) // Filter only valid meal items
                                                  .map((item: any) => {
                                                      const match = item.match(
                                                          /- (.+) \(Protein: ([\d.]+)g, Carbohydrates: ([\d.]+)g, Fiber: ([\d.]+)g, Fat: ([\d.]+)g, .*Calories: ([\d.]+) kcal\)/
                                                      );
                                                      return match
                                                          ? {
                                                              name: match[1],
                                                              protein: match[2],
                                                              carbs: match[3],
                                                              fiber: match[4],
                                                              fat: match[5],
                                                              calories: match[6],
                                                          }
                                                          : null;
                                                  })
                                                  .filter(Boolean);

                                              return { title, items: parsedItems };
                                          })
                                          .map((section: any, secIndex: any) => (
                                              <div
                                                  key={secIndex}
                                                  className="bg-gradient-to-r from-gray-100 to-gray-300 text-black p-4 rounded-2xl max-w-md shadow-lg mb-4"
                                              >
                                                  <h5 className="text-xl font-bold text-orange-700 flex items-center">🍽 {section.title}</h5>
                                                  <div className="mt-3 space-y-2">
                                                      {section.items.map((item: any, itemIndex: any) => (
                                                          <div
                                                              key={itemIndex}
                                                              className="bg-white p-4 rounded-lg shadow-md border border-gray-300 flex flex-col"
                                                          >
                                                              <p className="text-gray-700 font-medium">{item.name}</p>
                                                              <p className="text-sm text-gray-500">
                                                                  <span className="font-semibold">Protein:</span> {item.protein}g &bull;
                                                                  <span className="font-semibold"> Carbs:</span> {item.carbs}g &bull;
                                                                  <span className="font-semibold"> Fiber:</span> {item.fiber}g &bull;
                                                                  <span className="font-semibold"> Fat:</span> {item.fat}g &bull;
                                                                  <span className="font-semibold"> Calories:</span> {item.calories} kcal
                                                              </p>
                                                          </div>
                                                      ))}
                                                  </div>
                                              </div>
                                          ))}
                                  </motion.div>
                                  {renderChatHistory()}

                              </div>
                          );
                      })()}

                      {/* Input Field to Modify Meal */}
                      <form
                          onSubmit={(e) => {
                              e.preventDefault(); // Prevent default form submission
                              if (userQuery.trim()) {
                                  handleModifyMeal(); // Call modify meal function if input is not empty
                              }
                          }}
                          className="flex sticky bottom-0 items-center mt-4 w-full bg-gray-100 rounded-md shadow-sm p-3"
                      >
                          <input
                              type="text"
                              placeholder="Modify your meal plan..."
                              value={userQuery}
                              onChange={(e) => setUserQuery(e.target.value)}
                              onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                      e.preventDefault(); // Prevent form from submitting multiple times
                                      if (userQuery.trim()) {
                                          handleModifyMeal();
                                      }
                                  }
                              }}
                              className="flex-grow border-none text-gray-800 outline-none text-base p-2 rounded"
                          />
                          <button
                              type="submit"
                              disabled={modifyingMeal}
                              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                          >
                              {modifyingMeal ? (
                                  <span className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></span>
                              ) : (
                                  "Modify"
                              )}
                          </button>
                      </form>


                  </div>
              ) : (
                  <p className="text-gray-500 mt-3 text-center">
                      Select a chat from the sidebar to view history
                  </p>
              )}

          </div>
      </motion.div>
  );
}

export default page
