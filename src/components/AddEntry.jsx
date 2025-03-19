import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";

// Debounce function to delay API calls until typing stops
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

function AddEntry({ onEntryAdded, date }) {
  const user = useSelector((state) => state.user.user);
  const [entryText, setEntryText] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Function to fetch suggestions with abort control
  const fetchSuggestions = async (text) => {
    if (!text.trim()) {
      setSuggestion("");
      return;
    }

    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/autocomplete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text }),
          signal: abortController.signal,
        }
      );

      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      const suggestionSuffix = data.suggestions?.[0] || "";

      setSuggestion(suggestionSuffix);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching suggestions:", error);
        setSuggestion("");
      }
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 2000),
    []
  );
  const handleChange = (e) => {
    const value = e.target.value;
    setEntryText(value);
    debouncedFetchSuggestions(value);
    setSuggestion("");
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
          <textarea
            value={entryText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setSuggestion("")}
            placeholder="How was your day?"
            ref={inputRef}
            rows={1}
            className="!text-base !py-3 !px-4 !rounded-lg !border-gray-300 hover:!border-blue-400 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-200 resize-none w-full overflow-auto leading-snug"
            style={{
              minHeight: "48px",
              maxHeight: "200px",
              boxSizing: "border-box", // Ensure padding doesn't affect height calculations
            }}
            onInput={(e) => {
              // Auto-resize logic
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(
                e.target.scrollHeight,
                200
              )}px`;
            }}
          />

          {/* Ghost Text Overlay */}
          {suggestion && entryText && (
            <div
              className="absolute left-0 top-0 pointer-events-none w-full"
              style={{
                // Match textarea styling exactly
                padding: "12px 16px", // py-3 = 12px, px-4 = 16px
                font: "inherit", // Match font family and size
                whiteSpace: "pre-wrap", // Match textarea wrapping behavior
                wordBreak: "break-word", // Match textarea word breaking
              }}
            >
              <span className="text-transparent">
                {entryText}
                <span className="text-gray-400 opacity-75">{suggestion}</span>
              </span>
            </div>
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
