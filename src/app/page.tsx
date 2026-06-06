"use client";

import { useState, useEffect, useCallback } from "react";
import ChapterForm from "@/components/editor/ChapterForm";
import { editWithAIAction, getAITemplatesAction } from "@/actions/edit-with-ai";
import {
  getChapterForEdit,
  updateChapterAction,
} from "@/actions/edit-chapter-actions";
import { ChapterFormData } from "@/types/chapter-types";
import { AITemplate } from "@/types/ai-types";

export default function EditChapterPage() {
  const [initialData, setInitialData] = useState<ChapterFormData>({
    chapterText: "",
    aiEdited: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiTemplates, setAITemplates] = useState<AITemplate[]>([]);
  const [isTemplatesLoading, setIsTemplatesLoading] = useState(false);

  useEffect(() => {
    async function initPage() {
      setIsLoading(true);
      setIsTemplatesLoading(true);
      try {
        const [chapterData, templates] = await Promise.all([
          getChapterForEdit(),
          getAITemplatesAction(),
        ]);

        if (chapterData) {
          setInitialData(chapterData);
        }
        setAITemplates(templates);
      } catch (err) {
        setError("Error loading page data");
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsTemplatesLoading(false);
      }
    }

    initPage();
  }, []);

  const handleSave = async (updatedData: ChapterFormData) => {
    setError("");
    try {
      const result = await updateChapterAction(updatedData);

      if (result.error) {
        setError(result.error);
        return;
      }

      alert("Successfully saved!");

      setInitialData(updatedData);
    } catch (err) {
      setError("Error saving chapter data");
      console.error(err);
    }
  };

  const handleRequestEditWithAI = useCallback(
    async (template: AITemplate, text: string) => {
      try {
        const result = await editWithAIAction(template.key, text);
        return result.editedText;
      } catch (e) {
        throw new Error("AI-editing failed");
      }
    },
    [],
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="container p-3">
      <ChapterForm
        title="Demo chapter editor – AI-editing features"
        initialData={initialData}
        error={error}
        onSubmit={handleSave}
        aiTemplates={aiTemplates}
        isTemplatesLoading={isTemplatesLoading}
        handleRequestEditWithAI={handleRequestEditWithAI}
        aiAlreadyMarked={initialData.aiEdited}
      />
    </main>
  );
}
