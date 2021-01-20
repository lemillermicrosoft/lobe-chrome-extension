/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background/background.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/typescript-lru-cache/dist/LRUCache.js":
/*!************************************************************!*\
  !*** ./node_modules/typescript-lru-cache/dist/LRUCache.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LRUCache = void 0;
const LRUCacheNode_1 = __webpack_require__(/*! ./LRUCacheNode */ "./node_modules/typescript-lru-cache/dist/LRUCacheNode.js");
class LRUCache {
    /**
     * Creates a new instance of the LRUCache.
     *
     * @param options Additional configuration options for the LRUCache.
     */
    constructor(options) {
        this.lookupTable = new Map();
        this.head = null;
        this.tail = null;
        const { maxSize = 25, entryExpirationTimeInMS = null, onEntryEvicted, onEntryMarkedAsMostRecentlyUsed } = options || {};
        if (Number.isNaN(maxSize) || maxSize <= 0) {
            throw new Error('maxSize must be greater than 0.');
        }
        if (typeof entryExpirationTimeInMS === 'number' &&
            (entryExpirationTimeInMS <= 0 || Number.isNaN(entryExpirationTimeInMS))) {
            throw new Error('entryExpirationTimeInMS must either be null (no expiry) or greater than 0');
        }
        this.maxSizeInternal = maxSize;
        this.entryExpirationTimeInMS = entryExpirationTimeInMS;
        this.onEntryEvicted = onEntryEvicted;
        this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
    }
    /**
     * Returns the number of entries in the LRUCache object.
     *
     * @returns The number of entries in the cache.
     */
    get size() {
        return this.lookupTable.size;
    }
    /**
     * Returns the number of entries that can still be added to the LRUCache without evicting existing entries.
     *
     * @returns The number of entries that can still be added without evicting existing entries.
     */
    get remainingSize() {
        return this.maxSizeInternal - this.size;
    }
    /**
     * Returns the most recently used (newest) entry in the cache.
     * This will not mark the entry as recently used.
     *
     * @returns The most recently used (newest) entry in the cache.
     */
    get newest() {
        if (!this.head) {
            return null;
        }
        return this.mapNodeToEntry(this.head);
    }
    /**
     * Returns the least recently used (oldest) entry in the cache.
     * This will not mark the entry as recently used.
     *
     * @returns The least recently used (oldest) entry in the cache.
     */
    get oldest() {
        if (!this.tail) {
            return null;
        }
        return this.mapNodeToEntry(this.tail);
    }
    /**
     * Returns the max number of entries the LRUCache can hold.
     *
     * @returns The max size for the cache.
     */
    get maxSize() {
        return this.maxSizeInternal;
    }
    /**
     * Sets the maxSize of the cache.
     * This will evict the least recently used entries if needed to reach new maxSize.
     *
     * @param value The new value for maxSize. Must be greater than 0.
     */
    set maxSize(value) {
        if (Number.isNaN(value) || value <= 0) {
            throw new Error('maxSize must be greater than 0.');
        }
        this.maxSizeInternal = value;
        this.enforceSizeLimit();
    }
    /**
     * Sets the value for the key in the LRUCache object. Returns the LRUCache object.
     * This marks the newly added entry as the most recently used entry.
     * If adding the new entry makes the cache size go above maxSize,
     * this will evict the least recently used entries until size is equal to maxSize.
     *
     * @param key The key of the entry.
     * @param value The value to set for the key.
     * @param entryOptions Additional configuration options for the cache entry.
     * @returns The LRUCache instance.
     */
    set(key, value, entryOptions) {
        const currentNodeForKey = this.lookupTable.get(key);
        if (currentNodeForKey) {
            this.removeNodeFromListAndLookupTable(currentNodeForKey);
        }
        const node = new LRUCacheNode_1.LRUCacheNode(key, value, {
            entryExpirationTimeInMS: this.entryExpirationTimeInMS,
            onEntryEvicted: this.onEntryEvicted,
            onEntryMarkedAsMostRecentlyUsed: this.onEntryMarkedAsMostRecentlyUsed,
            ...entryOptions
        });
        this.setNodeAsHead(node);
        this.lookupTable.set(key, node);
        this.enforceSizeLimit();
        return this;
    }
    /**
     * Returns the value associated to the key, or null if there is none or if the entry is expired.
     * If an entry is returned, this marks the returned entry as the most recently used entry.
     *
     * @param key The key of the entry to get.
     * @returns The cached value or null.
     */
    get(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
            return null;
        }
        if (node.isExpired) {
            this.removeNodeFromListAndLookupTable(node);
            return null;
        }
        this.setNodeAsHead(node);
        return node.value;
    }
    /**
     * Returns the value associated to the key, or null if there is none or if the entry is expired.
     * If an entry is returned, this will not mark the entry as most recently accessed.
     * Useful if a value is needed but the order of the cache should not be changed.
     *
     * @param key The key of the entry to get.
     * @returns The cached value or null.
     */
    peek(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
            return null;
        }
        if (node.isExpired) {
            this.removeNodeFromListAndLookupTable(node);
            return null;
        }
        return node.value;
    }
    /**
     * Deletes the entry for the passed in key.
     *
     * @param key The key of the entry to delete
     * @returns True if an element in the LRUCache object existed and has been removed,
     * or false if the element does not exist.
     */
    delete(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
            return false;
        }
        return this.removeNodeFromListAndLookupTable(node);
    }
    /**
     * Returns a boolean asserting whether a value has been associated to the key in the LRUCache object or not.
     * This does not mark the entry as recently used.
     *
     * @param key The key of the entry to check if exists
     * @returns true if the cache contains the supplied key. False if not.
     */
    has(key) {
        return this.lookupTable.has(key);
    }
    /**
     * Removes all entries in the cache.
     */
    clear() {
        this.head = null;
        this.tail = null;
        this.lookupTable.clear();
    }
    /**
     * Searches the cache for an entry matching the passed in condition.
     * Expired entries will be skipped (and removed).
     * If multiply entries in the cache match the condition, the most recently used entry will be returned.
     * If an entry is returned, this marks the returned entry as the most recently used entry.
     *
     * @param condition The condition to apply to each entry in the
     * @returns The first cache entry to match the condition. Null if none match.
     */
    find(condition) {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            const entry = this.mapNodeToEntry(node);
            if (condition(entry)) {
                this.setNodeAsHead(node);
                return entry;
            }
            node = node.next;
        }
        return null;
    }
    /**
     * Iterates over and applies the callback function to each entry in the cache.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as recently used.
     *
     * @param callback the callback function to apply to the entry
     */
    forEach(callback) {
        let node = this.head;
        let index = 0;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            callback(node.value, node.key, index);
            node = node.next;
            index++;
        }
    }
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache values.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache values.
     */
    *values() {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            yield node.value;
            node = node.next;
        }
    }
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache keys.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache keys.
     */
    *keys() {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            yield node.key;
            node = node.next;
        }
    }
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache entries.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache entries.
     */
    *entries() {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            yield this.mapNodeToEntry(node);
            node = node.next;
        }
    }
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache entries.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache entries.
     */
    *[Symbol.iterator]() {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            yield this.mapNodeToEntry(node);
            node = node.next;
        }
    }
    enforceSizeLimit() {
        let node = this.tail;
        while (node !== null && this.size > this.maxSizeInternal) {
            const prev = node.prev;
            this.removeNodeFromListAndLookupTable(node);
            node = prev;
        }
    }
    mapNodeToEntry({ key, value }) {
        return {
            key,
            value
        };
    }
    setNodeAsHead(node) {
        this.removeNodeFromList(node);
        if (!this.head) {
            this.head = node;
            this.tail = node;
        }
        else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }
        node.invokeOnEntryMarkedAsMostRecentlyUsed();
    }
    removeNodeFromList(node) {
        if (node.prev !== null) {
            node.prev.next = node.next;
        }
        if (node.next !== null) {
            node.next.prev = node.prev;
        }
        if (this.head === node) {
            this.head = node.next;
        }
        if (this.tail === node) {
            this.tail = node.prev;
        }
        node.next = null;
        node.prev = null;
    }
    removeNodeFromListAndLookupTable(node) {
        node.invokeOnEvicted();
        this.removeNodeFromList(node);
        return this.lookupTable.delete(node.key);
    }
}
exports.LRUCache = LRUCache;
//# sourceMappingURL=LRUCache.js.map

/***/ }),

