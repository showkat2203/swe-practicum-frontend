import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './BulkUpload.css'

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false); // State to handle success message
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/products/bulk-create', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
        setUploadSuccess(true); // Set upload success state to true
        setTimeout(() => navigate('/'), 3000); // Redirect to home page after 3 seconds
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error during upload:', error);
    }
  };

  return (
    <div className="bulk-upload-container">
      <h2>Bulk Upload JSON File</h2>
      {uploadSuccess && <div className="upload-success-message">File uploaded successfully!</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="jsonFile">Upload JSON File</label>
          <input 
            type="file" 
            id="jsonFile" 
            accept=".json" 
            onChange={(e) => setFile(e.target.files[0])} 
          />
        </div>
        <button type="submit" className="submit-btn">Upload File</button>
      </form>
    </div>
  );
};

export default BulkUpload;
