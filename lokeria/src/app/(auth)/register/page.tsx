"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ArrowRight, ArrowLeft, X, Check, User, GraduationCap } from "lucide-react";
import { signUp } from "@/actions/auth";
import { useState, useRef, KeyboardEvent } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 fields
  const [major, setMajor] = useState("");
  const [skillField, setSkillField] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const interestInputRef = useRef<HTMLInputElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  const handleNextStep = () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setStep(2);
  };

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

  const handleSubmit = async () => {
    if (!major.trim()) {
      toast.error("Please enter your major");
      return;
    }
    if (!skillField.trim()) {
      toast.error("Please enter your skill field");
      return;
    }
    if (interests.length === 0) {
      toast.error("Please add at least one interest");
      return;
    }
    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("major", major);
    formData.append("skill_field", skillField);
    formData.append("interests", JSON.stringify(interests));
    formData.append("skills", JSON.stringify(skills));

    const result = await signUp(formData);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Account", icon: User },
    { number: 2, label: "Profile", icon: GraduationCap },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg overflow-hidden">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Briefcase className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-heading">Create account</CardTitle>
          <CardDescription>
            {step === 1
              ? "Enter your account details to get started"
              : "Tell us more about yourself"}
          </CardDescription>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-0 mt-6 px-8">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      step > s.number
                        ? "border-primary bg-primary text-primary-foreground"
                        : step === s.number
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted-foreground/30 bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.number ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <s.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors duration-300 ${
                      step >= s.number
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="relative w-24 mx-3 mb-5">
                    <div className="h-[2px] w-full bg-muted-foreground/20 rounded-full" />
                    <div
                      className={`absolute top-0 left-0 h-[2px] rounded-full bg-primary transition-all duration-500 ease-out ${
                        step > s.number ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {/* Step 1: Account Info */}
          <div
            className={`transition-all duration-300 ${
              step === 1
                ? "opacity-100 translate-x-0"
                : "opacity-0 absolute pointer-events-none -translate-x-8"
            }`}
          >
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                </div>
                <Button
                  type="button"
                  className="w-full gap-2"
                  onClick={handleNextStep}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Step 2: Profile Info */}
          <div
            className={`transition-all duration-300 ${
              step === 2
                ? "opacity-100 translate-x-0"
                : "opacity-0 absolute pointer-events-none translate-x-8"
            }`}
          >
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Input
                    id="major"
                    placeholder="e.g. Computer Science"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill_field">Skill Field</Label>
                  <Input
                    id="skill_field"
                    placeholder="e.g. Web Development"
                    value={skillField}
                    onChange={(e) => setSkillField(e.target.value)}
                    required
                  />
                </div>

                {/* Interests Tag Input */}
                <div className="space-y-2">
                  <Label htmlFor="interests">Interests</Label>
                  <div className="flex flex-wrap gap-1.5 min-h-[2.5rem] p-2 rounded-md border border-input bg-background">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="gap-1 pr-1 animate-in fade-in zoom-in-95 duration-200"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <Input
                      ref={interestInputRef}
                      id="interests"
                      className="flex-1 min-w-[120px] border-0 p-0 h-6 focus-visible:ring-0 shadow-none"
                      placeholder={
                        interests.length === 0
                          ? "Type & press Enter to add..."
                          : "Add more..."
                      }
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={handleAddInterest}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Press Enter to add each interest
                  </p>
                </div>

                {/* Skills Tag Input */}
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <div className="flex flex-wrap gap-1.5 min-h-[2.5rem] p-2 rounded-md border border-input bg-background">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="gap-1 pr-1 animate-in fade-in zoom-in-95 duration-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <Input
                      ref={skillInputRef}
                      id="skills"
                      className="flex-1 min-w-[120px] border-0 p-0 h-6 focus-visible:ring-0 shadow-none"
                      placeholder={
                        skills.length === 0
                          ? "Type & press Enter to add..."
                          : "Add more..."
                      }
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Press Enter to add each skill
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 gap-2"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
