# 🛡️ TruthLens AI

> An AI-powered misinformation awareness platform that helps users identify fake news, understand deepfakes, improve media literacy, and make informed decisions before sharing online content.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌐 Live Demo

**Website:** https://truthlens-ai-virid.vercel.app

**GitHub Repository:** https://github.com/pahwasiya26-source/S-09-Online-Misinformation-Awareness-Campaign-for-Young-Adults
## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)
## 📖 Project Overview

TruthLens AI is an interactive web platform developed as part of the **Chandigarh University Summer of Code (CUSoC) – S-09: Online Misinformation Awareness Campaign for Young Adults**.

The platform is designed to help users recognize misinformation, identify fake news, understand deepfake technology, and develop stronger media literacy skills through interactive learning experiences.

Instead of simply informing users about misinformation, TruthLens AI enables them to **analyze, verify, learn, and practice** using AI-assisted tools, educational resources, quizzes, and trusted fact-checking platforms.

The project combines awareness, education, and technology into a single platform that encourages responsible digital behavior.

---

## ❗ Problem Statement

Every day, millions of people consume and share information through social media platforms such as WhatsApp, Instagram, Facebook, X (Twitter), and YouTube. Unfortunately, false information spreads much faster than verified facts.

Young adults are among the most active internet users, making them particularly vulnerable to:

- Fake news
- Deepfake videos
- Manipulated images
- Clickbait headlines
- Health misinformation
- Financial scams
- Political misinformation

TruthLens AI addresses this challenge by providing a centralized platform where users can:

- Verify suspicious news
- Learn how misinformation spreads
- Discover trusted fact-checking websites
- Test their media literacy through quizzes
- Explore educational resources
- Stay informed through a newsletter
## ✨ Key Features

### 🔍 AI-Powered News Verification
- Analyze suspicious news articles and headlines.
- Receive an AI-generated credibility assessment.
- Learn why the content may be reliable or misleading.

### 🎭 Deepfake Awareness
- Understand how deepfake technology works.
- Learn practical techniques to identify manipulated videos and images.
- Explore common warning signs used by fact-checkers.

### 🌐 URL Credibility Checker
- Check whether a website URL appears trustworthy.
- Identify suspicious domains and unsafe website patterns.
- Encourage users to verify sources before sharing information.

### 🧠 Interactive Media Literacy Quiz
- Test knowledge through multiple-choice questions.
- Receive instant feedback and explanations.
- Download a completion certificate after finishing the quiz.

### 📚 Learning Resources
- Explore carefully curated articles and educational materials.
- Download learning resources for offline reading.
- Copy important information for quick reference.

### 📰 Trusted Fact-Checking Platforms
Quick access to reliable fact-checking organizations including:

- BOOM Live
- Alt News
- PIB Fact Check
- Google Fact Check Explorer
- Snopes

### 📧 Newsletter Subscription
- Subscribe using Supabase-powered backend.
- Receive updates about misinformation awareness and media literacy.

### 📱 Responsive User Interface
- Optimized for desktop, tablet, and mobile devices.
- Modern glassmorphism-inspired UI.
- Smooth animations and interactive experience.
## 🏗️ Architecture
                         ┌──────────────────────┐
                         │        User          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                     ┌────────────────────────────┐
                     │      TruthLens AI UI       │
                     │    (React + TypeScript)    │
                     └──────────┬─────────────────┘
                                │
          ┌─────────────────────┼──────────────────────┐
          │                     │                      │
          ▼                     ▼                      ▼
 ┌────────────────┐   ┌─────────────────┐   ┌──────────────────┐
 │ Verify News    │   │ Media Literacy  │   │ Learning Resources│
 │ Tool           │   │ Quiz            │   │ & Fact Platforms  │
 └────────────────┘   └─────────────────┘   └──────────────────┘
          │                     │                      │
          └─────────────────────┼──────────────────────┘
                                │
                                ▼
                  ┌──────────────────────────────┐
                  │ Supabase Backend (Newsletter)│
                  └──────────────────────────────┘
   The application follows a simple client-server architecture.

- **Frontend:** Built using React, TypeScript, and Vite to provide a fast and responsive user interface.
- **Interactive Modules:** Users can verify news, explore fact-checking resources, complete quizzes, and learn about deepfakes.
- **Backend:** Supabase is used to manage newsletter subscriptions and data storage.
- **External Resources:** Trusted fact-checking organizations provide reliable verification sources for users.
## 🛠 Technology Stack

| Category | Technology |
|-----------|------------|
| Frontend | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | CSS3 |
| Backend Services | Supabase |
| Database | Supabase PostgreSQL |
| Deployment | Vercel |
| Version Control | Git & GitHub |
## 📂 Project Structure

```
TruthLens-AI/
│
├── src/
│   ├── components/        # Reusable React components
│   ├── lib/               # Supabase configuration
│   ├── App.tsx            # Main application
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styling
│
├── public/
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md
└── LICENSE
```
## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or above)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/pahwasiya26-source/S-09-Online-Misinformation-Awareness-Campaign-for-Young-Adults.git

# Navigate into the project
cd S-09-Online-Misinformation-Awareness-Campaign-for-Young-Adults

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:

```
http://localhost:5173
```
## 🌍 Deployment

The application is deployed on **Vercel**.

### Production URL

https://truthlens-ai-virid.vercel.app

### Build Command

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```
## 🛣️ Future Roadmap

Planned improvements include:

- AI-powered misinformation detection using LLMs
- Reverse Image Search integration
- Multi-language support
- User authentication
- Personal learning dashboard
- Community discussion forum
- Dark/Light theme toggle
- Advanced misinformation analytics
- Mobile application
- Admin dashboard for content management
## 🤝 Contributing

Contributions are welcome.

If you'd like to improve TruthLens AI:

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes using meaningful commit messages.
4. Push your branch.
5. Open a Pull Request.

Please ensure that your code follows existing project structure and coding standards.
## 👩‍💻 Author

**Siya Pahwa**

Chandigarh University Summer of Code (CUSoC)

Project: **S-09 – Online Misinformation Awareness Campaign for Young Adults**
## 📄 License

This project is licensed under the **MIT License**.

See the LICENSE file for more information.
               
