// /**
//  * Purpose of this file is to provide a reusable base64 encoder/decoder, that will encode user paths so that they do not conflict with the internal delimiter used, as seen with the '~' character. Before it was '-', and no routes with '-' were allowed. This is allows for more flexibility in the routes.
//  * 
//  * Decoding of base64 is broken, so I will use the mozilla implementation for now. 
// */

// // Language: typescript


// // Array of bytes to Base64 string decoding
// function b64ToUint6(nChr) {
//     return nChr > 64 && nChr < 91
//         ? nChr - 65
//         : nChr > 96 && nChr < 123
//             ? nChr - 71
//             : nChr > 47 && nChr < 58
//                 ? nChr + 4
//                 : nChr === 43
//                     ? 62
//                     : nChr === 47
//                         ? 63
//                         : 0;
// }

// function base64DecToArr(sBase64, nBlocksSize) {
//     const sB64Enc = sBase64.replace(/[^A-Za-z0-9+/]/g, "");
//     const nInLen = sB64Enc.length;
//     const nOutLen = nBlocksSize
//         ? Math.ceil(((nInLen * 3 + 1) >> 2) / nBlocksSize) * nBlocksSize
//         : (nInLen * 3 + 1) >> 2;
//     const taBytes = new Uint8Array(nOutLen);

//     let nMod3;
//     let nMod4;
//     let nUint24 = 0;
//     let nOutIdx = 0;
//     for (let nInIdx = 0; nInIdx < nInLen; nInIdx++) {
//         nMod4 = nInIdx & 3;
//         nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << (6 * (3 - nMod4));
//         if (nMod4 === 3 || nInLen - nInIdx === 1) {
//             nMod3 = 0;
//             while (nMod3 < 3 && nOutIdx < nOutLen) {
//                 taBytes[nOutIdx] = (nUint24 >>> ((16 >>> nMod3) & 24)) & 255;
//                 nMod3++;
//                 nOutIdx++;
//             }
//             nUint24 = 0;
//         }
//     }

//     return taBytes;
// }

// /* Base64 string to array encoding */
// function uint6ToB64(nUint6) {
//     return nUint6 < 26
//         ? nUint6 + 65
//         : nUint6 < 52
//             ? nUint6 + 71
//             : nUint6 < 62
//                 ? nUint6 - 4
//                 : nUint6 === 62
//                     ? 43
//                     : nUint6 === 63
//                         ? 47
//                         : 65;
// }

// function base64EncArr(aBytes) {
//     let nMod3 = 2;
//     let sB64Enc = "";

//     const nLen = aBytes.length;
//     let nUint24 = 0;
//     for (let nIdx = 0; nIdx < nLen; nIdx++) {
//         nMod3 = nIdx % 3;
//         if (nIdx > 0 && ((nIdx * 4) / 3) % 76 === 0) {
//             sB64Enc += "\r\n";
//         }

//         nUint24 |= aBytes[nIdx] << ((16 >>> nMod3) & 24);
//         if (nMod3 === 2 || aBytes.length - nIdx === 1) {
//             sB64Enc += String.fromCodePoint(
//                 uint6ToB64((nUint24 >>> 18) & 63),
//                 uint6ToB64((nUint24 >>> 12) & 63),
//                 uint6ToB64((nUint24 >>> 6) & 63),
//                 uint6ToB64(nUint24 & 63)
//             );
//             nUint24 = 0;
//         }
//     }
//     return (
//         sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) +
//         (nMod3 === 2 ? "" : nMod3 === 1 ? "=" : "==")
//     );
// }

// /* UTF-8 array to JS string and vice versa */

