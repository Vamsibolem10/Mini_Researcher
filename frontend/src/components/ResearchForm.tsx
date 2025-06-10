"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ResearchFormProps {
  onSubmit: (data: ResearchFormData) => void;
  isLoading: boolean;
}

export interface ResearchFormData {
  query: string;
  mode: string;
  breadth: number;
  depth: number;
}

export function ResearchForm({ onSubmit, isLoading }: ResearchFormProps) {
  const [mode, setMode] = React.useState("balanced");
  const [numQueries, setNumQueries] = React.useState(5);
  const [depth, setDepth] = React.useState(3);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    switch (mode) {
      case "fast":
        setNumQueries(3);
        setDepth(2);
        break;
      case "balanced":
        setNumQueries(5);
        setDepth(3);
        break;
      case "comprehensive":
        setNumQueries(5);
        setDepth(5);
        break;
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      query,
      mode,
      breadth: numQueries,
      depth,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Research Query Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Research Query</label>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Impact of AI on Climate Modeling"
          className="w-full"
        />
      </div>

      {/* Research Mode Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Research Mode</label>
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fast">
              <div className="flex flex-col">
                <span className="font-medium">Fast</span>
                <span className="text-xs text-muted-foreground">Quick research (~1-3 min)</span>
              </div>
            </SelectItem>
            <SelectItem value="balanced">
              <div className="flex flex-col">
                <span className="font-medium">Balanced</span>
                <span className="text-xs text-muted-foreground">Moderate depth (~3-6 min)</span>
              </div>
            </SelectItem>
            <SelectItem value="comprehensive">
              <div className="flex flex-col">
                <span className="font-medium">Comprehensive</span>
                <span className="text-xs text-muted-foreground">In-depth (~5-12 min)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Mode Details */}
        <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          <div className="font-medium text-primary mb-2">Mode Details:</div>
          {mode === "fast" && (
            <ul className="list-disc space-y-1 pl-4">
              <li>Quick, surface-level research</li>
              <li>Up to 3 queries</li>
              <li>No recursive deep diving</li>
              <li>Ideal for rapid insights</li>
            </ul>
          )}
          {mode === "balanced" && (
            <ul className="list-disc space-y-1 pl-4">
              <li>Moderate depth and range</li>
              <li>Up to 7 queries</li>
              <li>Focuses on core relationships</li>
              <li>Recommended for general research</li>
            </ul>
          )}
          {mode === "comprehensive" && (
            <ul className="list-disc space-y-1 pl-4">
              <li>Exhaustive analysis</li>
              <li>Recursive deep dives</li>
              <li>Explores all relationship levels</li>
              <li>Ideal for academic/technical depth</li>
            </ul>
          )}
        </div>
      </div>

      {/* Breadth Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-foreground">Number of Queries</label>
          <span className="text-sm font-medium text-primary">{numQueries}</span>
        </div>
        <Slider
          value={[numQueries]}
          min={1}
          max={mode === "fast" ? 3 : mode === "balanced" ? 7 : 5}
          step={1}
          onValueChange={(vals) => setNumQueries(vals[0])}
          className="py-2"
        />
        <p className="text-xs text-muted-foreground">
          Broader coverage provides multiple perspectives on the topic.
        </p>
      </div>

      {/* Depth Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-foreground">Research Depth</label>
          <span className="text-sm font-medium text-primary">{depth}</span>
        </div>
        <Slider
          value={[depth]}
          min={1}
          max={mode === "fast" ? 2 : mode === "balanced" ? 3 : 5}
          step={1}
          onValueChange={(vals) => setDepth(vals[0])}
          className="py-2"
        />
        <p className="text-xs text-muted-foreground">
          Higher depth yields more detailed insights into each sub-topic.
        </p>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Researching..." : "Start Research"}
      </Button>
    </form>
  );
}
