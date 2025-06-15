import React from 'react';

export default function ListView({ posts }) {
  return (
    <table className="min-w-full text-sm text-left">
      <thead>
        <tr>
          <th className="px-2 py-1">Title</th>
          <th className="px-2 py-1">Date</th>
          <th className="px-2 py-1">Keywords</th>
          <th className="px-2 py-1">Title Length</th>
        </tr>
      </thead>
      <tbody>
        {posts.map(p => (
          <tr key={p.slug} className="border-b">
            <td className="px-2 py-1">{p.title}</td>
            <td className="px-2 py-1">{p.date}</td>
            <td className="px-2 py-1">{(p.keywords || []).join(', ')}</td>
            <td className="px-2 py-1">{p.seo.titleLength}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
