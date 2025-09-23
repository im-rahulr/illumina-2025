# Design Document

## Overview

This design document outlines the architectural restructuring of the Illumina event management website. The current flat file structure will be transformed into a well-organized, maintainable architecture that separates concerns, isolates admin functionality, and follows modern web development best practices.

The restructure will create a clean separation between public-facing content, administrative functionality, and shared assets while ensuring all file connections remain intact and functional.

## Architecture

### Current Structure Analysis

The existing structure has several issues:
- All files are in a single directory (illumina-main/)
- Admin functionality is mixed with public pages
- Assets are scattered and not properly organized
- No clear separation of concerns
- Difficult to maintain and scale

### New Proposed Structure

```
illumina/
├── index.html                          # Main landing page
├── README.md                           # Project documentation
├── netlify.toml                        # Deployment configuration
├── .gitignore                          # Git ignore rules
├── 
├── assets/                             # Shared assets directory
│   ├── css/                           # Stylesheets
│   │   ├── main.css                   # Main public styles (from styles.css)
│   │   └── components.css             # Reusable component styles
│   ├── js/                            # JavaScript files
│   │   ├── main.js                    # Main public JavaScript
│   │   ├── firebase-config.js         # Firebase configuration
│   │   └── utils.js                   # Utility functions
│   └── images/                        # All images and media
│       ├── events/                    # Event-specific images
│       ├── ui/                        # UI elements (logos, icons)
│       └── backgrounds/               # Background images
│
├── pages/                             # Public pages
│   ├── register.html                  # Registration page
│   ├── events.html                    # Events listing
│   ├── changelog.html                 # Changelog page
│   ├── rules-new.html                 # Rules and coordinators
│   ├── payment.html                   # Payment page
│   ├── payment-status.html            # Payment status
│   ├── success.html                   # Success page
│   ├── qr-code.html                   # QR code page
│   └── scan.html                      # QR scanner
│
├── events/                            # Event detail pages
│   ├── product-launch.html            # Individual event pages
│   ├── best-manager.html
│   ├── debugging.html
│   ├── coding.html
│   ├── solo-dance.html
│   └── [other-events].html
│
├── admin/                             # Administrative section
│   ├── index.html                     # Main admin dashboard (from admin.html)
│   ├── rsvp-management.html           # RSVP management
│   ├── assets/                        # Admin-specific assets
│   │   ├── css/
│   │   │   └── admin.css              # Admin-specific styles
│   │   └── js/
│   │       ├── admin.js               # Admin functionality
│   │       └── admin-fix.js           # Admin fixes
│   └── events/                        # Event-specific admin pages
│       ├── product-launch.html        # Event admin pages
│       ├── best-manager.html
│       └── [other-events].html
│
├── config/                            # Configuration files
│   ├── env.js                         # Environment configuration
│   └── firestore.rules               # Firestore security rules
│
├── docs/                              # Documentation
│   ├── EVENT_SELECTION_FLOW.md        # Event selection documentation
│   ├── QWEN.md                        # Additional documentation
│   └── techdoc.html                   # Technical documentation
│
└── backup/                            # Backup of original structure
    └── illumina-main-backup/          # Complete backup of original files
```

## Components and Interfaces

### 1. Asset Management System

**Purpose:** Centralized management of all static assets with proper organization and referencing.

**Structure:**
- `assets/css/` - All stylesheets with modular organization
- `assets/js/` - JavaScript files organized by functionality
- `assets/images/` - Images organized by category and usage

**Key Features:**
- Shared asset directory accessible from all pages
- Organized subdirectories for different asset types
- Consistent naming conventions
- Optimized file paths for performance

### 2. Public Pages Module

**Purpose:** All user-facing pages organized in a dedicated directory.

**Components:**
- Registration and event pages
- Information and utility pages
- Payment and success flows
- QR code functionality

**Interface:**
- Consistent navigation structure
- Shared styling from assets/css/
- Common JavaScript functionality
- Responsive design maintained

### 3. Admin Module

**Purpose:** Completely isolated administrative functionality with dedicated assets.

**Components:**
- Admin dashboard (main admin interface)
- Event management pages
- RSVP management system
- Admin-specific styling and scripts

**Interface:**
- Separate CSS file (`admin/assets/css/admin.css`)
- Dedicated JavaScript files for admin functionality
- Isolated from public page styling
- Secure admin-only access patterns

### 4. Events System

**Purpose:** Organized event detail pages with consistent structure.

**Components:**
- Individual event detail pages
- Event-specific admin interfaces
- Event image assets
- Consistent event page templates

