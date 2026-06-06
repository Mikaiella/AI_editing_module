"use server";

import fs from "fs/promises";
import path from "path";

export type EditChapterPayload = {
  chapterText: string;
  aiEdited?: boolean;
};

const jsonFilePath = path.join(
  process.cwd(),
  "src",
  "data",
  "demo-chapter.json",
);

async function readJson() {
  try {
    const fileData = await fs.readFile(jsonFilePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    return {
      chapterText: "Chapter text goes here...",
      aiEdited: false,
    };
  }
}

export async function getChapterForEdit() {
  try {
    const chapter = await readJson();
    return {
      chapterText: chapter.chapterText,
      aiEdited: chapter.aiEdited,
    };
  } catch (error) {
    console.error("Error reading demo JSON file:", error);
    return null;
  }
}

export async function updateChapterAction(data: EditChapterPayload) {
  if (!data.chapterText || data.chapterText.trim() === "") {
    return { error: "Chapter text is required" };
  }

  try {
    const updatedData = {
      chapterText: data.chapterText,
      aiEdited: !!data.aiEdited,
    };

    await fs.writeFile(jsonFilePath, JSON.stringify(updatedData), "utf-8");

    return { success: true };
  } catch (error) {
    console.error("Error writing to file:", error);
    return { error: "Failed to save changes to JSON file." };
  }
}
