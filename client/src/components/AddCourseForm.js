import React, { useState } from "react";

const AddCourseForm = ({ onAddCourse }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [availableHours, setAvailableHours] = useState("");
  const [timeCreditValue, setTimeCreditValue] = useState("");
  const [googleMeetLink, setGoogleMeetLink] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCourse({
      name,
      description,
      availableHours,
      timeCreditValue,
      googleMeetLink,
      tags: tags.split(",").map((tag) => tag.trim()),
      thumbnail,
    });
    setName("");
    setDescription("");
    setAvailableHours("");
    setTimeCreditValue("");
    setGoogleMeetLink("");
    setTags("");
    setThumbnail("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Course Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Available Hours"
        value={availableHours}
        onChange={(e) => setAvailableHours(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Time Credit Value"
        value={timeCreditValue}
        onChange={(e) => setTimeCreditValue(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Google Meet Link"
        value={googleMeetLink}
        onChange={(e) => setGoogleMeetLink(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Thumbnail URL"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
        Add Course
      </button>
    </form>
  );
};

export default AddCourseForm;