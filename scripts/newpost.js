const STUB_FILE = "scripts/.post-stub.md";
const args = require("minimist")(process.argv.slice(2));
const fs = require("fs");

const HELP = "asd";

const checkFields = () => {
    if (args.help) {
        console.log(HELP);
        return false;
    }
    if (!("filename" in args)) {
        console.log("Gib filename pls.");
        console.log(HELP);
        return false;
    }
    if (!("title" in args)) {
        console.log("Gib title pls.");
        console.log(HELP);
        return false;
    }
    if (!("t" in args)) {
        console.log("Gib tags pls.");
        console.log(HELP);
        return false;
    }
    return true;
}

const makeTags = () => {
    if (typeof args.t !== "object") {
        return `\n- ${args.t}`;
    }
    let text = "";
    args.t.forEach((tag) => {
        text += `\n- ${tag}`;
    })
    return text;
}

if (checkFields()) {
    fs.readFile(STUB_FILE, "utf-8", (err, data) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        const newContent = data
            .replace("{title}", `"${args.title}"`)
            .replace("{tags}", makeTags())
            .replace("{date}", new Date().toISOString().split("T")[0])
            .replace("{subtitle}", args.subtitle ? `"${args.subtitle}"` : "\"\"");

        fs.writeFile(`docs/posts/${args.filename}.md`, newContent, err => {
            if (err) {
                console.error(err);
                process.exit(1);
            } else {
                console.log("New empty post created");
                process.exit(0);
            }
        })
    })
} else {
    process.exit(1);
}
