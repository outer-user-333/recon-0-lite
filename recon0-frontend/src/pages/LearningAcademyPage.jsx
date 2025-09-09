import React from 'react';
import { Link } from 'react-router-dom';
import { learningContent } from '/src/lib/learningData.js';
import { ArrowRight } from 'lucide-react';

// Component for the individual article cards on the main page
const ArticleCard = ({ article }) => (
    <Link to={`/academy/${article.id}`} className="block bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex-grow">
            <div className="flex items-center gap-2 text-xs font-semibold mb-2">
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">{article.category}</span>
                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">{article.difficulty}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{article.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{article.description}</p>
        </div>
        <div className="mt-4 font-semibold text-sm text-blue-600 flex items-center gap-1">
            Read More <ArrowRight size={14} />
        </div>
    </Link>
);

const LearningAcademyPage = () => {
    // Group articles by category for display
    const articlesByCategory = learningContent.reduce((acc, article) => {
        const category = article.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(article);
        return acc;
    }, {});

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Learning Academy</h1>
                <p className="mt-1 text-slate-500">Your starting point for becoming a successful security researcher.</p>
            </div>

            {/* Render each category as a section */}
            {Object.entries(articlesByCategory).map(([category, articles]) => (
                 <div key={category}>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 border-l-4 border-blue-500 pl-4">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LearningAcademyPage;


