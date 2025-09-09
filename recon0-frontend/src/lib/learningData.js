// This file acts as a mini-database for all learning content.
// To add a new article, simply add a new object to this array.

// TODO: Replace placeholder image URLs with your own assets.
// Recommended image size for hero images is 1200x600.
// Recommended size for inline diagrams is 800x400.

export const learningContent = [
    {
        id: 'intro-to-http',
        title: 'Introduction to HTTP & Web Applications',
        author: 'Admin',
        date: 'September 1, 2025',
        category: 'Web Security Fundamentals',
        difficulty: 'Beginner',
        heroImage: 'https://placehold.co/1200x600/E2E8F0/475569?text=HTTP+Protocol',
        description: 'Understand the basic protocol that powers the web and how client-server communication works.',
        content: [
            { type: 'paragraph', text: 'HTTP, or Hypertext Transfer Protocol, is the foundation of data communication for the World Wide Web. It functions as a request-response protocol in the client-server computing model. In this model, a client (like your web browser) submits an HTTP request message to a server (the website you\'re visiting). The server, which stores content, or resources, such as HTML files, images, and videos, returns a response message to the client. The response contains completion status information about the request and may also contain requested content in its message body.' },
            { type: 'heading', text: 'Anatomy of an HTTP Request' },
            { type: 'paragraph', text: 'An HTTP request consists of several parts:' },
            { type: 'list', items: ['Request Line: Includes the HTTP method (e.g., GET, POST), the request URI (the path to the resource), and the HTTP version.', 'Headers: Key-value pairs that provide additional information about the request, like the User-Agent, Acceptable content types, and cookies.', 'Message Body (Optional): Contains data being sent to the server, typically used with POST or PUT methods.'] },
            { type: 'code', code: `GET /index.html HTTP/1.1\nHost: www.example.com\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36` },
            { type: 'paragraph', text: 'Understanding how to read and manipulate these requests is the absolute core of bug bounty hunting. Tools like Burp Suite act as a proxy, allowing you to intercept, inspect, and modify these requests before they reach the server.' },
            { type: 'image', src: 'https://placehold.co/800x400/3B82F6/FFFFFF?text=Client-Server+Request-Response', alt: 'Client-Server Diagram' },
        ]
    },
    {
        id: 'xss-deep-dive',
        title: 'Deep Dive: Cross-Site Scripting (XSS)',
        author: 'Admin',
        date: 'September 3, 2025',
        category: 'Web Security',
        difficulty: 'Intermediate',
        videoId: '3Kq1MIfTWCE?si=bKu2cze1wjfVTMba',
        description: 'Go beyond the basics of XSS. Learn about stored, reflected, and DOM-based XSS with practical examples.',
        content: [
           { type: 'paragraph', text: 'Cross-Site Scripting (XSS) is one of the most common vulnerabilities found in web applications. It occurs when an attacker is able to inject a malicious script (typically JavaScript) into content that is then delivered to a victim\'s browser. The victim\'s browser trusts the script because it appears to come from a legitimate source, allowing the script to access cookies, session tokens, or other sensitive information, or even rewrite the HTML on the page.' },
           { type: 'heading', text: 'The Three Types of XSS' },
           { type: 'list', items: ['Reflected XSS: The malicious script is part of the request sent to the web server and is "reflected" back in the HTTP response. A common example is in a search query where the search term is displayed on the results page.', 'Stored XSS: The malicious script is permanently stored on the target server, such as in a database comment field or a user profile page. When a user visits the page, the script is served to their browser.', 'DOM-based XSS: The vulnerability exists in the client-side code (the Document Object Model) itself. The server is not directly involved; the page\'s own script modifies the page in an unsafe way based on user input.'] },
           { type: 'paragraph', text: 'The key to finding XSS is to identify every point where user-supplied data is reflected back on the page and test whether you can break out of the intended context and execute JavaScript.' },
        ]
    },
    {
        id: 'api-hacking-intro',
        title: 'Introduction to API Hacking',
        author: 'Admin',
        date: 'September 5, 2025',
        category: 'API Security',
        difficulty: 'Intermediate',
        videoId: 'uIkxsBgkpj8?si=bZXYOS8FpspkOy83',
        description: 'APIs are a critical attack surface. Understand common API vulnerabilities like BOLA, Mass Assignment, and excessive data exposure.',
        content: [
            { type: 'paragraph', text: 'APIs (Application Programming Interfaces) are the backbone of modern applications, especially mobile and single-page applications (SPAs). Securing them is critical, and they present a unique attack surface. API vulnerabilities often differ from traditional web vulnerabilities.' },
            { type: 'heading', text: 'Common API Vulnerabilities (OWASP API Security Top 10)' },
            { type: 'list', items: ['Broken Object Level Authorization (BOLA): The most common API flaw. This occurs when an endpoint like `/api/users/{id}/data` doesn\'t properly check if the logged-in user is authorized to view the data for the requested `id`.', 'Broken Authentication: Weak or improperly implemented authentication mechanisms that can be bypassed.', 'Excessive Data Exposure: The API endpoint returns more data in its response than the client application actually displays. An attacker can intercept the traffic to see this sensitive hidden data.'] },
            { type: 'paragraph', text: 'When testing APIs, your primary tool will be a proxy like Burp Suite. The goal is to understand the intended functionality by observing legitimate requests and then manipulate those requests to trigger unintended behavior.' },
        ]
    },
    {
        id: 'idor-basics',
        title: 'Insecure Direct Object References (IDOR)',
        author: 'Admin',
        date: 'September 8, 2025',
        category: 'Web Security',
        difficulty: 'Beginner',
        videoId: 'lZAoFs75_cs?si=M5tSOghHk-BWw7Z1',
        description: 'Learn how to spot and exploit IDORs to access data you\'re not supposed to see. One of the most common and impactful bug types.',
        content: [
            { type: 'paragraph', text: 'IDOR stands for Insecure Direct Object Reference. It is a type of access control vulnerability that arises when an application provides direct access to objects based on user-supplied input. As a result, attackers can bypass authorization and access resources in the system directly, for example database records or files.' },
            { type: 'heading', text: 'How to Find IDORs' },
            { type: 'paragraph', text: 'Look for any user-supplied identifier in the URL, request body, or headers. These can be numeric IDs, usernames, or even filenames. For example, if your profile page is at `/profile?id=123`, try changing the `id` to `124`. If you can see another user\'s profile, you\'ve found an IDOR.' }
        ]
    },
    {
        id: 'android-hacking-101',
        title: 'Getting Started with Android Hacking',
        author: 'Admin',
        date: 'September 10, 2025',
        category: 'Mobile Security',
        difficulty: 'Intermediate',
        heroImage: 'https://placehold.co/1200x600/34D399/FFFFFF?text=Android+Security',
        description: 'An introduction to setting up your environment and finding common vulnerabilities in Android applications.',
        content: [
            { type: 'paragraph', text: 'Mobile application security testing is a growing field. This guide will help you set up your lab to start analyzing Android applications for security flaws.' },
            { type: 'heading', text: 'Essential Tools' },
            { type: 'list', items: ['JADX-GUI: A decompiler to convert APK files into readable Java code.', 'Frida: A dynamic instrumentation toolkit that allows you to inject scripts into running applications.', 'Android Studio & Emulator: For running and debugging applications in a controlled environment.'] }
        ]
    }
];

export const findArticleById = (id) => {
    return learningContent.find(article => article.id === id);
};
