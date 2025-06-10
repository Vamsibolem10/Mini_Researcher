"use client";
import React, { useState } from "react";
import { ResearchForm, ResearchFormData } from "@/components/ResearchForm";
import { ResearchResults } from "@/components/ResearchResults";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { FollowupQuestions } from "@/components/FollowupQuestions";

type ResearchState = "INITIAL" | "FOLLOWUP" | "RESULTS";

export default function HomePage() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [researchState, setResearchState] = useState<ResearchState>("INITIAL");

  const [currentFormData, setCurrentFormData] = useState<ResearchFormData | null>(null);
  const [followupQuestions, setFollowupQuestions] = useState<string[]>([]);

  const handleInitialSubmit = async (formData: ResearchFormData) => {
    setIsLoading(true);
    setResult("");
    setCurrentFormData(formData);

    try {
      const followupResponse = await fetch("http://localhost:8080/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: formData.query }),
      });

      if (!followupResponse.ok) {
        throw new Error("Failed to get followup questions - " + followupResponse.statusText);
      }

      const followupData = await followupResponse.json();
      if (followupData.questions?.length) {
        setFollowupQuestions(followupData.questions);
        setResearchState("FOLLOWUP");
      } else {
        await submitResearch(formData, []);
      }
    } catch (error) {
      console.error("Error getting followup questions:", error);
      setResult("Error: " + (error instanceof Error ? error.message : String(error)));
      setResearchState("INITIAL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowupSubmit = async (answers: Array<{ question: string; answer: string }>) => {
    if (!currentFormData) return;
    setIsLoading(true);
    await submitResearch(currentFormData, answers);
  };

  const submitResearch = async (
    formData: ResearchFormData,
    followupAnswers: Array<{ question: string; answer: string }>
  ) => {
    try {
      const requestData = {
        query: formData.query,
        mode: formData.mode,
        breadth: formData.breadth,
        depth: formData.depth,
        followup_answers: followupAnswers,
      };

      const response = await fetch("http://localhost:8080/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit research - " + response.statusText);
      }

      const data = await response.json();
      setResult(data.result || JSON.stringify(data, null, 2));
      setResearchState("RESULTS");
    } catch (error) {
      console.error("Error submitting research:", error);
      setResult("Error: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  const resetResearch = () => {
    setResearchState("INITIAL");
    setResult("");
    setCurrentFormData(null);
    setFollowupQuestions([]);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-pink-100 text-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0 backdrop-blur-sm bg-white/60" />

      <div className="relative z-10">
        <header className="border-b border-gray-300 bg-white/70 backdrop-blur-sm shadow-sm">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-blue-900">Mini Researcher</h1>
            <p className="mt-2 text-base text-gray-700">
              An intelligent research assistant powered by AI
            </p>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-sm shadow-xl p-6 space-y-6">
                {researchState === "INITIAL" && (
                  <>
                    <h2 className="text-2xl font-semibold text-blue-900">Start Your Research</h2>
                    <ResearchForm onSubmit={handleInitialSubmit} isLoading={isLoading} />
                  </>
                )}

                {researchState === "FOLLOWUP" && (
                  <>
                    <h2 className="text-2xl font-semibold text-blue-900">Follow-up Questions</h2>
                    <FollowupQuestions
                      questions={followupQuestions}
                      onSubmit={handleFollowupSubmit}
                      isLoading={isLoading}
                    />
                  </>
                )}

                {researchState === "RESULTS" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-blue-900">Research Complete</h2>
                    <p className="text-sm text-gray-600">
                      Your research results are displayed on the right.
                    </p>
                    <button
                      onClick={resetResearch}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
                    >
                      Start a new research query
                    </button>
                  </div>
                )}

                <LoadingIndicator isLoading={isLoading} />
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-white/80 border border-gray-300 backdrop-blur-sm p-6 shadow-xl h-full">
                <ResearchResults result={result} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
