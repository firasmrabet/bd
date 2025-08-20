import pkg from '@supabase/supabase-js';
const { createClient } = pkg;

// This script requires these env vars set in the shell before running:
// SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TEST_USER_ID

async function main() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const testUserId = process.env.TEST_USER_ID;

  if (!url || !serviceKey || !testUserId) {
    console.error('Missing required env vars: SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY, TEST_USER_ID');
    process.exit(2);
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  try {
    console.log('Upserting empty cart for user:', testUserId);
    let { data, error } = await supabase
      .from('carts')
      .upsert({ user_id: testUserId, items: [] }, { onConflict: 'user_id' })
      .select();
    if (error) throw error;

    console.log('Upsert result:', data);

    console.log('Upserting cart with items');
    const testItems = [{ id: 'sku-123', qty: 2 }];
    ({ data, error } = await supabase
      .from('carts')
      .upsert({ user_id: testUserId, items: testItems }, { onConflict: 'user_id' })
      .select());
    if (error) throw error;

    console.log('Fetch cart');
    ({ data, error } = await supabase.from('carts').select('*').eq('user_id', testUserId).limit(1));
    if (error) throw error;

    const row = data && data[0];
    console.log('Fetched row:', row);

    if (!row) throw new Error('No cart row found');
    if (!Array.isArray(row.items)) throw new Error('Cart items not an array');
    if (row.items.length !== 1 || row.items[0].id !== 'sku-123') {
      throw new Error('Cart items not persisted correctly');
    }

    console.log('Now clearing cart (empty array)');
    ({ data, error } = await supabase
      .from('carts')
      .upsert({ user_id: testUserId, items: [] }, { onConflict: 'user_id' })
      .select());
    if (error) throw error;

    ({ data, error } = await supabase.from('carts').select('*').eq('user_id', testUserId).limit(1));
    if (error) throw error;
    const after = data && data[0];
    console.log('After clear row:', after);
    if (!after || !Array.isArray(after.items)) throw new Error('After clear: missing row or items not array');
    if (after.items.length !== 0) throw new Error('After clear: items not empty');

    console.log('E2E test passed');
    process.exit(0);
  } catch (err) {
    console.error('E2E test failed:', err.message || err);
    process.exit(1);
  }
}

main();
