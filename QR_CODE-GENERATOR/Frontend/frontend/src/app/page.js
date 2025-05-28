'use client';
import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './page.css';

export default function Home() {
  const [text, setText] = useState('');
  const [qrCodeBase64, setQrCodeBase64] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const generateQRCode = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(apiUrl, { data: text.trim() });
      // Expected response: { image: <base64>, share_url: <url> }
      setQrCodeBase64(response.data.image);
      setShareUrl(response.data.share_url);
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        setError('Network error. Check your connection.');
      } else {
        setError('Unexpected error occurred.');
      }
      setQrCodeBase64('');
      setShareUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  // Download PNG from base64 data, frontend only
  const downloadQRCode = () => {
    if (!qrCodeBase64) return;

    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${qrCodeBase64}`;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 modern-title">QR Code Generator</h1>

      <div className="mb-3">
        <label htmlFor="qrText" className="form-label classic-label">
          Enter Text for QR Code
        </label>
        <input
          id="qrText"
          type="text"
          className="form-control classic-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
          disabled={isLoading}
        />
      </div>

      <div className="d-grid gap-2 mb-3">
        <button
          className="btn modern-button"
          onClick={generateQRCode}
          disabled={isLoading || !text.trim()}
        >
          {isLoading ? 'Generating QR Code...' : 'Generate QR Code'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {qrCodeBase64 && (
        <div className="text-center qr-code-container mt-4">
          <img
            src={`data:image/png;base64,${qrCodeBase64}`}
            alt="QR Code"
            className="img-fluid"
            style={{ maxWidth: '300px', margin: 'auto' }}
          />
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button
              className="btn modern-button"
              onClick={() => window.open(shareUrl, '_blank')}
              type="button"
            >
              Open QR Code
            </button>

            <button
              className="btn modern-button"
              onClick={downloadQRCode}
              type="button"
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
