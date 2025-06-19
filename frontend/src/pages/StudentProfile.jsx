// src/pages/StudentProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contestRange, setContestRange] = useState(90);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/students/${id}/profile`
        );
        setStudent(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [id]);

  if (loading) return <p className="text-center p-8">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  const now = new Date();
  const filteredContests = student.contests?.filter((c) => {
    const daysAgo = (now - new Date(c.date)) / (1000 * 60 * 60 * 24);
    return daysAgo <= contestRange;
  });

  const ratingGraphData = filteredContests?.map((c) => ({
    name: c.name,
    rating: c.newRating,
  }));

  const barChartData =
    student.stats?.ratingBuckets?.map((bucket) => ({
      rating: `${bucket.range}`,
      count: bucket.count,
    })) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back
      </button>
      <h1 className="text-2xl font-bold mb-6">
        {student.name}'s Codeforces Profile
      </h1>

      {/* Contest History Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🏁 Contest History</h2>
        <div className="mb-2">
          <label className="mr-2 font-medium">Show contests from:</label>
          <select
            value={contestRange}
            onChange={(e) => setContestRange(parseInt(e.target.value))}
            className="border rounded px-2 py-1 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={365}>Last 365 Days</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded shadow-sm dark:border-gray-700">
            <h3 className="font-semibold mb-2">Rating Graph</h3>
            {ratingGraphData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ratingGraphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={false} />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>No rating data available</p>
            )}
          </div>
          <div className="border p-4 rounded shadow-sm dark:border-gray-700">
            <h3 className="font-semibold mb-2">Recent Contests</h3>
            <ul className="text-sm space-y-2 max-h-60 overflow-auto">
              {filteredContests?.map((contest, idx) => (
                <li
                  key={idx}
                  className="border-b border-gray-200 dark:border-gray-700 pb-1"
                >
                  {contest.name} — Δ{contest.ratingChange} | Rank:{" "}
                  {contest.rank} | Unsolved: {contest.unsolvedCount}
                </li>
              )) || <p>No contests found</p>}
            </ul>
          </div>
        </div>
      </section>

      {/* Problem Solving Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🧠 Problem Solving</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded shadow-sm dark:border-gray-700">
            <p>📈 Total Problems Solved: {student.stats?.totalSolved || 0}</p>
            <p>🔥 Most Difficult Problem: {student.stats?.toughest || "N/A"}</p>
            <p>📊 Avg Rating: {student.stats?.avgRating || "-"}</p>
            <p>📅 Avg Problems/Day: {student.stats?.avgDaily || "-"}</p>
          </div>
          <div className="border p-4 rounded shadow-sm dark:border-gray-700">
            <h3 className="font-semibold mb-2">
              📊 Problems per Rating Bucket
            </h3>
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No problem distribution data</p>
            )}
          </div>
        </div>
        <div className="mt-6 border p-4 rounded shadow-sm dark:border-gray-700">
          <h3 className="font-semibold mb-2">🔥 Submission Heatmap</h3>
          {student.submissionHeatmap?.length > 0 ? (
            <CalendarHeatmap
              startDate={
                new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              }
              endDate={new Date()}
              values={student.submissionHeatmap}
              classForValue={(val) => {
                if (!val || val.count === 0) return "color-empty";
                if (val.count < 3) return "color-scale-1";
                if (val.count < 6) return "color-scale-2";
                return "color-scale-3";
              }}
              tooltipDataAttrs={(value) =>
                value.date
                  ? { "data-tip": `${value.date}: ${value.count} submissions` }
                  : {}
              }
              showWeekdayLabels
            />
          ) : (
            <p>No submission heatmap data available</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentProfile;
