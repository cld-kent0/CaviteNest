"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";

const AdminSearch = () => {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!keyword.trim()) return;

    // Redirect to search-results page with keyword as query parameter
    router.push(`/admin/search-results?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search"
        className="px-8 p-2 border rounded-full shadow-md"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="absolute right-2 top-1 p-2 bg-emerald-600 text-white rounded-full"
      >
        <BiSearch size={18} />
      </button>
    </div>
  );
};

export default AdminSearch;
