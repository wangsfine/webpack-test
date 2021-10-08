
class Component {
    constructor(props = {}) {
        this.ticking = false;
        this.props = props;
        this.__descriptors__ = [];
    }

    _update() {
        function recu(arr) {
            for (const descriptor of arr) {
                const { _update, children = [] } = descriptor;
                _update();
                recu(children);
            }
        }
        recu(this.__descriptors__);
    }
    updated() {

    }
    _render() {

    }
    _mount(el) {
        console.log(this.__descriptors__)
        console.log(this.state);
        this.__descriptors__.forEach(item => {
            const { __instance__ } = item;
            el.appendChild(__instance__);
        })
    }
    mounted() {

    }
    beforeDestory() {

    }

    setState(state) {
            if (typeof state === 'function') {
                state = state(this.state, this.props);
            }
            state = Object.assign(this.state, state);
            if (this.ticking) {
                return;
            }
            this.ticking = true;
            Promise.resolve().then(() => {
                // 更新后赋值state
                this._update(this, this._el);
                this.updated();
                this.ticking = false;
            })
    }
}

function Wzb() {

}

Wzb.Component = Component;
Wzb.render = function(cmp, el) {
    cmp._render();
    if (typeof el === 'string') {
        el = document.querySelector(el)
    }
    cmp._mount(el);
    cmp.mounted();
}

export {
    Wzb as default
}