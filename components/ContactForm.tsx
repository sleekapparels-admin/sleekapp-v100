'use client';

import { useState, FormEvent } from 'react';

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            // Remove trailing slash if present to avoid double slashes
            const baseUrl = apiUrl.replace(/\/$/, '');

            const response = await fetch(`${baseUrl}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };

    return (
        <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Request a Quote</h2>

            {status === 'success' ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-8 rounded-lg text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
                    <p>Thank you for contacting Sleek Apparels. We will get back to you within 24 hours.</p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="mt-6 text-primary-600 font-semibold hover:text-primary-700"
                    >
                        Send Another Message
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold mb-2">Full Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-2">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="company" className="block text-sm font-semibold mb-2">Company Name</label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                            placeholder="Your Brand"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold mb-2">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                            placeholder="+1 234 567 8900"
                        />
                    </div>

                    <div>
                        <label htmlFor="product_type" className="block text-sm font-semibold mb-2">Product Type *</label>
                        <select
                            id="product_type"
                            name="product_type"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                            required
                        >
                            <option value="">Select Product</option>
                            <option value="t-shirts">T-Shirts</option>
                            <option value="hoodies">Hoodies & Sweatshirts</option>
                            <option value="activewear">Activewear</option>
                            <option value="knitwear">Knitwear</option>
                            <option value="uniforms">Uniforms</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="quantity" className="block text-sm font-semibold mb-2">Quantity *</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                            placeholder="100"
                            min="50"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-semibold mb-2">Message / Requirements *</label>
                        <textarea
                            id="message"
                            name="message"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                            rows={5}
                            placeholder="Please describe your requirements in detail..."
                            required
                        ></textarea>
                    </div>

                    {status === 'error' && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                            Failed to send message. Please check your connection and try again.
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'sending' ? 'Sending...' : 'Send Inquiry'}
                    </button>
                </form>
            )}
        </div>
    );
}
