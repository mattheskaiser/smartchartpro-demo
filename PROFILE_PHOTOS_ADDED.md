# Profile Photos Added

## Summary
Added professional stock photos from Unsplash for all residents and CNAs to make the application look more polished and realistic.

## Changes Made

### 1. Updated Mock Data Files

#### Residents (`src/lib/mock-data/residents.json`)
Added profile photos for all 9 residents:
- Margaret Thompson (res_001) - Senior woman
- Robert Chen (res_002) - Asian man
- Dorothy Williams (res_003) - Senior woman
- James Martinez (res_004) - Hispanic man
- Patricia Johnson (res_005) - Professional woman
- William Anderson (res_006) - Man in wheelchair-appropriate setting
- Mary Davis (res_007) - Senior woman
- Charles Brown (res_008) - Professional man
- Barbara Wilson (res_009) - Senior woman

#### CNAs (`src/lib/mock-data/cnas.json`)
Added profile photos for all 6 CNAs:
- Jennifer Rodriguez (cna_001) - Healthcare professional woman
- Michael Thompson (cna_002) - Healthcare professional man
- Sarah Johnson (cna_003) - Healthcare professional woman
- David Lee (cna_004) - Healthcare professional man
- Emily Martinez (cna_005) - Healthcare professional woman
- Robert Kim (cna_006) - Healthcare professional man

### 2. Next.js Configuration (`next.config.js`)
Added Unsplash to the allowed image domains:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      port: '',
      pathname: '/**',
    },
  ],
}
```

## Image Source
All images are sourced from Unsplash, a free stock photo service with high-quality, professional images. The URLs include parameters for optimal display:
- `w=400&h=400` - Square format at 400x400 pixels
- `fit=crop&crop=faces` - Automatically crops to focus on faces

## Benefits
1. **Professional Appearance**: The app now looks more realistic and production-ready
2. **Diverse Representation**: Images represent a diverse range of ages, genders, and ethnicities
3. **Healthcare Context**: Selected images that look appropriate for a healthcare/senior care setting
4. **Consistent Quality**: All images are high-quality and properly sized

## Next Steps
To see the changes:
1. Restart the development server if it's running (the Next.js config change requires a restart)
2. Navigate to the Residents or CNAs pages
3. The profile photos should now be visible in cards, lists, and detail views

## Note
The images are loaded from Unsplash's CDN, so an internet connection is required to display them. In a production environment, you might want to:
- Download and host the images locally
- Use a different image service
- Allow users to upload their own photos
