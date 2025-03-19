import React, { useState } from "react";
import Media from "./Media";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { saveIcon, trashIcon } from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-react-common";

const Entry = ({ entry, onDelete }) => {
  if (!entry) return null;
  const [content, setContent] = useState(entry.content);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const toggleDialog = () => {
    setVisibleDialog(!visibleDialog);
  };

  const handleEdit = () => {
    setEditedContent(content);
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (content === editedContent) {
      setIsEditing(false);
      setEditedContent("");
      return;
    }
    try {
      setSaving(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/entries/${entry.id}/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editedContent,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update entry");
      }
      setContent(editedContent);
      setIsEditing(false);
      setEditedContent("");
      setSaving(false);
      // console.log("Updated Content:", editedContent);
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
    toggleDialog();
  };

  return (
    <div className="bg-[#FAF0E6] shadow-md rounded-xl p-6 mb-4 transition-all hover:shadow-lg border border-[#D2B48C]">
      {visibleDialog && (
        <Dialog title={"Please confirm"} onClose={toggleDialog}>
          <p
            style={{
              margin: "25px",
              textAlign: "center",
            }}
          >
            Are you sure you want to continue?
          </p>
          <DialogActionsBar>
            <Button type="button" onClick={toggleDialog}>
              No
            </Button>
            <Button type="button" onClick={handleDelete}>
              Yes
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={3}
          className="w-full bg-[#FAF0E6] text-gray-700 border border-[#D2B48C] focus:ring-2 focus:ring-[#EACDA3] rounded-md p-2 outline-none resize-none transition-all duration-200 font-serif text-lg shadow-inner"
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
              disabled={saving}
              onClick={handleSave}
              className="px-2 text-white bg-green-200 rounded-lg hover:bg-green-400 transition-colors font-medium"
            >
              {/* <img src="save.svg" alt="Edit" className="h-4 w-4" /> */}
              <SvgIcon icon={saveIcon} color="blue" />
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
            onClick={toggleDialog}
            className="px-5 py-2 text-white rounded-lg transition-colors font-medium hover:bg-gray-200"
          >
            {/* <img src="delete.svg" alt="Edit" className="h-4 w-4" /> */}
            <SvgIcon icon={trashIcon} color="red" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Entry;
