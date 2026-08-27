/* studio.test.mjs — Tests unitaires pour @curios/studio
 *
 * Tests du workflow, de l'historique et de la validation.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createWorkflow, STEPS } from "../../packages/studio/src/workflow.js";
import { createHistory } from "../../packages/studio/src/history.js";

describe("STEPS", () => {
  it("has 8 steps", () => {
    assert.equal(STEPS.length, 8);
  });

  it("each step has required fields", () => {
    for (const step of STEPS) {
      assert.ok(step.id);
      assert.ok(step.label);
      assert.ok(step.icon);
      assert.ok(step.description);
      assert.ok(Array.isArray(step.fields));
      assert.ok(Array.isArray(step.required));
    }
  });
});

describe("createWorkflow", () => {
  it("starts at step 0", () => {
    const wf = createWorkflow();
    assert.equal(wf.state.currentStep, 0);
  });

  it("canGoNext returns false when required fields are empty", () => {
    const wf = createWorkflow();
    assert.equal(wf.canGoNext(), false);
  });

  it("canGoNext returns true when required fields are filled", () => {
    const wf = createWorkflow();
    wf.updateData("title", "Mon parcours");
    wf.updateData("theme", "Nature");
    assert.equal(wf.canGoNext(), true);
  });

  it("goNext advances to next step", () => {
    const wf = createWorkflow();
    wf.updateData("title", "Test");
    wf.updateData("theme", "Test");
    assert.equal(wf.goNext(), true);
    assert.equal(wf.state.currentStep, 1);
  });

  it("goPrev goes back to previous step", () => {
    const wf = createWorkflow();
    wf.updateData("title", "Test");
    wf.updateData("theme", "Test");
    wf.goNext();
    assert.equal(wf.goPrev(), true);
    assert.equal(wf.state.currentStep, 0);
  });

  it("goPrev returns false at step 0", () => {
    const wf = createWorkflow();
    assert.equal(wf.goPrev(), false);
  });

  it("updateData sets nested values", () => {
    const wf = createWorkflow();
    wf.updateData("location.name", "Mon lieu");
    assert.equal(wf.state.data.location.name, "Mon lieu");
  });

  it("getData retrieves nested values", () => {
    const wf = createWorkflow();
    wf.updateData("location.center.lat", 46.03);
    assert.equal(wf.getData("location.center.lat"), 46.03);
  });
});

describe("Balises", () => {
  it("addBalise creates a new balise with correct id", () => {
    const wf = createWorkflow();
    const id = wf.addBalise();
    assert.equal(id, "B1");
    assert.equal(wf.state.data.balises.length, 1);
    assert.equal(wf.state.data.balises[0].id, "B1");
  });

  it("removeBalise removes by id", () => {
    const wf = createWorkflow();
    wf.addBalise();
    wf.addBalise();
    wf.removeBalise("B1");
    assert.equal(wf.state.data.balises.length, 1);
    assert.equal(wf.state.data.balises[0].id, "B2");
  });
});

describe("Discoveries", () => {
  it("addDiscovery creates a new discovery", () => {
    const wf = createWorkflow();
    const id = wf.addDiscovery();
    assert.equal(id, "decouverte-1");
    assert.equal(wf.state.data.discoveries.length, 1);
  });

  it("removeDiscovery removes by id", () => {
    const wf = createWorkflow();
    wf.addDiscovery();
    wf.removeDiscovery("decouverte-1");
    assert.equal(wf.state.data.discoveries.length, 0);
  });
});

describe("Events", () => {
  it("addEvent creates a new event", () => {
    const wf = createWorkflow();
    const id = wf.addEvent();
    assert.equal(id, "event-1");
    assert.equal(wf.state.data.events.length, 1);
    assert.equal(wf.state.data.events[0].type, "BALISE_FOUND");
  });

  it("removeEvent removes by id", () => {
    const wf = createWorkflow();
    wf.addEvent();
    wf.removeEvent("event-1");
    assert.equal(wf.state.data.events.length, 0);
  });

  it("updateEvent modifies event properties", () => {
    const wf = createWorkflow();
    wf.addEvent();
    wf.updateData("events.0.type", "QUIZ_COMPLETED");
    wf.updateData("events.0.trigger", "always");
    wf.updateData("events.0.description", "Récompense quand le quiz est terminé");
    assert.equal(wf.state.data.events[0].type, "QUIZ_COMPLETED");
    assert.equal(wf.state.data.events[0].description, "Récompense quand le quiz est terminé");
  });

  it("toParcours includes events", () => {
    const wf = createWorkflow();
    wf.updateData("title", "Test");
    wf.updateData("theme", "Test");
    wf.addEvent();
    wf.updateData("events.0.description", "Test event");
    const doc = wf.toParcours();
    assert.equal(doc.events.length, 1);
    assert.equal(doc.events[0].type, "BALISE_FOUND");
  });
});

describe("Debriefing", () => {
  it("addDebriefQuestion creates a question", () => {
    const wf = createWorkflow();
    const id = wf.addDebriefQuestion();
    assert.equal(id, "q-1");
    assert.equal(wf.state.data.debriefing.questions.length, 1);
  });

  it("removeDebriefQuestion removes by id", () => {
    const wf = createWorkflow();
    wf.addDebriefQuestion();
    wf.removeDebriefQuestion("q-1");
    assert.equal(wf.state.data.debriefing.questions.length, 0);
  });

  it("addCompetence adds a competence", () => {
    const wf = createWorkflow();
    wf.addCompetence();
    assert.equal(wf.state.data.debriefing.competences.length, 1);
  });

  it("removeCompetence removes by index", () => {
    const wf = createWorkflow();
    wf.addCompetence();
    wf.addCompetence();
    wf.removeCompetence(0);
    assert.equal(wf.state.data.debriefing.competences.length, 1);
  });

  it("toParcours includes debriefing", () => {
    const wf = createWorkflow();
    wf.updateData("title", "Test");
    wf.updateData("theme", "Test");
    wf.addDebriefQuestion();
    wf.updateData("debriefing.questions.0.text", "Qu'avez-vous appris ?");
    const doc = wf.toParcours();
    assert.ok(doc.debriefing);
    assert.equal(doc.debriefing.questions.length, 1);
    assert.equal(doc.debriefing.questions[0].text, "Qu'avez-vous appris ?");
  });
});

describe("Validation", () => {
  it("validate returns errors for empty workflow", () => {
    const wf = createWorkflow();
    const result = wf.validate();
    assert.equal(result.passed, false);
    assert.ok(result.errors.length > 0);
  });

  it("validate passes when all required fields are filled", () => {
    const wf = createWorkflow();
    wf.updateData("title", "Mon parcours");
    wf.updateData("theme", "Nature");
    wf.updateData("location.name", "Mon lieu");
    wf.updateData("audience", { minAge: 6, maxAge: 12 });
    const result = wf.validate();
    assert.equal(result.passed, true);
  });

  it("validate warns about empty balises", () => {
    const wf = createWorkflow();
    wf.updateData("title", "Test");
    wf.updateData("theme", "Test");
    wf.updateData("location.name", "Lieu");
    wf.updateData("audience", { minAge: 6, maxAge: 12 });
    const result = wf.validate();
    assert.ok(result.warnings.some((w) => w.includes("balise")));
  });
});

describe("toParcours", () => {
  it("generates a valid curios-parcours document", () => {
    const wf = createWorkflow();
    wf.updateData("title", "Mon Parcours");
    wf.updateData("theme", "Nature");
    wf.updateData("location.name", "Forêt");
    wf.updateData("location.region", "Creuse");
    wf.updateData("location.center", { lat: 46.03, lng: 2.55 });
    wf.updateData("audience", { minAge: 6, maxAge: 12 });

    // Add a balise
    const baliseId = wf.addBalise();
    wf.updateData("balises.0.label", "Première halte");
    wf.updateData("balises.0.lat", 46.031);
    wf.updateData("balises.0.lng", 2.553);
    wf.updateData("balises.0.enigmes.facile.text", "Quel est le nom de cet arbre ?");
    wf.updateData("balises.0.enigmes.facile.answers", ["chêne"]);

    // Add a discovery
    const discId = wf.addDiscovery();
    wf.updateData("discoveries.0.nom", "Le chêne");
    wf.updateData("discoveries.0.latin", "Quercus robur");

    const doc = wf.toParcours();
    assert.equal(doc.$format, "curios-parcours");
    assert.equal(doc.$version, 1);
    assert.equal(doc.title, "Mon Parcours");
    assert.equal(doc.stations.length, 1);
    assert.equal(doc.stations[0].label, "Première halte");
    assert.ok(doc.stations[0].missions.length > 0);
    assert.equal(doc.stations[0].missions[0].type, "enigme");
    assert.ok(Array.isArray(doc.events));
    assert.ok(doc.debriefing);
  });
});

describe("createHistory", () => {
  it("starts empty", () => {
    const h = createHistory();
    assert.equal(h.size(), 0);
    assert.equal(h.canUndo(), false);
    assert.equal(h.canRedo(), false);
  });

  it("push adds a snapshot", () => {
    const h = createHistory();
    h.push({ step: 0, data: "test" });
    assert.equal(h.size(), 1);
    assert.equal(h.canUndo(), false);
    assert.equal(h.canRedo(), false);
  });

  it("undo returns previous snapshot", () => {
    const h = createHistory();
    h.push({ step: 0 });
    h.push({ step: 1 });
    const snapshot = h.undo();
    assert.deepEqual(snapshot, { step: 0 });
    assert.equal(h.canRedo(), true);
  });

  it("redo returns next snapshot", () => {
    const h = createHistory();
    h.push({ step: 0 });
    h.push({ step: 1 });
    h.undo();
    const snapshot = h.redo();
    assert.deepEqual(snapshot, { step: 1 });
  });

  it("clear resets history", () => {
    const h = createHistory();
    h.push({ step: 0 });
    h.push({ step: 1 });
    h.clear();
    assert.equal(h.size(), 0);
    assert.equal(h.current(), null);
  });

  it("respects maxSteps limit", () => {
    const h = createHistory(3);
    for (let i = 0; i < 10; i++) h.push({ step: i });
    assert.equal(h.size(), 3);
  });

  it("truncates future on push", () => {
    const h = createHistory();
    h.push({ step: 0 });
    h.push({ step: 1 });
    h.push({ step: 2 });
    h.undo();
    h.undo();
    h.push({ step: "new" });
    assert.equal(h.size(), 2);
    assert.deepEqual(h.current(), { step: "new" });
  });
});
