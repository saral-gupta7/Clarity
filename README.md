# Clarity

Clarity is a modern, full-stack web application for creating, sharing, and managing forms. It provides a seamless experience for both administrators (who create and manage forms) and users (who fill out and submit forms). Built with Next.js, Prisma, and a modern UI, Clarity is designed for simplicity, security, and scalability.

---

## Features

### For Admins

- **Admin Registration & Login:** Secure authentication for form creators.
- **Dashboard:** View and manage all your forms and their responses.
- **Form Creation:** Easily create new forms with customizable questions.
- **Response Management:** View and analyze user submissions for each form.

### For Users

- **Public Form Access:** Fill out forms via unique public URLs.
- **Instant Submission:** Submit responses quickly and securely.

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL (hosted on [Supabase](https://supabase.com/))
- **Authentication:** Custom (admin only)
- **ORM:** Prisma
- **Package Manager:** [pnpm](https://pnpm.io/) (recommended)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/saral-gupta7/clarity.git
cd clarity
```

### 2. Install pnpm (if you don't have it already)

You can install pnpm globally using npm:

```bash
npm install -g pnpm
```

For more installation options, see the [pnpm documentation](https://pnpm.io/installation).

### 3. Install Dependencies

```bash
pnpm install
```

> Or use `npm install` or `yarn install` if you prefer, but pnpm is recommended.

### 4. Configure Environment Variables

Create a `.env` file in the root directory and add your database connection string. You can obtain the `DATABASE_URL` for your PostgreSQL database from your [Supabase](https://supabase.com/) project settings:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

### 5. Set Up the Database

Run Prisma migrations to set up your database schema:

```bash
npx prisma migrate deploy
```

Or, for development:

```bash
npx prisma migrate dev
```

### 6. Start the Development Server

```bash
pnpm dev
```

> The app will be available at [http://localhost:3000](http://localhost:3000)

---

## Usage

### Admin Workflow

1. **Register:** Go to `/admin/register` to create an admin account.
2. **Login:** Access `/admin/login` to log in.
3. **Dashboard:** After login, you’ll be redirected to your dashboard (`/admin/[adminId]/dashboard`).
4. **Create Forms:** Use the dashboard to create new forms.
5. **Share Forms:** Each form has a unique public URL you can share with users.
6. **View Responses:** See all submissions for your forms in the dashboard.

### User Workflow

1. **Access Form:** Visit the public URL provided by the admin (e.g., `/forms/[publicUrl]`).
2. **Fill & Submit:** Complete the form and submit your response.
3. **Confirmation:** Receive instant feedback upon successful submission.

---

## Project Structure

```
app/
  (admin)/         # Admin pages (register, login, dashboard)
  (users)/         # User-facing form pages
  api/             # API routes for forms, admin, submissions
components/        # Reusable React components
lib/               # Prisma client and schema
prisma/            # Prisma schema and migrations
public/            # Static assets
```

---

## Customization

- **Styling:** Modify `app/globals.css` or use Tailwind classes in components.
- **Database:** Update `prisma/schema.prisma` to change models, then run migrations.
- **Components:** Add or edit components in `components/` as needed.

---

## Database Design Approach

The database for Clarity is designed using [Prisma ORM](https://www.prisma.io/) and is hosted on Supabase (PostgreSQL). The schema is normalized to ensure data integrity and scalability, with clear relationships between entities:

- **Admin:** Represents form creators. Each admin can create multiple forms.
- **Form:** Each form belongs to an admin and contains multiple questions. Forms have a unique public URL for sharing.
- **Question:** Each question is linked to a form. Questions define the structure of the form (e.g., text, multiple choice).
- **Response:** Represents a user's submission to a form. Each response is linked to a form and contains multiple answers.
- **Answer:** Each answer is linked to a response and a specific question, storing the user's input for that question.

This relational structure allows:

- Efficient querying of all responses for a form
- Easy retrieval of all questions for a form
- Linking each answer to both the question and the response for detailed analytics
- Cascade deletion (e.g., deleting a form removes its questions, responses, and answers)

The schema is defined in `prisma/schema.prisma`, and migrations are managed using Prisma Migrate.

---
