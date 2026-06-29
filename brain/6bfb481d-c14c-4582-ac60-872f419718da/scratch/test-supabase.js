const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://shqagnqjayuzbycahiuw.supabase.co';
const supabaseKey = 'sb_publishable_Bv0_ovT0HwrR7D-8y-Jc1g_gE7B4DXg';

console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? 'PRESENT' : 'MISSING');

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  try {
    console.log('Fetching stories...');
    const { data: stories, error: storiesErr } = await supabase.from('stories').select('*');
    if (storiesErr) {
      console.error('Error fetching stories:', storiesErr);
    } else {
      console.log('Stories count:', stories?.length);
      console.log('Stories data:', stories);
    }

    console.log('Fetching members...');
    const { data: members, error: membersErr } = await supabase.from('members').select('*');
    if (membersErr) {
      console.error('Error fetching members:', membersErr);
    } else {
      console.log('Members count:', members?.length);
      console.log('Members data:', members);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

run();
