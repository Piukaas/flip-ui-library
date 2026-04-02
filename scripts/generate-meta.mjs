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

if (!fs.existsSync(LIB_SRC)) {
  console.error(`❌ Path not found: ${LIB_SRC}`);
  process.exit(1);
}

const componentFiles = getFilesRecursively(LIB_SRC);
const program = ts.createProgram(componentFiles, {});
const checker = program.getTypeChecker();
const allMetadata = [];

function resolveType(typeNode, sourceFile) {
  if (!typeNode) return 'any';
  if (ts.isTypeReferenceNode(typeNode)) {
    const symbol = checker.getSymbolAtLocation(typeNode.typeName);
    if (symbol) {
      const declaration = symbol.declarations?.[0];
      if (declaration && (ts.isTypeAliasDeclaration(declaration) || ts.isInterfaceDeclaration(declaration))) {
        return {
          name: typeNode.getText(sourceFile),
          definition: (declaration.type || declaration).getText(sourceFile)
        };
      }
    }
  }
  return typeNode.getText(sourceFile);
}

componentFiles.forEach(fileName => {
  const sourceFile = program.getSourceFile(fileName);
  if (!sourceFile) return;

  ts.forEachChild(sourceFile, node => {
    if (ts.isClassDeclaration(node)) {
      const component = {
        name: node.name?.getText(sourceFile),
        selector: '',
        inputs: [],
        outputs: []
      };

      const decorators = ts.getDecorators(node);
      const compDecorator = decorators?.find(d => d.expression.expression?.getText(sourceFile) === 'Component');

      if (compDecorator) {
        const config = compDecorator.expression.arguments[0];
        if (config && ts.isObjectLiteralExpression(config)) {
          const selectorProp = config.properties.find(p => p.name?.getText(sourceFile) === 'selector');
          component.selector = selectorProp?.initializer?.text || '';
        }
      }

      node.members.forEach(member => {
        if (!member.initializer || !member.name) return;
        const initText = member.initializer.getText(sourceFile);
        const memberName = member.name.getText(sourceFile);

        if (initText.startsWith('input')) {
          let typeData = 'any';
          if (member.type && ts.isTypeReferenceNode(member.type)) {
            typeData = resolveType(member.type.typeArguments?.[0], sourceFile);
          } else if (member.initializer.typeArguments) {
            typeData = resolveType(member.initializer.typeArguments[0], sourceFile);
          }
          component.inputs.push({
            name: memberName,
            required: initText.includes('.required'),
            type: typeData
          });
        } else if (initText.startsWith('output')) {
          let typeData = 'any';
          if (member.type && ts.isTypeReferenceNode(member.type)) {
            typeData = resolveType(member.type.typeArguments?.[0], sourceFile);
          } else if (member.initializer.typeArguments) {
            typeData = resolveType(member.initializer.typeArguments[0], sourceFile);
          }
          component.outputs.push({
            name: memberName,
            type: typeData
          });
        }
      });

      if (component.selector) allMetadata.push(component);
    }
  });
});

const DIST_DIR = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allMetadata, null, 2));

console.log(`✅ metadata.json generated: ${allMetadata.length} components found`);
