import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  suppressErrors: true, // prevents mermaid injecting error bomb SVG into body
});

// Remove any mermaid-generated nodes that leaked into document.body
const cleanMermaidOrphans = () => {
  document.querySelectorAll('[id^="mermaid-"], .mermaid-error').forEach(el => {
    if (el.parentNode === document.body) el.parentNode.removeChild(el);
  });
};

const Mermaid = ({ chart }) => {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    if (!chart) { setSvg(''); return; }

    let cancelled = false;
    // Unique ID for the SVG element mermaid creates
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    mermaid.render(id, chart)
      .then(({ svg: rendered }) => {
        if (!cancelled) setSvg(rendered);
        // Clean up in case mermaid appended a container to body
        cleanMermaidOrphans();
      })
      .catch(() => {
        if (!cancelled) setSvg('');
        cleanMermaidOrphans();
      });

    return () => {
      cancelled = true;
      cleanMermaidOrphans();
    };
  }, [chart]);

  if (!svg) return null;

  return (
    <div
      className="mermaid-diagram w-full overflow-x-auto py-4 my-2 flex justify-center items-center bg-neutral-900/30 rounded-lg border border-neutral-800/50"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Mermaid;
