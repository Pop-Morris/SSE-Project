export async function getStoreInfo() {
  const res = await fetch(
    `https://api.bigcommerce.com/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v2/store`,
    {
      headers: {
        'X-Auth-Token': process.env.BIGCOMMERCE_ACCESS_TOKEN!,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch store info');
  return res.json();
} 