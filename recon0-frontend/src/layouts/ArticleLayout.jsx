import React from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { findArticleById, learningContent } from '/src/lib/learningData.js';
import { ArrowLeft } from 'lucide-react';

// This is a reusable component to render different types of content blocks
const ContentBlock = ({ block }) => {
    switch (block.type) {
        case 'heading':
            return <h3 className="text-xl font-bold text-slate-800 mt-6 mb-2">{block.text}</h3>;
        case 'paragraph':
            return <p className="text-slate-600 mb-4 leading-relaxed">{block.text}</p>;
        case 'list':
            return (
                <ul className="list-disc list-inside space-y-2 mb-4 text-slate-600">
                    {block.items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            );
        case 'code':
            return <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto text-sm mb-4"><code>{block.code}</code></pre>;
        case 'image':
            return <img src={block.src} alt={block.alt || 'Article image'} className="my-6 rounded-lg shadow-md border border-slate-200" />;
        default:
            return null;
    }
};


const ArticleLayout = () => {
    const { articleId } = useParams();
    const article = findArticleById(articleId);

    if (!article) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold">Article not found</h1>
                <Link to="/academy" className="text-blue-600 hover:underline mt-4 inline-block">
                    Return to the Learning Academy
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <Link to="/academy" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline mb-6">
                <ArrowLeft size={16} />
                Back to Learning Academy
            </Link>
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                 <div className="space-y-4 mb-8">
                    <p className="font-semibold text-blue-600">{article.category}</p>
                    <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">{article.title}</h1>
                    <p className="text-slate-500">By {article.author} on {article.date}</p>
                </div>

                {article.heroImage && <img src={article.heroImage} alt={article.title} className="w-full h-auto md:h-80 object-cover rounded-2xl mb-8" />}
                
                {article.videoId && (
                    <div className="aspect-[4/2] rounded-2xl overflow-hidden mb-8">
                        <iframe 
                            src={`https://www.youtube.com/embed/${article.videoId}`} 
                            title={article.title} 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                )}
                
                <div className="prose max-w-none">
                    {article.content.map((block, index) => <ContentBlock key={index} block={block} />)}
                </div>
            </div>
        </div>
    );
};

export default ArticleLayout;

