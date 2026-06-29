const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://shqagnqjayuzbycahiuw.supabase.co';
const supabaseKey = 'sb_publishable_Bv0_ovT0HwrR7D-8y-Jc1g_gE7B4DXg';

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    id: '1',
    name: 'Standard Kit',
    type: 'standard',
    description: 'Essential menstrual hygiene kit with washable pads and accessories designed for everyday use and long-term sustainability.',
    contents: ["5 Reusable Organic Cotton Pads (washable)", "Organic Cotton Undergarments (2)", "Carrying Pouch", "Menstrual Health Educational Booklet", "Eco-friendly Disposal Bags"],
    imageUrl: '/images/product-standard.png'
  },
  {
    id: '2',
    name: 'Premium Kit',
    type: 'premium',
    description: 'Complete menstrual wellness solution with organic products, menstrual cup, and comprehensive health education materials.',
    contents: ["10 Organic Reusable Pads (premium quality)", "Organic Cotton Undergarments (3 sets)", "Medical-Grade Menstrual Cup", "Luxury Carrying Pouch", "Organic Intimate Wash (100ml)", "Natural Pain Relief Patches", "Comprehensive Health & Hygiene Guide (Urdu & English)", "Eco-friendly Disposal System"],
    imageUrl: '/images/product-premium.png'
  }
];

const stories = [
  {
    id: '1',
    title: 'From School Absence to Top Grades',
    content: "I was missing 5 days every month from school because I didn't have access to proper hygiene products. Floravia Pal changed my life. Now I attend all classes and my grades have improved from C to A. I want to become a doctor and help other girls.",
    author: 'Aisha, Age 16, Karachi',
    date: '2024-06-10',
    imageUrl: '/images/story-1.png',
    featured: true
  },
  {
    id: '2',
    title: 'Empowering the Next Generation',
    content: "As a teacher for 15 years, I've seen the direct impact. Girls who receive these kits have better attendance, confidence, and academic performance. Floravia Pal's educational materials help us break the stigma around menstruation in our schools.",
    author: 'Fatima Khan, Secondary School Teacher',
    date: '2024-05-15',
    imageUrl: '/images/story-2.png',
    featured: true
  },
  {
    id: '3',
    title: "A Mother's Peace of Mind",
    content: "Raising three daughters in Pakistan was a financial challenge. Floravia Pal's kits gave me peace of mind knowing my daughters have access to dignified period management. It's more than products - it's respect and equality.",
    author: 'Rabia Ahmed, Mother of 3',
    date: '2024-04-20',
    imageUrl: '/images/story-3.png',
    featured: false
  }
];

const members = [
  { id: '1', name: 'Dr. Hina Malik', email: 'hina@floravia.com', joinDate: '2023-01-15', role: 'admin', status: 'active' },
  { id: '2', name: 'Saira Hussain', email: 'saira@floravia.com', joinDate: '2023-03-20', role: 'moderator', status: 'active' },
  { id: '3', name: 'Amina Yousaf', email: 'amina@floravia.com', joinDate: '2024-01-10', role: 'volunteer', status: 'active' },
  { id: '4', name: 'Zainab Ali', email: 'zainab@floravia.com', joinDate: '2024-02-05', role: 'volunteer', status: 'active' },
  { id: '5', name: 'Bushra Khan', email: 'bushra@floravia.com', joinDate: '2024-03-12', role: 'member', status: 'active' }
];

async function seed() {
  try {
    console.log('Seeding products...');
    for (const p of products) {
      const { error } = await supabase.from('products').upsert(p);
      if (error) console.error(`Error seeding product ${p.id}:`, error);
      else console.log(`Product ${p.id} upserted.`);
    }

    console.log('Seeding stories...');
    for (const s of stories) {
      const { error } = await supabase.from('stories').upsert(s);
      if (error) console.error(`Error seeding story ${s.id}:`, error);
      else console.log(`Story ${s.id} upserted.`);
    }

    console.log('Seeding members...');
    for (const m of members) {
      const { error } = await supabase.from('members').upsert(m);
      if (error) console.error(`Error seeding member ${m.id}:`, error);
      else console.log(`Member ${m.id} upserted.`);
    }

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seeding exception:', err);
  }
}

seed();
