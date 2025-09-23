# Implementation Plan

- [x] 1. Create backup and initialize new structure



  - Create backup of original illumina-main directory
  - Set up new root directory structure with all required folders
  - Initialize the new architecture foundation


  - _Requirements: 6.1, 6.2, 6.3, 1.1_

- [ ] 2. Set up asset directory structure and move CSS files
  - Create assets/css/, assets/js/, and assets/images/ directories
  - Move styles.css to assets/css/main.css

  - Extract admin-specific styles from main.css into separate admin.css
  - Update CSS file references in all HTML files
  - _Requirements: 3.1, 3.2, 2.2, 8.2_

- [ ] 3. Reorganize and move JavaScript files
  - Move firebase-config.js to assets/js/
  - Move general JavaScript files to assets/js/

  - Move admin-fix.js to admin/assets/js/
  - Create admin-specific JavaScript files in admin/assets/js/
  - Update all JavaScript file references in HTML files
  - _Requirements: 3.3, 2.4, 8.3_

- [x] 4. Organize and move image assets

  - Move all images from illumina-main/images/ to assets/images/
  - Create subdirectories: assets/images/events/, assets/images/ui/, assets/images/backgrounds/
  - Organize images by category and usage
  - Update all image source references in HTML and CSS files
  - _Requirements: 3.1, 8.4, 8.8_


- [ ] 5. Move and organize public pages
  - Create pages/ directory
  - Move public HTML files (register.html, changelog.html, etc.) to pages/
  - Keep index.html in root directory
  - Update navigation links and internal references
  - _Requirements: 1.2, 8.1, 8.6_


- [ ] 6. Restructure event pages
  - Move event HTML files from illumina-main/events/ to events/
  - Update event page asset references to use new paths
  - Ensure all event images and styling work correctly
  - Test event page navigation and functionality

  - _Requirements: 4.1, 4.3, 8.5_

- [ ] 7. Create isolated admin section
  - Create admin/ directory structure with assets subdirectories
  - Move admin.html to admin/index.html
  - Create admin/assets/css/admin.css with admin-specific styles

  - Create admin/assets/js/admin.js with admin functionality
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 8. Move admin event pages and isolate admin functionality
  - Move admin event pages from illumina-main/a/ to admin/events/
  - Update admin page asset references to use isolated admin assets

  - Ensure admin CSS and JS don't affect public pages
  - Test admin functionality with new isolated files
  - _Requirements: 2.1, 2.4, 4.2, 8.7_

- [ ] 9. Set up configuration directory
  - Create config/ directory


  - Move env.js to config/
  - Move firestore.rules to config/
  - Update configuration file references
  - _Requirements: 5.1, 5.2, 5.4_




- [ ] 10. Create documentation directory and move docs
  - Create docs/ directory
  - Move EVENT_SELECTION_FLOW.md, QWEN.md, and techdoc.html to docs/
  - Update documentation references and links

  - Ensure documentation is easily accessible
  - _Requirements: 5.5, 7.4_

- [ ] 11. Update all file path references comprehensively
  - Update CSS file references in all HTML files to use new asset paths
  - Update JavaScript file references to point to new locations

  - Update image source paths in HTML and CSS files
  - Update internal navigation links between pages
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 12. Test public page functionality
  - Test all public pages load correctly with proper styling

  - Verify all images display properly on public pages
  - Test navigation between public pages
  - Verify JavaScript functionality works on public pages
  - _Requirements: 9.1, 9.2, 9.4, 9.5_

- [x] 13. Test admin functionality isolation


  - Verify admin pages load with isolated CSS and JS
  - Test that admin styles don't affect public pages
  - Verify all admin functionality works correctly
  - Test admin event pages with new structure
  - _Requirements: 9.6, 2.3, 2.4, 8.7_

- [ ] 14. Test event pages and cross-references
  - Test all event detail pages load correctly
  - Verify event page styling and images work properly
  - Test navigation from main pages to event pages
  - Verify event page asset references are correct
  - _Requirements: 9.1, 9.4, 4.3, 8.5_

- [ ] 15. Comprehensive site testing and validation
  - Test entire site functionality matches original behavior
  - Verify all internal links work correctly
  - Test responsive design across all pages
  - Validate that no functionality is broken
  - _Requirements: 9.7, 9.8, 8.5, 8.6_

- [ ] 16. Final cleanup and documentation
  - Remove any temporary files or unused assets
  - Update README.md with new structure information
  - Create migration documentation
  - Verify backup is complete and accessible
  - _Requirements: 6.4, 7.4, 5.5_