module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
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
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(431);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 212:
/***/ (function(module) {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 239:
/***/ (function(module, __unusedexports, __webpack_require__) {

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const core = __webpack_require__(563);
const { GitHub, context } = __webpack_require__(212);

async function run() {

    try {
        const github = new GitHub(process.env.GITHUB_TOKEN);
        const reRunCmd = core.getInput('rerun_cmd', { required: false});
        const owner = core.getInput('repo_owner', {required: true});
        const repo = core.getInput('repo_name', {required: true});
        const comment = core.getInput('comment', {required: true});

        if ( comment !== reRunCmd) {
            console.log("this is not a bot command");
            return;
        }

        const {
            data: {
                head: {
                    sha: prRef,
                }
            }
        } = await github.pulls.get({
            owner,
            repo,
            pull_number: context.issue.number,
        });

        const jobs = await github.checks.listForRef({
            owner,
            repo,
            ref: prRef,
            status: "completed"
        });

        jobs.data.check_runs.forEach(job => {
            if (job.conclusion === 'failure' || job.conclusion === 'cancelled') {
                console.log("rerun job " + job.name);
                github.checks.rerequestSuite({
                    owner,
                    repo,
                    check_suite_id: job.check_suite.id
                })
            }
        });
    }catch (e) {
        core.setFailed(e);
    }
}

module.exports = run;


/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const run = __webpack_require__(239);

if (require.main === require.cache[eval('__filename')]) {
    run();
}


/***/ }),

/***/ 563:
/***/ (function(module) {

module.exports = eval("require")("@actions/core");


/***/ })

/******/ });