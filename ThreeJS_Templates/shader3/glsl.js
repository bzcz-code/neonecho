import { createFilter } from 'rollup-pluginutils';
import MagicString from 'magic-string';
import fs from 'fs';
import path from 'path';

function preprocessIncludes(s, id) {
  return s.replace(/#include\s+([^\s'"]+)/g, (m, f) => {
    if (f.startsWith('<') && f.endsWith('>')) return m; // Skip includes like <name>
    const p = path.resolve(path.dirname(id), f);
    if (!fs.existsSync(p)) throw new Error(`Include not found: ${p}`);
    return preprocessIncludes(fs.readFileSync(p, 'utf-8'), p);
  });
}

function compressShader(s) {
  return s.replace(/\\(?:\r\n|\n\r|\n|\r)|\/\*.*?\*\/|\/\/[^\n\r]*/g, "")
    .split(/\n+/).map(l => l.trim().replace(/\s{2,}|\t/, " "))
    .reduce((r, l) => {
      if (l[0] === '#') {
        if (r[r.length - 1] !== "\n") r.push("\n");
        r.push(l, "\n");
      } else {
        r.push(l.replace(/\s*([{}=*,+\/><&|[\]()\-!;])\s*/g, "$1"));
      }
      return r;
    }, []).join('').replace(/\n+/g, "\n");
}

function glsl(options = {}) {
  const filter = createFilter(options.include || '**/*.glsl', options.exclude);
  return {
    name: 'glsl',
    transform(source, id) {
      if (!filter(id)) return;
      const code = preprocessIncludes(source, id);
      const compressed = compressShader(code);
      const magicString = new MagicString(`export default ${JSON.stringify(compressed)};`);
      return { code: magicString.toString() };
    }
  };
}

export default glsl;
