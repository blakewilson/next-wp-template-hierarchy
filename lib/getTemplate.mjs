import fs from "fs";

export function doesTemplateExist(templateName) {
  return fs.existsSync(`./pages/${templateName}.js`);
}

export function getTemplate(templates) {
  if (!templates) {
    return null;
  }

  for (let i = 0; i < templates.length; i++) {
    if (doesTemplateExist(templates[i])) {
      return templates[i];
    }
  }

  return null;
}
