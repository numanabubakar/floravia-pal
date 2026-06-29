const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://shqagnqjayuzbycahiuw.supabase.co';
const supabaseKey = 'sb_publishable_Bv0_ovT0HwrR7D-8y-Jc1g_gE7B4DXg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('role', 'admin');
  console.log('Admin members in database:', { data, error });
}

main();
