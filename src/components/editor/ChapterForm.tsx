"use client";

import { useState, useMemo } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ConfirmModal from "@/components/editor/ConfirmModal";
import EditWithAIModal from "@/components/editor/EditWithAIModal";
import { AITracking } from "@/services/ai-tracking";
import {
  validateAISelection,
  AI_MIN_CHARS,
  AI_MAX_CHARS,
  AI_MAX_PARAGRAPHS,
} from "@/utils/validate-ai-selection";
import { AITemplate } from "@/types/ai-types";
import { ChapterFormData } from "@/types/chapter-types";

const CHAPTER_LIMIT = 60000;

interface ChapterFormProps {
  title: string;
  initialData?: ChapterFormData;
  error?: string;
  onSubmit: (data: ChapterFormData) => void;
  aiTemplates: AITemplate[];
  isTemplatesLoading: boolean;
  handleRequestEditWithAI: (
    template: AITemplate,
    text: string,
  ) => Promise<string>;
  aiAlreadyMarked?: boolean;
}

export default function ChapterForm({
  title,
  initialData,
  error,
  onSubmit,
  aiTemplates,
  isTemplatesLoading,
  handleRequestEditWithAI,
  aiAlreadyMarked = false,
}: ChapterFormProps) {
  const [chapterText, setChapterText] = useState(
    initialData?.chapterText || "",
  );
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [showAIConsentModal, setShowAIConsentModal] = useState(false);
  const [showAIEditModal, setShowAIEditModal] = useState(false);
  const [aiSnapshots, setAISnapshots] = useState<string[]>([]);

  const isDirty = useMemo(() => {
    if (!initialData) return true;
    return chapterText !== initialData.chapterText;
  }, [chapterText, initialData]);

  const aiSelectionStats = useMemo(() => {
    return validateAISelection(selectedText);
  }, [selectedText]);

  const isAISelectionValid = aiSelectionStats.isValid;
  const contentLength = aiSelectionStats.contentLength;

  const renderAITooltip = (props: any) => {
    const { reason } = aiSelectionStats;
    const messages: Record<string, string> = {
      noSelection: "Highlight the text to enable AI-editing features",
      tooManyParagraphs: `Too many paragraphs selected (max ${AI_MAX_PARAGRAPHS})`,
      tooShort: `Text is too short (min ${AI_MIN_CHARS} characters)`,
      tooLong: `Text is too long (max ${AI_MAX_CHARS} characters)`,
      lowQuality:
        "Selected fragment contains too many special characters or numbers",
      ready: "AI-editor is ready to work",
    };

    return (
      <Tooltip
        id="aiTooltip"
        {...props}
        style={{ ...props.style, fontSize: "0.8rem" }}
      >
        {messages[reason] || messages.noSelection}
      </Tooltip>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty || chapterText.length > CHAPTER_LIMIT) return;

    let aiDetected = aiAlreadyMarked;
    if (!aiDetected && aiSnapshots.length > 0) {
      aiDetected = AITracking.checkIfAIPresent(chapterText, aiSnapshots);
    }

    onSubmit({
      chapterText,
      aiEdited: aiDetected,
    });
  };

  const handleRegisterAIText = (text: string) => {
    const snapshot = AITracking.prepareSnapshot(text);
    setAISnapshots((prev) => {
      if (prev.includes(snapshot)) return prev;
      return [...prev, snapshot];
    });
  };

  const handleApplyAIText = (finalText: string) => {
    if (!selectionRange) return;
    setChapterText(
      (prev) =>
        prev.slice(0, selectionRange.start) +
        finalText +
        prev.slice(selectionRange.end),
    );
    setSelectedText("");
    setSelectionRange(null);
  };

  const currentAIStatus = initialData?.aiEdited || aiAlreadyMarked;

  return (
    <div className="container-fluid px-0">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <form
            onSubmit={handleSubmit}
            className="dairy_page p-3 p-md-5 rounded shadow-sm"
          >
            <div className="text-center mb-4">
              <h1 className="mb-2">{title}</h1>
              <div>
                {currentAIStatus ? (
                  <span className="badge bg-warning text-dark px-3 py-2 fw-bold small shadow-sm">
                    Edited with AI
                  </span>
                ) : (
                  <span className="badge bg-light text-muted px-3 py-2 border small">
                    Edited by human only
                  </span>
                )}
              </div>
            </div>

            {error && (
              <div className="alert alert-danger border-0 shadow-sm mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span className="small text-muted">Chapter text</span>
                <span
                  className={`small ${chapterText.length > CHAPTER_LIMIT ? "text-danger" : "text-muted"}`}
                >
                  {chapterText.length} / {CHAPTER_LIMIT}
                </span>
              </div>
              <textarea
                className="form-control border-0 shadow-sm"
                style={{
                  minHeight: "450px",
                  fontSize: "1.1rem",
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
                value={chapterText}
                onChange={(e) => setChapterText(e.target.value)}
                onSelect={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  setSelectedText(
                    target.value.substring(
                      target.selectionStart,
                      target.selectionEnd,
                    ),
                  );
                  setSelectionRange({
                    start: target.selectionStart,
                    end: target.selectionEnd,
                  });
                }}
                required
              />

              <div
                className="mt-2 p-2 rounded-3 d-flex flex-wrap justify-content-between align-items-center bg-white shadow-sm"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <div className="px-2 py-1">
                  <small
                    className="text-muted d-block"
                    style={{ fontSize: "0.75rem", lineHeight: "1.2" }}
                  >
                    {!selectedText ? (
                      "Highlight the words for using AI editing features"
                    ) : (
                      <span
                        className={
                          isAISelectionValid ? "text-success" : "text-danger"
                        }
                      >
                        {contentLength} characters
                      </span>
                    )}
                  </small>
                </div>

                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderAITooltip}
                >
                  <span>
                    <button
                      type="button"
                      className="btn btn-sm py-1 px-3 transition-all"
                      style={{
                        fontSize: "0.85rem",
                        backgroundColor: isAISelectionValid
                          ? "#000"
                          : "#f1f1f1",
                        color: isAISelectionValid ? "#fff" : "#999",
                        border: "none",
                      }}
                      disabled={!isAISelectionValid}
                      onClick={() => setShowAIConsentModal(true)}
                    >
                      Edit with AI
                    </button>
                  </span>
                </OverlayTrigger>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4 pt-4 border-top border-light">
              <button
                type="submit"
                className="btn btn-dark px-5 w-100 w-md-auto shadow-sm fw-bold transition-all"
                disabled={!isDirty}
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showAIConsentModal}
        title="Using AI"
        message="Do you agree to provide a selected text to AI for editing?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={() => {
          setShowAIConsentModal(false);
          setShowAIEditModal(true);
        }}
        onCancel={() => setShowAIConsentModal(false)}
      />

      <EditWithAIModal
        isOpen={showAIEditModal}
        selectedText={selectedText}
        templates={aiTemplates}
        isTemplatesLoading={isTemplatesLoading}
        onClose={() => setShowAIEditModal(false)}
        onApply={handleApplyAIText}
        onGenerated={handleRegisterAIText}
        handleRequestEditWithAI={handleRequestEditWithAI}
      />
    </div>
  );
}
