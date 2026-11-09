import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f5c842',
          fontWeight: 900,
          borderRadius: 8,
          border: '1.5px solid #d4af37',
          fontFamily: 'sans-serif',
          letterSpacing: '-1px',
        }}
      >
        H
      </div>
    ),
    {
      ...size,
    }
  );
}

