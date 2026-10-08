/**
 * Narrative onboarding only: who the player has met as of the scene index.
 * Keep complete simulation relationships privately in engine state.
 * In the future, replace this coarse chapter-gate with observed-introduction flags.
 */
const reveals=[
  [0,["lea_marin","mara_eltan"]],
  [1,["nela_orr"]],
  [2,["ivo_marek","elena_varin"]],
  [3,["niko_arven"]],
  [6,["nadia_serrin","selma_aric","anton_beran"]],
  [9,["adrian_kessar","mira_solen","viktor_sarin","liora_venn"]],
  [13,["silas_koren"]]
];
export function knownPeople(sceneIndex=0){
  const i=Math.max(0,Number.isFinite(sceneIndex)?sceneIndex:0);
  return reveals.filter(([firstScene])=>i>=firstScene).flatMap(([,people])=>people);
}
