const fs = require("fs");
const Handlebars = require("handlebars");
const client = require("./utils/SanityClient");
const blocksToHtml = require("@sanity/block-content-to-html");

function buildHTML(filename, data) {
  const source = fs.readFileSync(filename, "utf8").toString();
  const template = Handlebars.compile(source);
  const output = template(data);

  return output;
}

async function main(src, dist) {
  const data = await getSanityData();
  const html = buildHTML(src, data);

  fs.writeFile(dist, html, function (err) {
    if (err) return console.log(err);
    console.log("index.html created");
  });
}

async function getSanityData() {
  const query = `{
        "about": *[_type == 'about'][0]
    }`;
  let data = await client.fetch(query);
  data.about.content = blocksToHtml({
    blocks: data.about.content,
  });
  return await data;
}

main("./src/index.html", "./dist/index.html");
