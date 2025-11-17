# Video Assets for Hero Section

This directory contains the hero background video in multiple formats for optimal browser compatibility.

## Required Files

1. **hero-textile.mp4** (Required)
   - Format: H.264 (Main or Baseline profile)
   - Resolution: 1280x720 or 1920x1080
   - Frame rate: 24-30 fps
   - Target size: 1-2 MB (compressed for web)
   - Audio: None (or muted)
   - Important: Must have `faststart` flag for web streaming

2. **hero-textile.webm** (Optional but recommended)
   - Format: VP9 codec
   - Resolution: Same as MP4
   - Frame rate: 24-30 fps
   - Target size: 1-1.5 MB
   - Audio: None (or muted)

## Encoding Commands

### For MP4 (H.264 with faststart):
```bash
ffmpeg -i source.mp4 -movflags +faststart -c:v libx264 -profile:v main -pix_fmt yuv420p -preset veryfast -crf 25 -an -vf scale=1280:-2 -r 30 public/videos/hero-textile.mp4
```

### For WebM (VP9):
```bash
ffmpeg -i source.mp4 -c:v libvpx-vp9 -b:v 0 -crf 35 -row-mt 1 -speed 4 -an -vf scale=1280:-2 -r 30 public/videos/hero-textile.webm
```

## Browser Compatibility

- **MP4 (H.264)**: Supported by all browsers including iOS Safari (required)
- **WebM (VP9)**: Supported by Chrome, Firefox, Edge (optional, better compression)

## Performance Notes

- Videos are cached aggressively by the service worker (1 year cache)
- The `faststart` flag on MP4 enables progressive streaming
- Keep file sizes under 2MB for optimal mobile performance
- Videos autoplay muted inline on all devices

## Current Status

⚠️ **Action Required**: Please add the video files mentioned above to this directory.

The application currently references:
- `/videos/hero-textile.webm`
- `/videos/hero-textile.mp4`

Without these files, users will see a dark gradient background with the hero content overlay.
