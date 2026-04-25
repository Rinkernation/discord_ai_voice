export interface CharacterConfig {
    name: string;
    systemPrompt: string;
    voicevoxSpeakerId: number;
    replies: {
        emptyMessage: string;
        leaveMessage: string;
        errorMessage: string;
    };
}
