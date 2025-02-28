// app/layout.js
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';

export const metadata = {
  title: 'QR Code Generator',
  description: 'Generate QR codes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}