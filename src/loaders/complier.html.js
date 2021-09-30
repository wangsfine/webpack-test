const htmlParser = require('htmlparser2');
const util = require('util');

function parseHTML(html) {
    const rootNodes = [];
    const stack = [];
    const parser = new htmlParser.Parser({
        onopentag(tagName, attrs) {
            const node = {
                type: 'tag',
                name: tagName,
                children: [],
                attrs: {},
                listeners: {},
            };
            stack.push(node);
        },
        onattribute(name, value, quote) {
            const length = stack.length;
            if (length > 0) {
                const { attrs, listeners } = stack[length - 1];
                // 1、 :value="xxx"
                const bindingResult = /^:([a-zA-Z$_][$\w]*)$/.exec(name);
                if (bindingResult) {
                    const prop = bindingResult[1];
                    return Object.assign(attrs, { [prop]: { value: value, type: 'Expression' }})
                }
                // 2、listeners
                const listenerResult = /^@(\w+)$/.exec(name);
                if (listenerResult) {
                    const event = listenerResult[1];
                    return Object.assign(listeners, { [event]: value })
                }
                // 3、common attr
                Object.assign(attrs, { [name]: { value, type: 'Literal' }})

            }
        },
        ontext(text) {
            text = text.trim();
            const node = {
                type: 'text',
                text,
                mustaches: getMustaches(text),
            }
            const length = stack.length;
            // 有父节点
            if (length > 0) {
                const parentNode = stack[length - 1];
                const { children = [] } = parentNode;
                children.push(node);
            } else {
                rootNodes.push(node);
            }
        },
        oncomment(data) {
            const node = {
                type: 'comment',
                comment: data,
            }
            const length = stack.length;
            // 有父节点
            if (length > 0) {
                const parentNode = stack[length - 1];
                const { children = [] } = parentNode;
                children.push(node);
            } else {
                rootNodes.push(node);
            }
        },
        onclosetag(tagName) {
            const node = stack.pop();
            const length = stack.length;
            // 有父节点
            if (length > 0) {
                const parentNode = stack[length - 1];
                const { children = [] } = parentNode;
                children.push(node);
            } else {
                rootNodes.push(node);
            }
        },
    });
    parser.write(html);
    parser.end();
    return rootNodes;
}

/**
 * 判断是否是一个字面量
 * @param {*} value 
 * @returns 
 */
function isLiteral(value) {
    value = value.trim();
    // number
    if (/^[\-\+]?\d+$/.test(value)) {
        return true;
    }
    // string 
    if (/^[`'"].*[`'"]$/.test(value)) {
        return true;
    }
    // boolean
    if (/^(true)|(false)$/.test(value)) {
        return true;
    }
    // undefined 、null
    if (/^(undefined)|(null)$/.test(value)) {
        return true;
    }
    // object
    if (/^\{.*\}$/.test(value)) {
        return true;
    }
    // arrow function
    if (/\([$\w,\.]*\)\s*(=>)/.test(value)) {
        return true;
    }
    // function
    if (/function\s*\([$\w,\.]*\)\s*\{[\s\S]*\}/.test(value)) {
        return true;
    }
    return false;
}

/**
 * 判断是一个引用
 * @param {*} value 
 * @returns 
 */
function isRefrence(value) {
    value = value.trim();
    return /^[a-zA-Z$_][$\w]*$/.test(value);
}


function getVarType(val) {
    if (isLiteral(val)) {
        return 'Literal';
    }
    if (isRefrence(val)) {
        return 'Refrence';
    }
    return 'Expression';
}

/**
 * 获取text中所有mustache表达式
 * @param {*} text 
 * @returns 
 */
const mustacheReg = /\{\{([\s\S]*?)\}\}/g;
function getMustaches(text) {
    const iterator = text.matchAll(mustacheReg);
    return Array.from(iterator).map(item => item[1].trim())
}

function generateCode(ast) {
    return {
        render: `
            const __descriptors__ = ${JSON.stringify(ast)};
            function createElement(parent, descriptor) {
                const { type } = descriptor;
                if (type === 'text') {
                    return createTextElement(parent, descriptor);
                }
                if (type === 'tag') {
                    return createTagElement(parent, descriptor);
                }
            }
            function createTagElement(parent, descriptor) {
                console.log('createTagElement--->')
                const { name, attrs, listeners, children } = descriptor;
                const el = document.createElement(name);
                descriptor._render = function() {
                    // 设置属性
                    Object.keys(attrs).forEach(key => {
                        const { value, type } = attrs[key];
                        el.setAttribute(key, type === 'Expression' ? value() : value);
                    })
                }
                descriptor._update = function() {
                    descriptor._render();
                }
                // 设置事件
                Object.keys(listeners).forEach(key => {
                    el.addEventListener(key, listeners[key]);
                })
                descriptor._render();
                descriptor.__instance__ = el;
                if (parent) {
                    parent.appendChild(el);
                }
                return el;
            }
            
            function createTextElement(parent, descriptor) {
                const { text: template, mustaches } = descriptor;
                let text = template;
                const node = document.createTextNode(text);
                // 渲染
                descriptor._render = function() {
                    const data = mustaches();
                    if (data.length > 0) {
                        const oldText = text;
                        text = renderMustachText(template, data);
                        if (text !== oldText) {
                            text = node.textContent = text;
                        }
                    }
                }
                // 更新
                descriptor._update = function() {
                    descriptor._render();
                    console.log('_update---->')
                }
                descriptor._render();
                descriptor.__instance__ = node;
                if (parent) {
                    parent.appendChild(node);
                }
                return node;
            }
            
            function renderMustachText(template, data) {
                let i = 0;
                return template.replace(${mustacheReg.toString()}, function() {
                    return data[i++];
                });
            }
            
            function recu(parent, arr) {
                for (const descriptor of arr) {
                    const { children = [] } = descriptor;
                    const node = createElement(parent, descriptor);
                    recu(node, children);
                }
            }
            recu(null, __descriptors__);
            this.__descriptors__ = __descriptors__;
        `
    }
}

module.exports = {
    parseHTML,
    generateCode,
};

