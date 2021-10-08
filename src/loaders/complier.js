const parser = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const { default: generator } = require('@babel/generator');
const { default: babelTemplate } = require('@babel/template');
const types = require('@babel/types');
const { parseHTML, generateCode } = require('./complier.html.js');
const { parseStyle } = require('./complier.style.js');
const util = require('util');

async function normalize(render, style, script) {
    const renderMethodBodyAst = babelTemplate(render, { placeholderPattern: false })();
    const styleAst = babelTemplate(style, { placeholderPattern: false })();
    const ast = await parser.parse(script, {
        sourceType: 'module',
    });
    traverse(ast, {
        Program(path) {
            path.node.body.push(
                styleAst
            )
        },
        ExportDefaultDeclaration(path) {
            if (path.node.declaration.type !== 'ClassDeclaration') {
                return;
            }
            path.traverse({
                ClassBody(path) {
                    path.node.body.push(
                        types.classMethod(
                            'method', 
                            types.identifier('_render'),
                            [], 
                            types.blockStatement(renderMethodBodyAst)
                        )
                    )
                    path.traverse({
                        ClassMethod(path) {
                            if (path.node.key.name !== '_render') {
                                return;
                            }
                            path.traverse({
                                VariableDeclarator(path) {
                                    if (path.node.id.name !== '__descriptors__') {
                                        return;
                                    }
                                    path.traverse({
                                        ObjectProperty(path) {
                                            // 处理mustache表达式
                                            if (path.node.key.value === 'mustaches') {
                                                const elements = path.node.value.elements.reduce((pre, element) => {
                                                    const { value } = element;
                                                    const node = babelTemplate(value)();
                                                    return [...pre, node.expression];
                                                }, []);
                                                path.node.value = types.arrowFunctionExpression(
                                                    [],
                                                    types.blockStatement([
                                                        types.returnStatement(
                                                            types.arrayExpression(elements)
                                                        )
                                                    ])
                                                )
                                            }
                                            // 处理事件
                                            if (path.node.key.value === 'listeners') {
                                                const properties = path.node.value.properties;
                                                path.node.value.properties = properties.reduce((pre, property) => {
                                                    const { key: { value: event }, value: { value: listener }} = property;
                                                    const node = types.objectProperty(
                                                        types.identifier(event),
                                                        babelTemplate(listener)().expression
                                                    )
                                                    return [...pre, node]
                                                }, []);
                                            }
                                            // 处理属性绑定
                                            if (path.node.key.value === 'attrs') {
                                                const properties = path.node.value.properties;
                                                for (const property of properties) {
                                                    if (types.isObjectProperty(property) && types.isObjectExpression(property.value)) {
                                                        const [valueObjProperty, typeObjProperty] = property.value.properties;
                                                        const { value: { value: type }} = typeObjProperty;
                                                        const { value: { value: value }} = valueObjProperty;
                                                        if (type === 'Expression') {
                                                            valueObjProperty.value = types.arrowFunctionExpression(
                                                                [],
                                                                types.blockStatement([
                                                                    types.returnStatement(
                                                                        babelTemplate(value, {placeholderPattern: false})().expression
                                                                    )
                                                                ])
                                                            );
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                },
            });
        }
    });
    return ast;
}
const complier = {
    async parse(source) {
        // 解析template
        const templateResult = /<template>([\s\S]*)<\/template>/.exec(source);
        const template = templateResult[1];
        const htmlAst = parseHTML(template);
        const { render } = generateCode(htmlAst);
        

        // 解析style
        const styleResult = /<style>([\s\S]*)<\/style>/.exec(source);
        const style = parseStyle(styleResult[1]);
        

        // 解析script
        const scriptResult = /<script>([\s\S]*)<\/script>/.exec(source);
        const script = scriptResult[1];
        
        const ast = await normalize(render, style, script);
        return generator(ast);
    }
}

module.exports = complier;