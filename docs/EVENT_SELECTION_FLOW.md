# Event Selection Flow - ILLUMINA

## Overview
This document describes the event selection feature that allows users to select specific events after registration. The registration fee is fixed at ₹250 regardless of event selections.

## User Flow

### 1. Registration (register.html)
- User fills out registration form with name, course, college, phone
- Upon successful registration, user gets a unique 3-digit token
- User is redirected to `events-list.html` instead of `success.html`

### 2. Event Selection (events-list.html)
- Displays all available events with simple titles and descriptions
- User can select multiple events and specify quantity (number of participants)
- Each event has a maximum participant limit
- No pricing displayed - fixed ₹250 registration fee applies
- Mobile-responsive grid layout
- Stores selections in Firebase and session storage
- "Submit" button redirects to payment page

### 3. Payment (payment.html)
- Shows selected events without individual pricing
- Fixed ₹250 payment amount regardless of event selections
- Mobile-responsive design
- Payment confirmation includes event details

### 4. Admin Panel (admin.html)
- New "Events" column shows selected events for each user
- Displays number of events selected
- Hover tooltip shows detailed event list

## Technical Implementation

### Data Structure
Event selections are stored in the user's registration document with this structure:
```javascript
{
  eventSelections: [
    {
      eventId: 'coding',
      eventTitle: 'Coding (C)',
      quantity: 2,
      maxParticipants: 2
    }
  ],
  totalAmount: 250, // Fixed amount
  eventSelectionTimestamp: serverTimestamp()
}
```

### Available Events (Fixed ₹250 registration fee)
- Coding (C) - max 2 participants
- Debugging - max 2 participants  
- Solo Dance - max 1 participant
- Group Dance - max 8 participants
- Solo Singing - max 1 participant
- Solo Instrumental - max 1 participant
- Photography - max 1 participant
- Face Painting - max 1 participant
- Reels Creation - max 3 participants
- General Quiz - max 2 participants
- Hindi Essay - max 1 participant
- Kannada Essay - max 1 participant
- Fireless Cooking - max 2 participants
- Product Launch - max 3 participants
- Best Manager - max 1 participant
- Red Carpet - max 1 participant

### Firebase Rules
Updated Firestore rules to allow:
- Reading event data
- Updating registration documents with event selections
- Creating event selection records

### Session Storage
The following data is stored in session storage for the flow:
- `lastToken` - User's registration token
- `lastName` - User's name
- `lastCollege` - User's college
- `eventSelections` - Selected events array
- `totalAmount` - Total payment amount
- `payment_user_context` - User context for payment

## Testing
Use `test-events.html` to simulate the registration flow and test the event selection process.

## Files Modified
- `register.html` - Updated redirect to events-list.html
- `events-list.html` - New event selection page
- `payment.html` - Updated to show event selections and dynamic pricing
- `admin.html` - Added events column to display selections
- `success.html` - Updated to redirect to event selection
- `firestore.rules` - Updated to allow event selection data
- `test-events.html` - Test page for the flow

## Future Enhancements
- Event capacity management
- Event time slots
- Team member management for group events
- Event-specific registration forms
- Payment confirmation with event details