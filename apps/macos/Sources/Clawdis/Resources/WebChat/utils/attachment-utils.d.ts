export interface Attachment {
    id: string;
    type: "image" | "document";
    fileName: string;
    mimeType: string;
    size: number;
    content: string;
    extractedText?: string;
    preview?: string;
}
/**
 * Load an attachment from various sources
 * @param source - URL string, File, Blob, or ArrayBuffer
 * @param fileName - Optional filename override
 * @returns Promise<Attachment>
 * @throws Error if loading fails
 */
export declare function loadAttachment(source: string | File | Blob | ArrayBuffer, fileName?: string): Promise<Attachment>;
//# sourceMappingURL=attachment-utils.d.ts.map