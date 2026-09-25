"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Lesson {
  id: number
  title: string
  description: string
  topic: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon: string
  color: string
  progress: number
  duration: string
}

const mockLessons: Lesson[] = [
  {
    id: 1,
    title: "Basic Greetings",
    description: "Learn how to greet and introduce yourself in English",
    topic: "Greeting & Introduction",
    difficulty: "Beginner",
    icon: "👋",
    color: "bg-blue-500",
    progress: 0,
    duration: "15 min"
  },
  {
    id: 2,
    title: "Shopping",
    description: "Shop confidently at stores and ask about prices",
    topic: "Shopping",
    difficulty: "Beginner",
    icon: "🛍️",
    color: "bg-pink-500",
    progress: 0,
    duration: "20 min"
  },
  {
    id: 3,
    title: "Ordering Food",
    description: "Order at restaurants and ask about the menu",
    topic: "Restaurant",
    difficulty: "Intermediate",
    icon: "🍽️",
    color: "bg-orange-500",
    progress: 0,
    duration: "25 min"
  },
  {
    id: 4,
    title: "Travel & Transportation",
    description: "Ask for directions, buy tickets, and use public transport",
    topic: "Travel",
    difficulty: "Intermediate",
    icon: "✈️",
    color: "bg-green-500",
    progress: 0,
    duration: "30 min"
  },
  {
    id: 5,
    title: "Career & Interview",
    description: "Interview skills and talking about your job",
    topic: "Career",
    difficulty: "Advanced",
    icon: "💼",
    color: "bg-purple-500",
    progress: 0,
    duration: "35 min"
  },
  {
    id: 6,
    title: "Daily Life",
    description: "Talk about hobbies and daily activities",
    topic: "Daily Life",
    difficulty: "Beginner",
    icon: "🏠",
    color: "bg-red-500",
    progress: 0,
    duration: "20 min"
  }
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("englishApp_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleStartLesson = (lessonId: number) => {
    router.push(`/lesson/${lessonId}`)
  }

  const handleStartDemo = () => {
    router.push("/lesson/1")
  }

  const handleLogout = () => {
    localStorage.removeItem("englishApp_user")
    setUser(null)
    router.push("/login")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-yellow-300 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-2 rounded-xl">
              <span className="text-2xl">✏️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'cursive' }}>
              English Master
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Hello,</p>
              <p className="text-lg font-bold text-blue-600">{user.name}</p>
            </div>
            <button
              onClick={handleStartDemo}
              className="px-4 py-2 rounded-xl bg-blue-100 text-blue-600 font-medium hover:bg-blue-200 transition"
            >
              Try Now
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-100 text-red-600 font-medium hover:bg-red-200 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-2xl transform -rotate-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to English Master! 🎉
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Choose a lesson to start your English learning journey with our AI chatbot!
          </p>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 flex-1 text-center">
              <p className="text-3xl font-bold">6</p>
              <p className="text-sm opacity-90">Lessons</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 flex-1 text-center">
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm opacity-90">Completed</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 flex-1 text-center">
              <p className="text-3xl font-bold">0%</p>
              <p className="text-sm opacity-90">Progress</p>
            </div>
          </div>
          <button
            onClick={handleStartDemo}
            className="mt-6 bg-white text-blue-600 font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            🚀 Start Now
          </button>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-3xl">📚</span>
          Lesson List
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-4 border-transparent hover:border-yellow-300"
            >
              {/* Lesson Header */}
              <div className={`${lesson.color} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <span className="text-6xl">{lesson.icon}</span>
                </div>
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-white/30 rounded-full text-sm font-medium mb-3 backdrop-blur">
                    {lesson.difficulty}
                  </span>
                  <h4 className="text-2xl font-bold mb-2">{lesson.icon} {lesson.title}</h4>
                  <p className="opacity-90 text-sm">{lesson.duration}</p>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Topic:</p>
                  <p className="text-blue-600 font-semibold">{lesson.topic}</p>
                </div>

                <button
                  onClick={() => handleStartLesson(lesson.id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Start Lesson
                </button>
              </div>
            </div>
          ))}
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
