"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useCallback } from "react";

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [workType, setWorkType] = useState(searchParams.get("work_type") || "");
  const [experience, setExperience] = useState(
    searchParams.get("experience") || ""
  );
  const [salaryRange, setSalaryRange] = useState([
    Number(searchParams.get("min_salary")) || 0,
    Number(searchParams.get("max_salary")) || 300000,
  ]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    if (workType) params.set("work_type", workType);
    if (experience) params.set("experience", experience);
    if (salaryRange[0] > 0) params.set("min_salary", salaryRange[0].toString());
    if (salaryRange[1] < 300000)
      params.set("max_salary", salaryRange[1].toString());
    router.push(`/jobs?${params.toString()}`);
  }, [query, location, workType, experience, salaryRange, router]);

  const clearFilters = () => {
    setQuery("");
    setLocation("");
    setWorkType("");
    setExperience("");
    setSalaryRange([0, 300000]);
    router.push("/jobs");
  };

  const hasActiveFilters =
    query || location || workType || experience || salaryRange[0] > 0 || salaryRange[1] < 300000;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Job title, keyword, or company..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          className="pl-10"
        />
      </div>

      <Separator />

      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-7 text-xs"
            onClick={clearFilters}
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Location
        </Label>
        <Input
          placeholder="e.g. New York, London..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        />
      </div>

      {/* Work Type */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Work Type
        </Label>
        <Select value={workType} onValueChange={setWorkType}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="REMOTE">Remote</SelectItem>
            <SelectItem value="HYBRID">Hybrid</SelectItem>
            <SelectItem value="ONSITE">On-site</SelectItem>
            <SelectItem value="INTERN">Intern</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Experience Level
        </Label>
        <Select value={experience} onValueChange={setExperience}>
          <SelectTrigger>
            <SelectValue placeholder="Any level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Entry">Entry Level</SelectItem>
            <SelectItem value="Mid">Mid Level</SelectItem>
            <SelectItem value="Senior">Senior Level</SelectItem>
            <SelectItem value="Lead">Lead / Principal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Salary Range */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground">
          Salary Range
        </Label>
        <Slider
          value={salaryRange}
          onValueChange={setSalaryRange}
          max={300000}
          min={0}
          step={10000}
          className="py-2"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>${(salaryRange[0] / 1000).toFixed(0)}k</span>
          <span>${(salaryRange[1] / 1000).toFixed(0)}k</span>
        </div>
      </div>

      <Button onClick={applyFilters} className="w-full">
        <Search className="mr-2 h-4 w-4" />
        Apply Filters
      </Button>
    </div>
  );
}
