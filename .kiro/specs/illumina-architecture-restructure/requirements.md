# Requirements Document

## Introduction

This document outlines the requirements for restructuring the Illumina event management website into a clean, maintainable architecture. The current project has all files scattered in the root directory with mixed concerns. The goal is to create a proper folder structure that separates different types of content, isolates admin functionality, and makes the codebase easier to understand and maintain.

## Requirements

### Requirement 1

**User Story:** As a developer, I want a clean project structure with organized folders, so that I can easily navigate and maintain the codebase.

#### Acceptance Criteria

1. WHEN the project is restructured THEN all files SHALL be organized into logical folders based on their purpose
2. WHEN viewing the project structure THEN public pages SHALL be separated from admin pages
3. WHEN accessing assets THEN images, styles, and scripts SHALL be in dedicated asset folders
4. WHEN looking for configuration files THEN they SHALL be grouped in a config directory
5. WHEN examining the structure THEN the root directory SHALL only contain essential files like index.html and README.md

### Requirement 2

**User Story:** As a developer, I want admin functionality completely isolated from public pages, so that admin code doesn't interfere with public functionality and security is improved.

#### Acceptance Criteria

1. WHEN admin pages are accessed THEN they SHALL be in a dedicated admin directory
2. WHEN admin.html is loaded THEN it SHALL use separate CSS and JS files specific to admin functionality
3. WHEN admin styles are modified THEN they SHALL NOT affect public page styling
4. WHEN admin scripts are updated THEN they SHALL NOT impact public page functionality
5. WHEN the admin directory is viewed THEN it SHALL contain all admin-related HTML, CSS, and JS files

### Requirement 3

**User Story:** As a developer, I want all assets properly organized by type, so that I can quickly find and manage images, styles, and scripts.

#### Acceptance Criteria

1. WHEN assets are needed THEN images SHALL be in an assets/images directory
2. WHEN styling is required THEN CSS files SHALL be in an assets/css directory
3. WHEN scripts are needed THEN JavaScript files SHALL be in an assets/js directory
4. WHEN fonts are used THEN they SHALL be in an assets/fonts directory if applicable
5. WHEN the assets structure is viewed THEN it SHALL be intuitive and follow web development best practices

### Requirement 4

**User Story:** As a developer, I want event-related pages grouped together, so that I can manage event content efficiently.

#### Acceptance Criteria

1. WHEN event pages are accessed THEN they SHALL be in a dedicated events directory
2. WHEN event admin pages are needed THEN they SHALL be in the admin/events subdirectory
3. WHEN event assets are required THEN they SHALL reference the centralized assets directory
4. WHEN new events are added THEN the structure SHALL accommodate them easily
5. WHEN event pages are modified THEN the organization SHALL remain consistent

### Requirement 5

**User Story:** As a developer, I want configuration and utility files properly organized, so that I can manage project settings and build processes effectively.

#### Acceptance Criteria

1. WHEN configuration is needed THEN Firebase config SHALL be in a config directory
2. WHEN build files are required THEN they SHALL be in appropriate directories (e.g., netlify.toml in root)
3. WHEN utility scripts are needed THEN they SHALL be organized by purpose
4. WHEN environment files are accessed THEN they SHALL be in the config directory
5. WHEN documentation is required THEN it SHALL be easily accessible and well-organized

### Requirement 6

**User Story:** As a developer, I want a backup of the original structure preserved, so that I can reference the old organization if needed during the transition.

#### Acceptance Criteria

1. WHEN restructuring begins THEN the original illumina-main directory SHALL be renamed to illumina-main-backup
2. WHEN the backup is created THEN it SHALL contain all original files unchanged
3. WHEN referencing old structure THEN the backup SHALL be easily accessible
4. WHEN the new structure is complete THEN the backup SHALL serve as a reference point
5. WHEN issues arise THEN the backup SHALL allow for easy rollback if necessary

### Requirement 7

**User Story:** As a developer, I want proper separation of concerns in the new architecture, so that different aspects of the application are clearly delineated.

#### Acceptance Criteria

1. WHEN the new structure is implemented THEN public pages SHALL be separate from admin pages
2. WHEN assets are organized THEN they SHALL be shared efficiently between public and admin sections
3. WHEN configuration is managed THEN it SHALL be centralized and environment-specific
4. WHEN documentation is accessed THEN it SHALL be comprehensive and up-to-date
5. WHEN the architecture is reviewed THEN it SHALL follow modern web development best practices

### Requirement 8

**User Story:** As a developer, I want all file paths and connections updated correctly after restructuring, so that the website continues to function perfectly without any broken links, missing styles, or broken functionality.

#### Acceptance Criteria

1. WHEN HTML files are moved THEN all internal links SHALL be updated to reflect new paths and work correctly
2. WHEN CSS files are relocated THEN all stylesheet references SHALL point to correct locations and styles SHALL load properly
3. WHEN JavaScript files are moved THEN all script references SHALL be updated and all JS functionality SHALL work correctly
4. WHEN images are reorganized THEN all image sources SHALL point to new asset locations and images SHALL display properly
5. WHEN the restructuring is complete THEN every page SHALL load correctly with proper styling, working JavaScript, and displayed images
6. WHEN testing the restructured site THEN all navigation links SHALL work correctly between pages
7. WHEN admin pages are accessed THEN they SHALL have their isolated CSS and JS files working properly
8. WHEN event pages are loaded THEN all their assets SHALL be properly connected and functional

### Requirement 9

**User Story:** As a developer, I want comprehensive testing of all file connections after restructuring, so that I can ensure nothing is broken and the site works exactly as before.

#### Acceptance Criteria

1. WHEN the restructure is complete THEN every HTML page SHALL be tested for proper loading
2. WHEN CSS files are tested THEN all styles SHALL apply correctly across all pages
3. WHEN JavaScript functionality is tested THEN all interactive features SHALL work as expected
4. WHEN images are tested THEN all images SHALL display correctly on all pages
5. WHEN navigation is tested THEN all internal links SHALL work properly
6. WHEN admin functionality is tested THEN all admin features SHALL work with the new isolated files
7. WHEN the site is tested THEN it SHALL function identically to the original structure
8. WHEN cross-references are checked THEN all file dependencies SHALL be properly maintained