'use client';

import { useEffect, useState } from 'react';
import parse from 'html-react-parser';

export default function SafeHTML({ html }: { html: string }) {
  const [parsed, setParsed] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (html && typeof html === 'string') {
      setParsed(parse(html));
    } else {
      setParsed(null);
    }
  }, [html]);

  return (
    <div className="text-gray-600 text-sm mb-3 line-clamp-2">
      {parsed ?? <span className="text-gray-300">No description available</span>}
    </div>
  );
}
