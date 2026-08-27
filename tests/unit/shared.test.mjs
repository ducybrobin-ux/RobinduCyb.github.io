import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { esc } from "../../packages/shared/src/escape.js";
import { createEventBus } from "../../packages/shared/src/event-bus.js";

/* ─── escape ─── */
describe("esc", () => {
  it("échappe & < > \" '", () => {
    assert.equal(esc('&<>"\''), "&amp;&lt;&gt;&quot;&#39;");
  });

  it("retourne \"\" pour null / undefined", () => {
    assert.equal(esc(null), "");
    assert.equal(esc(undefined), "");
  });

  it("ne modifie pas une chaîne propre", () => {
    assert.equal(esc("hello world"), "hello world");
  });

  it("convertit les non-strings", () => {
    assert.equal(esc(42), "42");
    assert.equal(esc(true), "true");
  });
});

/* ─── event-bus ─── */
describe("createEventBus", () => {
  it("émet et reçoit un événement", () => {
    const bus = createEventBus();
    let received = null;
    bus.on("test", (val) => {
      received = val;
    });
    bus.emit("test", 42);
    assert.equal(received, 42);
  });

  it("supporte plusieurs arguments", () => {
    const bus = createEventBus();
    let args = [];
    bus.on("multi", (a, b, c) => {
      args = [a, b, c];
    });
    bus.emit("multi", "x", "y", "z");
    assert.deepEqual(args, ["x", "y", "z"]);
  });

  it("off supprime le listener", () => {
    const bus = createEventBus();
    let count = 0;
    const fn = () => {
      count++;
    };
    bus.on("inc", fn);
    bus.emit("inc");
    assert.equal(count, 1);
    bus.off("inc", fn);
    bus.emit("inc");
    assert.equal(count, 1);
  });

  it("on retourne une fonction de désabonnement", () => {
    const bus = createEventBus();
    let called = false;
    const unsub = bus.on("auto", () => {
      called = true;
    });
    bus.emit("auto");
    assert.equal(called, true);
    unsub();
    called = false;
    bus.emit("auto");
    assert.equal(called, false);
  });

  it("once ne déclenche qu'une seule fois", () => {
    const bus = createEventBus();
    let count = 0;
    bus.once("once", () => {
      count++;
    });
    bus.emit("once");
    bus.emit("once");
    assert.equal(count, 1);
  });

  it("clear supprime tous les listeners", () => {
    const bus = createEventBus();
    let a = 0,
      b = 0;
    bus.on("x", () => a++);
    bus.on("y", () => b++);
    bus.clear();
    bus.emit("x");
    bus.emit("y");
    assert.equal(a, 0);
    assert.equal(b, 0);
  });

  it("les erreurs dans les listeners n'arrêtent pas les autres", () => {
    const bus = createEventBus();
    let good = false;
    bus.on("bad", () => {
      throw new Error("boom");
    });
    bus.on("bad", () => {
      good = true;
    });
    bus.emit("bad");
    assert.equal(good, true);
  });
});
