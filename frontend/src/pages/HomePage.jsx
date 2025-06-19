// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import StudentTable from '../components/StudentTable';
import StudentFormModal from '../components/StudentFormModel';
import axios from 'axios';

function HomePage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students');
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditStudent(null);
    setModalOpen(true);
  };

  const handleEditClick = (student) => {
    setEditStudent(student);
    setModalOpen(true);
  };

  const handleSubmit = async (studentData) => {
    try {
      if (editStudent) {
        await axios.put(`http://localhost:5000/api/students/${editStudent._id}`, studentData);
      } else {
        await axios.post('http://localhost:5000/api/students', studentData);
      }
      fetchStudents();
      setModalOpen(false);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Student Progress Dashboard</h1>
      <div className="text-right mb-4">
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Add Student
        </button>
      </div>
      {loading ? <p>Loading...</p> : <StudentTable students={students} onRefresh={fetchStudents} onEdit={handleEditClick} />}
      <StudentFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        student={editStudent}
      />
    </div>
  );
}

export default HomePage;