export interface Candidate {
  id: string;
  name: string;
  position: string;
  department: string;
  year: string;
  tagline: string;
  bio: string;
  avatar: string;
  color: string;
  profilePicture?: string;
  symbol?: string;
  promises: string[];
  vision: string;
  achievements: string[];
  socials: {
    email: string;
  };
}

export interface WishlistItem {
  id: string;
  author: string;
  content: string;
  category: string;
  votes: number;
  timestamp: number;
  votedBy: string[];
  approved: boolean;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
  icon: string;
}

export interface AdminState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}
