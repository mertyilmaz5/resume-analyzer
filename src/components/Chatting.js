import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import ChatBot from 'react-simple-chatbot';
import FileUpload from './FileUpload';
import ProcessedBackendResponse from './ProcessedBackendResponse';
import '../styles/Chatting.css';

const Chatting = () => {
    const [file, setFile] = useState(null);
    const [userData, setUserData] = useState({});
    const [showChat, setShowChat] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    const handleFileUpload = (uploadedFile) => {
        setFile(uploadedFile);
    };

    const handleEnd = ({ steps }) => {
        const userInputs = {
            jobSummary: steps.job_summary.value,
            jobTitle: steps.job_title.value,
            language: steps.language.value,
            extraRequests: steps.extra_requests.value,
        };
        setUserData(userInputs);
        setFadeOut(true);

        setTimeout(() => {
            setShowChat(false);
        }, 3000);
    };

    const steps = [
        {
            id: '1',
            message: 'Welcome to the Resume Analyzer! Please upload your CV to get started.',
            trigger: 'resume',
        },
        {
            id: 'resume',
            waitAction: true,
            component: <FileUpload onFileUpload={handleFileUpload} />,
            trigger: '3',
        },
        {
            id: '3',
            message: 'Great! Now continue with the Job Summary. Please provide the Job Summary you are applying for.',
            trigger: 'job_summary',
        },
        {
            id: 'job_summary',
            user: true,
            trigger: '5',
        },
        {
            id: '5',
            message: 'Thank you! Can you please provide Job Title?',
            trigger: 'job_title'
        },
        {
            id: 'job_title',
            user: true,
            trigger: '7',
        },
        {
            id: '7',
            message: 'Which language would you like to use for your updated resume?',
            trigger: 'language'
        },
        {
            id: 'language',
            options: [
                { value: 'en', label: 'English', trigger: '9' },
                { value: 'tr', label: 'Turkish', trigger: '9' },
                { value: 'es', label: 'Spanish', trigger: '9' },
                { value: 'fr', label: 'French', trigger: '9' },
                { value: 'de', label: 'German', trigger: '9' },
                { value: 'ru', label: 'Russian', trigger: '9' },
                { value: 'zh', label: 'Chinese', trigger: '9' },
            ],
        },
        {
            id: '9',
            message: 'Wonderful! Have you any extra requests you would like to share?',
            trigger: 'extra_requests'
        },
        {
            id: 'extra_requests',
            user: true,
            trigger: 'end',
        },
        {
            id: 'end',
            message: 'Thank you! Your resume is being analyzed. Please wait a moment.',
            trigger: 'end-message',
        },
        {
            id: 'end-message',
            message: 'Your resume has been analyzed successfully. Click below to see the results.',
            end: true,
        }
    ];

    const chatbotStyle = {
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        height: '100%',
        width: '700px',
        margin: 'auto',
    };

    const theme = {
        background: '#F1F6F9',
        fontFamily: 'sans-serif',
        headerFontSize: '20px',
        botBubbleColor: '#212A3E',
        botFontColor: '#fff',
        userBubbleColor: '#526997',
        userFontColor: '#fff',
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                {showChat ? (
                    <div className={fadeOut ? 'chatbot-fade-out' : ''}>
                        <ChatBot
                            steps={steps}
                            headerTitle="Resume Analyzer"
                            hideHeader={true}
                            userAvatar={"https://img.icons8.com/?size=100&id=98957&format=png&color=000000"}
                            handleEnd={handleEnd}
                            style={chatbotStyle}
                        />
                    </div>
                ) : (
                    <ProcessedBackendResponse file={file} userData={userData} />
                )}
            </ThemeProvider>
        </div>
    );
}

export default Chatting;

