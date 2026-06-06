export class AITracking {
  private static readonly SIMILARITY_THRESHOLD = 0.45;
  private static readonly MIN_SNAPSHOT_LENGTH = 200;
  private static readonly SHINGLE_SIZE = 3;

  static checkIfAIPresent(fullText: string, snapshots: string[]): boolean {
    if (!fullText || snapshots.length === 0) {
      return false;
    }

    const softNormalizedFullText = this.normalize(fullText, false);

    for (const rawSnapshot of snapshots) {
      const softSnapshot = this.normalize(rawSnapshot, false);

      if (softSnapshot.length < this.MIN_SNAPSHOT_LENGTH) continue;

      if (softNormalizedFullText.includes(softSnapshot)) {
        return true;
      }
    }

    const hardNormalizedFullText = this.normalize(fullText, true);
    const fullTextShingles = this.getShingles(hardNormalizedFullText);

    if (fullTextShingles.size === 0) return false;

    for (const rawSnapshot of snapshots) {
      const hardSnapshot = this.normalize(rawSnapshot, true);

      if (hardSnapshot.length < this.MIN_SNAPSHOT_LENGTH) continue;

      const snapshotShingles = this.getShingles(hardSnapshot);

      const similarity = this.calculateOverlap(
        snapshotShingles,
        fullTextShingles,
      );

      if (similarity >= this.SIMILARITY_THRESHOLD) {
        return true;
      }
    }

    return false;
  }

  private static normalize(text: string, removePunctuation: boolean): string {
    let normalized = text.toLowerCase().replace(/<[^>]*>/g, " ");

    if (removePunctuation) {
      normalized = normalized.replace(/[^\p{L}\p{N}\s]/gu, "");
    }

    return normalized.replace(/\s+/g, " ").trim();
  }

  private static getShingles(text: string): Set<string> {
    const words = text.split(" ").filter((word) => word.length > 0);
    const shingles = new Set<string>();

    if (words.length < this.SHINGLE_SIZE) {
      if (words.length > 0) shingles.add(words.join(" "));
      return shingles;
    }

    for (let i = 0; i <= words.length - this.SHINGLE_SIZE; i++) {
      const shingle = words.slice(i, i + this.SHINGLE_SIZE).join(" ");
      shingles.add(shingle);
    }

    return shingles;
  }

  private static calculateOverlap(
    snapshotSet: Set<string>,
    fullTextSet: Set<string>,
  ): number {
    if (snapshotSet.size === 0) return 0;

    let matches = 0;
    for (const shingle of snapshotSet) {
      if (fullTextSet.has(shingle)) {
        matches++;
      }
    }

    return matches / snapshotSet.size;
  }

  static prepareSnapshot(text: string): string {
    return text.trim();
  }
}
