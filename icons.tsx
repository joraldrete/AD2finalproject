import React from "react";

// Common icon props
interface IconProps {
  className?: string;
}

// Dashboard Icons
export const DashboardIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

// Habits Icon
export const HabitsIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
    <path d="M12 8v4l3 3" />
  </svg>
);

// Mood Icon
export const MoodIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

// Goals Icon
export const GoalsIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 4v16m-8-2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8m4 0h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// Insights Icon
export const InsightsIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2" />
    <line x1="8" y1="6" x2="8" y2="18" />
    <line x1="12" y1="10" x2="12" y2="18" />
    <line x1="16" y1="14" x2="16" y2="18" />
  </svg>
);

// Streak Icon
export const StreakIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-1.4 2.4-2 4.8-2 7.4 0 3.7 2.5 6.6 2 11.6.7-1.4 1.6-2.7 2.8-3.8a13 13 0 0 0 1.8-2.9 6 6 0 0 0-.4-5.4 6.5 6.5 0 0 1 2.9 4.7c.4-3.1-.3-6.2-2.1-8.8" />
  </svg>
);

// Completed Icon
export const CompletedIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

// Water Icon
export const WaterIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v6M12 22a7 7 0 0 0 7-7c0-2-1-4-3-7a32.8 32.8 0 0 0-4-4 32.8 32.8 0 0 0-4 4c-2 3-3 5-3 7a7 7 0 0 0 7 7Z" />
  </svg>
);

// Meditation Icon
export const MeditationIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    <path d="M16 16c0-2.5-4-3.5-4-3.5s-4 1-4 3.5" />
  </svg>
);
