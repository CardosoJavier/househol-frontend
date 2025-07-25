# Profile Picture Upload Documentation

## Overview

This document describes the profile picture upload functionality implemented in the ChoreBoard application. The feature allows users to upload, preview, and update their profile pictures following a secure and user-friendly workflow.

## Implementation Flow

### 1. User Interface Flow

1. **File Selection**: User clicks "Update Photo" button or clicks on their current profile picture
2. **Modal Opens**: A dedicated modal component opens for profile picture management
3. **File Preview**: Selected image is immediately previewed in the modal
4. **Validation**: File type and size are validated before allowing upload
5. **Upload**: User confirms upload and the process begins
6. **Success**: Modal closes and profile picture is updated throughout the app

### 2. Backend Processing Flow

1. **File Upload**: Image is uploaded to Supabase storage in `profile-pictures` bucket
2. **File Organization**: Files are stored in user-specific folders: `{userId}/{UUID}.{extension}`
3. **Database Update**: User's `profile_picture` column is updated with the new public URL
4. **Cleanup**: Previous profile picture is deleted from storage (if different)
5. **Cache Refresh**: User data is refetched from database and auth context is updated
6. **UI Update**: Profile picture updates immediately throughout the application

## Technical Implementation

### File Structure

```
src/
├── api/user/
│   ├── profilePicture.ts         # API functions for upload/delete/update
│   └── profilePicture.test.ts    # Unit tests for profile picture API
├── components/util/
│   └── ProfilePictureModal.tsx   # Modal component for profile picture upload
├── schemas/
│   └── profilePicture.ts         # Zod validation schema for file uploads
└── pages/profile/
    └── Profile.tsx               # Updated to integrate the modal
```

### Key Components

#### 1. ProfilePictureModal Component

- **Location**: `src/components/util/ProfilePictureModal.tsx`
- **Features**:
  - File selection with drag-and-drop support
  - Real-time image preview
  - File validation (type, size)
  - Upload progress indication
  - Error handling with user feedback

#### 2. API Functions

- **Location**: `src/api/user/profilePicture.ts`
- **Functions**:
  - `uploadProfilePicture()`: Uploads file to Supabase storage
  - `deleteProfilePicture()`: Removes old profile pictures
  - `updateUserProfilePicture()`: Updates database with new URL

#### Auth Context Integration

- **Location**: `src/context/AuthContext.tsx`
- **Features**:
  - `refreshPersonalInfo()`: Refetches user data and updates auth context
  - `invalidateCache()`: Clears cached user data
  - `personalInfo.profilePictureUrl`: Contains current profile picture URL
  - Automatic UI updates when profile picture changes

#### 3. Validation Schema

- **Location**: `src/schemas/profilePicture.ts`
- **Validates**:
  - File type (JPEG, JPG, PNG, WebP)
  - File size (max 5MB)
  - File format integrity

### Security Features

#### File Validation

- **Type Restriction**: Only allows image files (JPEG, JPG, PNG, WebP)
- **Size Limit**: Maximum file size of 5MB
- **Extension Validation**: Validates both MIME type and file extension

#### Storage Security

- **User Isolation**: Files stored in user-specific folders
- **Unique Naming**: Uses UUID for file names to prevent conflicts
- **Access Control**: Leverages Supabase RLS (Row Level Security)

### Error Handling

#### Client-Side Validation

- File type validation with immediate feedback
- File size validation before upload
- Network error handling with retry options

#### Server-Side Protection

- API wrapper handles all server errors gracefully
- Cleanup on failed uploads (removes orphaned files)
- Database transaction safety

### Usage Example

```typescript
import {
  uploadProfilePicture,
  updateUserProfilePicture,
} from "../../api/user/profilePicture";
import { useAuth } from "../../context";

// Upload and update profile picture with immediate UI refresh
const handleUpload = async (file: File, userId: string) => {
  const { refreshPersonalInfo } = useAuth();

  try {
    // 1. Upload to storage
    const newUrl = await uploadProfilePicture(file, userId);

    // 2. Update database
    if (newUrl) {
      await updateUserProfilePicture(newUrl);

      // 3. Refresh auth context to show new picture immediately
      await refreshPersonalInfo();
    }
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### Storage Configuration

#### Supabase Storage Setup

```sql
-- Create profile-pictures bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true);

-- Set up RLS policies
CREATE POLICY "Users can upload their own profile pictures"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile pictures"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Profile pictures are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-pictures');
```

### Testing

#### Unit Tests

- File upload validation
- API error handling
- Database update verification
- Storage cleanup verification

#### Integration Tests

- End-to-end upload flow
- Modal behavior testing
- Error state handling

### Performance Considerations

#### Optimization Features

- **Image Preview**: Efficient client-side preview using FileReader
- **Lazy Loading**: Modal only loads when opened
- **Immediate UI Updates**: Auth context refresh ensures profile picture shows instantly after upload
- **Cache Management**: Smart cache invalidation and refresh strategy
- **Progressive Enhancement**: Graceful degradation if upload fails

#### File Size Management

- Client-side compression recommendations
- Server-side file size validation
- Optimized storage paths for CDN delivery

### Future Enhancements

#### Planned Features

- Image cropping and resizing
- Multiple image format support
- Batch upload capabilities
- Image optimization pipeline

#### Performance Improvements

- Client-side image compression
- Progressive image loading
- CDN integration for faster delivery

### Troubleshooting

#### Common Issues

1. **Upload Fails**: Check file size and format
2. **Preview Not Showing**: Verify browser FileReader support
3. **Database Not Updating**: Check user authentication
4. **Old Images Not Deleted**: Verify storage permissions

#### Debug Information

- All API calls are logged for debugging
- Error messages provide specific failure details
- Test suite covers edge cases and error scenarios
