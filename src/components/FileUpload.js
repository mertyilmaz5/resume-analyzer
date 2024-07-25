import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const FileUpload = ({ onFileUpload, triggerNextStep = () => { } }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const fileInputRef = useRef(null);

    const handleClickChange = () => {
        setIsClicked(true);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : '');
    };

    const handleUpload = () => {
        if (file) {
            onFileUpload(file);
            triggerNextStep();
        }
        handleClickChange();
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        width: '90%',
    };

    const fileButtonStyle = {
        width: '30%',
        padding: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '5px',
    };

    const buttonStyle = {
        width: '20%',
        padding: '5px',
        cursor: 'pointer',
        backgroundColor: '#394867',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        display: isClicked ? 'none' : 'block',
    };

    const fileNameStyle = {
        fontStyle: 'italic',
        color: '#555',
    };

    return (
        <div style={containerStyle}>
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
            <button
                onClick={handleFileInputClick}
                style={fileButtonStyle}
            >
                Dosya Seç
            </button>
            <span style={fileNameStyle}>{fileName}</span>
            <button
                onClick={handleUpload}
                disabled={!file}
                style={{ ...buttonStyle, opacity: file ? 1 : 0.5 }}
            >
                Upload
            </button>
        </div>
    );
};

FileUpload.propTypes = {
    onFileUpload: PropTypes.func.isRequired,
    triggerNextStep: PropTypes.func,
};

export default FileUpload;