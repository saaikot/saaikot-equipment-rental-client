// src/app/loading.tsx
// Route-level loading UI shown while a page segment is being rendered.
export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-900">Loading RentEasy</p>
        <p className="text-sm text-slate-500 mt-1">Getting everything ready for you...</p>
      </div>
      <div className="w-full max-w-md space-y-3">
        <div className="h-3 rounded-full bg-slate-200 animate-pulse" />
        <div className="h-3 rounded-full bg-slate-200 animate-pulse w-4/5 mx-auto" />
      </div>
    </div>
  );
}
