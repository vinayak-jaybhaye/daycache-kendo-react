import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";

// Throttle function limit API calls
const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

function AddEntry({ onEntryAdded, date }) {
  const user = useSelector((state) => state.user.user);
  const [entryText, setEntryText] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  // Function to fetch suggestions
  const fetchSuggestions = async (text) => {
    if (!text.trim()) {
      setSuggestion("");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/autocomplete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      const suggestionSuffix = data.suggestions?.[0] || "";

      setSuggestion(suggestionSuffix);
      console.log("called");
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestion("");
    }
  };

  const throttledFetchSuggestions = useCallback(
    throttle(fetchSuggestions, 3000),
    []
  );
  const handleChange = (e) => {
    const value = e.target.value;
    setEntryText(value);
    throttledFetchSuggestions(value);
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Tab" || e.key === "Enter") && suggestion) {
      e.preventDefault();
      setEntryText(entryText + suggestion);
      setSuggestion("");
    }
  };

  const handleAddEntry = async () => {
    if (!entryText.trim()) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${
          user.id
        }/days/${date}/entries/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content: entryText,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add entry");

      const data = await response.json();

      // Add to UI
      onEntryAdded(data.entry);

      setEntryText("");
      setSuggestion("");
    } catch (error) {
      console.error("Error adding entry:", error);
      alert("Failed to add entry. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mt-6 px-4 py-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex gap-3 items-start">
        <div className="flex-1 relative">
          <Input
            value={entryText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setSuggestion("")}
            placeholder="Write your thoughts..."
            ref={inputRef}
            className="!text-base !py-3 !px-4 !rounded-lg !border-gray-300 hover:!border-blue-400 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-200"
          />

          {/* Ghost Text Overlay */}
          {suggestion && entryText && (
            <span className="absolute left-4 top-3.5 pointer-events-none flex items-center">
              <span className="text-transparent pr-2">{entryText}</span>

              <span className="text-gray-400 ml-[-2px] opacity-75">
                {suggestion}
              </span>
            </span>
          )}
        </div>

        {/* Add Button */}
        <Button
          onClick={handleAddEntry}
          disabled={loading || !entryText.trim()}
          className={`!min-w-[44px] !h-[44px] !px-3 !rounded-lg transition-all ${
            loading
              ? "!bg-gray-300 !border-gray-300 cursor-not-allowed"
              : "!bg-blue-500 hover:!bg-blue-600 !border-blue-500"
          }`}
        >
          {loading ? (
            <span className="text-white font-medium">...</span>
          ) : (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
}

export default AddEntry;
