import React, { useState } from 'react';
import axios from 'axios';

// Main App component with a mesmerizing design
function App() {
    const [input, setInput] = useState('');
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setAdvice('');

        try {
            const res = await axios.post('http://localhost:5000/api/advice', {
                userInput: input,
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setAdvice(res.data.advice);
        } catch (err) {
            console.error('Failed to fetch career advice:', err);
            setError('Error: could not get advice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 to-black text-white">
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                `}
            </style>
            
            <div className="bg-white/5 rounded-3xl backdrop-blur-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 p-8 w-full max-w-2xl transform hover:scale-[1.01] transition-transform duration-500 ease-in-out">
                <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2 text-center">
                    Career Advisor
                </h1>
                <p className="text-center text-gray-300 mb-6 font-light text-lg">
                    Enter your field of study below to get some personalized career advice powered by AI.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center items-center mb-6">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., Computer Science, Biology, Marketing"
                        disabled={loading}
                        className="flex-1 w-full sm:w-auto border border-gray-700 bg-gray-800 rounded-full px-6 py-3 mb-4 sm:mb-0 sm:mr-4 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Getting Advice...' : 'Get Advice'}
                    </button>
                </form>
                {advice && (
                    <div className="mt-8 p-8 bg-white/5 border border-purple-500 rounded-2xl shadow-inner animate-fade-in-up">
                        <h2 className="text-2xl font-bold text-purple-400 mb-4">Your Career Advice:</h2>
                        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{advice}</p>
                    </div>
                )}
                {error && <p className="mt-4 text-red-400 text-center font-semibold">{error}</p>}
            </div>
            
            {/* Tailwind CSS Script for styling */}
            <script src="https://cdn.tailwindcss.com"></script>
        </div>
    );
}

export default App;
