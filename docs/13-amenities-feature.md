# Amenities Booking Feature

## Overview
The Amenities Booking feature allows residents to view, book, and manage shared building facilities such as gyms, pools, BBQ areas, party rooms, and guest suites.

## Key Features

### 1. Amenity Management
- Multiple amenity types: Gym, Pool, BBQ, Party Room, Guest Suite, Tennis Court, Meeting Room
- Configurable booking rules (min/max hours, advance booking days)
- Optional booking fees and refundable deposits
- Capacity limits and usage rules

### 2. Booking System
- Calendar-based booking interface
- Real-time availability checking
- Conflict detection (prevents double bookings)
- Time slot selection with duration options
- Purpose and guest count tracking

### 3. User Features
- Browse all available amenities
- View amenity details, rules, and pricing
- Create new bookings
- View upcoming bookings
- Cancel bookings with reason
- Booking history

### 4. Integration
- Dashboard statistics (upcoming bookings count)
- Global search integration
- Sidebar navigation
- Email notifications (ready for implementation)

## Database Schema

### Amenity Model
- Building association
- Type, name, description
- Capacity and booking rules
- Fee and deposit configuration
- Active/inactive status

### AmenityBooking Model
- User and amenity association
- Start/end time
- Status (pending, confirmed, cancelled, completed)
- Purpose and guest count
- Payment tracking
- Cancellation details

## User Roles & Permissions
- All residents can view and book amenities
- Managers can configure amenities (future feature)
- Automatic booking confirmation
- Self-service cancellation

## Sample Data
The seed file includes 5 sample amenities:
1. Fitness Centre (free, 1-2 hours)
2. Swimming Pool (free, 1-3 hours)
3. BBQ Area ($25 + $50 deposit, 2-4 hours)
4. Community Room ($100 + $200 deposit, 3-6 hours)
5. Guest Suite ($80 + $100 deposit, 24-72 hours)

## Future Enhancements
- Admin amenity management interface
- Payment processing integration
- Automated deposit refunds
- Booking approval workflow
- Recurring bookings
- Amenity usage analytics
- Photo uploads for amenities
- Check-in/check-out system
- QR code access
- Booking reminders via email/SMS

## Technical Implementation
- Server-side rendering for performance
- Real-time conflict detection
- Optimistic UI updates
- Form validation
- Responsive design
- Accessible components

## Routes
- `/dashboard/amenities` - Browse amenities
- `/dashboard/amenities/[id]` - Amenity details and booking
- `/dashboard/amenities/my-bookings` - User's booking history

## API Endpoints
- Server actions for booking creation and cancellation
- Global search integration
- Dashboard statistics

## Design Patterns
- Consistent with WattleWay design system
- Amber color scheme for primary actions
- Icon-based amenity identification
- Clean, minimal card layouts
- Mobile-responsive grid system
