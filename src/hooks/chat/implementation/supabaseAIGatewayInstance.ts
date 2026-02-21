import type { AIGatewayInterface } from "../interface/aiGatewayInterface";
import { SupabaseAIGateway } from "./supabaseAIGateway";

export const createSupabaseAIGateway = (): AIGatewayInterface => ({
    getResponseStream: (request, onChunk, signal) =>
        SupabaseAIGateway.getResponseStream(request, onChunk, signal),
    getOcrResult: (imageUrls) => SupabaseAIGateway.getOcrResult(imageUrls),
    parseGradingResult: (aiReply, userImageUrls) =>
        SupabaseAIGateway.parseGradingResult(aiReply, userImageUrls),
    generateTitle: (messages) => SupabaseAIGateway.generateTitle(messages),
});