// function UTF8ArrToStr(aBytes) {
//     let sView = "";
//     let nPart;
//     const nLen = aBytes.length;
//     for (let nIdx = 0; nIdx < nLen; nIdx++) {
//         nPart = aBytes[nIdx];
//         sView += String.fromCodePoint(
//             nPart > 251 && nPart < 254 && nIdx + 5 < nLen /* six bytes */
//                 ? /* (nPart - 252 << 30) may be not so safe in ECMAScript! So…: */
//                 (nPart - 252) * 1073741824 +
//                 ((aBytes[++nIdx] - 128) << 24) +
//                 ((aBytes[++nIdx] - 128) << 18) +
//                 ((aBytes[++nIdx] - 128) << 12) +
//                 ((aBytes[++nIdx] - 128) << 6) +
//                 aBytes[++nIdx] -
//                 128
//                 : nPart > 247 && nPart < 252 && nIdx + 4 < nLen /* five bytes */
//                     ? ((nPart - 248) << 24) +
//                     ((aBytes[++nIdx] - 128) << 18) +
//                     ((aBytes[++nIdx] - 128) << 12) +
//                     ((aBytes[++nIdx] - 128) << 6) +
//                     aBytes[++nIdx] -
//                     128
//                     : nPart > 239 && nPart < 248 && nIdx + 3 < nLen /* four bytes */
//                         ? ((nPart - 240) << 18) +
//                         ((aBytes[++nIdx] - 128) << 12) +
//                         ((aBytes[++nIdx] - 128) << 6) +
//                         aBytes[++nIdx] -
//                         128
//                         : nPart > 223 && nPart < 240 && nIdx + 2 < nLen /* three bytes */
//                             ? ((nPart - 224) << 12) +
//                             ((aBytes[++nIdx] - 128) << 6) +
//                             aBytes[++nIdx] -
//                             128
//                             : nPart > 191 && nPart < 224 && nIdx + 1 < nLen /* two bytes */
//                                 ? ((nPart - 192) << 6) + aBytes[++nIdx] - 128
//                                 : /* nPart < 127 ? */ /* one byte */
//                                 nPart
//         );
//     }
//     return sView;
// }

// function strToUTF8Arr(sDOMStr) {
//     let aBytes;
//     let nChr;
//     const nStrLen = sDOMStr.length;
//     let nArrLen = 0;

//     /* mapping… */
//     for (let nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
//         nChr = sDOMStr.codePointAt(nMapIdx);

//         if (nChr > 65536) {
//             nMapIdx++;
//         }

//         nArrLen +=
//             nChr < 0x80
//                 ? 1
//                 : nChr < 0x800
//                     ? 2
//                     : nChr < 0x10000
//                         ? 3
//                         : nChr < 0x200000
//                             ? 4
//                             : nChr < 0x4000000
//                                 ? 5
//                                 : 6;
//     }

//     aBytes = new Uint8Array(nArrLen);

//     /* transcription… */
//     let nIdx = 0;
//     let nChrIdx = 0;
//     while (nIdx < nArrLen) {
//         nChr = sDOMStr.codePointAt(nChrIdx);
//         if (nChr < 128) {
//             /* one byte */
//             aBytes[nIdx++] = nChr;
//         } else if (nChr < 0x800) {
//             /* two bytes */
//             aBytes[nIdx++] = 192 + (nChr >>> 6);
//             aBytes[nIdx++] = 128 + (nChr & 63);
//         } else if (nChr < 0x10000) {
//             /* three bytes */
//             aBytes[nIdx++] = 224 + (nChr >>> 12);
//             aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
//             aBytes[nIdx++] = 128 + (nChr & 63);
//         } else if (nChr < 0x200000) {
//             /* four bytes */
//             aBytes[nIdx++] = 240 + (nChr >>> 18);
//             aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
//             aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
//             aBytes[nIdx++] = 128 + (nChr & 63);
//             nChrIdx++;
//         } else if (nChr < 0x4000000) {
//             /* five bytes */
//             aBytes[nIdx++] = 248 + (nChr >>> 24);
//             aBytes[nIdx++] = 128 + ((nChr >>> 18) & 63);
//             aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
//             aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
//             aBytes[nIdx++] = 128 + (nChr & 63);
//             nChrIdx++;
//         } /* if (nChr <= 0x7fffffff) */ else {
//             /* six bytes */
//             aBytes[nIdx++] = 252 + (nChr >>> 30);
//             aBytes[nIdx++] = 128 + ((nChr >>> 24) & 63);
//             aBytes[nIdx++] = 128 + ((nChr >>> 18) & 63);
//             aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
//             aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
//             aBytes[nIdx++] = 128 + (nChr & 63);
//             nChrIdx++;
//         }
//         nChrIdx++;
//     }

//     return aBytes;
// }




// export function encodeBase64(str: string):string {
//     const UTF8Array = strToUTF8Arr(str);
//     const base64String = base64EncArr(UTF8Array);
//     return base64String;
// }

// export function decodeBase64(str: string):string {
//     const UTF8Array = base64DecToArr(str, 1);
//     const base64String = UTF8ArrToStr(UTF8Array);
//     return base64String;
// }

// // export function encodeBase64(str: string): string {
// //     const x = Buffer.from(str, 'utf8').toString('base64');
// //     console.log(str);
// //     console.log('Encoded: ' + x);
// //     return x
// // }

// // export function decodeBase64(str: string): string {
// //     const z = Buffer.from(str, 'base64')
// //     console.log(`str: ${str}`);
// //     console.log(z)
// //     const x = z.toString('utf8');
// //     console.log(`Decoded: ${x}`);
// //     return x
// // }