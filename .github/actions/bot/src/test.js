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

const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function run() {

    try {
        const github = new GitHub(process.env.GITHUB_TOKEN);
        const reRunCmd = core.getInput('rerun_cmd', { required: false});
        const owner = core.getInput('repo_owner', {required: true});
        const repo = core.getInput('repo_name', {required: true});
        const comment = core.getInput('command', {required: true});

        console.log("owner: " + owner)
        console.log("repo: " + repo)

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

                console.log("")
                console.log("--------")
                console.log(job)
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
