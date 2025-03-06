# 🎙️ Whisper Transcription App Documentation

## 📜 Overview

This application uses the [OpenAI Whisper AI model](https://github.com/openai/whisper) to transcribe audio (or audio extracted from video) files. It features a FastAPI backend with PostgreSQL for persistence and a local bucket for saving audio files. The frontend is built with Next.js 15 using TypeScript and styled with Tailwind CSS. The app supports full CRUD operations for managing transcriptions.

## 🏗️ Architecture

### Backend (FastAPI):

- **📝 Transcription Processing**: Uses the Whisper model to transcribe audio files.
- **📂 File Storage**: Saves audio files locally (in an uploads folder).
- **🗄️ Database**: Persists transcription data in a PostgreSQL database.
- **🔄 CRUD Operations**: Endpoints for creating, reading, updating, and deleting transcriptions.

### Frontend (Next.js 15):

- **💻 User Interface**: Built using TypeScript and Tailwind CSS for a modern and responsive design.
- **🔗 Interaction**: Allows users to upload files, record audio, view transcriptions, and manage entries through a dashboard.

## 🌟 Features

- **📤 Audio/Video Upload**: Users can upload audio or video files; if a video is uploaded, the app extracts the audio.
- **🎙️ Audio Recording**: Users can record audio directly from the browser.
- **📝 Transcription Generation**: Uses the Whisper model to process audio and generate a transcription.
- **🔄 CRUD Operations**: Complete create, read, update, and delete functionality for managing transcriptions.
- **🔊 Audio Playback & Visualization**: Audio files are served from a local bucket and can be played back, with integrated waveform visualization using Wavesurfer.
- **📱 Responsive Design**: The UI is built with Tailwind CSS ensuring a responsive and modern user experience.

## 🛠️ How to Use the App

### 📤 Upload/Record Audio:

- Use the upload form to select a file or record audio directly in the browser.
- Upon submission, the file is processed by the Whisper model.

### 📄 View Transcriptions:

- The dashboard displays a list of transcriptions with metadata (file name, creation date, etc.).
- Click on an entry to see detailed transcription and play the corresponding audio.

### 🛠️ Manage Transcriptions:

- Use the provided controls to update or delete transcriptions.

## 🎥 Demo

Below is a GIF demonstrating the application in action:

## 📂 Clone Repository:

```sh
git clone https://github.com/noslenPantaleon/transcription-app.git
cd yourproject/backend
```

## 🐍 Create a Virtual Environment:

```sh
python -m venv venv
```

Activate the virtual environment:

- **Windows**:
  ```sh
  venv\Scripts\activate
  ```
- **Mac/Linux**:
  ```sh
  source venv/bin/activate
  ```

Install dependencies from the provided `requirements.txt`:

```sh
pip install -r requirements.txt
```

## 🧠 Install Whisper AI:

```sh
pip install openai-whisper
```

For more information, visit the [Whisper GitHub repository](https://github.com/openai/whisper).

## 🗄️ Configure PostgreSQL and Alembic:

Set up your PostgreSQL database and update your database URL in your configuration. Alembic is used for migrations. If you haven't initialized Alembic yet, run:

```sh
alembic init alembic
```

Generate and apply migrations:

```sh
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## 🚀 Run the FastAPI Application:

```sh
cd backend/src/
fastapi dev main.py
```

## 💻 Frontend Setup (Next.js 15 with TypeScript and Tailwind CSS)

1. Navigate to the Frontend Directory:

   ```sh
   cd yourproject/frontend
   ```

2. Install Dependencies:

   ```sh
   yarn add
   ```

3. Run the Development Server:

   ```sh
   yarn dev
   ```

4. Tailwind CSS and TypeScript:

The project is preconfigured with Tailwind CSS for styling and TypeScript for type safety. Check the `tailwind.config.js` file for custom configurations and the `tsconfig.json` for TypeScript settings.

## 🚀 Deployment

For deploying your project online, you can host the FastAPI backend on a free tier. Note that the Whisper model is resource-intensive, so performance on free tiers may vary. Here are some recommended free backend services:

- **🚂 [Railway](https://railway.app/)**: Offers a free tier suitable for lightweight FastAPI applications.
- **🚀 [Render](https://render.com/)**: Provides free web services that can host your FastAPI app.
- **🛫 [Fly.io](https://fly.io/)**: Also offers a free tier and supports containerized deployments.

Each platform has its own setup process; for example, Railway lets you connect your GitHub repository, set environment variables (like your PostgreSQL connection string), and deploy directly.
