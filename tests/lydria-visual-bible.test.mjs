import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const bible=JSON.parse(readFileSync(new URL('../data/lydria_visual_bible_v1.json',import.meta.url),'utf8'));
test('KM-012 setting coverage and unapproved status',()=>{assert.equal(bible.locations.length,7);assert.equal(bible.status,'proposal_requires_owner_art_review');for(const location of bible.locations){assert.equal(location.motifs.length,3);assert.equal(location.shots.length,3);assert.equal(Object.keys(location.palette).length,4);}});
