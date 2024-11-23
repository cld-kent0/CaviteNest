"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchResults = () => {
    const searchParams = useSearchParams();
    const keyword = searchParams?.get("keyword") || ""; // Fallback to an empty string if null
    const [results, setResults] = useState<{ users: any[]; listings: any[] }>({ users: [], listings: [] });

    useEffect(() => {
        if (keyword) {
            fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Error: ${res.status} ${res.statusText}`);
                    }
                    return res.json();
                })
                .then((data) => setResults(data))
                .catch((error) => {
                    console.error("Failed to fetch search results:", error);
                });
        }
    }, [keyword]);
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Search Results for: <span className="text-green-750">{keyword}</span></h1>

            <div className="mt-8">
                <h2 className="text-xl font-semibold">Users:</h2>
                <ul className="list-disc pl-5 mt-2">
                    {results.users.length > 0 ? (
                        results.users.map((user) => (
                            <li key={user.id} className="py-2 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <strong>{user.name}</strong>
                                        <p className="text-gray-600">{user.email}</p>
                                        <p className="text-gray-500">ID: {user.id}</p> {/* Display ID */}
                                    </div>
                                    <button className="bg-sky-950 text-white px-3 py-1 rounded">View</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="py-2">No users found.</li>
                    )}
                </ul>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold">Listings:</h2>
                <ul className="list-disc pl-5 mt-2">
                    {results.listings.length > 0 ? (
                        results.listings.map((listing) => (
                            <li key={listing.id} className="py-2 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <strong>{listing.title}</strong>
                                        <p className="text-gray-600">Category: {listing.category}</p>
                                        <p className="text-gray-500">ID: {listing.id}</p> {/* Display ID */}
                                    </div>
                                    <button className="bg-sky-950 text-white px-3 py-1 rounded">View</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="py-2">No listings found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default SearchResults;
