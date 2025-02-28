'use client';
import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './page.css'; // Import custom CSS

export default function Home() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shareUrl, setShareUrl] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const generateQRCode = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(apiUrl, { data: text });
      console.log('QR code generated:', response.data);
      setQrCode(`data:image/png;base64,${response.data.image}`);
      setShareUrl(response.data.url);
    } catch (err) {
      console.error('Error generating QR code:', err);
      if (err.response) {
        setError(`Failed to generate QR code: ${err.response.status} - ${err.response.data}`);
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-center mb-4 modern-title">QR Code Generator</h1>
          <div className="mb-3">
            <label htmlFor="qrText" className="form-label classic-label">
              Enter Text for QR Code
            </label>
            <input
              type="text"
              className="form-control classic-input"
              id="qrText"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2">
            <button className="btn modern-button" onClick={generateQRCode} disabled={isLoading}>
              {isLoading ? 'Generating QR Code...' : 'Generate QR Code'}
            </button>
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {qrCode || isLoading ? (
            <div className="mt-4 text-center qr-code-container">
              {isLoading && <div className="spinner"></div>}
              {qrCode && <img src={qrCode} alt="QR Code" className="img-fluid" />}
              {qrCode && (
                <div className="d-grid gap-2 mt-2">
                  <button className="btn modern-button" onClick={downloadQRCode}>
                    Download QR Code
                  </button>
                </div>
              )}

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}