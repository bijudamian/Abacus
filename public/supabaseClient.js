import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://lpbrfmaevpidtyhakhfw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYnJmbWFldnBpZHR5aGFraGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTg1NjEsImV4cCI6MjA5NDA5NDU2MX0.NgQp8vuwrjJrUN7lvqgRAU7_o0C9tCX8QR5w6QijFL0';
export const supabase = createClient(supabaseUrl, supabaseKey);
