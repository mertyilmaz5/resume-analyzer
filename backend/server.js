const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");

const app = express();
const port = 3001;

const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";
const ASSISTANT_ID = "YOUR_ASSISTANT_ID";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

app.post("/api/analyze-cv", upload.single("file"), async (req, res) => {
  const { positionSummary, position, language } = req.body;
  const filePath = req.file.path;
  const fileName = req.file.filename;
  const fileExtension = path.extname(fileName).toLowerCase();

  // Desteklenen dosya uzantıları
  const supportedExtensions = [".pdf", ".txt", ".docx"];

  // Desteklenmeyen dosya uzantısı hatası
  if (!supportedExtensions.includes(fileExtension)) {
    res.status(400).json({
      error: `Unsupported file type. Supported file types are: ${supportedExtensions.join(", ")}`,
    });
    return;
  }

  try {
    console.log("Starting analysis...");

    // Create Vector Store
    const vectorStoreResponse = await axios.post(
      "https://api.openai.com/v1/vector_stores",
      {
        name: "Resume Vector Store",
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );
    const vectorStoreId = vectorStoreResponse.data.id;

    console.log("Vector Store created with ID:", vectorStoreId);

    // Upload File and create File ID
    const fileUploadData = new FormData();
    fileUploadData.append("file", fs.createReadStream(filePath), fileName);
    fileUploadData.append("purpose", "assistants");

    const fileUploadResponse = await axios.post(
      "https://api.openai.com/v1/files",
      fileUploadData,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          ...fileUploadData.getHeaders(),
        },
      }
    );
    const fileId = fileUploadResponse.data.id;

    console.log("File uploaded with ID:", fileId);

    // Add file to Vector Store
    await axios.post(
      `https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`,
      {
        file_id: fileId,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );

    console.log("File added to Vector Store");

    // Create Thread with tool_resources
    const threadResponse = await axios.post(
      "https://api.openai.com/v1/threads",
      {
        tool_resources: {
          file_search: {
            vector_store_ids: [vectorStoreId],
          },
          code_interpreter: {
            file_ids: [fileId],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );

    const threadId = threadResponse.data.id;
    console.log("Thread created with ID:", threadId);

    // Create Message
    const createMessageResponse = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        role: "user",
        content: JSON.stringify({
          ResumeText: { file: fileId },
          JobSummary: positionSummary,
          Position: position,
          Language: language,
        }),
        attachments: [
          {
            file_id: fileId,
            tools: [
              { type: "code_interpreter" },
              { type: "file_search" }
            ]
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );

    console.log("Message response:", createMessageResponse.data);

    // Run Assistant
    const runResponse = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      {
        assistant_id: ASSISTANT_ID,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );

    console.log("Assistant run response:", runResponse.data);

    // Retrieve Run Response
    const runId = runResponse.data.id;
    let runStatus = "running";

    while (runStatus !== "completed") {
      const getRunResponse = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v2",
          },
        }
      );

      runStatus = getRunResponse.data.status;
      console.log("Run status:", runStatus);

      if (runStatus !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 saniye bekle
      }
    }

    // Get Assistant Response
    const getMessage = await axios.get(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );

    const assistantMessage = getMessage.data.data.find((message) => message.role === "assistant");

    const outputMessage = assistantMessage ? assistantMessage.content[0].text.value : "No response from assistant.";
    console.log("Output message: ");
    console.log(outputMessage);

    res.json({ analysis: outputMessage });

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Delete Vector Store
    await axios.delete(`https://api.openai.com/v1/vector_stores/${vectorStoreId}`, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    });

    // Delete File
    await axios.delete(`https://api.openai.com/v1/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    // Delete Thread
    await axios.delete(`https://api.openai.com/v1/threads/${threadId}`, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    });
  } catch (error) {
    console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error processing CV analysis" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
