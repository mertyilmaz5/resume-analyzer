import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import { Typewriter } from 'react-simple-typewriter';
import '../styles/ProcessedBackendResponse.css';

const ProcessedBackendResponse = ({ file, userData }) => {
    const [generalAnalysis, setGeneralAnalysis] = useState([]);
    const [positivePoints, setPositivePoints] = useState([]);
    const [negativePoints, setNegativePoints] = useState([]);
    const [suggestionsForImprovement, setSuggestionsForImprovement] = useState([]);
    const [updatedCV, setUpdatedCV] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const submitFormData = async () => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('positionSummary', userData.jobSummary);
            formData.append('position', userData.jobTitle);
            formData.append('language', userData.language);
            formData.append('extraRequests', userData.extraRequests);

            try {
                const result = await axios.post('http://localhost:3001/api/analyze-cv', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                handleBackendResponse(result.data.analysis);
            } catch (err) {
                setError('An error occurred while processing your request.');
            } finally {
                setLoading(false);
            }
        };

        submitFormData();
    }, [file, userData]);

    const handleBackendResponse = (data) => {
        const parsedData = JSON.parse(data);
        setGeneralAnalysis(parsedData.GeneralAnalysis || []);
        setPositivePoints(parsedData.PositivePoints || []);
        setNegativePoints(parsedData.NegativePoints || []);
        setSuggestionsForImprovement(parsedData.SuggestionsForImprovement || []);
        setUpdatedCV(parsedData.UpdatedCV || {});
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <img src="https://miro.medium.com/v2/resize:fit:800/1*hFwwQAW45673VGKrMPE2qQ.png" alt="Error" style={{ width: '700px', marginTop: '20px' }} />
            </div>
        );
    }

    return (
        <>
            <div className="a4-document">
                <h2 className="document-title">Your Resume Report</h2>
                <hr style={{ borderTop: '8px solid #bbb', borderRadius: '5px' }} />
                {Array.isArray(generalAnalysis) && generalAnalysis.length > 0 && (
                    <div>
                        <h3 className="section-title">General Analysis</h3>
                        <ul className="content-list">
                            {generalAnalysis.map((item, index) => (
                                <li key={index} className="content-item">
                                    <Typewriter
                                        words={[`✍ ${item}`]}
                                        loop={1}
                                        typeSpeed={70}
                                        delaySpeed={1000}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <hr style={{ borderTop: '3px dashed #bbb' }} />
                {Array.isArray(positivePoints) && positivePoints.length > 0 && (
                    <div>
                        <h3 className="section-title">Positive Points</h3>
                        <ul className="content-list">
                            {positivePoints.map((item, index) => (
                                <li key={index} className="content-item">
                                    <Typewriter
                                        words={[`👍 ${item}`]}
                                        loop={1}
                                        typeSpeed={70}
                                        delaySpeed={1000}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <hr style={{ borderTop: '3px dashed #bbb' }} />
                {Array.isArray(negativePoints) && negativePoints.length > 0 && (
                    <div>
                        <h3 className="section-title">Negative Points</h3>
                        <ul className="content-list">
                            {negativePoints.map((item, index) => (
                                <li key={index} className="content-item">
                                    <Typewriter
                                        words={[`👎 ${item}`]}
                                        loop={1}
                                        typeSpeed={70}
                                        delaySpeed={1000}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <hr style={{ borderTop: '3px dashed #bbb' }} />
                {Array.isArray(suggestionsForImprovement) && suggestionsForImprovement.length > 0 && (
                    <div>
                        <h3 className="section-title">Suggestions for Improvement</h3>
                        <ul className="content-list">
                            {suggestionsForImprovement.map((item, index) => (
                                <li key={index} className="content-item">
                                    <Typewriter
                                        words={[`🔝 ${item}`]}
                                        loop={1}
                                        typeSpeed={70}
                                        delaySpeed={1000}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {updatedCV && Object.keys(updatedCV).length > 0 && (
                    <div>
                        <h3 className="section-title" style={{ marginTop: '20px' }}>Your Updated Resume</h3>
                        <hr style={{ borderTop: '8px solid #bbb', borderRadius: '5px' }} />
                        {Object.entries(updatedCV).map(([section, items], sectionIndex) => (
                            <div key={sectionIndex}>
                                <h4 className="cv-section-title">📌{section}</h4>
                                <ul className="content-list">
                                    {items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="content-item">
                                            <Typewriter
                                                words={[`${item.Name}, ${item.Description} ${item.Date ? `(${item.Date})` : ''}`]}
                                                loop={1}
                                                typeSpeed={50}
                                                delaySpeed={2000}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="refresher">
                <p>Refresh the page to analyze another resume.</p>
                <button onClick={() => window.location.reload()} className="refresh-button">⟳</button>
            </div>
        </>
    );
};

export default ProcessedBackendResponse;
