import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({
  component: NotFound,
}) 


export function NotFound() {
  return (
    <div className=" mt-28 min-h-screen ">
      <h1 className="text-center text-4xl font-bold">Not Found</h1>
      <p className="text-center text-2xl">
        The page you are looking for does not exist.
      </p>
    </div>
  );
};