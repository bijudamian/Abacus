import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: authError } = await createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    ).auth.getUser(authHeader.replace('Bearer ', ''))

    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { quizId, answers: userAnswers } = await req.json()
    const studentName = user.email!.split('@')[0];

    if (!Array.isArray(userAnswers)) {
      return new Response(JSON.stringify({ error: 'Invalid answers format' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch the quiz securely from the database
    const { data: quiz, error: quizError } = await supabaseClient
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .eq('student_name', studentName) // Ensure it belongs to the user
      .single()

    if (quizError || !quiz || quiz.status === 'completed') {
        return new Response(JSON.stringify({ error: 'Quiz not found or already completed' }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let score = 0;
    const detailedResults = [];
    const correctAnswers = quiz.answers;
    const questions = quiz.questions;

    for (let i = 0; i < correctAnswers.length; i++) {
        const optionIndex = userAnswers[i];

        if (optionIndex === undefined || optionIndex < 0 || optionIndex >= 3) { // Assuming 3 options per question
            detailedResults.push({ userAnswer: optionIndex, correct: false, error: 'Invalid answer index' });
            continue;
        }

        const selectedValue = questions[i].options[optionIndex];
        const correct = selectedValue === correctAnswers[i];

        if (correct) {
            score++;
        }
        detailedResults.push({ userAnswer: optionIndex, correct });
    }

    // Update quiz status to completed
    await supabaseClient
        .from('quizzes')
        .update({ status: 'completed' })
        .eq('id', quizId)

    // Save score securely using service role
    await supabaseClient
        .from('scores')
        .insert([
            { student_name: studentName, level: quiz.level, score, max_score: correctAnswers.length, results: detailedResults }
        ])

    return new Response(
      JSON.stringify({ score, maxScore: correctAnswers.length, detailedResults }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error('Validation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
