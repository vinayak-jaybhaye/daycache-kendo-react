import React from "react";

const Media = ({ media }) => {
  if (!media) return null;

  return (
    <div className="mt-4">
      {media.type === "image" && (
        <div className="overflow-hidden rounded-lg shadow-md border border-gray-200">
          <img
            src={media.url}
            alt={media.description || "media"}
            className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      {media.type === "vidaueo" && (
        <div className="overflow-hidden rounded-lg shadow-md border border-gray-200">
          <video
            controls
            className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
          >
            <source src={media.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {media.type === "video" && (
        <div className="mt-2 p-2 border border-gray-200 rounded-lg shadow-md bg-gray-100">
          <audio controls className="w-full">
            <source src={media.url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {media.type === "file" && (
        <div className="mt-2">
          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            {media.description || "Download File"}
          </a>
        </div>
      )}
    </div>
  );
};

export default Media;
