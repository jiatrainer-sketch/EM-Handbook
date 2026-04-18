export default function Tools() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Tools</h1>
      <ul className="space-y-3 text-sm">
        <li className="rounded-lg border bg-card p-3">
          <div className="font-medium">📝 Pre-op Clearance Helper</div>
          <div className="text-muted-foreground">ช่วยเขียน pre-op note</div>
        </li>
        <li className="rounded-lg border bg-card p-3">
          <div className="font-medium">💬 Consult Reply Generator</div>
          <div className="text-muted-foreground">ช่วยเขียน consult reply</div>
        </li>
      </ul>
    </div>
  );
}
