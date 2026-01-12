import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gestionăm pre-flight-ul de browser (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { device_id, audio_base64 } = await req.json()
    const ELEVEN_LABS_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY')

    if (!audio_base64) throw new Error("Nu am primit date audio.")

    // Convertim base64 în format binar pentru ElevenLabs
    const byteCharacters = atob(audio_base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'audio/mpeg' })

    const formData = new FormData()
    formData.append('name', `Kosi_Parent_${device_id}`)
    formData.append('files', blob, 'sample.mp3')
    formData.append('labels', JSON.stringify({ device_id: device_id }))

    // 1. Trimitere la ElevenLabs
    const elResponse = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: { 'xi-api-key': ELEVEN_LABS_API_KEY! },
      body: formData
    })

    const elData = await elResponse.json()
    if (!elData.voice_id) throw new Error(`ElevenLabs Error: ${JSON.stringify(elData)}`)

    // 2. Salvare în baza de date Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: dbError } = await supabase
      .from('device_voices')
      .upsert({ 
        device_id: device_id, 
        elevenlabs_voice_id: elData.voice_id,
        is_active: true,
        updated_at: new Date().toISOString()
      })

    if (dbError) throw dbError

    return new Response(JSON.stringify({ success: true, voice_id: elData.voice_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})