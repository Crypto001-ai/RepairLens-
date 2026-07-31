🔗 **RepairLens AI**

Repair with confidence using AI guidance.

🔗 **Overview**

RepairLens AI is a web application that helps people diagnose and repair household appliances with the support of Google's Gemma 4 model.

Users can upload a photo, describe a fault, or combine both to receive an AI-assisted diagnosis. From there, RepairLens provides clear step by step repair guidance, keeps track of repair progress, and allows users to continue an unfinished repair without losing context.

The goal is to make appliance repair more accessible, reduce unnecessary replacement of working devices, and help people save money through practical AI assistance.

🔗 **The Problem**

Many people throw away or replace household appliances because they do not know what is wrong or where to begin fixing them. Professional repair services may not always be available, affordable, or convenient. Existing online repair guides are often generic, difficult to follow, or unrelated to the exact problem a user is experiencing.

As a result, usable appliances become electronic waste, households spend more money than necessary, and simple repairs are often left undone.

🔗 **Our Solution**

RepairLens AI provides a guided repair experience powered by Google's Gemma 4 model through OpenRouter.

Instead of presenting users with generic repair information, RepairLens analyzes the reported fault, understands the repair context, and guides users through each repair step with clear explanations, safety advice, expected results, and interactive AI support.

Users can pause a repair at any time and continue later without losing their progress. Throughout the repair process, the AI Repair Companion remains available to answer questions, explain confusing steps, and adapt guidance based on follow up messages and uploaded images.

By combining multimodal AI, session continuity, and practical repair guidance, RepairLens AI makes repairing household appliances more approachable, more reliable, and easier to complete with confidence.


🔗 **Key Features**


**AI Powered Diagnosis**

Diagnose appliance faults by taking a photo, uploading an existing image, describing the problem in text, or combining both image and text for a more accurate assessment.

**Guided DIY Repair**

Receive clear, step by step repair instructions written in simple language. Each repair step includes an explanation, expected results, safety guidance, and an AI generated visual checklist to help users identify the correct components.

**Repair Companion**

Continue asking questions without starting a new diagnosis. The Repair Companion remembers the current repair session, understands previous progress, accepts follow up images, and provides guidance based on the user's current repair step.

**Session Continuity**

Repairs are automatically saved. Users can leave the application and return later to continue exactly where they stopped without losing progress.

**Repair Progress Tracking**

Track repair completion through an interactive progress system. Users can mark steps as completed, view active repairs, and access completed or archived repair sessions from the My Repairs dashboard.

**Smart Repair Reports**

After completing a repair, users can generate a report summarizing the diagnosis, repair steps, estimated savings, repair duration, and environmental impact.

**Achievement System**

Users earn achievements as they complete repairs, encouraging learning and building confidence with every successful repair.

**Personalized Dashboard**

The dashboard highlights active repair sessions, recent activity, achievements, and quick access to start a new diagnosis or continue an unfinished repair.

🔗 **How It Works**

RepairLens AI guides users through a simple repair workflow.

1. Start a new diagnosis by taking a photo, uploading an existing image, or describing the fault.

2. Gemma 4 analyzes the information and identifies the most likely issue.

3. Review the diagnosis, confidence level, and recommended repair plan.

4. Follow the guided repair steps while using the Repair Companion whenever additional help is needed.

5. Mark completed steps and continue the repair until it is successfully finished.

6. Celebrate the completed repair, download a repair report, and access the repair later from the My Repairs page if needed.

🔗 **Tech Stack**

```
                  User
                   │
                   ▼
          React + TypeScript
                   │
                   ▼
         Express Backend (Render)
                   │
                   ▼
 OpenRouter (Google AI Studio BYOK)
                   │
                   ▼
      Google Gemma 4 31B Model
                   │
                   ▼
     Diagnosis & Repair Guidance
                   │
          Firebase Services
      (Auth + Firestore + Storage)
```

🔗 **Why Gemma 4?**

RepairLens AI is built around Google's Gemma 4 31B model because the application depends on more than a simple question and answer chatbot.
Gemma helps users analyze appliance problems from images and text, explains repair steps in simple language, remembers the current repair session, answers follow up questions without losing context, and adapts its guidance as users upload additional photos during a repair.
This allows RepairLens AI to provide an interactive repair experience rather than a one time diagnosis.

🔗 **Architecture**

RepairLens AI follows a simple cloud based architecture.
The user signs in and starts a new repair session.
Images and repair details are securely stored in Firebase.
The application sends the user's request to the Google's Gemma 4 model via OpenRouter using Google Al Studio BYOK through the Gemini API.
Gemma analyzes the input and returns a diagnosis together with repair guidance.
Repair progress is continuously saved so users can pause and continue later without losing their work.
Once the repair is completed, the application generates a repair report and updates the user's repair history and achievements.

🔗 **Project Structure**
The project is organized into separate folders to keep the codebase clean and easy to maintain.

