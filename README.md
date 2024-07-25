# Resume Analyzer Chatbot

## Overview

This project is a Resume Analyzer chatbot built using React for the frontend and Node.js with Express for the backend. The chatbot helps users upload their CVs and analyze them based on various inputs. The backend uses the OpenAI API to process the CV and provide insights.

## Frontend

### `Chatting.js`

The main component of the frontend is `Chatting.js`. It utilizes the `react-simple-chatbot` library to create a conversational UI where users interact with the bot to upload their CV and provide additional details. Key features include:

- **File Upload**: A component that handles file selection and uploads the CV file to the backend.
- **User Input Handling**: Collects job summary, job title, preferred language, and extra requests from the user.
- **Processed Backend Response**: A component that handles displaying the analysis results from the backend once the CV has been processed.

### Installation (Frontend)

1. Clone the repository:

   ```bash
   git clone https://github.com/mertyilmaz5/resume-analyzer.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

## Backend

### `server.js`

The backend server is implemented in `server.js` using Express and Multer for handling file uploads. The server processes the uploaded CV using the OpenAI Assistants API and provides a response with analysis results. Key features include:

- **File Upload Handling**: Uses Multer to handle file uploads and checks for supported file types.
- **OpenAI Assistants API Integration**: Communicates with OpenAI's Assistants API to create vector stores, upload files, and analyze the CV.
- **Asynchronous Operations**: Uses Axios to manage API requests and handle responses.

### Installation (Backend)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create an "uploads" directory:

   ```bash
   mkdir uploads
   ```

4. Start the server:

   ```bash
   node server.js
   ```

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key.
- `ASSISTANT_ID`: The ID of the OpenAI assistant.

### Assistant Instructions

You are a career advisor. Analyze the resume content below and provide feedback based on these parameters: "Resume Text (Resume Content or Uploaded File)", "Job Summary", "Position".

Then make your suggested corrections in the specified "Language" and update the resume content to better match the "Job Summary" and "Position" in an organized form using headers to group the content.

The output format should be a JSON object like this:

{
  "GeneralAnalysis": [
    "Sentence 1",
    "Sentence 2",
    ...
  ],
  "PositivePoints": [
    "Sentence 1",
    "Sentence 2",
    ...
  ],
  "NegativePoints": [
    "Sentence 1",
    "Sentence 2",
    ...
  ],
  "SuggestionsForImprovement": [
    "Sentence 1",
    "Sentence 2",
    ...
  ],
  "UpdatedCV": {
    "Section Name (e.g., Professional Experience)": [
      {
        "Name": "Job Title",
        "Description": "Detailed description of the job",
        "Date": "Start Date - End Date"
      },
      ...
    ],
    "Section Name (e.g., Education)": [
      {
        "Name": "Degree Title",
        "Description": "Detailed description of the degree or education",
        "Date": "Start Date - End Date"
      },
      ...
    ]
  }
}

Ensure that all feedback and updates are comprehensive and relevant to the provided resume content, job summary, and position.

Note: The output must be strictly in JSON format as specified. In "UpdatedCV" part, JSON must contain "Name", "Description", "Date" keys in every "Section Name". Their value should be in the requested language.

## Usage

1. Start both the frontend and backend servers.
2. Open the frontend in your browser (usually at `http://localhost:3000`).
3. Interact with the chatbot to upload your CV and provide the necessary details.
4. The backend will process the CV and return analysis results, which will be displayed in the chat interface.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
