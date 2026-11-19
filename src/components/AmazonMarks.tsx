import React from 'react';

export const AmazonLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-baseline select-none ${className}`}>
    <div className="relative inline-flex flex-col items-start">
      <div className="flex items-baseline tracking-tight font-bold text-[22px] leading-none text-white">
        <span>amazon</span>
        <span className="text-[13px] font-semibold text-white/95 ml-0.5">.sg</span>
      </div>
      {/* Signature Amazon Smile Arrow */}
      <svg
        viewBox="0 0 110 18"
        className="w-[74px] h-[11px] -mt-[2px] ml-[2px]"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 4.5C28 15.5 67 16 96 5.5"
          stroke="#FF9900"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M89.5 2.5L98.5 4.8L94.5 13"
          stroke="#FF9900"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

export const AmazonLogoDark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-baseline select-none ${className}`}>
    <div className="relative inline-flex flex-col items-start">
      <div className="flex items-baseline tracking-tight font-bold text-[19px] leading-none text-[#0F1111]">
        <span>amazon</span>
        <span className="text-[11px] font-semibold text-[#565959] ml-0.5">.sg</span>
      </div>
      <svg
        viewBox="0 0 110 18"
        className="w-[62px] h-[9px] -mt-[1px] ml-[1px]"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 4.5C28 15.5 67 16 96 5.5"
          stroke="#FF9900"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path
          d="M89.5 2.5L98.5 4.8L94.5 13"
          stroke="#FF9900"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

export const PrimeBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <span
    className={`inline-flex items-center gap-0.5 select-none leading-none ${
      compact ? 'text-[12px]' : 'text-[13px]'
    }`}
    aria-label="Amazon Prime"
  >
    <svg
      viewBox="0 0 16 14"
      className={compact ? 'w-3.5 h-3' : 'w-4 h-3.5'}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 7.5L5.8 11.5L14.5 2.5"
        stroke="#FF9900"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="font-extrabold italic tracking-tight text-[#00A8E1]">prime</span>
  </span>
);

export const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({
  rating,
  size = 'sm',
}) => {
  const dim = size === 'sm' ? 'w-4 h-4' : 'w-[18px] h-[18px]';
  return (
    <div
      className="inline-flex items-center gap-[1px]"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(Math.max(rating - (star - 1), 0), 1);
        const clipId = `star-${star}-${Math.round(rating * 10)}`;
        return (
          <svg
            key={star}
            viewBox="0 0 20 20"
            className={dim}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={clipId}>
                <stop offset={`${fill * 100}%`} stopColor="#FFA41C" />
                <stop offset={`${fill * 100}%`} stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.5l2.58 5.23 5.77.84-4.18 4.07.99 5.75L10 14.67l-5.16 2.72.99-5.75L1.65 7.57l5.77-.84L10 1.5z"
              fill={`url(#${clipId})`}
              stroke="#DE7921"
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
};
