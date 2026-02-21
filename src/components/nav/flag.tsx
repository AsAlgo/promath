import type { EdSystemCode } from '@/types/education-system';

export function Flag({
  code,
  size = 20,
}: {
  code: EdSystemCode;
  size?: number;
}) {
  const h = Math.round(size * 0.7);
  const props = { width: size, height: h, viewBox: '0 0 20 14' } as const;

  switch (code) {
    case 'DK':
      return (
        <svg {...props} aria-hidden="true">
          <rect width="20" height="14" fill="#C8102E" />
          <rect x="6" width="2" height="14" fill="#fff" />
          <rect y="6" width="20" height="2" fill="#fff" />
        </svg>
      );
    case 'DE':
      return (
        <svg {...props} aria-hidden="true">
          <rect width="20" height="4.67" fill="#000" />
          <rect y="4.67" width="20" height="4.67" fill="#DD0000" />
          <rect y="9.33" width="20" height="4.67" fill="#FFCC00" />
        </svg>
      );
    case 'UK':
      return (
        <svg {...props} aria-hidden="true">
          <rect width="20" height="14" fill="#012169" />
          <path
            d="M0,0 L20,14 M20,0 L0,14"
            stroke="#fff"
            strokeWidth="2.5"
          />
          <path
            d="M0,0 L20,14 M20,0 L0,14"
            stroke="#C8102E"
            strokeWidth="1.5"
          />
          <rect x="8" width="4" height="14" fill="#fff" />
          <rect y="5" width="20" height="4" fill="#fff" />
          <rect x="9" width="2" height="14" fill="#C8102E" />
          <rect y="5.5" width="20" height="3" fill="#C8102E" />
        </svg>
      );
    case 'US':
      return (
        <svg {...props} aria-hidden="true">
          <rect width="20" height="14" fill="#B22234" />
          <rect y="2" width="20" height="2" fill="#fff" />
          <rect y="6" width="20" height="2" fill="#fff" />
          <rect y="10" width="20" height="2" fill="#fff" />
          <rect width="8" height="8" fill="#3C3B6E" />
        </svg>
      );
  }
}
