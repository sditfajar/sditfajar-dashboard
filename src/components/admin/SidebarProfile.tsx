"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCircle } from "lucide-react";

interface UserProfile {
  displayName: string;
  role: string;
  photoURL: string | null;
}

export function SidebarProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      // Check session storage first
      const cachedProfile = sessionStorage.getItem(`profile_${user.uid}`);
      if (cachedProfile) {
        setProfile(JSON.parse(cachedProfile));
        setIsLoading(false);
        return;
      }

      // Fetch from Firestore
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        let role = "Admin";
        let photoURL = user.photoURL;
        let displayName = user.displayName || "User";

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          role = data.role === "teacher" ? "Guru" : "Admin";
          if (data.photoURL) photoURL = data.photoURL;
          if (data.name) displayName = data.name;
        }

        const newProfile = { displayName, role, photoURL };
        setProfile(newProfile);
        sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(newProfile));
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback
        setProfile({
          displayName: user.displayName || "Admin",
          role: "Admin",
          photoURL: user.photoURL,
        });
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4 border-t mt-auto">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex flex-col gap-1 w-full">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex items-center gap-3 p-4 border-t mt-auto bg-muted/20">
      {profile.photoURL ? (
        <div className="relative h-10 w-10 rounded-full overflow-hidden border border-border/50 shrink-0">
          <Image
            src={profile.photoURL}
            alt={profile.displayName}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-border/50">
          <UserCircle className="h-6 w-6" />
        </div>
      )}
      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-medium leading-none truncate mb-1">
          {profile.displayName}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {profile.role}
        </span>
      </div>
    </div>
  );
}
