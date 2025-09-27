# Admin Login Restriction Implementation

This document explains how admin users are prevented from logging into the main NepalKamma site.

## Implementation Overview

Admin users are restricted from accessing the main site through multiple layers of protection:

### 1. **Login Prevention** (`/src/app/auth/signin/page.tsx`)

When a user attempts to log in:
- The login function authenticates the user normally
- After successful authentication, we check the user's role
- If the role is `'admin'`, we:
  - Clear the auth store (logout the user)
  - Show an error message: "Admins must log in from the admin portal."
  - Prevent the redirect to dashboard

```tsx
// Check if user is admin - prevent login on main site
if (user?.role === 'admin') {
    // Clear the auth store since admin shouldn't be logged in here
    useAuthStore.getState().logout();
    ErrorToast("Admins must log in from the admin portal.");
    return;
}
```

### 2. **Auth Layout Protection** (`/src/app/auth/layout.tsx`)

Additional protection in the auth layout:
- If an admin user somehow gets to auth pages, they are automatically logged out
- This prevents any auth page access for admin users

```tsx
// Prevent admin users from accessing auth pages
if (user.role === 'admin') {
    useAuthStore.getState().logout();
    return;
}
```

### 3. **Dashboard Layout Protection** 

Both dashboard layouts have admin protection:

**Job Seeker Dashboard** (`/src/app/dashboard/job-seeker/layout.tsx`):
```tsx
else if (user.role === 'admin') {
    // Admin users should not access job-seeker dashboard
    useAuthStore.getState().logout();
    router.push('/auth/signin');
}
```

**Job Provider Dashboard** (`/src/app/dashboard/job-provider/layout.tsx`):
```tsx
else if (user.role === 'admin') {
    // Admin users should not access job-provider dashboard  
    useAuthStore.getState().logout();
    router.push('/auth/signin');
}
```

### 4. **User Type Definition** (`/src/types/user.ts`)

Updated to explicitly include admin role:
```tsx
role: 'job_seeker' | 'job_provider' | 'admin' | string;
```

## How It Works

1. **Normal Users**: Job seekers and providers can log in normally
2. **Admin Users**: 
   - Cannot complete login on main site
   - Get error message directing them to admin portal
   - Are automatically logged out if they access restricted areas
   - Cannot access any dashboard areas

## Testing

To test this implementation:

1. **Valid User**: Try logging in with job_seeker/job_provider - should work normally
2. **Admin User**: Try logging in with admin role - should show error and prevent access
3. **Direct Access**: If admin somehow gets authenticated, accessing dashboard areas will log them out

## Admin Portal Access

Admin users should use a separate admin portal (e.g., `admin.nepalkamma.com` or `nepalkamma.com/admin`) for their login and management tasks.

## Security Notes

- Multiple layers ensure no single point of failure
- User is always logged out when admin access is detected
- Clear error messages guide admin users to correct portal
- No sensitive admin functionality is exposed on main site
