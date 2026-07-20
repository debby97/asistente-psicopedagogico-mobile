import { createClient } from '@supabase/supabase-js';

// Proyecto Supabase dedicado: "asistente psicopedagógico"
// La anon key es segura para exponer en el cliente (por diseño de Supabase);
// el acceso real está protegido por RLS + la función activate_license (SECURITY DEFINER).
const SUPABASE_URL = 'https://plqznbhjvqgijfwcfczw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBscXpuYmhqdnFnaWpmd2NmY3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMzY5MzcsImV4cCI6MjA5OTkxMjkzN30.Hob34w-sc_5IUi1pFEpey0YLSnCBT3_oNBxnsC_m5XA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
