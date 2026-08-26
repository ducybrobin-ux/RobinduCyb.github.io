/* pedagogy-engine.test.mjs — Tests unitaires pour @curios/pedagogy-engine
 *
 * Tests du moteur pédagogique (debrief, skills, progress).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateDebrief } from "../../packages/pedagogy-engine/src/debrief.js";
import { assessSkills } from "../../packages/pedagogy-engine/src/skills.js";
import { computeProgress, computeRanking } from "../../packages/pedagogy-engine/src/progress.js";

describe("generateDebrief", () => {
  it("returns correct summary", () => {
    const result = generateDebrief({
      teamName: "Les Aventuriers",
      progress: [
        { stationId: "B1", stars: 3 },
        { stationId: "B2", stars: 2 },
        { stationId: "B3", stars: 3 },
      ],
      totalStars: 8,
      durationSeconds: 3600,
    });

    assert.equal(result.team, "Les Aventuriers");
    assert.equal(result.summary.stationCount, 3);
    assert.equal(result.summary.totalStars, 8);
    assert.equal(result.summary.avgStars, 2.7);
    assert.equal(result.summary.performance, "excellent");
  });

  it("identifies strengths and weaknesses", () => {
    const result = generateDebrief({
      teamName: "Team",
      progress: [
        { stationId: "B1", stars: 3 },
        { stationId: "B2", stars: 0 },
        { stationId: "B3", stars: 3 },
      ],
      totalStars: 6,
      durationSeconds: 1800,
    });

    assert.equal(result.strengths.length, 2);
    assert.equal(result.weaknesses.length, 1);
  });

  it("generates questions based on performance", () => {
    const excellent = generateDebrief({
      teamName: "Team",
      progress: [{ stationId: "B1", stars: 3 }],
      totalStars: 3,
      durationSeconds: 600,
    });

    assert.ok(excellent.questions.length >= 4);
  });

  it("handles empty progress", () => {
    const result = generateDebrief({
      teamName: "Team",
      progress: [],
      totalStars: 0,
      durationSeconds: 0,
    });

    assert.equal(result.summary.stationCount, 0);
    assert.equal(result.summary.avgStars, 0);
  });
});

describe("assessSkills", () => {
  it("returns all skill definitions", () => {
    const result = assessSkills({
      progress: [{ stationId: "B1", stars: 3 }],
    });

    assert.ok(result.cooperation);
    assert.ok(result.communication);
    assert.ok(result.criticalThinking);
    assert.ok(result.perseverance);
    assert.ok(result.observation);
    assert.ok(result.problemSolving);
  });

  it("scores skills based on progress", () => {
    const result = assessSkills({
      progress: [
        { stationId: "B1", stars: 3 },
        { stationId: "B2", stars: 3 },
        { stationId: "B3", stars: 3 },
        { stationId: "B4", stars: 3 },
      ],
    });

    assert.ok(result.cooperation.score >= 5);
    assert.ok(result.observation.score >= 5);
  });

  it("handles empty progress", () => {
    const result = assessSkills({ progress: [] });

    assert.equal(result.cooperation.score, 0);
    assert.equal(result.observation.score, 0);
  });
});

describe("computeProgress", () => {
  it("computes completion rate", () => {
    const result = computeProgress({
      validations: ["B1", "B2"],
      stations: [
        { id: "B1", label: "Station 1" },
        { id: "B2", label: "Station 2" },
        { id: "B3", label: "Station 3" },
      ],
    });

    assert.equal(result.totalStations, 3);
    assert.equal(result.validatedCount, 2);
    assert.equal(result.completionRate, 67);
    assert.equal(result.isComplete, false);
  });

  it("computes stars", () => {
    const result = computeProgress({
      validations: ["B1", "B2"],
      stations: [
        { id: "B1", label: "Station 1" },
        { id: "B2", label: "Station 2" },
      ],
      progress: [
        { stationId: "B1", stars: 3 },
        { stationId: "B2", stars: 2 },
      ],
    });

    assert.equal(result.totalStars, 5);
    assert.equal(result.maxStars, 6);
    assert.equal(result.starsRate, 83);
  });

  it("identifies remaining stations", () => {
    const result = computeProgress({
      validations: ["B1"],
      stations: [
        { id: "B1", label: "Station 1" },
        { id: "B2", label: "Station 2" },
        { id: "B3", label: "Station 3" },
      ],
    });

    assert.equal(result.remaining.length, 2);
    assert.ok(result.remaining.includes("B2"));
    assert.ok(result.remaining.includes("B3"));
  });

  it("marks complete when all validated", () => {
    const result = computeProgress({
      validations: ["B1", "B2", "B3"],
      stations: [
        { id: "B1", label: "Station 1" },
        { id: "B2", label: "Station 2" },
        { id: "B3", label: "Station 3" },
      ],
    });

    assert.equal(result.isComplete, true);
    assert.equal(result.completionRate, 100);
  });
});

describe("computeRanking", () => {
  it("computes rank", () => {
    const result = computeRanking({
      teamProgress: { teamId: "team2", totalStars: 8, totalTime: 3000 },
      allProgress: [
        { teamId: "team1", totalStars: 10, totalTime: 2500 },
        { teamId: "team2", totalStars: 8, totalTime: 3000 },
        { teamId: "team3", totalStars: 5, totalTime: 4000 },
      ],
    });

    assert.equal(result.rank, 2);
    assert.equal(result.total, 3);
  });

  it("handles single team", () => {
    const result = computeRanking({
      teamProgress: { teamId: "team1", totalStars: 10, totalTime: 2500 },
      allProgress: [
        { teamId: "team1", totalStars: 10, totalTime: 2500 },
      ],
    });

    assert.equal(result.rank, 1);
    assert.equal(result.total, 1);
    assert.equal(result.percentile, 100);
  });

  it("handles empty allProgress", () => {
    const result = computeRanking({
      teamProgress: { teamId: "team1", totalStars: 10, totalTime: 2500 },
      allProgress: [],
    });

    assert.equal(result.rank, 1);
    assert.equal(result.total, 1);
  });
});
