// @ts-check
// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unused imports
import {Call as $Call, Create as $Create} from "@wailsio/runtime";

/**
 * CreateDirectory creates a directory or multiple directories recursively.
 * @param {string} path
 * @returns {Promise<void> & { cancel(): void }}
 */
export function CreateDirectory(path) {
    let $resultPromise = /** @type {any} */($Call.ByID(847424631, path));
    return $resultPromise;
}

/**
 * ReadFile reads a text file.
 * @param {string} path
 * @returns {Promise<string> & { cancel(): void }}
 */
export function ReadFile(path) {
    let $resultPromise = /** @type {any} */($Call.ByID(731559306, path));
    return $resultPromise;
}

/**
 * Remove removes a directory or file. If the given path is a directory, this function recursively removes all contents of the specific directory.
 * @param {string} path
 * @returns {Promise<void> & { cancel(): void }}
 */
export function Remove(path) {
    let $resultPromise = /** @type {any} */($Call.ByID(3095806768, path));
    return $resultPromise;
}

/**
 * WriteFile writes a text file.
 * @param {string} path
 * @param {string} data
 * @returns {Promise<void> & { cancel(): void }}
 */
export function WriteFile(path, data) {
    let $resultPromise = /** @type {any} */($Call.ByID(2990795945, path, data));
    return $resultPromise;
}
