
export const processShader = (shaderCode: string, shaderType: 'vertex' | 'fragment') => {
    shaderCode = shaderCode.split('\n').map(line => line.replace(/[ \t]+(?=[^\s])/g, ' ').trim()).filter(line => line.length > 0).join('\n').replace(/(\n\s*){2,}/g, '\n');
    const [header, body] = shaderCode.split('void main');
    const mainBody = body.trim().slice(0, -1).replace('{', '___|Temp|___').split('___|Temp|___')[1];
    return { header, mainBody };
};



