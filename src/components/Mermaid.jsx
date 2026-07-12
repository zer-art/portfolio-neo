import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
});

const Mermaid = ({ chart }) => {
  const ref = useRef(null);
  const [svg, setSvg] = useState('');

  useEffect(() => {
    if (chart) {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      mermaid.render(id, chart).then((result) => {
        setSvg(result.svg);
      }).catch((e) => {
        console.error("Mermaid error:", e);
      });
    }
  }, [chart]);

  if (!chart) return null;

  return (
    <div 
      ref={ref} 
      className="mermaid-diagram w-full overflow-x-auto py-4 my-2 flex justify-center items-center bg-neutral-900/30 rounded-lg border border-neutral-800/50"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Mermaid;
