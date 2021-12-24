const core = require('@actions/core');
const github = require('@actions/github');
const http = require("https");
const fs = require("fs");
const path = require("path");

try {
    const apiKey = core.getInput('api-key');
    const dist = 'dist';

    const fullPath = path.join(dist, '/template-version-id-content-map.json');
    const fileContent = fs.readFileSync(fullPath, "utf8");

    const map = JSON.parse(fileContent);


    console.log('template keys', Object.keys(map))
    Object.keys(map).forEach(function(templateVersionId) {
        console.log('running patch for ', templateVersionId)
        var options = {
            "method": "PATCH",
            "hostname": "api.sendgrid.com",
            "port": null,
            "path": `/v3/templates/${templateVersionId}`,
            "headers": {
                "authorization": `Bearer ${apiKey}`,
                "content-type": "application/json"
            }
        };

        var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log("api done", body.toString());
            });
        });

        req.write(JSON.stringify({
            html_content: map[templateVersionId]
        }));
        req.end();  
    })

} catch (error) {
    core.setFailed(error.message);
}