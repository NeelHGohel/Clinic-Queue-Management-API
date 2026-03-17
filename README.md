# Clinic Queue Management System

A full-stack clinic management application built with React, Material-UI, and Axios. This system allows clinics to manage patient appointments, doctor queues, and medical records efficiently.

## Features

- **Role-Based Access Control**: Separate dashboards for Admins, Doctors, Receptionists, and Patients.
- **Admin Dashboard**: Manage clinic staff and patients.
- **Doctor Module**: View daily queues, add prescriptions, and generate medical reports.
- **Receptionist View**: Manage live queues and update patient status (Waiting, In-Progress, Done).
- **Patient Portal**: Book appointments and view personal medical history/reports.

## Tech Stack

- **Frontend**: React.js, Vite
- **UI Framework**: Material-UI (MUI)
- **API Integration**: Axios with JWT Authentication
- **State Management**: React Context API

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Build for production: `npm run build`

## Project Structure

- `src/components`: Reusable UI components (Layout, ProtectedRoutes).
- `src/context`: Authentication state management.
- `src/pages`: Role-specific view components.
- `src/services`: API service layers for modular backend interaction.
