# Gig Detail Page

This page displays detailed information about a specific gig, converted from React Native to Next.js TypeScript.

## Features

### 🎨 **Design & Layout**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Project Color Scheme**: Uses your exact color codes (`color2: #79AC78`, `primary: #32b327`)
- **Consistent Styling**: Matches your existing component patterns

### 🖼️ **Image Gallery**
- **Image Carousel**: Navigate through multiple gig images
- **Navigation Controls**: Previous/Next buttons for image browsing
- **Image Counter**: Shows current image position (e.g., "Banner - 1 of 3")

### 👤 **Provider Information**
- **Profile Display**: Shows provider's profile picture and username
- **Online Status**: Green/red indicator for online/offline status
- **Rating System**: Displays average rating with star icons
- **Contact Button**: Navigate to provider's profile page

### 📝 **Content Sections**
- **Gig Description**: Rich HTML content with SafeHTML component
- **Skills Display**: Shows provider's skills as tags
- **Pricing Information**: Clear pricing display with disclaimers
- **Category & Details**: Organized information display

### ⭐ **Reviews System**
- **Write Reviews**: Interactive star rating and text input
- **Review Display**: Shows existing reviews with ratings
- **Review Submission**: Handles review posting with loading states

### 🗺️ **Location Features**
- **Location Modal**: Shows provider's general location
- **Privacy Notice**: Explains location sharing policy

### 📱 **Interactive Elements**
- **Bookmark Feature**: Save/unsave gigs
- **Contact Provider**: Direct navigation to provider profile
- **Location Viewing**: Modal popup for location details

## Usage

### Navigation
```typescript
// Navigate to gig detail page
router.push('/dashboard/job-seeker/gig?id=your-gig-id');
```

### URL Structure
```
/dashboard/job-seeker/gig?id=gig-id-here
```

## Component Structure

```
GigDetailPage/
├── Header Breadcrumb
├── Main Content
│   ├── Gig Title
│   ├── Provider Profile
│   ├── Image Gallery
│   ├── Description
│   ├── Skills
│   ├── Pricing
│   └── Reviews
├── Right Sidebar
│   ├── Gig Details
│   ├── Bookmark Button
│   └── Contact Button
└── Location Modal
```

## Color Scheme Used

- **Primary Green**: `#32b327` (primary)
- **Secondary Green**: `#79AC78` (color2)
- **Accent Colors**: `#618264`, `#B0D9B1`, `#D0E7D2`
- **Text Colors**: Gray scale for content hierarchy

## Integration Points

### From Explore Page
- Demo button added to explore page for testing
- Can be integrated with actual gig data from API

### With Existing Components
- Uses `LeftSideSeeker` for consistent sidebar
- Uses `SafeHTML` for rich content display
- Uses `Image` component from Next.js for optimization

## Mock Data
Currently uses mock data for demonstration. Replace with actual API calls:

```typescript
// Replace this mock data section with actual API call
const mockGigData: GigData = {
  // ... mock data
};
```

## Testing
Visit the explore page and click the "View Gig Details" button to see the converted component in action.
