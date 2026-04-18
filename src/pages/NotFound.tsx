import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">ไม่พบหน้านี้</h1>
      <p className="text-sm text-muted-foreground">Page not found (404).</p>
      <Link
        to="/"
        className="inline-block text-sm text-primary underline-offset-4 hover:underline"
      >
        ← กลับหน้าหลัก
      </Link>
    </div>
  );
}
