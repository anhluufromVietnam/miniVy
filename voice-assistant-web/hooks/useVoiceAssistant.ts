"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type VoiceState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"

type SpeechRecognitionEventLike = Event & {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
        confidence?: number
      }
    }
  }
}

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean

  onstart: (() => void) | null
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onend: (() => void) | null
  onerror: ((event: unknown) => void) | null

  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionConstructor =
  new () => SpeechRecognitionLike

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

const API_URL =
  process.env.NEXT_PUBLIC_VOICE_API_URL ||
  "http://127.0.0.1:8000"

export default function useVoiceAssistant() {
  const [state, setState] =
    useState<VoiceState>("idle")

  const [transcript, setTranscript] =
    useState("")

  const [answer, setAnswer] =
    useState("")

  // --------------------------------
  // Refs
  // --------------------------------

  const recognitionRef =
    useRef<SpeechRecognitionLike | null>(null)

  const transcriptRef =
    useRef("")

  const abortControllerRef =
    useRef<AbortController | null>(null)

  const speechQueueRef =
    useRef<string[]>([])

  const speakingRef =
    useRef(false)

  const stoppedRef =
    useRef(false)

  const mountedRef =
    useRef(true)

  const listeningTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null)

  // --------------------------------
  // Clean text for TTS
  // --------------------------------

  const cleanForSpeech = useCallback(
    (text: string) => {
      return text
        // Remove markdown
        .replace(/```[\s\S]*?```/g, "")
        .replace(/[*_#>`~-]/g, "")

        // Remove brackets
        .replace(/[()[\]{}]/g, "")

        // Remove repeated whitespace
        .replace(/\s+/g, " ")

        .trim()
    },
    []
  )

  // --------------------------------
  // Cancel current speech
  // --------------------------------

  const cancelSpeech = useCallback(() => {
    if (typeof window === "undefined") {
      return
    }

    window.speechSynthesis.cancel()

    speechQueueRef.current = []

    speakingRef.current = false
  }, [])

  // --------------------------------
  // Start listening
  // --------------------------------

  const startListening = useCallback(() => {
    if (typeof window === "undefined") {
      return
    }

    if (stoppedRef.current) {
      return
    }

    const Recognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!Recognition) {
      alert(
        "Speech Recognition is not supported. Please use Chrome."
      )

      return
    }

    console.log("[VOICE] Starting microphone")

    // Cancel old recognition
    try {
      recognitionRef.current?.abort()
    } catch {}

    cancelSpeech()

    transcriptRef.current = ""
    setTranscript("")

    const recognition =
      new Recognition()

    recognition.lang = "en-US"

    recognition.continuous = false

    recognition.interimResults = true

    recognition.onstart = () => {
      console.log("[VOICE] Listening")

      transcriptRef.current = ""

      setTranscript("")

      setState("listening")
    }

    recognition.onresult = (
      event
    ) => {
      let text = ""

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        text +=
          event.results[i][0].transcript
      }

      text = text.trim()

      console.log(
        "[VOICE] Transcript:",
        text
      )

      transcriptRef.current = text

      setTranscript(text)
    }

    recognition.onerror = (
      event
    ) => {
      console.error(
        "[VOICE] Recognition error:",
        event
      )

      setState("idle")
    }

    recognition.onend = () => {
      const text =
        transcriptRef.current.trim()

      console.log(
        "[VOICE] Recognition ended:",
        text
      )

      if (stoppedRef.current) {
        return
      }

      if (!text) {
        setState("idle")
        return
      }

      sendMessage(text)
    }

    recognitionRef.current =
      recognition

    try {
      recognition.start()
    } catch (error) {
      console.error(
        "[VOICE] Recognition start failed:",
        error
      )

      setState("idle")
    }
  }, [cancelSpeech])

  // --------------------------------
  // TTS queue
  // --------------------------------

  const speakNext = useCallback(() => {
    if (
      typeof window === "undefined"
    ) {
      return
    }

    if (speakingRef.current) {
      return
    }

    const next =
      speechQueueRef.current.shift()

    // Nothing left
    if (!next) {
      console.log(
        "[TTS] Queue empty"
      )

      setState("idle")

      if (
        !stoppedRef.current
      ) {
        if (
          listeningTimeoutRef.current
        ) {
          clearTimeout(
            listeningTimeoutRef.current
          )
        }

        listeningTimeoutRef.current =
          setTimeout(() => {
            if (
              !stoppedRef.current &&
              mountedRef.current
            ) {
              startListening()
            }
          }, 300)
      }

      return
    }

    const text =
      cleanForSpeech(next)

    if (!text) {
      speakNext()
      return
    }

    console.log(
      "[TTS] Speaking:",
      text
    )

    speakingRef.current = true

    setState("speaking")

    const utterance =
      new SpeechSynthesisUtterance(
        text
      )

    utterance.lang = "en-US"

    utterance.rate = 1.0

    utterance.pitch = 1.0

    utterance.volume = 1.0

    utterance.onstart = () => {
      console.log(
        "[TTS] Started"
      )

      setState("speaking")
    }

    utterance.onend = () => {
      console.log(
        "[TTS] Finished"
      )

      speakingRef.current = false

      // Immediately speak next sentence
      speakNext()
    }

    utterance.onerror = (
      event
    ) => {
      console.error(
        "[TTS] Error:",
        event
      )

      speakingRef.current = false

      speakNext()
    }

    window.speechSynthesis.speak(
      utterance
    )
  }, [
    cleanForSpeech,
    startListening,
  ])

  // --------------------------------
  // Add sentence to TTS queue
  // --------------------------------

  const enqueueSpeech =
    useCallback(
      (text: string) => {
        const clean =
          cleanForSpeech(text)

        if (!clean) {
          return
        }

        console.log(
          "[TTS] Queue:",
          clean
        )

        speechQueueRef.current.push(
          clean
        )

        // If TTS is idle, start immediately
        if (
          !speakingRef.current
        ) {
          speakNext()
        }
      },
      [
        cleanForSpeech,
        speakNext,
      ]
    )

  // --------------------------------
  // Send message
  // --------------------------------

  const sendMessage =
    useCallback(
      async (text: string) => {
        const message =
          text.trim()

        if (!message) {
          return
        }

        console.log(
          "[VOICE] Sending:",
          message
        )

        setState("thinking")

        setAnswer("")

        cancelSpeech()

        const controller =
          new AbortController()

        abortControllerRef.current =
          controller

        try {
          const url =
            `${API_URL}/chat/stream`

          console.log(
            "[VOICE] POST:",
            url
          )

          const response =
            await fetch(url, {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "text/plain",
              },

              body: JSON.stringify({
                message,

                temperature: 0.2,

                max_tokens: 2048,
              }),

              signal:
                controller.signal,
            })

          console.log(
            "[VOICE] HTTP:",
            response.status
          )

          if (!response.ok) {
            const errorText =
              await response.text()

            throw new Error(
              `API ${response.status}: ${errorText}`
            )
          }

          if (!response.body) {
            throw new Error(
              "Response body is empty"
            )
          }

          const reader =
            response.body.getReader()

          const decoder =
            new TextDecoder()

          let fullText = ""

          let sentenceBuffer = ""

          while (true) {
            const {
              value,
              done,
            } =
              await reader.read()

            if (done) {
              break
            }

            const chunk =
              decoder.decode(
                value,
                {
                  stream: true,
                }
              )

            if (!chunk) {
              continue
            }

            console.log(
              "[VOICE] Chunk:",
              JSON.stringify(chunk)
            )

            fullText += chunk

            sentenceBuffer += chunk

            // Update UI immediately
            setAnswer(fullText)

            // --------------------------------
            // Extract complete sentences
            // --------------------------------

            const sentenceRegex =
              /(.+?[.!?](?:\s+|$))/g

            let match

            let lastIndex = 0

            while (
              (
                match =
                  sentenceRegex.exec(
                    sentenceBuffer
                  )
              ) !== null
            ) {
              const sentence =
                match[1].trim()

              if (sentence) {
                enqueueSpeech(
                  sentence
                )
              }

              lastIndex =
                sentenceRegex.lastIndex
            }

            if (lastIndex > 0) {
              sentenceBuffer =
                sentenceBuffer.slice(
                  lastIndex
                )
            }
          }

          // Flush decoder
          const remaining =
            decoder.decode()

          if (remaining) {
            fullText += remaining

            sentenceBuffer +=
              remaining

            setAnswer(fullText)
          }

          // --------------------------------
          // Speak remaining text
          // --------------------------------

          const finalText =
            sentenceBuffer.trim()

          if (finalText) {
            enqueueSpeech(
              finalText
            )
          }

          console.log(
            "[VOICE] Stream complete:",
            fullText
          )

        } catch (error) {
          if (
            error instanceof Error &&
            error.name ===
              "AbortError"
          ) {
            console.log(
              "[VOICE] Request aborted"
            )

            return
          }

          console.error(
            "[VOICE] Request failed:",
            error
          )

          setAnswer(
            "Sorry, I could not connect to the assistant."
          )

          setState("idle")
        } finally {
          abortControllerRef.current =
            null
        }
      },
      [
        cancelSpeech,
        enqueueSpeech,
      ]
    )

  // --------------------------------
  // Stop everything
  // --------------------------------

  const stop =
    useCallback(() => {
      console.log(
        "[VOICE] STOP"
      )

      stoppedRef.current =
        true

      try {
        recognitionRef.current?.abort()
      } catch {}

      try {
        abortControllerRef.current?.abort()
      } catch {}

      cancelSpeech()

      if (
        listeningTimeoutRef.current
      ) {
        clearTimeout(
          listeningTimeoutRef.current
        )
      }

      setState("idle")
    }, [cancelSpeech])

  // --------------------------------
  // Cleanup
  // --------------------------------

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false

      try {
        recognitionRef.current?.abort()
      } catch {}

      try {
        abortControllerRef.current?.abort()
      } catch {}

      if (
        listeningTimeoutRef.current
      ) {
        clearTimeout(
          listeningTimeoutRef.current
        )
      }

      if (
        typeof window !==
        "undefined"
      ) {
        window.speechSynthesis.cancel()
      }

      speechQueueRef.current = []

      speakingRef.current = false
    }
  }, [])

  // --------------------------------
  // Public API
  // --------------------------------

  return {
    state,

    transcript,

    answer,

    isListening:
      state === "listening",

    isThinking:
      state === "thinking",

    isSpeaking:
      state === "speaking",

    startListening,

    sendMessage,

    stop,
  }
}
