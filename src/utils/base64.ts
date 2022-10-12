/**
 * Purpose of this file is to provide a reusable base64 encoder/decoder, that will encode user paths so that they do not conflict with the internal delimiter used, as seen with the '~' character. Before it was '-', and no routes with '-' were allowed. This is allows for more flexibility in the routes.
 */

// Language: typescript


export function encodeBase64(str: string): string {
    return Buffer.from(str).toString('base64'); 
}

export function decodeBase64(str: string): string {
    return Buffer.from(str, 'base64').toString();
}