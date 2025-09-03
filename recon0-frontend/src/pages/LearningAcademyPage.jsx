import React from 'react';
import { Link } from 'react-router-dom';

// --- Hardcoded Content for the Learning Academy ---
const learningContent = [
    {
        category: 'Beginner Path: Web Security Fundamentals',
        articles: [
            {
                title: 'Introduction to HTTP & Web Applications',
                description: 'Understand the basic protocol that powers the web and how client-server communication works.',
                content: 'HTTP, or Hypertext Transfer Protocol, is the foundation of data communication for the World Wide Web...'
            },
            {
                title: 'Common Vulnerabilities: Cross-Site Scripting (XSS)',
                description: 'Learn how attackers can inject malicious scripts into web pages viewed by other users.',
                videoUrl: 'https://www.youtube.com/embed/cbmBDi_ePLg' // Example video
            },
            {
                title: 'Essential Tools for Bug Hunters',
                description: 'An overview of indispensable tools like Burp Suite, OWASP ZAP, and browser developer tools.',
                content: 'No bug hunter can succeed without the right tools. Burp Suite is an industry-standard proxy...'
            }
        ]
    },
    {
        category: 'Beginner Path: Recon Techniques',
        articles: [
            {
                title: 'Subdomain Enumeration',
                description: 'Discover hidden subdomains of a target to expand your attack surface and find potential vulnerabilities.',
                content: 'Subdomain enumeration is a critical first step in reconnaissance. Tools like sublist3r, Amass, and findomain can automate this process...'
            },
            {
                title: 'Information Gathering with Google Dorking',
                description: 'Leverage advanced Google search operators to find sensitive information and login pages that are not meant to be public.',
                content: 'Google Dorking, or Google hacking, uses specialized search queries to find information that is not easily accessible...'
            }
        ]
    }
];
// --- End of Hardcoded Content ---

const LearningAcademyPage = () => {
    return (
        <div className="container mt-5">
            <h2 className="mb-4">Learning Academy</h2>
            <p className="text-muted mb-5">Your starting point for becoming a successful security researcher. Master the fundamentals and learn advanced techniques.</p>

            {learningContent.map((section, index) => (
                <div key={index} className="mb-5">
                    <h3 className="mb-4 section-title">{section.category}</h3>
                    <div className="row g-4">
                        {section.articles.map((article, articleIndex) => (
                            <div key={articleIndex} className="col-md-6">
                                <div className="card h-100 shadow-sm learning-card">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{article.title}</h5>
                                        <p className="card-text flex-grow-1">{article.description}</p>
                                        {article.videoUrl && (
                                            <div className="ratio ratio-16x9 mb-3">
                                                <iframe 
                                                    src={article.videoUrl} 
                                                    title={article.title} 
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                    allowFullScreen>
                                                </iframe>
                                            </div>
                                        )}
                                        <Link to="#" className="btn btn-outline-primary mt-auto align-self-start">Read More</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
             <style>{`
                .section-title {
                    border-left: 4px solid #34d399; /* Primary accent color */
                    padding-left: 1rem;
                }
                .learning-card {
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                }
                .learning-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
                }
            `}</style>
        </div>
    );
};

export default LearningAcademyPage;
