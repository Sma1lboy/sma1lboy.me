import UserProfile from "@/components/user-profile";
import { Suspense } from "react";

export default async function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Suspense fallback={<div>Loading user profile...</div>}>
        <UserProfile username="Sma1lboy" />
      </Suspense>
    </section>
  );
}
