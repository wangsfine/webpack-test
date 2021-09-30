import Wzb from './wzb/index.js';
import Test from './components/Test.wzb';
const el = document.createElement('div');
document.body.appendChild(el);

Wzb.render(new Test({ name: 'gongxiaomei'}), el);