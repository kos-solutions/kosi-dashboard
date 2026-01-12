'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, StopCircle, Upload, CheckCircle, ArrowLeft, Info } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useDashboard } from '@/lib/DashboardContext'
import toast from 'react-hot-toast'

export default function VoiceLabPage() {
  const router = useRouter()
  const { state } = useDashboard()
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      
      const chunks: BlobPart[] = []
      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mpeg' })
        setAudioBlob(blob)
      }

      recorder.start()
      setIsRecording(true)
      
      // Timer pentru durată
      setRecordingDuration(0)
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)
    } catch (err) {
      toast.error("Nu avem acces la microfon. Verifică setările browser-ului.")
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const uploadVoice = async () => {
  console.log("Începere upload. DeviceId:", state.deviceId);
  
  if (!audioBlob) {
    toast.error("Înregistrează audio mai întâi!");
    return;
  }

  if (!state.deviceId) {
    toast.error("Eroare: Nu am detectat ID-ul dispozitivului Miriam. Verifică conexiunea.");
    console.error("DeviceId este NULL. Verifică DashboardContext.");
    return;
  }

  setIsUploading(true);
    const reader = new FileReader()
    reader.readAsDataURL(audioBlob)
    reader.onloadend = async () => {
      const base64Audio = (reader.result as string).split(',')[1]

      try {
        // Apelăm Edge Function-ul pe care îl folosește și aplicația Android
        const { data, error } = await supabase.functions.invoke('clone-voice', {
          body: {
            device_id: state.deviceId,
            audio_base64: base64Audio,
            sample_duration: recordingDuration
          }
        })

        if (error) throw error

        toast.success("Vocea a fost clonată cu succes!")
        router.push('/dashboard')
      } catch (err) {
        console.error(err)
        toast.error("Eroare la procesarea vocii. Încearcă din nou.")
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Înapoi la Dashboard
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-indigo-50">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Lab 🎤</h1>
            <p className="text-gray-500">Înregistrează-ți vocea pentru a-i citi copilului tău povești magice.</p>
          </div>

          {/* Text de citit */}
          <div className="bg-indigo-50 rounded-2xl p-6 mb-8 border border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-700 mb-3 font-semibold text-sm uppercase tracking-wider">
              <Info className="w-4 h-4" />
              Citește cu voce tare:
            </div>
            <p className="text-lg text-gray-700 leading-relaxed italic">
              "Era odată ca niciodată, un tărâm magic unde norii erau făcuți din vată de zahăr. 
              Kosi, micul robot explorator, mergea în fiecare zi prin pădurea de smarald 
              pentru a învăța lucruri noi despre prietenie și curaj..."
            </p>
          </div>

          {/* UI de înregistrare */}
          <div className="flex flex-col items-center justify-center py-10">
            <AnimatePresence mode='wait'>
              {!audioBlob || isRecording ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative"
                >
                  {isRecording && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-red-400 rounded-full"
                    />
                  )}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                      isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white shadow-lg`}
                  >
                    {isRecording ? <StopCircle className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="p-4 bg-green-100 rounded-full">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-800">Înregistrare finalizată! ({recordingDuration}s)</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setAudioBlob(null)}
                      className="text-sm text-gray-500 hover:text-red-500 underline"
                    >
                      Șterge și refă
                    </button>
                    <button
                      onClick={uploadVoice}
                      disabled={isUploading}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isUploading ? "Se procesează..." : "Clonează Vocea"}
                      <Upload className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {isRecording && (
              <p className="mt-4 text-red-500 font-mono font-bold animate-pulse">
                {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}