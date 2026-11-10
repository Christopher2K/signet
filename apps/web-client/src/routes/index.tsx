import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "#/features/auth/components/route-guards";
import { LibraryPage } from "#/features/library/components/library-page";

const Home = () => {
  return (
    <ProtectedRoute>
      <LibraryPage />
    </ProtectedRoute>
  );
};

export const Route = createFileRoute("/")({ component: Home });
