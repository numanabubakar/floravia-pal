import { Heart } from 'lucide-react';

interface HeartLoaderProps {
  text?: string;
  className?: string;
}

export function HeartLoader({ text = 'Loading...', className = 'py-12' }: HeartLoaderProps) {
  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <Heart className="w-12 h-12 text-primary  animate-bounce mb-4" />
      <p className="text-muted-foreground font-semibold animate-pulse text-sm">{text}</p>
    </div>
  );
}
