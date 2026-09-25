"use client"

import { useEffect } from "react"
import useVoiceAssistant from "../hooks/useVoiceAssistant"

export default function VoiceChat() {
  const {
    state,
    transcript,
    answer,
    isListening,
    isThinking,
    isSpeaking,
    startListening,
    stop,
  } = useVoiceAssistant()

  useEffect(() => {
    // Auto-start listening when component mounts
    if (state === "ready") {
      startListening()
    }
  }, [state])

  const getStatusText = () => {
    switch (state) {
      case "listening":
        return "Listening..."
      case "thinking":
        return "Thinking..."
      case "speaking":
        return "Speaking..."
      default:
        return "Ready"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Card */}
        <div className="rounded-3xl border-4 border-yellow-300 bg-white/90 backdrop-blur-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">AI Voice Assistant</div>
            <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'cursive' }}>
              English Conversation
            </h1>
            <p className="text-gray-600 mt-2">Speak naturally with your AI assistant</p>
          </div>

          {/* Status Indicator */}
          <div className="flex flex-col items-center mb-8">
            <div
              className={`
                w-28 h-28 rounded-full flex items-center justify-center text-4xl transition-all duration-300
                ${
                  isListening
                    ? "bg-blue-500/20 ring-4 ring-blue-500/30 scale-110"
                    : isSpeaking
                    ? "bg-green-500/20 ring-4 ring-green-500/30 scale-110"
                    : isThinking
                    ? "bg-yellow-500/20 ring-4 ring-yellow-500/30"
                    : "bg-gray-100"
                }
              `}
            >
              {isListening ? "🎤" : isSpeaking ? "🔊" : isThinking ? "🧠" : "🤖"}
            </div>
            <div className="mt-4 text-sm text-gray-600 font-medium">{getStatusText()}</div>
          </div>

          {/* User Transcript */}
          <div className="mb-5">
            <div className="text-xs uppercase tracking-wider text-blue-700 mb-2">You</div>
            <div className="min-h-[70px] rounded-2xl bg-blue-50 border-2 border-blue-200 p-4 text-blue-900">
              {transcript || <span className="text-blue-600">Say something...</span>}
            </div>
          </div>

          {/* Assistant Response */}
          <div className="mb-8">
            <div className="text-xs uppercase tracking-wider text-purple-700 mb-2">Assistant</div>
            <div className="min-h-[100px] rounded-2xl bg-purple-50 border-2 border-purple-200 p-4 text-purple-900 leading-relaxed">
              {answer || <span className="text-purple-600">Your assistant's response will appear here...</span>}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={startListening}
              disabled={isListening || isThinking || isSpeaking}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold transition hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🎤 Talk
            </button>
            <button
              onClick={stop}
              className="px-6 py-3 rounded-full bg-gray-100 border-2 border-gray-300 text-gray-700 font-bold transition hover:bg-gray-200"
            >
              Stop
            </button>
          </div>
        </div>

        {/* Debug state */}
        <div className="text-center mt-4 text-xs text-gray-400">State: {state}</div>
      </div>
    </div>
  )
}