/***/ "./node_modules/typescript-lru-cache/dist/LRUCacheNode.js":
/*!****************************************************************!*\
  !*** ./node_modules/typescript-lru-cache/dist/LRUCacheNode.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LRUCacheNode = void 0;
class LRUCacheNode {
    constructor(key, value, options) {
        const { entryExpirationTimeInMS = null, next = null, prev = null, onEntryEvicted, onEntryMarkedAsMostRecentlyUsed } = options || {};
        if (typeof entryExpirationTimeInMS === 'number' &&
            (entryExpirationTimeInMS <= 0 || Number.isNaN(entryExpirationTimeInMS))) {
            throw new Error('entryExpirationTimeInMS must either be null (no expiry) or greater than 0');
        }
        this.key = key;
        this.value = value;
        this.created = Date.now();
        this.entryExpirationTimeInMS = entryExpirationTimeInMS;
        this.next = next;
        this.prev = prev;
        this.onEntryEvicted = onEntryEvicted;
        this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
    }
    get isExpired() {
        return typeof this.entryExpirationTimeInMS === 'number' && Date.now() - this.created > this.entryExpirationTimeInMS;
    }
    invokeOnEvicted() {
        if (this.onEntryEvicted) {
            const { key, value, isExpired } = this;
            this.onEntryEvicted({ key, value, isExpired });
        }
    }
    invokeOnEntryMarkedAsMostRecentlyUsed() {
        if (this.onEntryMarkedAsMostRecentlyUsed) {
            const { key, value } = this;
            this.onEntryMarkedAsMostRecentlyUsed({ key, value });
        }
    }
}
exports.LRUCacheNode = LRUCacheNode;
//# sourceMappingURL=LRUCacheNode.js.map

/***/ }),

