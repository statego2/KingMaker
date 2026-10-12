import test from "node:test";
import assert from "node:assert/strict";
import {findStrategicMaterial} from "./knowledge-retrieval.mjs";
test("Greek billionaire and political ambitions retrieve grounded content without making those outcomes true",()=>{
 const money=findStrategicMaterial("Θέλω να γίνω δισεκατομμυριούχος και να χτίσω επιχειρήσεις");
 assert.equal(money.identified,true);
 assert.equal(money.candidates[0].id,"CASE-01");
 assert.equal(money.candidates[0].availability,"bounded-executable-world");
 assert.equal(money.candidates[0].executableScenario,"venture-alliance");
 assert.ok(money.candidates[0].authoredMechanisms.length>=3);
 const election=findStrategicMaterial("Θέλω πολιτική εξουσία, κυβέρνηση και συνασπισμό");
 assert.equal(election.candidates[0].id,"CASE-03");
 assert.equal(election.candidates[0].executableScenario,"local-reform");
 assert.doesNotMatch(JSON.stringify(election),/guaranteed-victory/);
});
test("book study and love match different but equally legitimate life paths",()=>{
 const study=findStrategicMaterial("Θέλω να διαβάζω βιβλία και να κάνω μελέτη");
 assert.equal(study.candidates[0].id,"CASE-11");
 assert.equal(study.candidates[0].availability,"authored-reference-only");
 const social=findStrategicMaterial("Θέλω φιλία και ερωτική σχέση");
 assert.equal(social.candidates[0].id,"CASE-07");
 assert.equal(social.candidates[0].executableScenario,null);
 assert.ok(social.candidates[0].authoredMechanisms.some(x=>x.competencies.length>=2));
});
test("retrieval is stable, limited, accent-insensitive and never fabricates a case when there are no cues",()=>{
 assert.deepEqual(findStrategicMaterial("ΣΧΈΣΗ"),findStrategicMaterial("σχεση"));
 assert.deepEqual(findStrategicMaterial("οτιδήποτε", {limit:2}).candidates,[]);
 assert.ok(findStrategicMaterial("πολιτική επιχειρήσεις οικονομία σχέσεις", {limit:2}).candidates.length<=2);
 assert.throws(()=>findStrategicMaterial(123),/Invalid intent/);
 assert.throws(()=>findStrategicMaterial("x",{limit:0}),/Invalid retrieval/);
});
