import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const big_friend = {9: [10, -1], 8: [10, -2], 7: [10, -3], 6: [10, -4]};
const small_friend_add = {4: [-1, 5], 3: [-2, 5], 2: [-3, 5], 1: [-4, 5]};
const small_friend_sub = {4: [1, -5], 3: [2, -5], 2: [3, -5], 1: [4, -5]};
const combination_friend_add = {6: [10, -5, 1], 7: [10, -5, 2], 8: [10, -5, 3], 9: [10, -5, 4]};

function apply_formula(base: number, formula: number[]) {
    return [base, ...formula];
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomChoice(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRow(levelNum: number) {
    const question_types = ["big_friend", "small_friend_add", "small_friend_sub", "combination_friend_add"];
    const q_type = getRandomChoice(question_types);

    let row: number[] = [];

    let minBase = 10;
    let maxBase = 50;
    let seqLength = 3;

    if (levelNum >= 3) { minBase = 20; maxBase = 99; seqLength = 4; }
    if (levelNum >= 5) { minBase = 50; maxBase = 999; seqLength = 5; }
    if (levelNum >= 7) { minBase = 100; maxBase = 9999; seqLength = 6; }

    if (q_type === "big_friend") {
        const keys = Object.keys(big_friend);
        const bf_key = keys[Math.floor(Math.random() * keys.length)];
        row = apply_formula(getRandomInt(minBase, maxBase), (big_friend as any)[bf_key]);
    } else if (q_type === "small_friend_add") {
        const keys = Object.keys(small_friend_add);
        const sf_key = keys[Math.floor(Math.random() * keys.length)];
        row = apply_formula(getRandomInt(minBase, maxBase), (small_friend_add as any)[sf_key]);
    } else if (q_type === "small_friend_sub") {
        const keys = Object.keys(small_friend_sub);
        const sf_key = keys[Math.floor(Math.random() * keys.length)];
        row = apply_formula(getRandomInt(minBase, maxBase), (small_friend_sub as any)[sf_key]);
    } else if (q_type === "combination_friend_add") {
        const keys = Object.keys(combination_friend_add);
        const cf_key = keys[Math.floor(Math.random() * keys.length)];
        row = apply_formula(getRandomInt(minBase, maxBase), (combination_friend_add as any)[cf_key]);
    }

    if (levelNum > 1 && Math.random() < 0.65) {
        row[getRandomInt(1, row.length - 1)] = -getRandomChoice([1, 2, 3, 4, 5]);
    }

    if (row[1] < 0) {
        while (row[0] <= Math.abs(row[1])) {
            row[0] = getRandomInt(Math.abs(row[1]) + 1, maxBase);
        }
    }

    while (row.length < seqLength) {
        const val = getRandomInt(1, maxBase > 100 ? 99 : maxBase);
        row.push(Math.random() > 0.5 ? val : -val);
    }
    if (row.length > seqLength) {
        row = row.slice(0, seqLength);
    }

    const total = row.reduce((a, b) => a + b, 0);
    if (total < 0) return null;

    return row;
}

function generateOptionsAndAnswer(row: number[], levelNum: number) {
    const correct_answer = row.reduce((a, b) => a + b, 0);
    const options = [correct_answer];

    const variance = levelNum > 4 ? 50 : 10;
    while (options.length < 3) {
        const option = correct_answer + getRandomChoice([-variance, -2, -1, 1, 2, variance]);
        if (option !== correct_answer && !options.includes(option) && option > 0) {
            options.push(option);
        }
    }

    options.sort(() => Math.random() - 0.5);
    return { options, correct_answer };
}

function generateQuestions(numQuestions: number, level: string) {
    const questions = [];
    const answers = [];

    const levelNum = parseInt(level.replace('level', ''));

    while (questions.length < numQuestions) {
        let row = null;
        while (row === null) {
            row = generateRow(levelNum);
        }

        const total = row!.reduce((a, b) => a + b, 0);
        let maxTotal = 100;
        if (levelNum >= 3) maxTotal = 300;
        if (levelNum >= 5) maxTotal = 2000;
        if (levelNum >= 7) maxTotal = 15000;

        if (total >= 1 && total <= maxTotal) {
            const { options, correct_answer } = generateOptionsAndAnswer(row!, levelNum);
            const questionHtml = row!.map(num => `<p>${num}</p>`).join('');
            questions.push({
                question: questionHtml,
                options: options
            });
            answers.push(correct_answer);
        }
    }
    return { questions, answers };
}

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

    const { level } = await req.json()
    const studentName = user.email!.split('@')[0];

    // Check Permissions
    const { data: perms } = await supabaseClient
        .from('student_permissions')
        .select('allowed_levels')
        .eq('student_name', studentName)
        .single();

    const allowedLevels = perms?.allowed_levels || ['level1']; // default to level1 if no record

    if (!allowedLevels.includes(level)) {
        return new Response(JSON.stringify({ error: `You do not have permission to take ${level}` }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const levelNum = parseInt(level.replace('level', ''));
    let numQuestions = 10;
    if (levelNum >= 3) numQuestions = 15;
    if (levelNum >= 6) numQuestions = 20;

    // Fetch Custom Questions first
    const { data: customQData } = await supabaseClient
        .from('custom_questions')
        .select('*')
        .eq('level', level);

    const questions = [];
    const answers = [];

    // Use custom questions if available (up to numQuestions)
    let usedCustom = 0;
    if (customQData && customQData.length > 0) {
        // shuffle custom questions
        customQData.sort(() => Math.random() - 0.5);
        for (const cq of customQData) {
            if (usedCustom >= numQuestions) break;
            questions.push({
                question: cq.question,
                options: cq.options
            });
            answers.push(cq.answer);
            usedCustom++;
        }
    }

    // Generate remaining if needed
    if (usedCustom < numQuestions) {
        const remaining = numQuestions - usedCustom;
        const generated = generateQuestions(remaining, level);
        questions.push(...generated.questions);
        answers.push(...generated.answers);
    }

    // Save quiz securely
    const { data, error } = await supabaseClient
      .from('quizzes')
      .insert([
        { student_name: studentName, level, questions, answers }
      ])
      .select('id')
      .single()

    if (error) throw error;

    return new Response(
      JSON.stringify({ quizId: data.id, questions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
