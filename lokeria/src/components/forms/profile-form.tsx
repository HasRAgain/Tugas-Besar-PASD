"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Save, X, Sparkles } from "lucide-react";
import { updateProfile } from "@/actions/profile";
import { useState, useRef, KeyboardEvent } from "react";
import { toast } from "sonner";

interface ProfileFormProps {
  profile: {
    full_name: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    country: string | null;
    major: string | null;
    skill_field: string | null;
    interests: string[] | null;
    skills: string[] | null;
  } | null;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);

  // Tag inputs state
  const [interests, setInterests] = useState<string[]>(
    profile?.interests || []
  );
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [interestInput, setInterestInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const interestInputRef = useRef<HTMLInputElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  const handleAddInterest = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = interestInput.trim();
      if (value && !interests.includes(value)) {
        setInterests([...interests, value]);
        setInterestInput("");
      }
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleAddSkill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = skillInput.trim();
      if (value && !skills.includes(value)) {
        setSkills([...skills, value]);
        setSkillInput("");
      }
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    // Append array data as JSON strings
    formData.set("interests", JSON.stringify(interests));
    formData.set("skills", JSON.stringify(skills));

    const result = await updateProfile(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      const embStatus = (result as { embeddingStatus?: string })
        ?.embeddingStatus;
      if (embStatus === "success") {
        toast.success(
          "Profile updated! AI recommendations will refresh."
        );
      } else if (embStatus === "insufficient_data") {
        toast.success(
          "Profile updated! Add more details for AI recommendations."
        );
      } else {
        toast.success(
          `Profile updated! Embedding: ${embStatus || "unknown"}`
        );
      }
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-heading">
          <User className="h-5 w-5 text-primary" />
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {/* === BASIC INFO === */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Basic Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile?.full_name || ""}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  name="headline"
                  defaultValue={profile?.headline || ""}
                  placeholder="Senior Software Engineer"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile?.bio || ""}
                placeholder="Tell us about yourself, your experience, and what you're looking for..."
                rows={4}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={profile?.location || ""}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue={profile?.country || ""}
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* === PROFESSIONAL INFO === */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground">
                Professional Details
                <span className="ml-1 text-xs text-primary">
                  (used for AI recommendations)
                </span>
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="major">Major / Education</Label>
                <Input
                  id="major"
                  name="major"
                  defaultValue={profile?.major || ""}
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skill_field">Skill Field / Domain</Label>
                <Input
                  id="skill_field"
                  name="skill_field"
                  defaultValue={profile?.skill_field || ""}
                  placeholder="Web Development"
                />
              </div>
            </div>

            {/* Interests Tag Input */}
            <div className="mt-4 space-y-2">
              <Label htmlFor="interest_input">Interests</Label>
              <div className="flex flex-wrap gap-2 min-h-[2.5rem] rounded-md border bg-background p-2">
                {interests.map((interest) => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Input
                  id="interest_input"
                  ref={interestInputRef}
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={handleAddInterest}
                  placeholder={
                    interests.length === 0
                      ? "Type and press Enter (e.g. Machine Learning)"
                      : "Add more..."
                  }
                  className="flex-1 min-w-[120px] border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter to add each interest
              </p>
            </div>

            {/* Skills Tag Input */}
            <div className="mt-4 space-y-2">
              <Label htmlFor="skill_input">Skills</Label>
              <div className="flex flex-wrap gap-2 min-h-[2.5rem] rounded-md border bg-background p-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Input
                  id="skill_input"
                  ref={skillInputRef}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder={
                    skills.length === 0
                      ? "Type and press Enter (e.g. React, Python)"
                      : "Add more..."
                  }
                  className="flex-1 min-w-[120px] border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter to add each skill
              </p>
            </div>
          </div>

          <Separator />

          <Button type="submit" disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? "Saving & generating AI profile..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
