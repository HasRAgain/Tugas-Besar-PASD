import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser, getProfile } from "@/actions/auth";
import { ProfileForm } from "@/components/forms/profile-form";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your Lokeria profile.",
};

export default async function ProfilePage() {
  let profile = null;

  try {
    const user = await getUser();
    if (!user) redirect("/login");
    profile = await getProfile();
  } catch {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">Your Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Keep your profile up to date to make the most of Lokeria.
        </p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
