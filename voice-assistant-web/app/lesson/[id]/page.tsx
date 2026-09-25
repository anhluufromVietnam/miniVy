"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

interface Lesson {
  id: number
  title: string
  description: string
  topic: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon: string
  color: string
  duration: string
  vocabulary: string[]
  questions: string[]
}

const lessons: Record<number, Lesson> = {
  1: {
    id: 1,
    title: "Lời chào hỏi cơ bản",
    description: "Học cách chào hỏi và giới thiệu bản thân trong tiếng Anh",
    topic: "Greeting & Introduction",
    difficulty: "Beginner",
    icon: "👋",
    color: "bg-blue-500",
    duration: "15 phút",
    vocabulary: [
      "Hello - Xin chào",
      "Hi - Chào (thân mật)",
      "Good morning - Chào buổi sáng",
      "Good afternoon - Chào buổi chiều",
      "Good evening - Chào buổi tối",
      "Nice to meet you - Rất vui được gặp bạn",
      "How are you? - Bạn khỏe không?",
      "I'm fine, thank you - Tôi khỏe, cảm ơn"
    ],
    questions: [
      "Hello! How are you today?",
      "Nice to meet you! What's your name?",
      "Where are you from?",
      "Do you like learning English?"
    ]
  },
  2: {
    id: 2,
    title: "Đi mua sắm",
    description: "Tự tin mua sắm tại cửa hàng và hỏi giá",
    topic: "Shopping",
    difficulty: "Beginner",
    icon: "🛍️",
    color: "bg-pink-500",
    duration: "20 phút",
    vocabulary: [
      "How much is this? - Cái này bao nhiêu tiền?",
      "I want to buy this - Tôi muốn mua cái này",
      "Do you have...? - Bạn có... không?",
      "Size S/M/L - Kích thước S/M/L",
      "Can I try this on? - Tôi có thể thử không?",
      "Where is the fitting room? - Phòng thử ở đâu?",
      "Discount - Giảm giá",
      "Receipt - Hóa đơn"
    ],
    questions: [
      "Hello! I'm looking for a shirt. Do you have any?",
      "How much does this dress cost?",
      "Can I try this in size M?",
      "Do you have any discounts today?"
    ]
  },
  3: {
    id: 3,
    title: "Đặt món ăn",
    description: "Đặt món tại nhà hàng và hỏi về thực đơn",
    topic: "Restaurant",
    difficulty: "Intermediate",
    icon: "🍽️",
    color: "bg-orange-500",
    duration: "25 phút",
    vocabulary: [
      "Menu - Thực đơn",
      "Waiter/Waitress - Nhân viên phục vụ",
      "I would like... - Tôi muốn...",
      "The bill, please - Hóa đơn giúp tôi",
      "What do you recommend? - Bạn gợi ý gì?",
      "Is this spicy? - Món này có cay không?",
      "I'm allergic to... - Tôi bị dị ứng với...",
      "Takeout - Mang đi",
      "Dine-in - Ăn tại chỗ"
    ],
    questions: [
      "Hello, can I see the menu please?",
      "What do you recommend for today?",
      "I'd like to order the chicken pasta, please",
      "Could I have the bill, please?"
    ]
  },
  4: {
    id: 4,
    title: "Du lịch và phương tiện",
    description: "Hỏi đường, mua vé và đi lại công cộng",
    topic: "Travel",
    difficulty: "Intermediate",
    icon: "✈️",
    color: "bg-green-500",
    duration: "30 phút",
    vocabulary: [
      "Ticket - Vé",
      "Where is...? - ...ở đâu?",
      "How do I get to...? - Làm thế nào để đến...",
      "Train station - Ga tàu",
      "Bus stop - Bến xe buýt",
      "Airport - Sân bay",
      "Left/Right - Trái/Phải",
      "Straight ahead - Đi thẳng",
      "Nearby - Gần đây"
    ],
    questions: [
      "Excuse me, where is the nearest train station?",
      "How do I get to the airport from here?",
      "Is this bus going to the city center?",
      "Where can I buy tickets?"
    ]
  },
  5: {
    id: 5,
    title: "Công việc và phỏng vấn",
    description: "Kỹ năng phỏng vấn và nói về công việc",
    topic: "Career",
    difficulty: "Advanced",
    icon: "💼",
    color: "bg-purple-500",
    duration: "35 phút",
    vocabulary: [
      "Curriculum Vitae (CV) - Sơ yếu lý lịch",
      "Interview - Phỏng vấn",
      "Experience - Kinh nghiệm",
      "Skills - Kỹ năng",
      "Salary - Lương",
      "Benefits - Quyền lợi",
      "Teamwork - Làm việc nhóm",
      "Leadership - Lãnh đạo",
      "Career goal - Mục tiêu nghề nghiệp"
    ],
    questions: [
      "Tell me about yourself",
      "What are your strengths and weaknesses?",
      "Why do you want to work here?",
      "Where do you see yourself in 5 years?"
    ]
  },
  6: {
    id: 6,
    title: "Cuộc sống hàng ngày",
    description: "Nói về sở thích và hoạt động thường ngày",
    topic: "Daily Life",
    difficulty: "Beginner",
    icon: "🏠",
    color: "bg-red-500",
    duration: "20 phút",
    vocabulary: [
      "Hobby - Sở thích",
      "Free time - Thời gian rảnh",
      "Watch TV - Xem tivi",
      "Listen to music - Nghe nhạc",
      "Read books - Đọc sách",
      "Go to the gym - Tập gym",
      "Spend time with friends - Gặp gỡ bạn bè",
      "Cook - Nấu ăn",
      "Travel - Du lịch"
    ],
    questions: [
      "What do you like to do in your free time?",
      "What are your hobbies?",
      "Do you prefer staying at home or going out?",
      "What's your favorite way to relax?"
    ]
  }
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = Number(params.id)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [activeTab, setActiveTab] = useState<"chat" | "vocab">("chat")
  const [messages, setMessages] = useState<{role: "user" | "assistant", text: string}[]>([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("englishApp_user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    
    if (lessons[lessonId]) {
      const currentLesson = lessons[lessonId]
      setLesson(currentLesson)
      // Add welcome message
      setMessages([
        {
          role: "assistant",
          text: `Hello! Let's practice the topic "${currentLesson.topic}". Would you like to start with an introduction?`
        }
      ])
    } else {
      router.push("/dashboard")
    }
  }, [lessonId, router])

  const handleSendMessage = async () => {
    if (!inputText.trim() || !lesson) return

    const userMessage = { role: "user" as const, text: inputText }
    setMessages(prev => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let responseText = ""
      
      if (activeTab === "chat") {
        responseText = `Great! You said: "${userMessage.text}". That's a very good sentence! Try saying more about "${lesson.topic}".`
      } else {
        responseText = `Vocabulary: ${userMessage.text}. Would you like to learn more words?`
      }

      setMessages(prev => [...prev, { role: "assistant", text: responseText }])
      setIsTyping(false)
    }, 1000)
  }

  const handlePracticeQuestion = (question: string) => {
    setInputText(question)
  }

  if (!lesson) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-yellow-300 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Lesson:</p>
              <p className="text-lg font-bold text-blue-600">{lesson.title}</p>
            </div>
            <div className={`${lesson.color} text-white p-3 rounded-xl`}>
              <span className="text-3xl">{lesson.icon}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Lesson Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Lesson Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-transparent hover:border-yellow-300 transition">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{lesson.title}</h2>
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <span className="text-xl">🎯</span>
                  <div>
                    <p className="text-sm text-gray-500">Topic</p>
                    <p className="font-semibold text-blue-600">{lesson.topic}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-purple-600">{lesson.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <span className="text-xl">📊</span>
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-semibold text-green-600">{lesson.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vocabulary Section */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-transparent hover:border-pink-300 transition">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Key Vocabulary
              </h3>
              <div className="space-y-2">
                {lesson.vocabulary.map((word, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                    <p className="font-medium text-gray-800">{word}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Chat & Practice */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-300">
              {/* Tabs */}
              <div className="flex border-b-4 border-yellow-200">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex-1 py-4 text-center font-semibold transition ${
                    activeTab === "chat"
                      ? "bg-blue-500 text-white border-b-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  💬 Chat with AI
                </button>
                <button
                  onClick={() => setActiveTab("vocab")}
                  className={`flex-1 py-4 text-center font-semibold transition ${
                    activeTab === "vocab"
                      ? "bg-pink-500 text-white border-b-4 border-pink-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  📚 Practice Vocabulary
                </button>
              </div>

              {/* Chat Area */}
              <div className="h-[500px] overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 shadow-md rounded-bl-none border-2 border-gray-100"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-md border-2 border-gray-100">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Practice Questions */}
              <div className="px-6 py-4 bg-gray-50 border-b-4 border-gray-200">
                <p className="text-sm text-gray-500 mb-2 font-medium">Practice Questions:</p>
                <div className="flex flex-wrap gap-2">
                  {lesson.questions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => handlePracticeQuestion(q)}
                      className="px-4 py-2 bg-white border-2 border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 hover:border-blue-300 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={activeTab === "chat" ? "Type your answer here..." : "Type the word you want to learn..."}
                    className="flex-1 px-6 py-4 rounded-2xl border-4 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all text-lg"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-yellow-300 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-600">
            © 2024 English Master. Learn English every day! 🇻🇳
          </p>
        </div>
      </footer>
    </div>
  )
}
