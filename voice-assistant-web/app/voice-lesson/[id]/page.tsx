"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import VoiceChat from "../components/VoiceChat"

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
    title: "Basic Greetings",
    description: "Learn how to greet and introduce yourself in English",
    topic: "Greeting & Introduction",
    difficulty: "Beginner",
    icon: "👋",
    color: "bg-blue-500",
    duration: "15 min",
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
    title: "Shopping",
    description: "Shop confidently at stores and ask about prices",
    topic: "Shopping",
    difficulty: "Beginner",
    icon: "🛍️",
    color: "bg-pink-500",
    duration: "20 min",
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
    title: "Ordering Food",
    description: "Order at restaurants and ask about the menu",
    topic: "Restaurant",
    difficulty: "Intermediate",
    icon: "🍽️",
    color: "bg-orange-500",
    duration: "25 min",
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
    title: "Travel & Transportation",
    description: "Ask for directions, buy tickets, and use public transport",
    topic: "Travel",
    difficulty: "Intermediate",
    icon: "✈️",
    color: "bg-green-500",
    duration: "30 min",
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
    title: "Career & Interview",
    description: "Interview skills and talking about your job",
    topic: "Career",
    difficulty: "Advanced",
    icon: "💼",
    color: "bg-purple-500",
    duration: "35 min",
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
    title: "Daily Life",
    description: "Talk about hobbies and daily activities",
    topic: "Daily Life",
    difficulty: "Beginner",
    icon: "🏠",
    color: "bg-red-500",
    duration: "20 min",
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

export default function VoiceLessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = Number(params.id)
  const [lesson, setLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("englishApp_user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    
    if (lessons[lessonId]) {
      setLesson(lessons[lessonId])
    } else {
      router.push("/dashboard")
    }
  }, [lessonId, router])

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

          {/* Right Column - Voice Chat */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-300">
              {/* Tabs */}
              <div className="flex border-b-4 border-yellow-200">
                <button
                  className="flex-1 py-4 text-center font-semibold bg-blue-500 text-white border-b-4 border-blue-600"
                >
                  🎤 Voice Chat
                </button>
              </div>

              {/* Voice Chat Area */}
              <div className="p-6">
                <VoiceChat />
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
