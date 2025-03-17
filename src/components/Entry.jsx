import React, { useState } from "react";
import Media from "./Media";
import { Button } from "@progress/kendo-react-buttons";

const Entry = ({ entry, onDelete }) => {
  if (!entry) return null;
  const [content, setContent] = useState(entry.content);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/entries/${entry.id}/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update entry");
      }

      setIsEditing(false);
      console.log("Updated Content:", content);
    } catch (error) {
      console.error("Failed to update entry:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/days/${entry.day_id}/entries/${
          entry.id
        }/delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      console.log("Entry deleted");
      onDelete(entry.id);
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-4 transition-all hover:shadow-lg border border-gray-100">
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full bg-transparent text-gray-700 focus:ring-2 focus:ring-blue-300 rounded-md p-2 outline-none resize-none transition-all duration-200 font-serif text-lg"
          placeholder="Write something..."
          style={{
            lineHeight: "1.6",
            color: "#374151",
          }}
        />
      ) : (
        <p
          className="text-gray-700 mb-3 font-serif text-lg leading-relaxed"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {content || "Write something..."}
        </p>
      )}

      {entry.media?.length > 0 &&
        entry.media.map((item) => <Media key={item.id} media={item} />)}

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 ">
          {new Date(entry.created_at).toLocaleString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </p>

        <div className="flex gap-2">
          {isEditing ? (
            <Button
              onClick={handleSave}
              className="px-2 text-white bg-green-200 rounded-lg hover:bg-green-400 transition-colors font-medium"
            >
              <img src="save.svg" alt="Edit" className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleEdit}
              className="px-2 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium border-gray-200"
            >
              <img src="edit.svg" alt="Edit" className="h-4 w-4" />
            </Button>
          )}

          <Button
            onClick={handleDelete}
            className="px-5 py-2 text-white rounded-lg transition-colors font-medium hover:bg-gray-200"
          >
            <img src="delete.svg" alt="Edit" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Entry;
