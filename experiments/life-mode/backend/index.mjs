// The one import path for a ChatGPT/LLM host or an external app.
// Established modules retain their stable paths while an incremental migration proceeds.
export {createSession,applySession,sessionPlayerView,sessionDirectorPacket,
 saveSession,loadSession,sessionBootstrap,CHAT_PROTOCOL_VERSION} from "../kingmaker-session.mjs";
export {renderPlayerTurn,exportChatHandoff} from "../chat-handoff.mjs";
export {listBackendContent,verifyBackendCatalog,BACKEND_LAYERS,BACKEND_CATALOG_VERSION} from "../backend-catalog.mjs";

export {AI_ACTION_SCHEMA,AI_TOOL_CONTRACT,verifyAiToolContract} from "../ai-tool-contract.mjs";
