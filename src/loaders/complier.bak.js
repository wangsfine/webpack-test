const parser = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const { default: generator } = require('@babel/generator');
const types = require('@babel/types');
const { parseHTML, generateCode } = require('./complier.html.js');


const complier = {
    async parse(source) {
        const templateResult = /<template>([\s\S]*)<\/template>/.exec(source);
        const template = templateResult[1];
        const htmlAst = parseHTML(template);
        const { render } = generateCode(htmlAst);
        console.log(render);
        const scriptResult = /<script>([\s\S]*)<\/script>/.exec(source);
        const script = scriptResult[1];
        const ast = await parser.parse(script, {
            sourceType: 'module',
        })
        traverse(ast, {
            Program(path) {
                // path.node.body.unshift(
                //     types.importDeclaration(
                //         [types.importDefaultSpecifier(types.identifier('handlebars'))],
                //         types.stringLiteral('handlebars/dist/handlebars.js')
                //     )
                // )
            },
            ExportDefaultDeclaration(path) {
                path.get
                if (path.node.declaration.type !== 'ClassDeclaration') {
                    return;
                }
                path.traverse({
                    ClassBody(path) {
                        // console.log(path.node)
                        path.node.body.push(
                            types.classMethod(
                                'method', 
                                types.identifier('_render'),
                                [], 
                                types.blockStatement([
                                    // const __descriptor__ = []
                                    // createElement
                                    types.functionDeclaration(
                                        types.identifier('createElement'), 
                                        [types.identifier('descriptor')], 
                                        types.blockStatement([
                                            // const { type: type } = descriptor;
                                            types.variableDeclaration(
                                                'const',
                                                [
                                                    types.variableDeclarator(
                                                        types.objectPattern([
                                                            types.objectProperty(
                                                                types.identifier('type'),
                                                                types.identifier('type')
                                                            )
                                                        ]),
                                                        types.identifier('descriptor')
                                                    )
                                                ]
                                            ),
                                            /**
                                             * if (type === 'text') {
                                             *      createTextElement(null, descriptor);
                                             * }
                                             */
                                            types.ifStatement(
                                                types.binaryExpression(
                                                    "===", 
                                                    types.identifier('type'),
                                                    types.stringLiteral('text')
                                                ),
                                                types.blockStatement([
                                                    types.expressionStatement(
                                                        types.callExpression(
                                                            types.identifier('createTextElement'),
                                                            [
                                                                types.nullLiteral(),
                                                                types.identifier('descriptor'),
                                                            ]
                                                        )
                                                    )
                                                ])
                                            ),
                                            /**
                                             * if (type === 'tag') {
                                             *      createTagElement(null, descriptor);
                                             * }
                                             */
                                            types.ifStatement(
                                                types.binaryExpression(
                                                    "===", 
                                                    types.identifier('type'),
                                                    types.stringLiteral('tag')
                                                ),
                                                types.blockStatement([
                                                    types.expressionStatement(
                                                        types.callExpression(
                                                            types.identifier('createTagElement'),
                                                            [
                                                                types.nullLiteral(),
                                                                types.identifier('descriptor'),
                                                            ]
                                                        )
                                                    )
                                                ])
                                            )
                                        ])
                                    ),
                                    // createTagElement
                                    types.functionDeclaration(
                                        types.identifier('createTagElement'),
                                        [
                                            types.identifier('parent'),
                                            types.identifier('descriptor'),
                                        ],
                                        types.blockStatement([
                                            // const { name, attrs, listeners, children } = descriptor; 
                                            types.variableDeclaration(
                                                'const',
                                                [
                                                    types.variableDeclarator(
                                                        types.objectPattern([
                                                            types.objectProperty(
                                                                types.identifier('name'),
                                                                types.identifier('name')
                                                            ),
                                                            types.objectProperty(
                                                                types.identifier('attrs'),
                                                                types.identifier('attrs')
                                                            ),
                                                            types.objectProperty(
                                                                types.identifier('listeners'),
                                                                types.identifier('listeners')
                                                            ),
                                                            types.objectProperty(
                                                                types.identifier('children'),
                                                                types.identifier('children')
                                                            )
                                                        ]),
                                                        types.identifier('descriptor'),
                                                    )
                                                ]
                                            ),
                                            // const el = document.createElement(name);
                                            types.variableDeclaration(
                                                'const',
                                                [
                                                    types.variableDeclarator(
                                                        types.identifier('el'),
                                                        types.callExpression(
                                                            types.memberExpression(
                                                                types.identifier('document'),
                                                                types.identifier('createElement')
                                                            ),
                                                            [
                                                                types.identifier('name')
                                                            ]
                                                        )
                                                    )
                                                ]
                                            ),
                                            // descriptor.__instance__ = el;
                                            types.expressionStatement(
                                                types.assignmentExpression(
                                                    '=',
                                                    types.memberExpression(
                                                        types.identifier('descriptor'),
                                                        types.identifier('__instance__')
                                                    ),
                                                    types.identifier('el')
                                                )
                                            ),
                                            /**
                                             * Object.keys(attrs).forEach(key => {
                                                const { value, type } = attrs[key];
                                                el.setAttribute(key, value);
                                                })
                                             */
                                            types.expressionStatement(
                                                types.callExpression(
                                                    types.memberExpression(
                                                        types.callExpression(
                                                            types.memberExpression(
                                                                types.identifier('Object'),
                                                                types.identifier('keys')
                                                            ),
                                                            [
                                                                types.identifier('attrs')
                                                            ]
                                                        ),
                                                        types.identifier('forEach')
                                                    ),
                                                    [
                                                        types.arrowFunctionExpression(
                                                            [
                                                                types.identifier('key')
                                                            ],
                                                            types.blockStatement([
                                                                // const { value, type } = attrs[key]
                                                                types.variableDeclaration(
                                                                    'const',
                                                                    [
                                                                        types.variableDeclarator(
                                                                            types.objectPattern(
                                                                                [
                                                                                    types.objectProperty(
                                                                                        types.identifier('value'),
                                                                                        types.identifier('value')
                                                                                    ),
                                                                                    types.objectProperty(
                                                                                        types.identifier('type'),
                                                                                        types.identifier('type')
                                                                                    ),
                                                                                ]
                                                                            ),
                                                                            types.memberExpression(
                                                                                types.identifier('attrs'),
                                                                                types.identifier('key')
                                                                            )
                                                                        )
                                                                    ]

                                                                ),
                                                                // el.setAttribute(key, value);
                                                                types.expressionStatement(
                                                                    types.callExpression(
                                                                        types.memberExpression(
                                                                            types.identifier('el'),
                                                                            types.identifier('setAttribute')
                                                                        ),
                                                                        [
                                                                            types.identifier('key'),
                                                                            types.identifier('value')
                                                                        ]
                                                                    )
                                                                )
                                                            ])
                                                        )
                                                    ]
                                                ),
                                            ),
                                            /**
                                             *  Object.keys(listeners).forEach(key => {
                                                el.addEventListener(key, listeners[key]);
                                                })
                                             */
                                            types.expressionStatement(
                                                types.callExpression(
                                                    types.memberExpression(
                                                        types.callExpression(
                                                            types.memberExpression(
                                                                types.identifier('Object'),
                                                                types.identifier('keys')
                                                            ),
                                                            [
                                                                types.identifier('listeners')
                                                            ]
                                                        ),
                                                        types.identifier('forEach')
                                                    ),
                                                    [
                                                        types.arrowFunctionExpression(
                                                            [
                                                                types.identifier('key')
                                                            ],
                                                            types.blockStatement([
                                                                types.expressionStatement(
                                                                    types.callExpression(
                                                                        types.memberExpression(
                                                                            types.identifier('el'),
                                                                            types.identifier('addEventListener')
                                                                        ),
                                                                        [
                                                                            types.identifier('key'),
                                                                            types.memberExpression(
                                                                                types.identifier('listeners'),
                                                                                types.identifier('key')
                                                                            )
                                                                        ]
                                                                    )
                                                                )
                                                            ])
                                                        )
                                                    ]
                                                ),
                                            ),
                                            /**
                                             * if (parent) {
                                             *  parent.appendChild(el)
                                             * }
                                             */
                                            types.ifStatement(
                                                types.identifier('parent'),
                                                types.blockStatement([
                                                    types.expressionStatement(
                                                        types.callExpression(
                                                            types.memberExpression(
                                                                types.identifier('parent'),
                                                                types.identifier('appendChild')
                                                            ),
                                                            [
                                                                types.identifier('el')
                                                            ]
                                                        )
                                                    )
                                                ])
                                            ),
                                            /**
                                             * if (children.length > 0) {
                                                for (child of children) {
                                                    const { type } = child;
                                                    if (type === 'text') {
                                                    createTextElement(el, child);
                                                    }
                                                    if (type === 'tag') {
                                                    createTagElement(el, child);
                                                    }
                                                }
                                                }
                                             */
                                            types.ifStatement(
                                                types.binaryExpression(
                                                    '>',
                                                    types.memberExpression(
                                                        types.identifier('children'),
                                                        types.identifier('length')
                                                    ),
                                                    types.numericLiteral(0)
                                                ),
                                                types.blockStatement([
                                                    types.forOfStatement(
                                                        types.identifier('child'),
                                                        types.identifier('children'),
                                                        types.blockStatement([
                                                            types.variableDeclaration(
                                                                'const',
                                                                [
                                                                    types.variableDeclarator(
                                                                        types.objectPattern([
                                                                            types.objectProperty(
                                                                                types.identifier('type'),
                                                                                types.identifier('type')
                                                                            )
                                                                        ]),
                                                                        types.identifier('child')
                                                                    )
                                                                ]
                                                            ),
                                                            types.ifStatement(
                                                                types.binaryExpression(
                                                                    '===',
                                                                    types.identifier('type'),
                                                                    types.stringLiteral('text')
                                                                ),
                                                                types.blockStatement([
                                                                    types.expressionStatement(
                                                                        types.callExpression(
                                                                            types.identifier('createTextElement'),
                                                                            [
                                                                                types.identifier('el'),
                                                                                types.identifier('child')
                                                                            ]
                                                                        )
                                                                    )
                                                                ])
                                                            ),
                                                            types.ifStatement(
                                                                types.binaryExpression(
                                                                    '===',
                                                                    types.identifier('type'),
                                                                    types.stringLiteral('tag')
                                                                ),
                                                                types.blockStatement([
                                                                    types.expressionStatement(
                                                                        types.callExpression(
                                                                            types.identifier('createTagElement'),
                                                                            [
                                                                                types.identifier('el'),
                                                                                types.identifier('child')
                                                                            ]
                                                                        )
                                                                    )
                                                                ])
                                                            ),
                                                        ])
                                                    )
                                                ])
                                            ),
                                        ])
                                    ),
                                    // createTextElement
                                    types.functionDeclaration(
                                        types.identifier('createTextElement'),
                                        [
                                            types.identifier('parent'),
                                            types.identifier('descriptor')
                                        ],
                                        types.blockStatement([
                                            types.variableDeclaration(
                                                'const',
                                                [
                                                    types.variableDeclarator(
                                                        types.objectPattern([
                                                            types.objectProperty(
                                                                types.identifier('text'),
                                                                types.identifier('template')
                                                            ),
                                                            types.objectProperty(
                                                                types.identifier('mustaches'),
                                                                types.identifier('mustaches')
                                                            )
                                                        ]),
                                                        types.identifier('descriptor')
                                                    )
                                                ]
                                            ),
                                            types.variableDeclaration(
                                                'let',
                                                [
                                                    types.variableDeclarator(
                                                        types.identifier('text'),
                                                        types.identifier('template')
                                                    )
                                                ]
                                            ),
                                            types.ifStatement(
                                                types.binaryExpression(
                                                    '>',
                                                    types.memberExpression(
                                                        types.identifier('mustaches'),
                                                        types.identifier('length')
                                                    ),
                                                    types.numericLiteral(0)
                                                ),
                                                types.blockStatement([
                                                    types.expressionStatement(
                                                        types.assignmentExpression(
                                                            '=',
                                                            types.identifier('text'),
                                                            types.callExpression(
                                                                types.identifier('renderMustachText'),
                                                                [
                                                                    types.identifier('template'),
                                                                    types.identifier('mustaches')
                                                                ]
                                                            )
                                                        )
                                                    )
                                                ])
                                            ),
                                            types.variableDeclaration(
                                                'const',
                                                [
                                                    types.variableDeclarator(
                                                        types.identifier('node'),
                                                        types.callExpression(
                                                            types.memberExpression(
                                                                types.identifier('document'),
                                                                types.identifier('createTextNode')
                                                            ),
                                                            [
                                                                types.identifier('text')
                                                            ]
                                                        )
                                                    )
                                                ]
                                            ),
                                            types.expressionStatement(
                                                types.assignmentExpression(
                                                    '=',
                                                    types.memberExpression(
                                                        types.identifier('descriptor'),
                                                        types.identifier('__instance__')
                                                    ),
                                                    types.identifier('node')
                                                )
                                            ),
                                            types.ifStatement(
                                                types.identifier('parent'),
                                                types.blockStatement([
                                                    types.expressionStatement(
                                                        types.callExpression(
                                                            types.memberExpression(
                                                                types.identifier('parent'),
                                                                types.identifier('appendChild')
                                                            ),
                                                            [
                                                                types.identifier('node')
                                                            ]
                                                        )
                                                    )
                                                ])
                                            ),
                                        ])
                                    ),
                                    // renderMustachText
                                    types.functionDeclaration(
                                        types.identifier('renderMustachText'),
                                        [
                                            types.identifier('template'),
                                            types.identifier('data')
                                        ],
                                        types.blockStatement([
                                            types.variableDeclaration(
                                                'let',
                                                [
                                                    types.variableDeclarator(
                                                        types.identifier('i'),
                                                        types.numericLiteral(0)
                                                    )
                                                ]
                                            ),
                                            types.returnStatement(
                                                types.callExpression(
                                                    types.memberExpression(
                                                        types.identifier('template'),
                                                        types.identifier('replace')
                                                    ),
                                                    [
                                                        types.regExpLiteral('\\{\\{[\\s]*([\\w.\\(\\)]+)[\\s]*\\}\\}', 'g'),
                                                        types.functionExpression(
                                                            null,
                                                            [],
                                                            types.blockStatement([
                                                                types.returnStatement(
                                                                    types.memberExpression(
                                                                        types.identifier('data'),
                                                                        types.updateExpression(
                                                                            '++',
                                                                            types.identifier('i'),
                                                                            false
                                                                        ),
                                                                        true
                                                                    )
                                                                )
                                                            ])
                                                        )
                                                    ]
                                                )
                                            )
                                        ])
                                    ),
                                    // this.__descriptor__.forEach(createElement);
                                    types.expressionStatement(
                                        types.callExpression(
                                            types.memberExpression(
                                                types.identifier('__descriptor__'),
                                                types.identifier('forEach'),
                                            ),
                                            [
                                                types.identifier('createElement')
                                            ]
                                        )
                                    )
                                ])
                            )
                        )
                    }
                })
            }
        });
        return generator(ast);
    }
}
module.exports = complier;