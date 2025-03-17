import { useEffect, useState } from "react";
import Entry from "./Entry";
import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardActions,
  PanelBar,
} from "@progress/kendo-react-layout";
import { Badge } from "@progress/kendo-react-indicators";
import AddEntry from "./AddEntry";
import { Loader } from "@progress/kendo-react-indicators";

const Day = ({ date, userId }) => {
  const [day, setDay] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const onDelete = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const fetchDayData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/days/${date}`,
        {
          cache: "no-store",
        }
      );

      if (response.status === 404) {
        setDay(null);
        setEntries([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch entries: ${response.statusText}`);
      }

      const data = await response.json();
      setDay(data);
      setEntries(data?.entries || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDayData();
  }, [date, userId]);

  const generateSummary = async () => {
    if (!day) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/days/${
          day.id
        }/summarize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to generate summary");

      const data = await response.json();
      setDay((prev) => ({ ...prev, latest_summary: data }));
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
        }}
      >
        <Loader size="large" type="pulsing" />
      </div>
    );
  }

  return (
    <>
      {
        <div className="mb-4 md:mb-6 border-b border-pink-200 pb-3 md:pb-4">
          <h1 className="text-2xl md:text-3xl font-serif text-gray-700 mb-1 md:mb-2">
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h1>

          <span>
            {entries?.length} {entries?.length === 1 ? "Entry" : "Entries"}
          </span>
        </div>
      }
      <div className="w-[100%] h-[100%] mx-auto p-2 md:p-8 bg-rose-50 rounded-xl md:rounded-2xl shadow-lg mt-2 md:mt-8 border border-opacity-10 border-pink-200 overflow-auto scrollbar-hide flex flex-col gap-2">
        <AddEntry
          date={date}
          onEntryAdded={(newEntry) => setEntries((prev) => [...prev, newEntry])}
        />
        <Card>
          {/* Entries List */}

          <CardHeader>
            <CardTitle>Entries</CardTitle>
          </CardHeader>

          <CardBody>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <Entry key={entry.id} entry={entry} onDelete={onDelete} />
              ))
            ) : (
              <div className="k-panelbar-item bg-white/90 rounded-lg">
                <div className="k-item-wrapper p-3 md:p-4 text-center">
                  <span className="text-gray-400 italic text-sm md:text-base">
                    No entries found for this day
                  </span>
                </div>
              </div>
            )}

            {/* Day Summary */}
            {day && (
              <Card className="mt-6 md:mt-8 p-4 md:p-6 bg-white/90 rounded-lg md:rounded-xl shadow-sm border border-dashed border-pink-200">
                <CardHeader>
                  <CardTitle>Day Summary</CardTitle>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-600 text-sm md:text-base">
                    {day.latest_summary || "No summary available"}
                  </p>
                </CardBody>
                <CardActions>
                  <button
                    onClick={generateSummary}
                    className="px-4 py-2 bg-pink-500 text-white rounded-md shadow-md hover:shadow-lg transition"
                  >
                    Generate Summary
                  </button>
                </CardActions>
              </Card>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Day;
