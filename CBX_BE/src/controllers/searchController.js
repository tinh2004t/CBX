async function searchAllCollections(keyword) {
  const db = client.db('your_database');
  const collections = ['tours', 'products', 'orders']; // Danh sách collections
  
  const results = [];
  
  for (let collName of collections) {
    const data = await db.collection(collName).find({
      // Logic search ở đây
    }).limit(10).toArray();
    
    if (data.length > 0) {
      results.push({ collection: collName, data });
    }
  }
  
  return results;
}