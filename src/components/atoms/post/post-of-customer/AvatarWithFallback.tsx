// components/posts/atoms/avatar-with-fallback.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from 'lucide-react';

interface AvatarWithFallbackProps {
  src: string | null;
  alt: string;
  fallbackText?: string;
}

export function AvatarWithFallback({ src, alt, fallbackText }: AvatarWithFallbackProps) {
  const initials = fallbackText
    ? fallbackText.split(' ').map(n => n[0]).join('').toUpperCase()
    : alt.charAt(0).toUpperCase();

  return (
    <Avatar>
      {src ? <AvatarImage src={src || "/placeholder.svg"} alt={alt} /> : null}
      <AvatarFallback>
        {fallbackText ? initials : <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}