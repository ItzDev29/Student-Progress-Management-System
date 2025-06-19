// src/components/StudentFormModal.jsx
import React, { useState, useEffect } from 'react';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  codeforcesHandle: '',
};

const StudentFormModal = ({ open, onClose, onSubmit, student }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        codeforcesHandle: student.codeforcesHandle || '',
      });
    } else {
      setFormData(initialForm);
    }
  }, [student]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.codeforcesHandle.trim()) newErrors.codeforcesHandle = 'Handle is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
    alert(student ? 'Student updated successfully' : 'Student added successfully');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {student ? 'Edit Student' : 'Add Student'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
              autoFocus
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <input
              name="codeforcesHandle"
              type="text"
              placeholder="Codeforces Handle"
              value={formData.codeforcesHandle}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            {errors.codeforcesHandle && (
              <p className="text-red-500 text-sm mt-1">{errors.codeforcesHandle}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {student ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;
