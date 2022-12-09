'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

/* eslint-disable @typescript-eslint/no-use-before-define */
var CHANNEL_LABEL = 'P2P_CHAT_CHANNEL_LABEL';
function createPeerConnection(_a) {
    var remoteDescription = _a.remoteDescription, _b = _a.iceServers, iceServers = _b === void 0 ? [] : _b, onChannelOpen = _a.onChannelOpen, onMessageReceived = _a.onMessageReceived;
    var peerConnection = new RTCPeerConnection({
        iceServers: iceServers,
    });
    var channelInstance;
    // peerConnection.oniceconnectionstatechange = () => {
    //   if (peerConnection.iceConnectionState === 'failed' || peerConnection.iceConnectionState === 'disconnected') {
    //     createOffer();
    //   }
    // };
    function setupChannelAsAHost() {
        try {
            channelInstance = peerConnection.createDataChannel(CHANNEL_LABEL);
            channelInstance.onopen = function () {
                onChannelOpen();
            };
            channelInstance.onmessage = function (event) {
                onMessageReceived(event.data);
            };
        }
        catch (e) {
            console.error('No data channel (peerConnection)', e);
        }
    }
    function createOffer() {
        return __awaiter(this, void 0, void 0, function () {
            var description;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, peerConnection.createOffer()];
                    case 1:
                        description = _a.sent();
                        peerConnection.setLocalDescription(description);
                        return [2 /*return*/];
                }
            });
        });
    }
    function setupChannelAsASlave() {
        peerConnection.ondatachannel = function (_a) {
            var channel = _a.channel;
            channelInstance = channel;
            channelInstance.onopen = function () {
                onChannelOpen();
            };
            channelInstance.onmessage = function (event) {
                onMessageReceived(event.data);
            };
        };
    }
    function createAnswer(remoteDescription) {
        return __awaiter(this, void 0, void 0, function () {
            var description;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, peerConnection.setRemoteDescription(JSON.parse(remoteDescription))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, peerConnection.createAnswer()];
                    case 2:
                        description = _a.sent();
                        peerConnection.setLocalDescription(description);
                        return [2 /*return*/];
                }
            });
        });
    }
    function setAnswerDescription(answerDescription) {
        peerConnection.setRemoteDescription(JSON.parse(answerDescription));
    }
    function sendMessage(message) {
        if (channelInstance) {
            channelInstance.send(message);
        }
    }
    return new Promise(function (res) {
        peerConnection.onicecandidate = function (e) {
            if (e.candidate === null && peerConnection.localDescription) {
                peerConnection.localDescription.sdp.replace('b=AS:30', 'b=AS:1638400');
                res({
                    localDescription: JSON.stringify(peerConnection.localDescription),
                    setAnswerDescription: setAnswerDescription,
                    sendMessage: sendMessage,
                });
            }
        };
        if (!remoteDescription) {
            setupChannelAsAHost();
            createOffer();
        }
        else {
            setupChannelAsASlave();
            createAnswer(remoteDescription);
        }
    });
}

exports.createPeerConnection = createPeerConnection;
