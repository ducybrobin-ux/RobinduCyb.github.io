import vm from "node:vm";
import fs from "node:fs";

const ctx = { window: {} };
ctx.window.CURIOS_ENGINE = {
  normalize(s) {
    return (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[''\u2019]/g," ").replace(/\s+/g," ").trim();
  },
  checkAnswer(e,a) {
    const n = this.normalize(a);
    if (!n) return false;
    return (e.reponses||[]).some(r=> this.normalize(r)===n || this.normalize(r)===n.replace(/^(le |la |un |une |l )/,""));
  },
  makeQuiz(b) {
    return b.quiz.map((q,i)=>{
      const entries = q.options.map((o,j)=>({o,j}));
      entries.sort(()=>Math.random()-0.5);
      return {bird:b.id,num:i,q:q.q,options:entries.map(e=>e.o),reponse:entries.findIndex(e=>e.j===q.reponse)};
    });
  },
  getEnigme(b,d) {
    if (!b) return null;
    d = d||"facile";
    if (b.enigmes && b.enigmes[d]) return b.enigmes[d];
    return b.enigme || null;
  }
};
vm.createContext(ctx);

const code = fs.readFileSync(process.argv[2], "utf8");
vm.runInContext(code, ctx, { filename: "data.js" });

let pass = true;
const ok = (name, val) => { console.log("  " + name + ": " + val); if (!val) pass = false; };

ok("allBirds",  typeof ctx.allBirds === "function");
ok("getBird",   typeof ctx.getBird  === "function");
ok("normalize",      typeof ctx.normalize      === "function");
ok("checkAnswer",    typeof ctx.checkAnswer    === "function");
ok("makeQuiz",       typeof ctx.makeQuiz       === "function");
ok("getEnigme",      typeof ctx.getEnigme      === "function");
ok("allBirds().length", ctx.allBirds().length === 33);
ok("normalize accents", ctx.normalize("Été") === "ete");
ok("checkAnswer", ctx.checkAnswer({reponses:["fontaine"]},"La Fontaine"));
ok("getEnigme text", ctx.getEnigme(ctx.getBalise("B1"),"facile").text.length > 10);

if (!pass) process.exit(1);
console.log("smoke engine OK");
