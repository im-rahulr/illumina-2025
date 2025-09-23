# illumina Website

A simple website for announcing and managing illumina at Lowry Adventist College. This document explains how the site works in plain language. No technical setup, code, or passwords are included.

## What the site does
- **Inform** visitors about the event and important dates.
- **Let students register** using a short form.
- **Show updates** in a clean Changes Log so everyone can see what’s new.

## Main pages
- `index.html` — Home page with event intro, key actions, and links.
- `register.html` — Registration form for participants.
- `changelog.html` — Timeline of updates with version notes. Current release: **1.02.03**.
- `admin.html` — A simple internal page used by organizers (no credentials are shared here).

## How visitors use the site
1. **Open the home page** and read about the event.
2. **Go to Register** and fill out the short form with required details.
3. **Submit the form** and wait for the confirmation message.
4. **Check the Changes Log** to see recent improvements and version notes.

## Registration flow
- The form asks for basic participant information.
- Input is checked for common mistakes (for example, empty fields and phone format).
- On success, the site confirms the submission and may show a small celebration effect.

## Changes Log (Changelog)
- Displays a date, tag (Feature, Improvement, Refactor, Fix), short title, and who committed it.
- Each entry also lists the version, for example: “Committed by: Rahul • Version 1.02.02”.
- The latest entries appear at the top.

## Versioning
- Versions are written in the format `MAJOR.MINOR.PATCH` (e.g., `1.02.02`).
- The current public version shown on the site header is **1.02.02**.

## Support and feedback
- If you notice an error in your registration or have questions about the event, contact the organizing team through the usual college channels.
- For website copy edits or new content, reach out to the website maintainers.

## Notes
- This README does not include any technical steps, tooling, or passwords.
- All links on the site point to public pages only.
