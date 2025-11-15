# Vaihtoaktivaattori – Frontend

Frontend repository for the **Vaihtoaktivaattori** project (Mediapalveluprojekti course).

## Overview

User interface for exploring and managing international exchange opportunities.

## Tech Stack

- Next.js
- Tailwind CSS
- React
- Leaflet
- Vitest + React Testing Library

## Documentation and Installation

**Backend Repository**<br>
- Backend repository is available [here](https://github.com/karripar/va-backend)

**Hybrid Types Repository**<br>
- The va-hybrid-types repository and installable module used for TypeScript typing is found [here](https://github.com/karripar/va-hybrid-types)

**Installation**<br>
1. Clone The repository in your desired directory.
2. Make sure Node.js and NPM are installed with a stable release version.
3. Open the repository in the terminal. 
4. Install the required node_modules with the command `npm install`
5. Fill in the required environment variables with the instructions in the following paragraph.
6. Enter `npm run dev` once the backend is up and running. 
7. All available commands are found in the `package.json` file.

## Environment Variables

**Example Variables**<br>
- Required environment variables are found in the `.env.sample` file. Copy the content and create a new `.env` file with it. `.env` is already included in .gitignore.
- By default mock data is used with the help of the env variable `USE_MOCK_DATA`, change it to false when the backend is running. 

**Google API Client**<br>
- To get access to the Google OAuth 2.0 flow and authentication, you need to create a Client ID. Follow the instructions found [here](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid) and place the acquired Client ID in the environment variables. Same Cliend ID is required in the backend as well. 

**Vector Store ID**<br>
- TODO: Update this with info about vector store id


## Features

- Frontend implementation of the project includes a live ai-chat implementation for users to get help from a trained AI assistant.
- Contact page for contacting the page admins about pressing topics. Admins are able to edit available contact information.
- Destinations page for viewing current Metropolia Exchange partner schools and destinations with an interactive Leaflet map.
- Mobile first design with responsive user interface and simplistic but eye catching design.
- Users can sign in with their Google account, making signing in easy and efficient. Limited to Metropolia organization and students/staff.
- Users can save links to their important documents and favorite destinations, plan their exchange itinerary and financial frames.
- Get up-to-date information about the current exchange application process and information about important dates.
- Actual applications are not handled on this platform.
- Information about financial support and help before and during the exchange - such as student housing, living costs, student allowance and financial aid.
- Tips for students heading towards their international student exchange.

## Project structure

- Standard Next.js provided folder structure, with available routes and sites in the `app` folder. 
- Admin folder and it's pages are protected from standard users by guiding them back to the index page and requiring an admin authorization token to fetch sensitive information.
- Hooks are separated into different files with their respective topics.
- The backend is separated into its own repository instead of being included in the Next.js frontend. This improves modularity and separation of concerns, and also allows the frontend to be expanded - for example, to React Native - while using the same backend.  

## Testing

- Tests are found in the `src/tests` folder. Inactive test files are marked by replacing a "." in the filename with "-" during development to ignore them from test runs. E.g `Instructions-test.tsx` instead of `Instructions.test.tsx`.
