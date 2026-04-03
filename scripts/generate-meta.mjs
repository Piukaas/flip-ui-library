import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LIB_SRC = path.join(PROJECT_ROOT, 'projects/ui-components/src/lib');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'dist/flip-ui-library/browser/metadata.json');

function getFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else if (file.endsWith('.ts') && !file.endsWith('.spec.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

function extractSlots(htmlPath) {
  if (!fs.existsSync(htmlPath)) return [];
  const html = fs.readFileSync(htmlPath, 'utf8');
  const slots = [];
  const slotRegex = /<slot(?:\s+name="([^"]+)")?.*?>/g;
  let match;
  while ((match = slotRegex.exec(html)) !== null) {
    slots.push(match[1] || 'default');
  }
  return [...new Set(slots)]; // Unique slots
}

function resolveType(typeNode, sourceFile) {
  if (!typeNode) return 'any';
  return typeNode.getText(sourceFile).replace(/import\(.*?\)\./g, '');
}

const componentFiles = getFilesRecursively(LIB_SRC);
const program = ts.createProgram(componentFiles, {target: ts.ScriptTarget.Latest, module: ts.ModuleKind.ESNext});
const checker = program.getTypeChecker();
const allMetadata = [];

componentFiles.forEach(fileName => {
  const sourceFile = program.getSourceFile(fileName);
  if (!sourceFile) return;

  ts.forEachChild(sourceFile, node => {
    if (ts.isClassDeclaration(node) && node.name) {

      const symbol = checker.getSymbolAtLocation(node.name);
      const description = symbol
        ? ts.displayPartsToString(symbol.getDocumentationComment(checker))
        : '';

      const component = {
        name: node.name.text,
        selector: '',
        description: description.trim(),
        inputs: [],
        outputs: [],
        slots: []
      };

      const decorators = ts.getDecorators(node);
      const compDecorator = decorators?.find(d =>
        d.expression.expression?.getText(sourceFile) === 'Component' ||
        d.expression.getText(sourceFile).startsWith('Component')
      );

      if (compDecorator) {
        const config = compDecorator.expression.arguments[0];
        if (config && ts.isObjectLiteralExpression(config)) {
          const props = config.properties;

          const selectorProp = props.find(p => p.name?.getText(sourceFile) === 'selector');
          if (selectorProp && selectorProp.initializer) {
            component.selector = selectorProp.initializer.text;
          }

          const templateProp = props.find(p => p.name?.getText(sourceFile) === 'templateUrl');
          if (templateProp && ts.isStringLiteral(templateProp.initializer)) {
            const htmlPath = path.resolve(path.dirname(fileName), templateProp.initializer.text);
            component.slots = extractSlots(htmlPath);
          }
        }
      }

      node.members.forEach(member => {
        if (!member.name || !member.initializer) return;

        const memberName = member.name.getText(sourceFile);
        const initText = member.initializer.getText(sourceFile);

        const memSymbol = checker.getSymbolAtLocation(member.name);
        const memDescription = memSymbol
          ? ts.displayPartsToString(memSymbol.getDocumentationComment(checker))
          : '';

        if (initText.startsWith('input')) {
          const typeNode = member.initializer.typeArguments?.[0] || member.type?.typeArguments?.[0];
          component.inputs.push({
            name: memberName,
            description: memDescription.trim(),
            required: initText.includes('.required'),
            type: resolveType(typeNode, sourceFile)
          });
        } else if (initText.startsWith('output')) {
          const typeNode = member.initializer.typeArguments?.[0] || member.type?.typeArguments?.[0];
          component.outputs.push({
            name: memberName,
            description: memDescription.trim(),
            type: resolveType(typeNode, sourceFile)
          });
        }
      });

      if (component.selector) allMetadata.push(component);
    }
  });
});

const DIST_DIR = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, {recursive: true});
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allMetadata, null, 2));

console.log(`✅ Generated metadata for ${allMetadata.length} components.`);
