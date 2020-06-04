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


async function run(core, context, github) {

    try {

        const provider = process.env.PROVIDER;
        const repository = process.env.REPOSITORY;
        const command = context.payload.comment.body;

        if (command !== 'rerun tests') {
            console.log("Invalid command:" + command);
            return;
        }

        const {
            data: {
                head: {
                    sha: ref,
                }
            }
        } = await github.pulls.get({
            owner: provider,
            repo: repository,
            pull_number: context.issue.number,
        });

        const checks = await github.checks.listForRef({
            owner: provider,
            repo: repository,
            ref: ref
        });

        checks.data.check_runs.forEach(check => {

            if (check.app.owner.login === 'travis-ci') {
                console.log("rerun travis ci check")
                rebuild(check.external_id)
            } else {
                console.log("ignore github action check")
            }

        });


    } catch (e) {
        console.log(e)
    }

}

function rebuild(buildId) {
    const https = require('https');
    const token = process.env.HUDI_TRAVIS_COM_TOKEN

    const options = {
        hostname: 'api.travis-ci.com',
        port: 443,
        path: `/build/${buildId}/restart`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Travis-API-Version': 3,
            'Authorization': `token ${token}`,
        }
    };

    const req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
        res.on('error', function (error) {
            console.log('ERROR: ' + error);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}

module.exports = ({core}, {context}, {github}) => {
    return run(core, context, github);
}
