# Admin Dashboard with Next.js & Stack Auth

<div align="center">

<div>
<img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
<img src="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
<img src="https://img.shields.io/badge/-PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
<img src="https://img.shields.io/badge/-Stack Auth-FF6B6B?style=for-the-badge&logo=stackauth&logoColor=white" alt="Stack Auth" />
<img src="https://img.shields.io/badge/-Lucide Icons-FD4D4D?style=for-the-badge&logo=lucide" alt="Lucide Icons" />
</div>


<br />
</div>

## 📋 Table of Contents

1. [Introduction](#-introduction)
2. [Tech Stack](#-tech-stack)
3. [Features](#-features)
4. [Quick Start](#-quick-start)
5. [Screenshots](#-screenshots)
6. Role & Responsibility

---

## 🚀 Introduction

Planora is a full-stack travel management and booking application built with Next.js, Prisma, PostgreSQL, TailwindCSS, and OpenAI integration.
It allows users to explore global destinations, browse curated travel packages, and instantly book trips with a clean and modern user interface.

Designed as an all-in-one personal travel dashboard, Planora helps users manage their past, current, and upcoming international trips with ease — offering real-time insights, automated booking features, and smart AI assistance.

🎥 Watched a youtube tutorial and created the a similar project but different
Reference- https://www.youtube.com/watch?v=L5CsIkO5xv4

---

## ⚙️ Tech Stack

- **Next.js 15** – React framework with App Router and Server Components
- **React 19** – Component-based UI development with latest features
- **TailwindCSS** – Utility-first CSS for modern styling
- **Stack Auth** – Modern authentication solution (replaces NextAuth.js)
- **Prisma** – Type-safe database ORM with migrations
- **PostgreSQL** – Robust relational database
- **Lucide Icons** – Clean and beautiful icon pack
- **Recharts** – Data visualization for analytics
- **TypeScript** – Type safety and enhanced developer experience
- **Vercel** – Deployment and hosting platform

---

## ⚡️ Features

- 🔐 **Modern Authentication** - Secure user registration and login with Stack Auth
- 📊 **Dashboard Analytics** - Real-time metrics, charts, and trips insights
- 📦 **Trip Management** - Complete CRUD operations for trips detail
- 🔍 **Search & Filtering** - Find products quickly with search functionality
- 📄 **Pagination** - Efficient data loading for large data
- 💰 **Value Tracking** - Monitor total trips detail and financial metrics
- 📈 **Visual Analytics** - Interactive charts showing trips trends
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🎨 **Modern UI** - Clean, professional interface with TailwindCSS
- 🚀 **Server Actions** - Form handling with Next.js Server Actions
- 🔄 **Real-time Updates** - Instant UI updates after data changes
- **OpenAI**- Integrated openAI for trip detail search assitance.

---

## 👌 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [PostgreSQL Database](https://www.postgresql.org/) (Neon)

### Clone and Run

```bash
git clone https://github.com/2025-Fall-ITE-5425-0TA/project-planora.git
cd project-planora
npm install
```

### Environment Setup

1. Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/dbName"
NEXT_PUBLIC_STACK_PROJECT_ID="your_stack_project_id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your_publishable_key"
STACK_SECRET_SERVER_KEY="your_secret_key"

OPENAI_API_KEY=You Key Here
```

2. Set up your database:

```bash
npx prisma migrate dev
npx prisma generate
```

3. Start the development server:

```bash
npm run dev
```

The app will be available at: [http://localhost:3000](http://localhost:3000)

---

## 🖼️ Screenshots


<img width="1875" height="917" alt="image" src="https://github.com/user-attachments/assets/a6e2eb04-16de-4402-8059-eec72c801915" />
<img width="1886" height="748" alt="image" src="https://github.com/user-attachments/assets/1ac70f8c-1720-491f-b0d2-c5aa24bfb175" />
<img width="1380" height="926" alt="image" src="https://github.com/user-attachments/assets/7db96a3f-8017-471a-92af-fd79681c81ed" />
<img width="1872" height="813" alt="image" src="https://github.com/user-attachments/assets/a4dd4497-378c-4053-8c9f-2f4ff932adf1" />
<img width="1817" height="736" alt="image" src="https://github.com/user-attachments/assets/8eb80626-850e-4419-89a1-b6c6ecbc1a59" />
<img width="1857" height="837" alt="image" src="https://github.com/user-attachments/assets/654fad77-47ac-4b36-acc9-70cf34cae730" />
---


## Roles & Responsibilities ##

Team Member	Responsibilities

Aszad Khan	• Sign-in page
		• Sign-up page
		• Stack authentication
		• Settings page
		• AI assistance page
		• Profile page
		• Multi-factor authentication (MFA)
		• Sidebar
		• Modern UI design
		• Real-time updates
		• Integration with Neon Database

Aviral		• Dashboard page
		• Total trip page
		• Database integration on Total Trip page
		• CRUD functionality for trip management

Ritesh		• Destination page
		• Slug page (dynamic routing)
		• Pagination functionality
		• Search and filtering functionality

Dhaval		• Add Trips page
		• Value tracking
		• Visual analytics
		• Responsive design


## Credential ##
User- aszadk@gmail.com
Password- Web4Aszad

User - aszadk2@gmail.com
Password- Web2Aszad2

