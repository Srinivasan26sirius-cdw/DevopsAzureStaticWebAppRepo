const fs = require("fs");
const path = require("path");

describe("React Build Artifact Tests", () => {
  test("index.html should exist in build folder", () => {
    const filePath = path.join(__dirname, "../dist/index.html");

    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("index.html should contain root div", () => {
    const filePath = path.join(__dirname, "../dist/index.html");

    const html = fs.readFileSync(filePath, "utf8");

    expect(html).toMatch(/id="root"/);
  });

  test("index.html should contain script tag", () => {
    const filePath = path.join(__dirname, "../dist/index.html");

    const html = fs.readFileSync(filePath, "utf8");

    expect(html).toMatch(/script/);
  });
});
