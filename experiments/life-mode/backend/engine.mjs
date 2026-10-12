// Advanced engine access for tests and specialist agents; not the ordinary AI interface.
export {beginLife,act,replayLife,playerView,saveLife,loadLife} from "../world-simulator.mjs";
export {beginStrategy,strategyTurn,replayStrategy,strategyPlayerView,
 strategyDesignerAudit} from "../strategic-director.mjs";
export {beginSaga,sagaCommand,replaySaga,sagaPlayerView,saveSaga,loadSaga} from "../strategic-saga.mjs";
