import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './BulkUpload.css';


const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();

  const isValidJson = (content) => {
    try {
      JSON.parse(content);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleFileRead = async (event) => {
    const content = event.target.result;
    if (isValidJson(content)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:8080/products/bulk-create', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('File uploaded successfully');
          setUploadSuccess(true); 
          setTimeout(() => navigate('/products'), 2000);
        } else {
          console.error('Upload failed');
        }
      } catch (error) {
        console.error('Error during upload:', error);
      }
    } else {
      alert('The selected file is not valid JSON.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
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
