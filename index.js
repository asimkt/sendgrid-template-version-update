const core = require('@actions/core');
const github = require('@actions/github');
const http = require("https");
const fs = require("fs");
const path = require("path");

try {
    // `who-to-greet` input defined in action metadata file
    const apiKey = core.getInput('api-key');
    const templateVersionId = core.getInput('template-version');
    const templateContent = core.getInput('template-content');
    
    console.log(templateVersionId);

    const dist = 'dist';
    var fullPath = path.join(dist, '/template-version-id-content-map.json');
    var fileContent = fs.readFileSync(fullPath, "utf8");

    console.log(fileContent);
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
            console.log(body.toString());
        });
    });

    req.write(JSON.stringify({
        html_content: templateContent
    }));
    req.end();  
} catch (error) {
    core.setFailed(error.message);
}