import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, MailCheck, MailX, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CSVLink } from 'react-csv';
import { toast } from 'react-hot-toast';

function StudentTable({ onEdit }) {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get("http://localhost:5000/api/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  };

  const toggleReminder = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/students/${id}/toggle-email`);
      setStudents(prev =>
        prev.map(s =>
          s._id === id ? { ...s, disableReminderEmails: res.data.disabled } : s
        )
      );
      toast.success(`Reminder ${res.data.disabled ? 'disabled' : 'enabled'}`);
    } catch (err) {
      console.error("Toggle failed:", err);
      toast.error("Failed to update reminder");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      toast.success("Student deleted");
      fetchStudents(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete student");
    }
  };

  const csvHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone' },
    { label: 'CF Handle', key: 'codeforcesHandle' },
    { label: 'Current Rating', key: 'currentRating' },
    { label: 'Max Rating', key: 'maxRating' },
    { label: 'Last Synced At', key: 'lastSyncedAt' }
  ];

  const formattedStudents = students.map(s => ({
    ...s,
    lastSyncedAt: s.lastSyncedAt
      ? new Date(s.lastSyncedAt).toLocaleString()
      : 'N/A'
  }));

  return (
    <div className="overflow-x-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📋 Student Table</h2>
        <CSVLink
          data={formattedStudents}
          headers={csvHeaders}
          filename="students_export.csv"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
        >
          Export CSV
        </CSVLink>
      </div>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">CF Handle</th>
            <th className="p-2">Rating</th>
            <th className="p-2">Reminders</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="border-b border-gray-300 dark:border-gray-700">
              <td className="p-2">{student.name}</td>
              <td className="p-2">{student.email}</td>
              <td className="p-2">{student.codeforcesHandle}</td>
              <td className="p-2">{student.currentRating || "-"}</td>
              <td className="p-2">
                {student.reminderCount || 0} {student.disableReminderEmails && "(Disabled)"}
              </td>
              <td className="p-2 flex flex-wrap gap-2 items-center">
                <button onClick={() => navigate(`/student/${student._id}`)}>
                  <Eye className="w-5 h-5 text-blue-500" />
                </button>
                <button onClick={() => toggleReminder(student._id)}>
                  {student.disableReminderEmails ? (
                    <MailX className="w-5 h-5 text-red-500" title="Enable Reminders" />
                  ) : (
                    <MailCheck className="w-5 h-5 text-green-500" title="Disable Reminders" />
                  )}
                </button>
                <button onClick={() => onEdit(student)}>
                  <Pencil className="w-5 h-5 text-yellow-500" title="Edit" />
                </button>
                <button onClick={() => deleteStudent(student._id)}>
                  <Trash2 className="w-5 h-5 text-red-600" title="Delete" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