```
RepairLens-AI/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, icons, and branding
│   ├── components/         # Reusable UI components
│   ├── pages/              # Application pages
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Firebase and API services
│   ├── utils/              # Helper functions
│   ├── types/              # TypeScript types
│   ├── styles/             # Global styles
│   └── main.tsx            # Application entry point
├── server/                 # Backend logic and API routes
├── .env.example            # Environment variable template
├── package.json
└── README.md
```

🔗 **Getting Started**
Follow these steps to run RepairLens AI locally.

🔗 **Prerequisites**

Before you begin, make sure you have:
• Node.js 20 or later
• npm or yarn
• A Firebase project
• Access to the Google AI Studio API

🔗 **Installation**

Clone the repository.

```git clone https://github.com/your-username/repairlens-ai.git```

Move into the project directory.

```cd repairlens-ai```

Install project dependencies.

```npm install```

🔗 **Environment Variables**

Create a .env file in the project root and add the required environment variables.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

GEMINI_API_KEY=

```
🔗 **Running the Application**

Start the development server.

```npm run dev```

The application will be available in your browser at:

```http://localhost:5173```

🔗 **Building for Production**

To create a production build, run:

```npm run build```

To preview the production build locally:

```npm run preview```

🔗 **Design Decisions**

Every major feature in RepairLens AI was designed to solve a specific problem faced by people attempting to repair household appliances.

**Guided Repairs Instead of Long Manuals**

Traditional repair guides are often difficult to follow because they present large amounts of information at once. RepairLens AI breaks every repair into smaller, manageable steps with clear explanations, expected results, safety reminders, and optional visual checklists. This helps users stay focused and reduces the chance of making mistakes.

**Session Continuity**

Repairs are not always completed in one sitting. Users may need to stop because they are waiting for a replacement part, need additional tools, or simply run out of time. RepairLens AI automatically saves progress so users can continue exactly where they left off without restarting the diagnosis.

**Multimodal Diagnosis**

Many appliance problems are easier to explain with both images and text. RepairLens AI supports photo uploads together with written descriptions, allowing Gemma to use multiple sources of information to produce more accurate guidance.

**User Focused Explanations**

RepairLens AI explains repair steps in clear language that is suitable for beginners while still providing enough detail for more experienced users. When users need additional help, they can ask follow up questions without leaving their current repair session.

🔗 **Screenshots**

The screenshots below highlight the main user journey through RepairLens AI.

🔗 **Home Dashboard**

Displays active repair sessions, recent activity, achievements, and quick access to start a new diagnosis or continue an existing repair.

<img width="1359" height="590" alt="Image" src="https://github.com/user-attachments/assets/d0eb90d1-d416-4a79-b7fa-6a9a69500e70" />


🔗 **AI Diagnosis**

Users can upload an image, describe the problem, or combine both inputs to receive an AI powered diagnosis.

<img width="1366" height="605" alt="Image" src="https://github.com/user-attachments/assets/de941aca-fb2f-4c62-b599-2b43150ad3c6" />


🔗 **Guided Repair**

Step by step repair instructions with explanations, expected results, visual checklists, and safety guidance.

<img width="1366" height="610" alt="Image" src="https://github.com/user-attachments/assets/fe221181-da37-4bec-9aed-8f835d028f51" />

🔗 **Repair Companion**

An AI assistant that remains connected to the current repair session, allowing users to ask follow up questions, upload additional images, and receive context aware guidance.

<img width="1353" height="602" alt="Image" src="https://github.com/user-attachments/assets/8408a8cf-964a-43e8-91d7-6a27dbce2261" />

🔗 **Repair Completion**

A completion screen showing repair progress, achievements, estimated savings, and the option to download a repair report.

<img width="1366" height="600" alt="Image" src="https://github.com/user-attachments/assets/5c24a214-0211-411f-842c-97bee3bb99ab" />


🔗 **Future Improvements**

RepairLens AI has been designed with future expansion in mind. Planned improvements include:

- Support for additional appliance categories.
- More languages to improve accessibility.
- Offline diagnosis for selected repair workflows.
- Community verified repair guides.
- Voice guided repair assistance.
- Predictive maintenance recommendations.
- Integration with spare parts suppliers.
- Repair skill tracking and learning progress.

🔗 **Contributors**

This project was developed as part of the **Build with Gemma AI Hackathon 2026.**

🔗 **Team**

**- Adeniran Abdullahi**: Product Design, Frontend Development, AI Integration

🔗 **License**

This project is released under the MIT License.

See the "LICENSE" file for more information.

🔗 **Acknowledgements**

We would like to thank the following communities and technologies for supporting this project:

- Google DeepMind for developing Gemma 4.
- Google AI Studio for providing a rapid development environment.
- Firebase for authentication, database, and storage services.
- The organizers of the Build with Gemma AI Hackathon 2026 for creating this opportunity.
- Everyone who tested the prototype and provided valuable feedback.

🔗 **Contact**

For questions, feedback, or collaboration opportunities, please reach out through below medium.

[Twitter/X](https://x.com/TechAbdullahi)
[LinkedIn](https://www.linkedin.com/in/adeniran-abdullahi-204702363)

