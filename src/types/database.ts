export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  country: string | null;
  parish: string | null;
  bio: string | null;
  is_verified: boolean;
  is_admin: boolean;
  is_banned: boolean;
  ban_reason: string | null;
  ban_expires_at: string | null;
  listing_count: number;
  free_listings_used: number;
  rating_average: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface OTPCode {
  id: string;
  user_id: string | null;
  email: string;
  code: string;
  type: 'signup' | 'login' | 'reset';
  expires_at: string;
  is_used: boolean;
  attempts: number;
  created_at: string;
}

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'sold' | 'expired';
export type ListingCondition = 'new' | 'used' | 'refurbished';
export type AIRiskScore = 'low' | 'medium' | 'high';

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  condition: ListingCondition | null;
  country: string;
  parish: string | null;
  images: string[];
  videos: string[];
  status: ListingStatus;
  rejection_reason: string | null;
  ai_risk_score: AIRiskScore | null;
  ai_flags: string[];
  ai_confidence: number | null;
  views_count: number;
  favorites_count: number;
  moderated_by: string | null;
  moderated_at: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export type EventStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'past';

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  country: string;
  parish: string | null;
  venue: string | null;
  start_date: string;
  end_date: string | null;
  is_annual: boolean;
  images: string[];
  link: string | null;
  status: EventStatus;
  rejection_reason: string | null;
  rsvp_interested_count: number;
  rsvp_going_count: number;
  moderated_by: string | null;
  moderated_at: string | null;
  created_at: string;
  updated_at: string;
}

export type RSVPStatus = 'interested' | 'going';

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: RSVPStatus;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  listing_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: string;
  listing_id: string;
  seller_id: string;
  reviewer_id: string;
  rating: number;
  review: string | null;
  created_at: string;
  updated_at: string;
}

export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  listing_id: string | null;
  comment_id: string | null;
  reason: string;
  description: string | null;
  status: ReportStatus;
  resolution: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  email_sent: boolean;
  created_at: string;
}

export type AdminActionTargetType = 'user' | 'listing' | 'event' | 'report' | 'comment';

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: AdminActionTargetType;
  target_id: string;
  details: Record<string, any>;
  created_at: string;
}

export interface AIModertionLog {
  id: string;
  listing_id: string;
  risk_score: AIRiskScore;
  confidence: number;
  flags: string[];
  raw_response: Record<string, any> | null;
  auto_action: string | null;
  created_at: string;
}

export type EmailFrequency = 'instant' | 'daily' | 'weekly' | 'disabled';

export interface EmailPreferences {
  id: string;
  user_id: string;
  comments: boolean;
  favorites: boolean;
  listings: boolean;
  events: boolean;
  messages: boolean;
  frequency: EmailFrequency;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  listing_id: string | null;
  subject: string | null;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface ListingWithProfile extends Listing {
  profiles: Profile;
}

export interface EventWithProfile extends Event {
  profiles: Profile;
}

export interface CommentWithProfile extends Comment {
  profiles: Profile;
  replies?: CommentWithProfile[];
}

export interface RatingWithProfiles extends Rating {
  reviewer: Profile;
  seller: Profile;
}

export interface MessageWithProfiles extends Message {
  sender: Profile;
  recipient: Profile;
  listing?: Listing;
}

export interface ReportWithDetails extends Report {
  reporter: Profile;
  reported_user?: Profile;
  listing?: Listing;
  comment?: Comment;
}