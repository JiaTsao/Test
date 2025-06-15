import React, { useEffect, useState } from 'react';
import ListView from './components/ListView';
import KeywordGraph from './components/KeywordGraph';

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold mb-2">Articles</h1>
      <ListView posts={data.posts} />
      <h2 className="text-lg font-bold mt-4">Keyword Graph</h2>
      <KeywordGraph posts={data.posts} keywordFrequency={data.keywordFrequency} />
    </div>
  );
}
