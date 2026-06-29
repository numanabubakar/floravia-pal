'use client';

import { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
  delay?: number;
}

export function TypingText({ text, speed = 40, className, delay = 0 }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let index = 0;
    let timer: NodeJS.Timeout;

    const startTyping = () => {
      timer = setInterval(() => {
        setDisplayedText((prev) => text.slice(0, index + 1));
        index++;
        if (index >= text.length) {
          clearInterval(timer);
        }
      }, speed);
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimeout);
      if (timer) clearInterval(timer);
    };
  }, [text, speed, delay, mounted]);

  // Server-side and initial paint renders full text for SEO & accessibility
  if (!mounted) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {displayedText}
      <span className="inline-block w-[3px] h-[0.95em] bg-primary ml-1.5 animate-pulse align-middle" />
    </span>
  );
}
