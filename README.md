# SwitchBox-JS
[![version](https://img.shields.io/npm/v/@carry0987/switch-box.svg)](https://www.npmjs.com/package/@carry0987/switch-box)
![CI](https://github.com/carry0987/SwitchBox-JS/actions/workflows/ci.yml/badge.svg)  
A JS library for create switcher via checkbox

## Installation
```bash
pnpm i @carry0987/switch-box
```

## Usage
Here is a simple example to use SwitchBox-JS

#### UMD
```html
<div id="app">
    <h1>Individual Input</h1>
    <input type="checkbox" name="switch-1">
    <input type="checkbox" name="switch-2">
</div>
<hr>
<div id="app-2">
    <h1>Grouped Input</h1>
    <input type="checkbox" name="switch-3" title="Switch-3">
    <input type="checkbox" name="switch-4">
    <label data-switch-for="switch-4">Switch-4</label>
    <input type="checkbox" id="switch-5" value="1">
    <label data-switch-for="switch-5">Switch-5</label>
    <input type="checkbox" id="switch-6">
    <label for="switch-6">Switch-6</label>
</div>
<hr>
<div id="app-3">
    <h1>Disabled Input</h1>
    <input type="checkbox" id="switch-7">
    <label for="switch-7">Switch-7</label>
</div>
<link href="dist/theme/switchBox.min.css" rel="stylesheet">
<script src="dist/switchBox.min.js"></script>
<script type="text/javascript">
let switchBox1 = new switchBoxjs.SwitchBox('input[name="switch-1"]', {
    title: 'Switch 1',
    checked: true,
    onUnchecked: function(target) {
        console.log(target);
    }
});
switchBox1.onChange = (target, checked) => {
    console.log(checked);
};
let switchBox2 = new switchBoxjs.SwitchBox('input[name="switch-2"]', {
    title: 'Switch 2',
    checked: false,
    onChecked: function(target) {
        console.log(target);
    }
});
let switchBox3 = new switchBoxjs.SwitchBox('#app-2 input', {
    bindLabel: false,
    checked: ['switch-3'],
    checkedByValue: [1, '1'],
    styles: {
        '.switch-box': {'padding': '10px;'}
    },
    onLoad: function(switchbox) {
        console.log(switchbox.elements);
    }
});
switchBox3.onToggled = function(e, ele) {
    console.log(e.target.checked);
    console.log(ele);
};
let switchBox4 = new switchBoxjs.SwitchBox('#app-3 input', {
    disabled: ['switch-7'],
    styles: {
        '.switch-box': {'padding': '10px;'}
    }
});
</script>
```

#### ES Module
```ts
import { SwitchBox } from '@carry0987/switch-box';
import '@carry0987/switch-box/theme/switchBox.min.css';

let switchBox = new SwitchBox('.check-box-list input', {
    //...
});
```
