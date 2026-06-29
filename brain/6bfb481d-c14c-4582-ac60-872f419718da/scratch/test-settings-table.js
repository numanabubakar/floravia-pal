const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://shqagnqjayuzbycahiuw.supabase.co';
const supabaseKey = 'sb_publishable_Bv0_ovT0HwrR7D-8y-Jc1g_gE7B4DXg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('settings').select('*');
  console.log('Settings:', { data, error });
  
  const { data: don, error: donErr } = await supabase.from('donation_settings').select('*');
  console.log('Donation Settings:', { data: don, error: donErr });
}

main();