/***/ "./node_modules/typescript-lru-cache/dist/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/typescript-lru-cache/dist/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(/*! ./LRUCache */ "./node_modules/typescript-lru-cache/dist/LRUCache.js"), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./src/background/background.ts":
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_lru_cache_1 = __webpack_require__(/*! typescript-lru-cache */ "./node_modules/typescript-lru-cache/dist/index.js");
var selectedProject = undefined;
var projects = undefined;
// chrome.storage.local.set({ selectedProject: selectedProject });
chrome.storage.local.clear();
var sendSelectedProject = function (project) {
    chrome.runtime.sendMessage(__assign({ type: "SELECTED_PROJECT" }, project));
};
// Get locally stored value
function InitializeProjects(callback) {
    chrome.storage.local.get("selectedProject", function (res) {
        GetProjects().then(function (data) {
            projects = data.data.projects.map(function (project) {
                return { id: project.id, selectionLabel: project.meta.name };
            });
            chrome.storage.local.set({
                projects: projects,
            });
            console.log("durp: " + JSON.stringify(res));
            if (res["selectedProject"] === undefined) {
                selectedProject = projects[0];
                LoadProject(selectedProject.id).then(function (data) {
                    // alert(`project loaded: ${JSON.stringify(data)}`);
                    predictionCache.clear();
                    chrome.storage.local.set({
                        selectedProject: {
                            id: selectedProject.id,
                            selectionLabel: selectedProject.selectionLabel,
                        },
                    });
                });
                console.log("Setting default selection: " + JSON.stringify(selectedProject));
            }
            callback && callback(projects);
        });
    });
}
InitializeProjects();
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tab.url.includes("http")) {
        chrome.tabs.executeScript(tabId, { file: "./injectscript.js" }, function () {
            chrome.tabs.executeScript(tabId, { file: "./content.bundle.js" }, function () {
                console.log("INJECTED AND EXECUTED");
            });
        });
    }
});
chrome.runtime.onMessage.addListener(function (message) {
    switch (message.type) {
        case "GET_SELECTED_PROJECT":
            console.log("project requested: " + JSON.stringify(selectedProject));
            sendSelectedProject(selectedProject);
            break;
        case "SELECT_PROJECT":
            console.log("setting project: " + JSON.stringify(selectedProject.id) + " to " + JSON.stringify(message.id) + " with " + JSON.stringify(message.selectionLabel));
            if (selectedProject.id !== message.id) {
                // TODO Load Project -- if this fails? don't change selection? Alert?
                LoadProject(message.id).then(function (data) {
                    // alert(`project loaded: ${JSON.stringify(data)}`);
                    predictionCache.clear();
                    selectedProject.id = message.id;
                    selectedProject.selectionLabel = message.selectionLabel;
                    chrome.storage.local.set({
                        selectedProject: {
                            id: message.id,
                            selectionLabel: message.selectionLabel,
                        },
                    });
                });
            }
            break;
        default:
            break;
    }
});
var urlToBase64 = {};
// const base64ToProjectsContaining: Record<
//   string,
//   { projects: Array<string> }
// > = {};
var predictionCache = new typescript_lru_cache_1.LRUCache({
    entryExpirationTimeInMS: 1000 * 60,
    maxSize: 500,
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "convert_image_url_to_data_url") {
        if (urlToBase64[request.url]) {
            console.log("cache image data!");
            sendResponse({ data: urlToBase64[request.url] });
        }
        else {
            console.log("populating cache image data!");
            var canvas = document.createElement("canvas");
            var img = new Image();
            img.crossOrigin = "anonymous";
            img.addEventListener("load", function () {
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext("2d").drawImage(img, 0, 0);
                var data = canvas.toDataURL("image/jpeg");
                urlToBase64[request.url] = data;
                sendResponse({ data: data });
            });
            img.src = request.url;
        }
        return true; // Required for async sendResponse()
    }
    else if (request.message == "get_projects") {
        InitializeProjects(function (data) {
            sendResponse({ data: data });
        });
        return true;
    }
    else if (request.message == "get_some_labels") {
        console.info("get_labels");
        // TODO interfaces for these messages
        var projectId = request.projectId;
        GetDatastream(projectId)
            .then(function (dataStreams) {
            var targets;
            console.info("get_labels Got DataStream ; " + JSON.stringify(dataStreams));
            for (var dx = 0; dx < dataStreams.length; dx++) {
                var dataStream = dataStreams[dx];
                if (dataStream.category === "target") {
                    targets = dataStream.classes;
                }
            }
            console.info("get_labels Got targets ; " + JSON.stringify(targets));
            sendResponse({ data: targets });
        })
            .catch(function (err) {
            console.error("error: " + JSON.stringify(err));
        });
        return true;
    }
    else if (request.message == "post_prediction") {
        // TODO interfaces for these messages
        var projectId_1 = request.projectId;
        var base64Image_1 = request.base64Image;
        var label_1 = request.label;
        GetDatastream(projectId_1)
            .then(function (dataStreams) {
            var targets;
            var inputs;
            for (var dx = 0; dx < dataStreams.length; dx++) {
                var dataStream = dataStreams[dx];
                if (dataStream.category === "input") {
                    inputs = dataStream.lobeId;
                } // if (dataStream.category === "target")
                else {
                    targets = dataStream.lobeId;
                }
            }
            return [targets, inputs];
        })
            .then(function (value) {
            var targets = value[0], inputs = value[1];
            return PostItemImage(projectId_1, inputs, base64Image_1).then(function (example) {
                console.log("Got Example: " + JSON.stringify(example));
                return PostItemLabel(projectId_1, targets, example[0].exampleId, label_1);
            });
        })
            .then(function (example) {
            // alert(`Sending Response: ${JSON.stringify(example)}`);
            sendResponse({ data: example });
        });
        return true;
    }
    else if (request.message == "get_prediction") {
        var projectId_2 = request.projectId;
        var base64Image_2 = request.base64Image;
        var knownPrediction = predictionCache.peek(base64Image_2);
        if (knownPrediction) {
            // console.log(`Awaiting prediction cache`);
            // console.log(`Awaiting prediction cache ${hashCode(base64Image)}`);
            predictionCache.set(base64Image_2, knownPrediction.then(function (data) {
                // console.log(`Cache promise complete! ${hashCode(base64Image)}`);
                // console.log(`sendResponse({ data: data }); ${hashCode(base64Image)}`);
                // console.log(`${data} ${hashCode(base64Image)}`);
                sendResponse({ data: data });
                return data;
            }));
        }
        else {
            predictionCache.set(base64Image_2, new Promise(function (resolve, reject) {
                console.log("Fetching prediction");
                // console.log(`Fetching prediction ${hashCode(base64Image)}`);
                var data = JSON.stringify({
                    inputs: {
                        Image: base64Image_2 === null || base64Image_2 === void 0 ? void 0 : base64Image_2.split("base64,")[1],
                    },
                });
                var xhr = new XMLHttpRequest();
                // xhr.withCredentials = true;
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === this.DONE) {
                        // alert(`hey: ${this.responseText}`);
                        // console.log(`Prediction FOUND ${hashCode(base64Image)}`);
                        // console.log(`resolve({ data: this.responseText }); ${hashCode(base64Image)}`);
                        // console.log(`${this.responseText} ${hashCode(base64Image)}`);
                        resolve(this.responseText);
                    }
                });
                xhr.open("POST", "http://localhost:38100/predict/" + projectId_2 //5a866fee-3d04-412e-b5e0-50f5fc586ad2"
                );
                xhr.send(data);
            }).then(function (data) {
                // console.log(`Initial promise complete ${hashCode(base64Image)}`);
                // console.log(`sendResponse({ data: data }); ${hashCode(base64Image)}`);
                // console.log(`${JSON.stringify(data)} ${hashCode(base64Image)}`);
                sendResponse({ data: data });
                return data;
            }));
        }
        return true;
    }
});
function LoadProject(projectId) {
    var formData = new FormData();
    formData.append("query", "{projects}");
    var graphqlURL = "http://localhost:38101/graphql";
    ("mutation LoadProject($projectId:ID!){loadProject(projectId:$projectId)}");
    return fetch(graphqlURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            variables: JSON.stringify({ projectId: projectId }),
            query: "\nmutation LoadProject($projectId:ID!) {\n  loadProject(projectId:$projectId)\n}",
        }),
    }).then(function (response) { return response.json(); });
}
function GetProjects() {
    var formData = new FormData();
    formData.append("query", "{projects}");
    var graphqlURL = "http://localhost:38101/graphql";
    return fetch(graphqlURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: "\n    query {\n      projects {\n        id\n        meta {\n          name\n          description\n          category\n          userSaved\n          displayInBrowse\n          type\n          templateId\n          optimization\n        }\n      }\n    }",
        }),
    }).then(function (response) { return response.json(); }); // TODO interface
}
function GetDatastream(projectId) {
    var dataStreamsUrl = "http://localhost:38101/data/v1/project/" + projectId + "/datastream";
    return fetch(dataStreamsUrl)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        return data;
    });
}
function PostItemImage(projectId, imageDataStream, base64Image) {
    var dataStreamUrl = "http://localhost:38101/data/v1/project/" + projectId + "/datastream/";
    var inputUrl = dataStreamUrl + imageDataStream + "/item";
    return fetch(base64Image)
        .then(function (res) { return res.blob(); })
        .then(function (blob) {
        var inputItems = {
            isTest: false,
            item: "",
            type: "image",
            exampleId: "",
            timestamp: Date.now(),
        };
        var formData = new FormData();
        formData.append("items[]", JSON.stringify(inputItems));
        formData.append("file", blob, "image.png");
        // fetch(inputUrl, {method: 'POST'})
        return fetch(inputUrl, {
            method: "POST",
            body: formData,
        })
            .then(function (response) { return response.json(); })
            .then(function (exampleJson) {
            return exampleJson;
        })
            .catch(function (error) { return alert("error caught: " + error); });
    });
}
function PostItemLabel(projectId, labelDataStream, exampleId, label) {
    var dataStreamUrl = "http://localhost:38101/data/v1/project/" + projectId + "/datastream/";
    var inputUrl = dataStreamUrl + labelDataStream + "/item";
    var targetItems = {
        isTest: false,
        item: label,
        type: "text",
        exampleId: exampleId,
        timestamp: Date.now(),
    };
    var targetFormData = new FormData();
    targetFormData.append("items[]", JSON.stringify(targetItems));
    return fetch(inputUrl, {
        method: "POST",
        body: targetFormData,
    })
        .then(function (response) { return response.json(); })
        .then(function (exampleJson) {
        return exampleJson;
    });
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3R5cGVzY3JpcHQtbHJ1LWNhY2hlL2Rpc3QvTFJVQ2FjaGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3R5cGVzY3JpcHQtbHJ1LWNhY2hlL2Rpc3QvTFJVQ2FjaGVOb2RlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90eXBlc2NyaXB0LWxydS1jYWNoZS9kaXN0L2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9iYWNrZ3JvdW5kL2JhY2tncm91bmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0EsdUJBQXVCLG1CQUFPLENBQUMsZ0ZBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxnR0FBZ0c7QUFDL0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsYUFBYTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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UztBQUNULEtBQUssNEJBQTRCLHdCQUF3QixFQUFFLEVBQUU7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsd0JBQXdCLEVBQUU7QUFDN0Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLG1CQUFtQixFQUFFO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsZUFBZTtBQUMzQztBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsdUNBQXVDLHdCQUF3QixFQUFFO0FBQ2pFO0FBQ0E7QUFDQSxTQUFTO0FBQ1QscUNBQXFDLHdDQUF3QyxFQUFFO0FBQy9FLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxtQ0FBbUMsd0JBQXdCLEVBQUU7QUFDN0Q7QUFDQTtBQUNBLEtBQUs7QUFDTCIsImZpbGUiOiJiYWNrZ3JvdW5kLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2JhY2tncm91bmQvYmFja2dyb3VuZC50c1wiKTtcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuTFJVQ2FjaGUgPSB2b2lkIDA7XHJcbmNvbnN0IExSVUNhY2hlTm9kZV8xID0gcmVxdWlyZShcIi4vTFJVQ2FjaGVOb2RlXCIpO1xyXG5jbGFzcyBMUlVDYWNoZSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIExSVUNhY2hlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBvcHRpb25zIEFkZGl0aW9uYWwgY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgTFJVQ2FjaGUuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLmxvb2t1cFRhYmxlID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuaGVhZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy50YWlsID0gbnVsbDtcclxuICAgICAgICBjb25zdCB7IG1heFNpemUgPSAyNSwgZW50cnlFeHBpcmF0aW9uVGltZUluTVMgPSBudWxsLCBvbkVudHJ5RXZpY3RlZCwgb25FbnRyeU1hcmtlZEFzTW9zdFJlY2VudGx5VXNlZCB9ID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKG1heFNpemUpIHx8IG1heFNpemUgPD0gMCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21heFNpemUgbXVzdCBiZSBncmVhdGVyIHRoYW4gMC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBlbnRyeUV4cGlyYXRpb25UaW1lSW5NUyA9PT0gJ251bWJlcicgJiZcclxuICAgICAgICAgICAgKGVudHJ5RXhwaXJhdGlvblRpbWVJbk1TIDw9IDAgfHwgTnVtYmVyLmlzTmFOKGVudHJ5RXhwaXJhdGlvblRpbWVJbk1TKSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdlbnRyeUV4cGlyYXRpb25UaW1lSW5NUyBtdXN0IGVpdGhlciBiZSBudWxsIChubyBleHBpcnkpIG9yIGdyZWF0ZXIgdGhhbiAwJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWF4U2l6ZUludGVybmFsID0gbWF4U2l6ZTtcclxuICAgICAgICB0aGlzLmVudHJ5RXhwaXJhdGlvblRpbWVJbk1TID0gZW50cnlFeHBpcmF0aW9uVGltZUluTVM7XHJcbiAgICAgICAgdGhpcy5vbkVudHJ5RXZpY3RlZCA9IG9uRW50cnlFdmljdGVkO1xyXG4gICAgICAgIHRoaXMub25FbnRyeU1hcmtlZEFzTW9zdFJlY2VudGx5VXNlZCA9IG9uRW50cnlNYXJrZWRBc01vc3RSZWNlbnRseVVzZWQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbnRyaWVzIGluIHRoZSBMUlVDYWNoZSBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgVGhlIG51bWJlciBvZiBlbnRyaWVzIGluIHRoZSBjYWNoZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IHNpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9va3VwVGFibGUuc2l6ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVudHJpZXMgdGhhdCBjYW4gc3RpbGwgYmUgYWRkZWQgdG8gdGhlIExSVUNhY2hlIHdpdGhvdXQgZXZpY3RpbmcgZXhpc3RpbmcgZW50cmllcy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgbnVtYmVyIG9mIGVudHJpZXMgdGhhdCBjYW4gc3RpbGwgYmUgYWRkZWQgd2l0aG91dCBldmljdGluZyBleGlzdGluZyBlbnRyaWVzLlxyXG4gICAgICovXHJcbiAgICBnZXQgcmVtYWluaW5nU2l6ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXhTaXplSW50ZXJuYWwgLSB0aGlzLnNpemU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1vc3QgcmVjZW50bHkgdXNlZCAobmV3ZXN0KSBlbnRyeSBpbiB0aGUgY2FjaGUuXHJcbiAgICAgKiBUaGlzIHdpbGwgbm90IG1hcmsgdGhlIGVudHJ5IGFzIHJlY2VudGx5IHVzZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgVGhlIG1vc3QgcmVjZW50bHkgdXNlZCAobmV3ZXN0KSBlbnRyeSBpbiB0aGUgY2FjaGUuXHJcbiAgICAgKi9cclxuICAgIGdldCBuZXdlc3QoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhlYWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcE5vZGVUb0VudHJ5KHRoaXMuaGVhZCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGxlYXN0IHJlY2VudGx5IHVzZWQgKG9sZGVzdCkgZW50cnkgaW4gdGhlIGNhY2hlLlxyXG4gICAgICogVGhpcyB3aWxsIG5vdCBtYXJrIHRoZSBlbnRyeSBhcyByZWNlbnRseSB1c2VkLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIFRoZSBsZWFzdCByZWNlbnRseSB1c2VkIChvbGRlc3QpIGVudHJ5IGluIHRoZSBjYWNoZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG9sZGVzdCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMudGFpbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwTm9kZVRvRW50cnkodGhpcy50YWlsKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbWF4IG51bWJlciBvZiBlbnRyaWVzIHRoZSBMUlVDYWNoZSBjYW4gaG9sZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgbWF4IHNpemUgZm9yIHRoZSBjYWNoZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IG1heFNpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWF4U2l6ZUludGVybmFsO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBtYXhTaXplIG9mIHRoZSBjYWNoZS5cclxuICAgICAqIFRoaXMgd2lsbCBldmljdCB0aGUgbGVhc3QgcmVjZW50bHkgdXNlZCBlbnRyaWVzIGlmIG5lZWRlZCB0byByZWFjaCBuZXcgbWF4U2l6ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgbWF4U2l6ZS4gTXVzdCBiZSBncmVhdGVyIHRoYW4gMC5cclxuICAgICAqL1xyXG4gICAgc2V0IG1heFNpemUodmFsdWUpIHtcclxuICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA8PSAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbWF4U2l6ZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1heFNpemVJbnRlcm5hbCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZW5mb3JjZVNpemVMaW1pdCgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIGtleSBpbiB0aGUgTFJVQ2FjaGUgb2JqZWN0LiBSZXR1cm5zIHRoZSBMUlVDYWNoZSBvYmplY3QuXHJcbiAgICAgKiBUaGlzIG1hcmtzIHRoZSBuZXdseSBhZGRlZCBlbnRyeSBhcyB0aGUgbW9zdCByZWNlbnRseSB1c2VkIGVudHJ5LlxyXG4gICAgICogSWYgYWRkaW5nIHRoZSBuZXcgZW50cnkgbWFrZXMgdGhlIGNhY2hlIHNpemUgZ28gYWJvdmUgbWF4U2l6ZSxcclxuICAgICAqIHRoaXMgd2lsbCBldmljdCB0aGUgbGVhc3QgcmVjZW50bHkgdXNlZCBlbnRyaWVzIHVudGlsIHNpemUgaXMgZXF1YWwgdG8gbWF4U2l6ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5LlxyXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQgZm9yIHRoZSBrZXkuXHJcbiAgICAgKiBAcGFyYW0gZW50cnlPcHRpb25zIEFkZGl0aW9uYWwgY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgY2FjaGUgZW50cnkuXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgTFJVQ2FjaGUgaW5zdGFuY2UuXHJcbiAgICAgKi9cclxuICAgIHNldChrZXksIHZhbHVlLCBlbnRyeU9wdGlvbnMpIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50Tm9kZUZvcktleSA9IHRoaXMubG9va3VwVGFibGUuZ2V0KGtleSk7XHJcbiAgICAgICAgaWYgKGN1cnJlbnROb2RlRm9yS2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZUZyb21MaXN0QW5kTG9va3VwVGFibGUoY3VycmVudE5vZGVGb3JLZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBub2RlID0gbmV3IExSVUNhY2hlTm9kZV8xLkxSVUNhY2hlTm9kZShrZXksIHZhbHVlLCB7XHJcbiAgICAgICAgICAgIGVudHJ5RXhwaXJhdGlvblRpbWVJbk1TOiB0aGlzLmVudHJ5RXhwaXJhdGlvblRpbWVJbk1TLFxyXG4gICAgICAgICAgICBvbkVudHJ5RXZpY3RlZDogdGhpcy5vbkVudHJ5RXZpY3RlZCxcclxuICAgICAgICAgICAgb25FbnRyeU1hcmtlZEFzTW9zdFJlY2VudGx5VXNlZDogdGhpcy5vbkVudHJ5TWFya2VkQXNNb3N0UmVjZW50bHlVc2VkLFxyXG4gICAgICAgICAgICAuLi5lbnRyeU9wdGlvbnNcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNldE5vZGVBc0hlYWQobm9kZSk7XHJcbiAgICAgICAgdGhpcy5sb29rdXBUYWJsZS5zZXQoa2V5LCBub2RlKTtcclxuICAgICAgICB0aGlzLmVuZm9yY2VTaXplTGltaXQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgdmFsdWUgYXNzb2NpYXRlZCB0byB0aGUga2V5LCBvciBudWxsIGlmIHRoZXJlIGlzIG5vbmUgb3IgaWYgdGhlIGVudHJ5IGlzIGV4cGlyZWQuXHJcbiAgICAgKiBJZiBhbiBlbnRyeSBpcyByZXR1cm5lZCwgdGhpcyBtYXJrcyB0aGUgcmV0dXJuZWQgZW50cnkgYXMgdGhlIG1vc3QgcmVjZW50bHkgdXNlZCBlbnRyeS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGdldC5cclxuICAgICAqIEByZXR1cm5zIFRoZSBjYWNoZWQgdmFsdWUgb3IgbnVsbC5cclxuICAgICAqL1xyXG4gICAgZ2V0KGtleSkge1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmxvb2t1cFRhYmxlLmdldChrZXkpO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5vZGUuaXNFeHBpcmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZUZyb21MaXN0QW5kTG9va3VwVGFibGUobm9kZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldE5vZGVBc0hlYWQobm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHZhbHVlIGFzc29jaWF0ZWQgdG8gdGhlIGtleSwgb3IgbnVsbCBpZiB0aGVyZSBpcyBub25lIG9yIGlmIHRoZSBlbnRyeSBpcyBleHBpcmVkLlxyXG4gICAgICogSWYgYW4gZW50cnkgaXMgcmV0dXJuZWQsIHRoaXMgd2lsbCBub3QgbWFyayB0aGUgZW50cnkgYXMgbW9zdCByZWNlbnRseSBhY2Nlc3NlZC5cclxuICAgICAqIFVzZWZ1bCBpZiBhIHZhbHVlIGlzIG5lZWRlZCBidXQgdGhlIG9yZGVyIG9mIHRoZSBjYWNoZSBzaG91bGQgbm90IGJlIGNoYW5nZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBnZXQuXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgY2FjaGVkIHZhbHVlIG9yIG51bGwuXHJcbiAgICAgKi9cclxuICAgIHBlZWsoa2V5KSB7XHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubG9va3VwVGFibGUuZ2V0KGtleSk7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobm9kZS5pc0V4cGlyZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVOb2RlRnJvbUxpc3RBbmRMb29rdXBUYWJsZShub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWxldGVzIHRoZSBlbnRyeSBmb3IgdGhlIHBhc3NlZCBpbiBrZXkuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBkZWxldGVcclxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgYW4gZWxlbWVudCBpbiB0aGUgTFJVQ2FjaGUgb2JqZWN0IGV4aXN0ZWQgYW5kIGhhcyBiZWVuIHJlbW92ZWQsXHJcbiAgICAgKiBvciBmYWxzZSBpZiB0aGUgZWxlbWVudCBkb2VzIG5vdCBleGlzdC5cclxuICAgICAqL1xyXG4gICAgZGVsZXRlKGtleSkge1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmxvb2t1cFRhYmxlLmdldChrZXkpO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlbW92ZU5vZGVGcm9tTGlzdEFuZExvb2t1cFRhYmxlKG5vZGUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgYm9vbGVhbiBhc3NlcnRpbmcgd2hldGhlciBhIHZhbHVlIGhhcyBiZWVuIGFzc29jaWF0ZWQgdG8gdGhlIGtleSBpbiB0aGUgTFJVQ2FjaGUgb2JqZWN0IG9yIG5vdC5cclxuICAgICAqIFRoaXMgZG9lcyBub3QgbWFyayB0aGUgZW50cnkgYXMgcmVjZW50bHkgdXNlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrIGlmIGV4aXN0c1xyXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2FjaGUgY29udGFpbnMgdGhlIHN1cHBsaWVkIGtleS4gRmFsc2UgaWYgbm90LlxyXG4gICAgICovXHJcbiAgICBoYXMoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9va3VwVGFibGUuaGFzKGtleSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIGVudHJpZXMgaW4gdGhlIGNhY2hlLlxyXG4gICAgICovXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLmhlYWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudGFpbCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sb29rdXBUYWJsZS5jbGVhcigpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZWFyY2hlcyB0aGUgY2FjaGUgZm9yIGFuIGVudHJ5IG1hdGNoaW5nIHRoZSBwYXNzZWQgaW4gY29uZGl0aW9uLlxyXG4gICAgICogRXhwaXJlZCBlbnRyaWVzIHdpbGwgYmUgc2tpcHBlZCAoYW5kIHJlbW92ZWQpLlxyXG4gICAgICogSWYgbXVsdGlwbHkgZW50cmllcyBpbiB0aGUgY2FjaGUgbWF0Y2ggdGhlIGNvbmRpdGlvbiwgdGhlIG1vc3QgcmVjZW50bHkgdXNlZCBlbnRyeSB3aWxsIGJlIHJldHVybmVkLlxyXG4gICAgICogSWYgYW4gZW50cnkgaXMgcmV0dXJuZWQsIHRoaXMgbWFya3MgdGhlIHJldHVybmVkIGVudHJ5IGFzIHRoZSBtb3N0IHJlY2VudGx5IHVzZWQgZW50cnkuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvbmRpdGlvbiBUaGUgY29uZGl0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZW50cnkgaW4gdGhlXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgZmlyc3QgY2FjaGUgZW50cnkgdG8gbWF0Y2ggdGhlIGNvbmRpdGlvbi4gTnVsbCBpZiBub25lIG1hdGNoLlxyXG4gICAgICovXHJcbiAgICBmaW5kKGNvbmRpdGlvbikge1xyXG4gICAgICAgIGxldCBub2RlID0gdGhpcy5oZWFkO1xyXG4gICAgICAgIHdoaWxlIChub2RlKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlzRXhwaXJlZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IG5vZGUubmV4dDtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZUZyb21MaXN0QW5kTG9va3VwVGFibGUobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbmV4dDtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5tYXBOb2RlVG9FbnRyeShub2RlKTtcclxuICAgICAgICAgICAgaWYgKGNvbmRpdGlvbihlbnRyeSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Tm9kZUFzSGVhZChub2RlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSXRlcmF0ZXMgb3ZlciBhbmQgYXBwbGllcyB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gZWFjaCBlbnRyeSBpbiB0aGUgY2FjaGUuXHJcbiAgICAgKiBJdGVyYXRlcyBpbiBvcmRlciBmcm9tIG1vc3QgcmVjZW50bHkgYWNjZXNzZWQgZW50cnkgdG8gbGVhc3QgcmVjZW50bHkuXHJcbiAgICAgKiBFeHBpcmVkIGVudHJpZXMgd2lsbCBiZSBza2lwcGVkIChhbmQgcmVtb3ZlZCkuXHJcbiAgICAgKiBObyBlbnRyeSB3aWxsIGJlIG1hcmtlZCBhcyByZWNlbnRseSB1c2VkLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYXBwbHkgdG8gdGhlIGVudHJ5XHJcbiAgICAgKi9cclxuICAgIGZvckVhY2goY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuaGVhZDtcclxuICAgICAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgICAgIHdoaWxlIChub2RlKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlzRXhwaXJlZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IG5vZGUubmV4dDtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZUZyb21MaXN0QW5kTG9va3VwVGFibGUobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbmV4dDtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG5vZGUudmFsdWUsIG5vZGUua2V5LCBpbmRleCk7XHJcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgR2VuZXJhdG9yIHdoaWNoIGNhbiBiZSB1c2VkIHdpdGggZm9yIC4uLiBvZiAuLi4gdG8gaXRlcmF0ZSBvdmVyIHRoZSBjYWNoZSB2YWx1ZXMuXHJcbiAgICAgKiBJdGVyYXRlcyBpbiBvcmRlciBmcm9tIG1vc3QgcmVjZW50bHkgYWNjZXNzZWQgZW50cnkgdG8gbGVhc3QgcmVjZW50bHkuXHJcbiAgICAgKiBFeHBpcmVkIGVudHJpZXMgd2lsbCBiZSBza2lwcGVkIChhbmQgcmVtb3ZlZCkuXHJcbiAgICAgKiBObyBlbnRyeSB3aWxsIGJlIG1hcmtlZCBhcyBhY2Nlc3NlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBBIEdlbmVyYXRvciBmb3IgdGhlIGNhY2hlIHZhbHVlcy5cclxuICAgICAqL1xyXG4gICAgKnZhbHVlcygpIHtcclxuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuaGVhZDtcclxuICAgICAgICB3aGlsZSAobm9kZSkge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5pc0V4cGlyZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBub2RlLm5leHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGVGcm9tTGlzdEFuZExvb2t1cFRhYmxlKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG5leHQ7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5aWVsZCBub2RlLnZhbHVlO1xyXG4gICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIEdlbmVyYXRvciB3aGljaCBjYW4gYmUgdXNlZCB3aXRoIGZvciAuLi4gb2YgLi4uIHRvIGl0ZXJhdGUgb3ZlciB0aGUgY2FjaGUga2V5cy5cclxuICAgICAqIEl0ZXJhdGVzIGluIG9yZGVyIGZyb20gbW9zdCByZWNlbnRseSBhY2Nlc3NlZCBlbnRyeSB0byBsZWFzdCByZWNlbnRseS5cclxuICAgICAqIEV4cGlyZWQgZW50cmllcyB3aWxsIGJlIHNraXBwZWQgKGFuZCByZW1vdmVkKS5cclxuICAgICAqIE5vIGVudHJ5IHdpbGwgYmUgbWFya2VkIGFzIGFjY2Vzc2VkLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIEEgR2VuZXJhdG9yIGZvciB0aGUgY2FjaGUga2V5cy5cclxuICAgICAqL1xyXG4gICAgKmtleXMoKSB7XHJcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLmhlYWQ7XHJcbiAgICAgICAgd2hpbGUgKG5vZGUpIHtcclxuICAgICAgICAgICAgaWYgKG5vZGUuaXNFeHBpcmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gbm9kZS5uZXh0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVOb2RlRnJvbUxpc3RBbmRMb29rdXBUYWJsZShub2RlKTtcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBuZXh0O1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgeWllbGQgbm9kZS5rZXk7XHJcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgR2VuZXJhdG9yIHdoaWNoIGNhbiBiZSB1c2VkIHdpdGggZm9yIC4uLiBvZiAuLi4gdG8gaXRlcmF0ZSBvdmVyIHRoZSBjYWNoZSBlbnRyaWVzLlxyXG4gICAgICogSXRlcmF0ZXMgaW4gb3JkZXIgZnJvbSBtb3N0IHJlY2VudGx5IGFjY2Vzc2VkIGVudHJ5IHRvIGxlYXN0IHJlY2VudGx5LlxyXG4gICAgICogRXhwaXJlZCBlbnRyaWVzIHdpbGwgYmUgc2tpcHBlZCAoYW5kIHJlbW92ZWQpLlxyXG4gICAgICogTm8gZW50cnkgd2lsbCBiZSBtYXJrZWQgYXMgYWNjZXNzZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgQSBHZW5lcmF0b3IgZm9yIHRoZSBjYWNoZSBlbnRyaWVzLlxyXG4gICAgICovXHJcbiAgICAqZW50cmllcygpIHtcclxuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuaGVhZDtcclxuICAgICAgICB3aGlsZSAobm9kZSkge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5pc0V4cGlyZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBub2RlLm5leHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGVGcm9tTGlzdEFuZExvb2t1cFRhYmxlKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG5leHQ7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5aWVsZCB0aGlzLm1hcE5vZGVUb0VudHJ5KG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIEdlbmVyYXRvciB3aGljaCBjYW4gYmUgdXNlZCB3aXRoIGZvciAuLi4gb2YgLi4uIHRvIGl0ZXJhdGUgb3ZlciB0aGUgY2FjaGUgZW50cmllcy5cclxuICAgICAqIEl0ZXJhdGVzIGluIG9yZGVyIGZyb20gbW9zdCByZWNlbnRseSBhY2Nlc3NlZCBlbnRyeSB0byBsZWFzdCByZWNlbnRseS5cclxuICAgICAqIEV4cGlyZWQgZW50cmllcyB3aWxsIGJlIHNraXBwZWQgKGFuZCByZW1vdmVkKS5cclxuICAgICAqIE5vIGVudHJ5IHdpbGwgYmUgbWFya2VkIGFzIGFjY2Vzc2VkLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIEEgR2VuZXJhdG9yIGZvciB0aGUgY2FjaGUgZW50cmllcy5cclxuICAgICAqL1xyXG4gICAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgICAgIGxldCBub2RlID0gdGhpcy5oZWFkO1xyXG4gICAgICAgIHdoaWxlIChub2RlKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlzRXhwaXJlZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IG5vZGUubmV4dDtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZUZyb21MaXN0QW5kTG9va3VwVGFibGUobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbmV4dDtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHlpZWxkIHRoaXMubWFwTm9kZVRvRW50cnkobm9kZSk7XHJcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZW5mb3JjZVNpemVMaW1pdCgpIHtcclxuICAgICAgICBsZXQgbm9kZSA9IHRoaXMudGFpbDtcclxuICAgICAgICB3aGlsZSAobm9kZSAhPT0gbnVsbCAmJiB0aGlzLnNpemUgPiB0aGlzLm1heFNpemVJbnRlcm5hbCkge1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2ID0gbm9kZS5wcmV2O1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGVGcm9tTGlzdEFuZExvb2t1cFRhYmxlKG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlID0gcHJldjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBtYXBOb2RlVG9FbnRyeSh7IGtleSwgdmFsdWUgfSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGtleSxcclxuICAgICAgICAgICAgdmFsdWVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgc2V0Tm9kZUFzSGVhZChub2RlKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVOb2RlRnJvbUxpc3Qobm9kZSk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhlYWQpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkID0gbm9kZTtcclxuICAgICAgICAgICAgdGhpcy50YWlsID0gbm9kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG5vZGUubmV4dCA9IHRoaXMuaGVhZDtcclxuICAgICAgICAgICAgdGhpcy5oZWFkLnByZXYgPSBub2RlO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWQgPSBub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBub2RlLmludm9rZU9uRW50cnlNYXJrZWRBc01vc3RSZWNlbnRseVVzZWQoKTtcclxuICAgIH1cclxuICAgIHJlbW92ZU5vZGVGcm9tTGlzdChub2RlKSB7XHJcbiAgICAgICAgaWYgKG5vZGUucHJldiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBub2RlLnByZXYubmV4dCA9IG5vZGUubmV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5vZGUubmV4dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBub2RlLm5leHQucHJldiA9IG5vZGUucHJldjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaGVhZCA9PT0gbm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLmhlYWQgPSBub2RlLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnRhaWwgPT09IG5vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy50YWlsID0gbm9kZS5wcmV2O1xyXG4gICAgICAgIH1cclxuICAgICAgICBub2RlLm5leHQgPSBudWxsO1xyXG4gICAgICAgIG5vZGUucHJldiA9IG51bGw7XHJcbiAgICB9XHJcbiAgICByZW1vdmVOb2RlRnJvbUxpc3RBbmRMb29rdXBUYWJsZShub2RlKSB7XHJcbiAgICAgICAgbm9kZS5pbnZva2VPbkV2aWN0ZWQoKTtcclxuICAgICAgICB0aGlzLnJlbW92ZU5vZGVGcm9tTGlzdChub2RlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb29rdXBUYWJsZS5kZWxldGUobm9kZS5rZXkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTFJVQ2FjaGUgPSBMUlVDYWNoZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TFJVQ2FjaGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5MUlVDYWNoZU5vZGUgPSB2b2lkIDA7XHJcbmNsYXNzIExSVUNhY2hlTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgY29uc3QgeyBlbnRyeUV4cGlyYXRpb25UaW1lSW5NUyA9IG51bGwsIG5leHQgPSBudWxsLCBwcmV2ID0gbnVsbCwgb25FbnRyeUV2aWN0ZWQsIG9uRW50cnlNYXJrZWRBc01vc3RSZWNlbnRseVVzZWQgfSA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgaWYgKHR5cGVvZiBlbnRyeUV4cGlyYXRpb25UaW1lSW5NUyA9PT0gJ251bWJlcicgJiZcclxuICAgICAgICAgICAgKGVudHJ5RXhwaXJhdGlvblRpbWVJbk1TIDw9IDAgfHwgTnVtYmVyLmlzTmFOKGVudHJ5RXhwaXJhdGlvblRpbWVJbk1TKSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdlbnRyeUV4cGlyYXRpb25UaW1lSW5NUyBtdXN0IGVpdGhlciBiZSBudWxsIChubyBleHBpcnkpIG9yIGdyZWF0ZXIgdGhhbiAwJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmNyZWF0ZWQgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIHRoaXMuZW50cnlFeHBpcmF0aW9uVGltZUluTVMgPSBlbnRyeUV4cGlyYXRpb25UaW1lSW5NUztcclxuICAgICAgICB0aGlzLm5leHQgPSBuZXh0O1xyXG4gICAgICAgIHRoaXMucHJldiA9IHByZXY7XHJcbiAgICAgICAgdGhpcy5vbkVudHJ5RXZpY3RlZCA9IG9uRW50cnlFdmljdGVkO1xyXG4gICAgICAgIHRoaXMub25FbnRyeU1hcmtlZEFzTW9zdFJlY2VudGx5VXNlZCA9IG9uRW50cnlNYXJrZWRBc01vc3RSZWNlbnRseVVzZWQ7XHJcbiAgICB9XHJcbiAgICBnZXQgaXNFeHBpcmVkKCkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5lbnRyeUV4cGlyYXRpb25UaW1lSW5NUyA9PT0gJ251bWJlcicgJiYgRGF0ZS5ub3coKSAtIHRoaXMuY3JlYXRlZCA+IHRoaXMuZW50cnlFeHBpcmF0aW9uVGltZUluTVM7XHJcbiAgICB9XHJcbiAgICBpbnZva2VPbkV2aWN0ZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub25FbnRyeUV2aWN0ZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBrZXksIHZhbHVlLCBpc0V4cGlyZWQgfSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMub25FbnRyeUV2aWN0ZWQoeyBrZXksIHZhbHVlLCBpc0V4cGlyZWQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaW52b2tlT25FbnRyeU1hcmtlZEFzTW9zdFJlY2VudGx5VXNlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5vbkVudHJ5TWFya2VkQXNNb3N0UmVjZW50bHlVc2VkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsga2V5LCB2YWx1ZSB9ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5vbkVudHJ5TWFya2VkQXNNb3N0UmVjZW50bHlVc2VkKHsga2V5LCB2YWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5MUlVDYWNoZU5vZGUgPSBMUlVDYWNoZU5vZGU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxSVUNhY2hlTm9kZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL0xSVUNhY2hlXCIpLCBleHBvcnRzKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHR5cGVzY3JpcHRfbHJ1X2NhY2hlXzEgPSByZXF1aXJlKFwidHlwZXNjcmlwdC1scnUtY2FjaGVcIik7XG52YXIgc2VsZWN0ZWRQcm9qZWN0ID0gdW5kZWZpbmVkO1xudmFyIHByb2plY3RzID0gdW5kZWZpbmVkO1xuLy8gY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2VsZWN0ZWRQcm9qZWN0OiBzZWxlY3RlZFByb2plY3QgfSk7XG5jaHJvbWUuc3RvcmFnZS5sb2NhbC5jbGVhcigpO1xudmFyIHNlbmRTZWxlY3RlZFByb2plY3QgPSBmdW5jdGlvbiAocHJvamVjdCkge1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKF9fYXNzaWduKHsgdHlwZTogXCJTRUxFQ1RFRF9QUk9KRUNUXCIgfSwgcHJvamVjdCkpO1xufTtcbi8vIEdldCBsb2NhbGx5IHN0b3JlZCB2YWx1ZVxuZnVuY3Rpb24gSW5pdGlhbGl6ZVByb2plY3RzKGNhbGxiYWNrKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwic2VsZWN0ZWRQcm9qZWN0XCIsIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgR2V0UHJvamVjdHMoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBwcm9qZWN0cyA9IGRhdGEuZGF0YS5wcm9qZWN0cy5tYXAoZnVuY3Rpb24gKHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogcHJvamVjdC5pZCwgc2VsZWN0aW9uTGFiZWw6IHByb2plY3QubWV0YS5uYW1lIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgICAgICAgcHJvamVjdHM6IHByb2plY3RzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImR1cnA6IFwiICsgSlNPTi5zdHJpbmdpZnkocmVzKSk7XG4gICAgICAgICAgICBpZiAocmVzW1wic2VsZWN0ZWRQcm9qZWN0XCJdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFByb2plY3QgPSBwcm9qZWN0c1swXTtcbiAgICAgICAgICAgICAgICBMb2FkUHJvamVjdChzZWxlY3RlZFByb2plY3QuaWQpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoYHByb2plY3QgbG9hZGVkOiAke0pTT04uc3RyaW5naWZ5KGRhdGEpfWApO1xuICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uQ2FjaGUuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUHJvamVjdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBzZWxlY3RlZFByb2plY3QuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uTGFiZWw6IHNlbGVjdGVkUHJvamVjdC5zZWxlY3Rpb25MYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2V0dGluZyBkZWZhdWx0IHNlbGVjdGlvbjogXCIgKyBKU09OLnN0cmluZ2lmeShzZWxlY3RlZFByb2plY3QpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHByb2plY3RzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5Jbml0aWFsaXplUHJvamVjdHMoKTtcbmNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAodGFiSWQsIGNoYW5nZUluZm8sIHRhYikge1xuICAgIGlmIChjaGFuZ2VJbmZvLnN0YXR1cyA9PT0gXCJjb21wbGV0ZVwiICYmIHRhYi51cmwuaW5jbHVkZXMoXCJodHRwXCIpKSB7XG4gICAgICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQodGFiSWQsIHsgZmlsZTogXCIuL2luamVjdHNjcmlwdC5qc1wiIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQodGFiSWQsIHsgZmlsZTogXCIuL2NvbnRlbnQuYnVuZGxlLmpzXCIgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSU5KRUNURUQgQU5EIEVYRUNVVEVEXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcIkdFVF9TRUxFQ1RFRF9QUk9KRUNUXCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInByb2plY3QgcmVxdWVzdGVkOiBcIiArIEpTT04uc3RyaW5naWZ5KHNlbGVjdGVkUHJvamVjdCkpO1xuICAgICAgICAgICAgc2VuZFNlbGVjdGVkUHJvamVjdChzZWxlY3RlZFByb2plY3QpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJTRUxFQ1RfUFJPSkVDVFwiOlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHByb2plY3Q6IFwiICsgSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWRQcm9qZWN0LmlkKSArIFwiIHRvIFwiICsgSlNPTi5zdHJpbmdpZnkobWVzc2FnZS5pZCkgKyBcIiB3aXRoIFwiICsgSlNPTi5zdHJpbmdpZnkobWVzc2FnZS5zZWxlY3Rpb25MYWJlbCkpO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkUHJvamVjdC5pZCAhPT0gbWVzc2FnZS5pZCkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE8gTG9hZCBQcm9qZWN0IC0tIGlmIHRoaXMgZmFpbHM/IGRvbid0IGNoYW5nZSBzZWxlY3Rpb24/IEFsZXJ0P1xuICAgICAgICAgICAgICAgIExvYWRQcm9qZWN0KG1lc3NhZ2UuaWQpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoYHByb2plY3QgbG9hZGVkOiAke0pTT04uc3RyaW5naWZ5KGRhdGEpfWApO1xuICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uQ2FjaGUuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRQcm9qZWN0LmlkID0gbWVzc2FnZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRQcm9qZWN0LnNlbGVjdGlvbkxhYmVsID0gbWVzc2FnZS5zZWxlY3Rpb25MYWJlbDtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUHJvamVjdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBtZXNzYWdlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkxhYmVsOiBtZXNzYWdlLnNlbGVjdGlvbkxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0pO1xudmFyIHVybFRvQmFzZTY0ID0ge307XG4vLyBjb25zdCBiYXNlNjRUb1Byb2plY3RzQ29udGFpbmluZzogUmVjb3JkPFxuLy8gICBzdHJpbmcsXG4vLyAgIHsgcHJvamVjdHM6IEFycmF5PHN0cmluZz4gfVxuLy8gPiA9IHt9O1xudmFyIHByZWRpY3Rpb25DYWNoZSA9IG5ldyB0eXBlc2NyaXB0X2xydV9jYWNoZV8xLkxSVUNhY2hlKHtcbiAgICBlbnRyeUV4cGlyYXRpb25UaW1lSW5NUzogMTAwMCAqIDYwLFxuICAgIG1heFNpemU6IDUwMCxcbn0pO1xuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgIGlmIChyZXF1ZXN0Lm1lc3NhZ2UgPT0gXCJjb252ZXJ0X2ltYWdlX3VybF90b19kYXRhX3VybFwiKSB7XG4gICAgICAgIGlmICh1cmxUb0Jhc2U2NFtyZXF1ZXN0LnVybF0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FjaGUgaW1hZ2UgZGF0YSFcIik7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBkYXRhOiB1cmxUb0Jhc2U2NFtyZXF1ZXN0LnVybF0gfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInBvcHVsYXRpbmcgY2FjaGUgaW1hZ2UgZGF0YSFcIik7XG4gICAgICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltZy5jcm9zc09yaWdpbiA9IFwiYW5vbnltb3VzXCI7XG4gICAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaW1nLmhlaWdodDtcbiAgICAgICAgICAgICAgICBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLmRyYXdJbWFnZShpbWcsIDAsIDApO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gY2FudmFzLnRvRGF0YVVSTChcImltYWdlL2pwZWdcIik7XG4gICAgICAgICAgICAgICAgdXJsVG9CYXNlNjRbcmVxdWVzdC51cmxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpbWcuc3JjID0gcmVxdWVzdC51cmw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7IC8vIFJlcXVpcmVkIGZvciBhc3luYyBzZW5kUmVzcG9uc2UoKVxuICAgIH1cbiAgICBlbHNlIGlmIChyZXF1ZXN0Lm1lc3NhZ2UgPT0gXCJnZXRfcHJvamVjdHNcIikge1xuICAgICAgICBJbml0aWFsaXplUHJvamVjdHMoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IGRhdGE6IGRhdGEgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAocmVxdWVzdC5tZXNzYWdlID09IFwiZ2V0X3NvbWVfbGFiZWxzXCIpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiZ2V0X2xhYmVsc1wiKTtcbiAgICAgICAgLy8gVE9ETyBpbnRlcmZhY2VzIGZvciB0aGVzZSBtZXNzYWdlc1xuICAgICAgICB2YXIgcHJvamVjdElkID0gcmVxdWVzdC5wcm9qZWN0SWQ7XG4gICAgICAgIEdldERhdGFzdHJlYW0ocHJvamVjdElkKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGFTdHJlYW1zKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0cztcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcImdldF9sYWJlbHMgR290IERhdGFTdHJlYW0gOyBcIiArIEpTT04uc3RyaW5naWZ5KGRhdGFTdHJlYW1zKSk7XG4gICAgICAgICAgICBmb3IgKHZhciBkeCA9IDA7IGR4IDwgZGF0YVN0cmVhbXMubGVuZ3RoOyBkeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFTdHJlYW0gPSBkYXRhU3RyZWFtc1tkeF07XG4gICAgICAgICAgICAgICAgaWYgKGRhdGFTdHJlYW0uY2F0ZWdvcnkgPT09IFwidGFyZ2V0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cyA9IGRhdGFTdHJlYW0uY2xhc3NlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oXCJnZXRfbGFiZWxzIEdvdCB0YXJnZXRzIDsgXCIgKyBKU09OLnN0cmluZ2lmeSh0YXJnZXRzKSk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBkYXRhOiB0YXJnZXRzIH0pO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChyZXF1ZXN0Lm1lc3NhZ2UgPT0gXCJwb3N0X3ByZWRpY3Rpb25cIikge1xuICAgICAgICAvLyBUT0RPIGludGVyZmFjZXMgZm9yIHRoZXNlIG1lc3NhZ2VzXG4gICAgICAgIHZhciBwcm9qZWN0SWRfMSA9IHJlcXVlc3QucHJvamVjdElkO1xuICAgICAgICB2YXIgYmFzZTY0SW1hZ2VfMSA9IHJlcXVlc3QuYmFzZTY0SW1hZ2U7XG4gICAgICAgIHZhciBsYWJlbF8xID0gcmVxdWVzdC5sYWJlbDtcbiAgICAgICAgR2V0RGF0YXN0cmVhbShwcm9qZWN0SWRfMSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhU3RyZWFtcykge1xuICAgICAgICAgICAgdmFyIHRhcmdldHM7XG4gICAgICAgICAgICB2YXIgaW5wdXRzO1xuICAgICAgICAgICAgZm9yICh2YXIgZHggPSAwOyBkeCA8IGRhdGFTdHJlYW1zLmxlbmd0aDsgZHgrKykge1xuICAgICAgICAgICAgICAgIHZhciBkYXRhU3RyZWFtID0gZGF0YVN0cmVhbXNbZHhdO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhU3RyZWFtLmNhdGVnb3J5ID09PSBcImlucHV0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzID0gZGF0YVN0cmVhbS5sb2JlSWQ7XG4gICAgICAgICAgICAgICAgfSAvLyBpZiAoZGF0YVN0cmVhbS5jYXRlZ29yeSA9PT0gXCJ0YXJnZXRcIilcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cyA9IGRhdGFTdHJlYW0ubG9iZUlkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbdGFyZ2V0cywgaW5wdXRzXTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHRhcmdldHMgPSB2YWx1ZVswXSwgaW5wdXRzID0gdmFsdWVbMV07XG4gICAgICAgICAgICByZXR1cm4gUG9zdEl0ZW1JbWFnZShwcm9qZWN0SWRfMSwgaW5wdXRzLCBiYXNlNjRJbWFnZV8xKS50aGVuKGZ1bmN0aW9uIChleGFtcGxlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHb3QgRXhhbXBsZTogXCIgKyBKU09OLnN0cmluZ2lmeShleGFtcGxlKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFBvc3RJdGVtTGFiZWwocHJvamVjdElkXzEsIHRhcmdldHMsIGV4YW1wbGVbMF0uZXhhbXBsZUlkLCBsYWJlbF8xKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGV4YW1wbGUpIHtcbiAgICAgICAgICAgIC8vIGFsZXJ0KGBTZW5kaW5nIFJlc3BvbnNlOiAke0pTT04uc3RyaW5naWZ5KGV4YW1wbGUpfWApO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgZGF0YTogZXhhbXBsZSB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChyZXF1ZXN0Lm1lc3NhZ2UgPT0gXCJnZXRfcHJlZGljdGlvblwiKSB7XG4gICAgICAgIHZhciBwcm9qZWN0SWRfMiA9IHJlcXVlc3QucHJvamVjdElkO1xuICAgICAgICB2YXIgYmFzZTY0SW1hZ2VfMiA9IHJlcXVlc3QuYmFzZTY0SW1hZ2U7XG4gICAgICAgIHZhciBrbm93blByZWRpY3Rpb24gPSBwcmVkaWN0aW9uQ2FjaGUucGVlayhiYXNlNjRJbWFnZV8yKTtcbiAgICAgICAgaWYgKGtub3duUHJlZGljdGlvbikge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYEF3YWl0aW5nIHByZWRpY3Rpb24gY2FjaGVgKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBBd2FpdGluZyBwcmVkaWN0aW9uIGNhY2hlICR7aGFzaENvZGUoYmFzZTY0SW1hZ2UpfWApO1xuICAgICAgICAgICAgcHJlZGljdGlvbkNhY2hlLnNldChiYXNlNjRJbWFnZV8yLCBrbm93blByZWRpY3Rpb24udGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBDYWNoZSBwcm9taXNlIGNvbXBsZXRlISAke2hhc2hDb2RlKGJhc2U2NEltYWdlKX1gKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgc2VuZFJlc3BvbnNlKHsgZGF0YTogZGF0YSB9KTsgJHtoYXNoQ29kZShiYXNlNjRJbWFnZSl9YCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYCR7ZGF0YX0gJHtoYXNoQ29kZShiYXNlNjRJbWFnZSl9YCk7XG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgZGF0YTogZGF0YSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHByZWRpY3Rpb25DYWNoZS5zZXQoYmFzZTY0SW1hZ2VfMiwgbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmV0Y2hpbmcgcHJlZGljdGlvblwiKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgRmV0Y2hpbmcgcHJlZGljdGlvbiAke2hhc2hDb2RlKGJhc2U2NEltYWdlKX1gKTtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBJbWFnZTogYmFzZTY0SW1hZ2VfMiA9PT0gbnVsbCB8fCBiYXNlNjRJbWFnZV8yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBiYXNlNjRJbWFnZV8yLnNwbGl0KFwiYmFzZTY0LFwiKVsxXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgLy8geGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gdGhpcy5ET05FKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGVydChgaGV5OiAke3RoaXMucmVzcG9uc2VUZXh0fWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYFByZWRpY3Rpb24gRk9VTkQgJHtoYXNoQ29kZShiYXNlNjRJbWFnZSl9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgcmVzb2x2ZSh7IGRhdGE6IHRoaXMucmVzcG9uc2VUZXh0IH0pOyAke2hhc2hDb2RlKGJhc2U2NEltYWdlKX1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAke3RoaXMucmVzcG9uc2VUZXh0fSAke2hhc2hDb2RlKGJhc2U2NEltYWdlKX1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIFwiaHR0cDovL2xvY2FsaG9zdDozODEwMC9wcmVkaWN0L1wiICsgcHJvamVjdElkXzIgLy81YTg2NmZlZS0zZDA0LTQxMmUtYjVlMC01MGY1ZmM1ODZhZDJcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYEluaXRpYWwgcHJvbWlzZSBjb21wbGV0ZSAke2hhc2hDb2RlKGJhc2U2NEltYWdlKX1gKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgc2VuZFJlc3BvbnNlKHsgZGF0YTogZGF0YSB9KTsgJHtoYXNoQ29kZShiYXNlNjRJbWFnZSl9YCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYCR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9ICR7aGFzaENvZGUoYmFzZTY0SW1hZ2UpfWApO1xuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IGRhdGE6IGRhdGEgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSk7XG5mdW5jdGlvbiBMb2FkUHJvamVjdChwcm9qZWN0SWQpIHtcbiAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoXCJxdWVyeVwiLCBcIntwcm9qZWN0c31cIik7XG4gICAgdmFyIGdyYXBocWxVUkwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzgxMDEvZ3JhcGhxbFwiO1xuICAgIChcIm11dGF0aW9uIExvYWRQcm9qZWN0KCRwcm9qZWN0SWQ6SUQhKXtsb2FkUHJvamVjdChwcm9qZWN0SWQ6JHByb2plY3RJZCl9XCIpO1xuICAgIHJldHVybiBmZXRjaChncmFwaHFsVVJMLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdmFyaWFibGVzOiBKU09OLnN0cmluZ2lmeSh7IHByb2plY3RJZDogcHJvamVjdElkIH0pLFxuICAgICAgICAgICAgcXVlcnk6IFwiXFxubXV0YXRpb24gTG9hZFByb2plY3QoJHByb2plY3RJZDpJRCEpIHtcXG4gIGxvYWRQcm9qZWN0KHByb2plY3RJZDokcHJvamVjdElkKVxcbn1cIixcbiAgICAgICAgfSksXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHsgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTsgfSk7XG59XG5mdW5jdGlvbiBHZXRQcm9qZWN0cygpIHtcbiAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoXCJxdWVyeVwiLCBcIntwcm9qZWN0c31cIik7XG4gICAgdmFyIGdyYXBocWxVUkwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzgxMDEvZ3JhcGhxbFwiO1xuICAgIHJldHVybiBmZXRjaChncmFwaHFsVVJMLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgcXVlcnk6IFwiXFxuICAgIHF1ZXJ5IHtcXG4gICAgICBwcm9qZWN0cyB7XFxuICAgICAgICBpZFxcbiAgICAgICAgbWV0YSB7XFxuICAgICAgICAgIG5hbWVcXG4gICAgICAgICAgZGVzY3JpcHRpb25cXG4gICAgICAgICAgY2F0ZWdvcnlcXG4gICAgICAgICAgdXNlclNhdmVkXFxuICAgICAgICAgIGRpc3BsYXlJbkJyb3dzZVxcbiAgICAgICAgICB0eXBlXFxuICAgICAgICAgIHRlbXBsYXRlSWRcXG4gICAgICAgICAgb3B0aW1pemF0aW9uXFxuICAgICAgICB9XFxuICAgICAgfVxcbiAgICB9XCIsXG4gICAgICAgIH0pLFxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7IHJldHVybiByZXNwb25zZS5qc29uKCk7IH0pOyAvLyBUT0RPIGludGVyZmFjZVxufVxuZnVuY3Rpb24gR2V0RGF0YXN0cmVhbShwcm9qZWN0SWQpIHtcbiAgICB2YXIgZGF0YVN0cmVhbXNVcmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzgxMDEvZGF0YS92MS9wcm9qZWN0L1wiICsgcHJvamVjdElkICsgXCIvZGF0YXN0cmVhbVwiO1xuICAgIHJldHVybiBmZXRjaChkYXRhU3RyZWFtc1VybClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7IHJldHVybiByZXNwb25zZS5qc29uKCk7IH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gUG9zdEl0ZW1JbWFnZShwcm9qZWN0SWQsIGltYWdlRGF0YVN0cmVhbSwgYmFzZTY0SW1hZ2UpIHtcbiAgICB2YXIgZGF0YVN0cmVhbVVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDozODEwMS9kYXRhL3YxL3Byb2plY3QvXCIgKyBwcm9qZWN0SWQgKyBcIi9kYXRhc3RyZWFtL1wiO1xuICAgIHZhciBpbnB1dFVybCA9IGRhdGFTdHJlYW1VcmwgKyBpbWFnZURhdGFTdHJlYW0gKyBcIi9pdGVtXCI7XG4gICAgcmV0dXJuIGZldGNoKGJhc2U2NEltYWdlKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7IHJldHVybiByZXMuYmxvYigpOyB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoYmxvYikge1xuICAgICAgICB2YXIgaW5wdXRJdGVtcyA9IHtcbiAgICAgICAgICAgIGlzVGVzdDogZmFsc2UsXG4gICAgICAgICAgICBpdGVtOiBcIlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxuICAgICAgICAgICAgZXhhbXBsZUlkOiBcIlwiLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICB9O1xuICAgICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiaXRlbXNbXVwiLCBKU09OLnN0cmluZ2lmeShpbnB1dEl0ZW1zKSk7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImZpbGVcIiwgYmxvYiwgXCJpbWFnZS5wbmdcIik7XG4gICAgICAgIC8vIGZldGNoKGlucHV0VXJsLCB7bWV0aG9kOiAnUE9TVCd9KVxuICAgICAgICByZXR1cm4gZmV0Y2goaW5wdXRVcmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkgeyByZXR1cm4gcmVzcG9uc2UuanNvbigpOyB9KVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGV4YW1wbGVKc29uKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhhbXBsZUpzb247XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7IHJldHVybiBhbGVydChcImVycm9yIGNhdWdodDogXCIgKyBlcnJvcik7IH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gUG9zdEl0ZW1MYWJlbChwcm9qZWN0SWQsIGxhYmVsRGF0YVN0cmVhbSwgZXhhbXBsZUlkLCBsYWJlbCkge1xuICAgIHZhciBkYXRhU3RyZWFtVXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjM4MTAxL2RhdGEvdjEvcHJvamVjdC9cIiArIHByb2plY3RJZCArIFwiL2RhdGFzdHJlYW0vXCI7XG4gICAgdmFyIGlucHV0VXJsID0gZGF0YVN0cmVhbVVybCArIGxhYmVsRGF0YVN0cmVhbSArIFwiL2l0ZW1cIjtcbiAgICB2YXIgdGFyZ2V0SXRlbXMgPSB7XG4gICAgICAgIGlzVGVzdDogZmFsc2UsXG4gICAgICAgIGl0ZW06IGxhYmVsLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgZXhhbXBsZUlkOiBleGFtcGxlSWQsXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICB9O1xuICAgIHZhciB0YXJnZXRGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIHRhcmdldEZvcm1EYXRhLmFwcGVuZChcIml0ZW1zW11cIiwgSlNPTi5zdHJpbmdpZnkodGFyZ2V0SXRlbXMpKTtcbiAgICByZXR1cm4gZmV0Y2goaW5wdXRVcmwsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgYm9keTogdGFyZ2V0Rm9ybURhdGEsXG4gICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7IHJldHVybiByZXNwb25zZS5qc29uKCk7IH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChleGFtcGxlSnNvbikge1xuICAgICAgICByZXR1cm4gZXhhbXBsZUpzb247XG4gICAgfSk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9