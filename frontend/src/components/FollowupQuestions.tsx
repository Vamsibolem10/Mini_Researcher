"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FollowupQuestionsProps {
  questions: string[];
  onSubmit: (answers: Array<{ question: string; answer: string }>) => void;
  isLoading: boolean;
}

export function FollowupQuestions({ questions, onSubmit, isLoading }: FollowupQuestionsProps) {
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const questionAnswers = questions.map((question, index) => ({
      question,
      answer: answers[index] || "No answer provided",
    }));
    onSubmit(questionAnswers);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-muted/50 p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">
          To better understand your research needs, please answer the following:
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, index) => (
          <motion.div
            key={index}
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <label className="block text-sm font-semibold text-foreground">
              {question}
            </label>
            <Input
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder="Type your answer..."
              className="w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            />
          </motion.div>
        ))}

        <Button
          type="submit"
          disabled={isLoading || answers.every((a) => !a.trim())}
          className="w-full transition-colors duration-200 disabled:opacity-60"
        >
          {isLoading ? "Processing..." : "Submit Answers"}
        </Button>
      </form>
    </div>
  );
}
