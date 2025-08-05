export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold md:text-6xl">404 Not Found</h1>
      <div className="flex items-center">
        <p className="text-muted-foreground mt-4 text-center md:text-lg">
          Looks like this page took a sudden dip. 📉
        </p>
      </div>
    </main>
  );
}
