"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CreateModulePage() {
  const [formData, setFormData] = useState({
    date: '',
    timeslot: '',
    class: '',
    content: ''
  });

  const [timeslots, setTimeslots] = useState([]);
  const [classes, setClasses] = useState([]);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    // Set date constraints
    const today = new Date();
    setMinDate(today.toISOString().split('T')[0]);
    setMaxDate(new Date(today.setFullYear(today.getFullYear() + 1)).toISOString().split('T')[0]);

    // Fetch available timeslots and classes
    axios.get('/api/timeslots')
      .then(response => setTimeslots(response.data))
      .catch(error => console.error('Error fetching timeslots:', error));

    axios.get('/api/classes')
      .then(response => setClasses(response.data))
      .catch(error => console.error('Error fetching classes:', error));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/modules', {
        module_date: `${formData.date} ${formData.timeslot}`,
        module_name: formData.content,
        class_id: formData.class
      });

      if (response.data.success) {
        alert('Module created successfully!');
        setFormData({ date: '', timeslot: '', class: '', content: '' });
      }
    } catch (error) {
      console.error('Error creating module:', error);
      alert('Error creating module');
    }
  };

  return (
    <div className="flex flex-grow items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Lav en lektion
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Vælg en dato:
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            min={minDate}
            max={maxDate}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
            required
          />

          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Tidspunkt:
          </label>
          <select
            value={formData.timeslot}
            onChange={(e) => setFormData({ ...formData, timeslot: e.target.value })}
            className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
            required
          >
            <option value="">Vælg tidspunkt</option>
            {timeslots.map((slot) => (
              <option key={slot.id} value={slot.time}>
                {slot.label}
              </option>
            ))}
          </select>

          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Hold:
          </label>
          <select
            value={formData.class}
            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
            required
          >
            <option value="">Vælg hold</option>
            {classes.map((cls) => (
              <option key={cls.class_id} value={cls.class_id}>
                {cls.class_name}
              </option>
            ))}
          </select>

          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Content:
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
            rows={4}
            placeholder="What are you going to teach about"
            required
          ></textarea>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Create Module
          </button>
        </form>
      </div>
    </div>
  );
}