**Interface:**
- Standardized event page layout
- Shared event styling
- Admin counterparts for each event
- Proper asset referencing

### 5. Configuration Management

**Purpose:** Centralized configuration and environment management.

**Components:**
- Firebase configuration
- Environment settings
- Security rules
- Build configurations

**Interface:**
- Single source of truth for configurations
- Environment-specific settings
- Secure configuration management
- Easy deployment configuration

## Data Models

### File Path Mapping

The restructure requires careful mapping of old paths to new paths:

```javascript
// Path mapping for asset references
const pathMappings = {
  // CSS files
  'styles.css': 'assets/css/main.css',
  
  // JavaScript files
  'firebase-config.js': 'assets/js/firebase-config.js',
  'admin-fix.js': 'admin/assets/js/admin-fix.js',
  'env.js': 'config/env.js',
  
  // Images
  'images/': 'assets/images/',
  
  // Pages
  'admin.html': 'admin/index.html',
  'events/': 'events/',
  
  // Admin event pages
  'a/admin-*.html': 'admin/events/*.html'
};
```

### Asset Reference Structure

```javascript
// New asset reference patterns
const assetReferences = {
  publicPages: {
    css: '../assets/css/main.css',
    js: '../assets/js/main.js',
    images: '../assets/images/'
  },
  eventPages: {
    css: '../assets/css/main.css',
    js: '../assets/js/main.js',
    images: '../assets/images/'
  },
  adminPages: {
    css: 'assets/css/admin.css',
    js: 'assets/js/admin.js',
    sharedAssets: '../assets/'
  }
};
```

## Error Handling

### File Reference Validation

1. **Broken Link Detection**
   - Implement validation to check all internal links
   - Verify CSS and JS file references
   - Validate image source paths
   - Test navigation between pages

2. **Asset Loading Verification**
   - Ensure all stylesheets load correctly
   - Verify JavaScript functionality works
   - Confirm images display properly
   - Test responsive design elements

3. **Admin Isolation Verification**
   - Confirm admin CSS doesn't affect public pages
   - Verify admin JS is properly isolated
   - Test admin functionality independently
   - Ensure security boundaries are maintained

### Fallback Mechanisms

1. **Missing Asset Handling**
   - Graceful degradation for missing images
   - Fallback styling for missing CSS
   - Error handling for missing JavaScript
   - User-friendly error messages

2. **Path Resolution**
   - Relative path calculation utilities
   - Dynamic path resolution for different page levels
   - Consistent base URL handling
   - Cross-browser compatibility

## Testing Strategy

### 1. Structural Testing

**Objective:** Verify the new directory structure is correctly implemented.

**Tests:**
- Directory structure validation
- File placement verification
- Naming convention compliance
- Organization logic verification

### 2. Functional Testing

**Objective:** Ensure all functionality works after restructuring.

**Tests:**
- Page loading verification
- Navigation testing
- Form functionality testing
- Admin feature testing
- Event page functionality

### 3. Asset Integration Testing

**Objective:** Verify all assets are properly connected and functional.

**Tests:**
- CSS loading and application testing
- JavaScript functionality verification
- Image display testing
- Font loading verification
- Responsive design testing

### 4. Cross-Reference Testing

**Objective:** Ensure all internal links and references work correctly.

**Tests:**
- Internal navigation testing
- Asset reference validation
- Admin page isolation testing
- Event page connectivity testing

### 5. Performance Testing

**Objective:** Ensure the restructure doesn't negatively impact performance.

**Tests:**
- Page load time comparison
- Asset loading efficiency
- Cache behavior verification
- Mobile performance testing

### 6. Regression Testing

**Objective:** Confirm the site works identically to the original structure.

**Tests:**
- Feature parity verification
- Visual consistency testing
- Functionality comparison
- User experience validation

## Implementation Phases

### Phase 1: Backup and Preparation
- Create backup of original structure
- Set up new directory structure
- Prepare asset organization plan

### Phase 2: Asset Reorganization
- Move and organize CSS files
- Reorganize JavaScript files
- Organize image assets
- Update asset references

### Phase 3: Page Restructuring
- Move public pages to pages/ directory
- Reorganize event pages
- Set up admin isolation
- Update internal links

### Phase 4: Admin Isolation
- Create dedicated admin CSS
- Separate admin JavaScript
- Update admin page references
- Test admin functionality

### Phase 5: Testing and Validation
- Comprehensive functionality testing
- Asset reference validation
- Performance verification
- Cross-browser testing

### Phase 6: Documentation and Cleanup
- Update documentation
- Clean up temporary files
- Finalize structure
- Create migration guide