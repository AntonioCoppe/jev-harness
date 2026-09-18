import { whoSpeaksNextQuestions } from "../../../../recipes/agent-comm-harness/who-speaks-next.js";
const q = whoSpeaksNextQuestions(["researcher", "critic", "synthesizer"]);
console.log(JSON.stringify(q, null, 2));
