function throwError(message) {
    throw new Error(message);
}

function getElem(ele, mode, parent) {
    // Return generic Element type or NodeList
    if (typeof ele !== 'string')
        return ele;
    let searchContext = document;
    if (mode === null && parent) {
        searchContext = parent;
    }
    else if (mode && mode instanceof Node && 'querySelector' in mode) {
        searchContext = mode;
    }
    else if (parent && parent instanceof Node && 'querySelector' in parent) {
        searchContext = parent;
    }
    // If mode is 'all', search for all elements that match, otherwise, search for the first match
    // Casting the result as E or NodeList
    return mode === 'all' ? searchContext.querySelectorAll(ele) : searchContext.querySelector(ele);
}
function createElem(tagName, attrs = {}, text = '') {
    let elem = document.createElement(tagName);
    for (let attr in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
            if (attr === 'textContent' || attr === 'innerText') {
                elem.textContent = attrs[attr];
            }
            else {
                elem.setAttribute(attr, attrs[attr]);
            }
        }
    }
    if (text)
        elem.textContent = text;
    return elem;
}

let stylesheetId = 'utils-style';
const replaceRule = {
    from: '.utils',
    to: '.utils-'
};
function isObject(item) {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
}
function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (source) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                const sourceKey = key;
                const value = source[sourceKey];
                const targetKey = key;
                if (isObject(value)) {
                    if (!target[targetKey] || typeof target[targetKey] !== 'object') {
                        target[targetKey] = {};
                    }
                    deepMerge(target[targetKey], value);
                }
                else {
                    target[targetKey] = value;
                }
            }
        }
    }
    return deepMerge(target, ...sources);
}
function setStylesheetId(id) {
    stylesheetId = id;
}
function setReplaceRule(from, to) {
    replaceRule.from = from;
    replaceRule.to = to;
}
// CSS Injection
function injectStylesheet(stylesObject, id = null) {
    id = isEmpty(id) ? '' : id;
    // Create a style element
    let style = createElem('style');
    // WebKit hack
    style.id = stylesheetId + id;
    style.textContent = '';
    // Add the style element to the document head
    document.head.append(style);
    let stylesheet = style.sheet;
    for (let selector in stylesObject) {
        if (stylesObject.hasOwnProperty(selector)) {
            compatInsertRule(stylesheet, selector, buildRules(stylesObject[selector]), id);
        }
    }
}
function buildRules(ruleObject) {
    let ruleSet = '';
    for (let [property, value] of Object.entries(ruleObject)) {
        property = property.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
        ruleSet += `${property}:${value};`;
    }
    return ruleSet;
}
function compatInsertRule(stylesheet, selector, cssText, id = null) {
    id = isEmpty(id) ? '' : id;
    let modifiedSelector = selector.replace(replaceRule.from, replaceRule.to + id);
    stylesheet.insertRule(modifiedSelector + '{' + cssText + '}', 0);
}
function removeStylesheet(id = null) {
    const styleId = isEmpty(id) ? '' : id;
    let styleElement = getElem('#' + stylesheetId + styleId);
    if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
    }
}
function isEmpty(str) {
    if (typeof str === 'number') {
        return false;
    }
    return !str || (typeof str === 'string' && str.length === 0);
}
function generateRandom(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}

class Utils {
    static setStylesheetId = setStylesheetId;
    static setReplaceRule = setReplaceRule;
    static isEmpty = isEmpty;
    static deepMerge = deepMerge;
    static generateRandom = generateRandom;
    static injectStylesheet = injectStylesheet;
    static removeStylesheet = removeStylesheet;
    static getElem = getElem;
    static createElem = createElem;
    static throwError = throwError;
    static getTemplate = function (id, theme) {
        id = id.toString();
        let template = `
        <div class="switch-box switch-box-${id}">
            <div class="switch switch-${theme}">
                <span class="switch-style switch-trigger"></span>
            </div>
            <label class="switch-title"></label>
        </div>
        `;
        return template;
    };
    static handleSwitchboxTitle(ele, labelSibling) {
        let title = ele.title || ele.dataset.switchboxTitle || null;
        let remainLabel = false;
        let randomID = null;
        let isValidLabel = false;
        let labelToRestore;
        if (labelSibling instanceof HTMLLabelElement) {
            const htmlFor = labelSibling.htmlFor;
            const dataSwitchFor = labelSibling.dataset.switchFor;
            const dataSwitchId = ele.dataset.switchId;
            remainLabel = !isEmpty(ele.id) && htmlFor === ele.id;
            isValidLabel = !isEmpty(ele.id) && dataSwitchFor === ele.id;
            if (!isValidLabel && !isEmpty(ele.name)) {
                isValidLabel = !isEmpty(dataSwitchFor) && dataSwitchFor === ele.name;
            }
            if (!isEmpty(dataSwitchId) && dataSwitchFor === dataSwitchId) {
                randomID = isEmpty(ele.id) && isEmpty(htmlFor) ? 'switch-' + generateRandom(6) : null;
                isValidLabel = true;
            }
            if (isValidLabel || remainLabel) {
                labelToRestore = labelSibling.cloneNode(true);
                // Prefer the explicitly set title, fall back to text from the label.
                title = title || labelSibling.textContent;
                labelSibling.parentNode?.removeChild(labelSibling);
            }
        }
        return { title, remainLabel, randomID, labelToRestore };
    }
    static insertSwitchbox(id, theme, ele, randomID, remainLabel) {
        let template = Utils.getTemplate(id, theme);
        let templateNode = createElem('div');
        templateNode.innerHTML = template.trim();
        let switchNode = getElem('.switch', templateNode);
        let switchTriggerNode = getElem('.switch-trigger', templateNode);
        let labelNode = getElem('label', templateNode);
        let cloneEle = ele.cloneNode(true);
        cloneEle.withID = true;
        if (randomID) {
            cloneEle.id = randomID;
            cloneEle.withID = false;
        }
        if (remainLabel === true) {
            labelNode.htmlFor = cloneEle.id;
        }
        // Add click event to the switch trigger
        switchTriggerNode.addEventListener('click', (e) => {
            e.preventDefault();
            cloneEle.click();
        });
        // Replace the original element with the template
        switchNode.insertBefore(cloneEle, switchNode.firstChild);
        ele.parentNode.replaceChild(templateNode.firstElementChild || templateNode, ele);
        return { cloneEle, templateNode, labelNode };
    }
    static insertSwitchboxTitle(title, bindLabel, labelNode, cloneEle) {
        if (!title) {
            labelNode.parentNode.removeChild(labelNode);
        }
        else {
            labelNode.textContent = title;
            if (bindLabel === true) {
                labelNode.classList.add('switch-box-labeled');
                labelNode.addEventListener('click', (e) => {
                    e.preventDefault();
                    cloneEle.click();
                });
            }
        }
    }
    static toggleCheckStatus(ele, checked) {
        if (checked) {
            ele.checked = true;
            ele.setAttribute('checked', 'checked');
        }
        else {
            ele.checked = false;
            ele.removeAttribute('checked');
        }
    }
    static toggleDisableStatus(ele, disabled) {
        if (disabled) {
            ele.disabled = true;
            ele.setAttribute('disabled', 'disabled');
        }
        else {
            ele.disabled = false;
            ele.removeAttribute('disabled');
        }
    }
    static restoreElement(element) {
        if (typeof element.switchBoxChange === 'function') {
            element.removeEventListener('change', element.switchBoxChange);
        }
        if (element.withID === false) {
            element.removeAttribute('id');
        }
        element.switchBoxChange = undefined;
        element.removeAttribute('data-switchbox');
        if (element.parentNode && element.parentNode.parentNode) {
            let parentElement = element.parentNode;
            parentElement = parentElement.parentNode;
            parentElement.replaceWith(element);
        }
        let labelNode = element.labelToRestore;
        if (labelNode && labelNode.nodeType === Node.ELEMENT_NODE) {
            element.parentNode?.insertBefore(labelNode, element.nextSibling);
        }
    }
}
Utils.setStylesheetId('switchbox-style');
Utils.setReplaceRule('.switch-box', '.switch-box-');

const reportInfo = (vars, showType = false) => {
    if (showType === true) {
        console.log('Data Type : ' + typeof vars, '\nValue : ' + vars);
    }
    else if (typeof showType !== 'boolean') {
        console.log(showType);
    }
    else {
        console.log(vars);
    }
};

const defaults = {
    title: null,
    bindLabel: true,
    checked: false,
    checkedByValue: null,
    disabled: false,
    disabledByValue: null,
    styles: {},
    theme: 'blue',
    onLoad: undefined,
    onChecked: undefined,
    onUnchecked: undefined,
    onChange: undefined
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "/* Switch */\n.switch,\n.switch-style,\n.switch-style:before {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}\n\n.switch-box {\n    display: flex;\n    justify-content: flex-start;\n    align-items: center;\n    margin: 5px 0;\n}\n\n.switch {\n    display: inline-block;\n    font-size: 100%;\n    height: 1.6em;\n    margin: 0;\n    position: relative;\n    vertical-align: middle;\n}\n\n.switch .switch-style {\n    height: 1.65em;\n    left: 0;\n    background: #C0CCDA;\n    -webkit-border-radius: 0.8em;\n    border-radius: 0.8em;\n    display: inline-block;\n    position: relative;\n    top: 0;\n    -webkit-transition: all 0.15s cubic-bezier(0.45, 0.05, 0.55, 0.95);\n    transition: all 0.15s cubic-bezier(0.45, 0.05, 0.55, 0.95);\n    width: 3.125em;\n    cursor: pointer;\n}\n\n.switch .switch-style:before {\n    display: block;\n    content: '';\n    height: 1.4em;\n    position: absolute;\n    width: 1.4em;\n    background-color: #fff;\n    -webkit-border-radius: 50%;\n    border-radius: 50%;\n    left: 0.125em;\n    top: 0.125em;\n    -webkit-transition: all 0.15s cubic-bezier(0.45, 0.05, 0.55, 0.95);\n    transition: all 0.15s cubic-bezier(0.45, 0.05, 0.55, 0.95);\n}\n\n.switch-title {\n    margin: 0;\n    margin-left: 0.25em;\n    display: inline-block;\n    vertical-align: middle;\n    line-height: 1.25em;\n    font-size: 1.25em;\n    text-transform: capitalize;\n}\n\n.switch-title.switch-box-labeled {\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n\n.switch-title.switch-box-labeled:hover {\n    cursor: pointer;\n}\n\n.switch>input[type=\"checkbox\"] {\n    display: none;\n}\n\n.switch>input[type=\"checkbox\"][disabled]+.switch-style {\n    cursor: not-allowed;\n    background-color: #c0c3c6;\n}\n\n.switch>input[type=\"checkbox\"][disabled]+.switch-style:before {\n    background-color: #f3f3f3;\n}\n\n.switch>input[type=\"checkbox\"]:checked+.switch-style {\n    background-color: #20a0ff;\n}\n\n.switch>input[type=\"checkbox\"]:checked+.switch-style:before {\n    left: 50%;\n}\n\n.switch>input[type=\"checkbox\"]:checked[disabled]+.switch-style {\n    background-color: #b0d7f5;\n}\n\n.switch.switch-blue>input[type=\"checkbox\"]:checked+.switch-style {\n    background-color: #20a0ff;\n}\n\n.switch.switch-blue>input[type=\"checkbox\"]:checked[disabled]+.switch-style {\n    background-color: #b0d7f5;\n}\n\n.switch.switch-green>input[type=\"checkbox\"]:checked+.switch-style {\n    background-color: #13ce66;\n}\n\n.switch.switch-green>input[type=\"checkbox\"]:checked[disabled]+.switch-style {\n    background-color: #a1efc4;\n}\n\n.switch.switch-red>input[type=\"checkbox\"]:checked+.switch-style {\n    background-color: #ff4949;\n}\n\n.switch.switch-red>input[type=\"checkbox\"]:checked[disabled]+.switch-style {\n    background-color: #f9b3b3;\n}\n\n.switch.switch-yellow>input[type=\"checkbox\"]:checked+.switch-style {\n    background-color: #f7ba2a;\n}\n\n.switch.switch-yellow>input[type=\"checkbox\"]:checked[disabled]+.switch-style {\n    background-color: #fbeac1;\n}\n";
styleInject(css_248z);

class SwitchBox {
    static instances = [];
    static version = '2.0.2';
    static firstLoad = true;
    length = 0;
    options = defaults;
    id = 0;
    allElement = [];
    // Methods for external use
    onLoadCallback;
    onCheckedCallback;
    onUncheckedCallback;
    onChangeCallback;
    constructor(element, option) {
        this.init(element, option, SwitchBox.instances.length);
        SwitchBox.instances.push(this);
        if (SwitchBox.instances.length === 1 && SwitchBox.firstLoad === true) {
            reportInfo(`SwitchBox is loaded, version: ${SwitchBox.version}`);
        }
        // Set firstLoad flag to false
        SwitchBox.firstLoad = false;
    }
    init(elements, option, id) {
        let elem = Utils.getElem(elements, 'all');
        if (!elem || elem.length < 1)
            Utils.throwError('Cannot find elements : ' + elements);
        this.length = elem.length;
        this.id = id;
        this.options = Utils.deepMerge({}, defaults, option);
        // Inject stylesheet
        this.injectStyles();
        // Handle callback events
        this.setupCallbacks();
        // Process each switchbox element
        elem.forEach((ele, index) => this.processSwitchbox(ele, index));
        // Handle switch loaded event
        this.onLoadCallback?.(this);
        return this;
    }
    injectStyles() {
        // Inject stylesheet
        let styles = {};
        if (this.options?.styles && Object.keys(this.options.styles).length > 0) {
            styles = Utils.deepMerge({}, this.options.styles, styles);
        }
        styles && Utils.injectStylesheet(styles, this.id.toString());
    }
    setupCallbacks() {
        // Handle onChange event
        this.onChange = (target, checked) => { if (this.options?.onChange)
            this.options.onChange(target, checked); };
        // Handle onChecked event
        this.onChecked = (target) => { if (this.options?.onChecked)
            this.options.onChecked(target); };
        // Handle onUnchecked event
        this.onUnchecked = (target) => { if (this.options?.onUnchecked)
            this.options.onUnchecked(target); };
        // Handle onLoad event
        this.onLoadCallback = this.options?.onLoad;
    }
    processSwitchbox(ele, index) {
        if (ele.type !== 'checkbox')
            return;
        if (ele.hasAttribute('data-switchbox'))
            return;
        ele.setAttribute('data-switchbox', 'true');
        // Handle switchbox title
        let labelSibling = ele.nextElementSibling;
        let bindLabel = this.options.bindLabel ?? false;
        let { title, remainLabel, randomID, labelToRestore } = Utils.handleSwitchboxTitle(ele, labelSibling);
        bindLabel = remainLabel ? true : bindLabel;
        if (this.length === 1) {
            title = title || this.options.title || null;
        }
        // Handle switchbox checked status
        if (ele.checked) {
            Utils.toggleCheckStatus(ele, true);
        }
        else {
            if (this.options.checkedByValue && Array.isArray(this.options.checkedByValue)) {
                if (this.options.checkedByValue.includes(ele.value)) {
                    Utils.toggleCheckStatus(ele, true);
                }
            }
            if (this.options.checked) {
                // Initialize switchbox checked status based on options
                this.updateSwitchboxCheckedStatus(ele, index);
            }
        }
        // Handle switch disabled
        if (ele.disabled) {
            Utils.toggleDisableStatus(ele, true);
        }
        else {
            if (this.options.disabledByValue && Array.isArray(this.options.disabledByValue)) {
                if (this.options.disabledByValue.includes(ele.value)) {
                    Utils.toggleDisableStatus(ele, true);
                }
            }
            if (this.options.disabled) {
                // Initialize switchbox disabled status based on options
                this.updateSwitchboxDisabledStatus(ele, index);
            }
        }
        // Insert switchbox
        let { cloneEle, labelNode } = Utils.insertSwitchbox(this.id.toString(), this.options.theme, ele, randomID, remainLabel);
        // Insert switchbox title
        Utils.insertSwitchboxTitle(title, bindLabel, labelNode, cloneEle);
        // Add event listener
        let switchBoxChange = this.switchBoxChange.bind(this, cloneEle);
        cloneEle.addEventListener('change', switchBoxChange);
        cloneEle.switchBoxChange = switchBoxChange;
        this.allElement.push(cloneEle);
        // Store label
        cloneEle.labelToRestore = labelToRestore;
    }
    updateSwitchboxCheckedStatus(ele, index) {
        // Logic to determine if a switchbox should be checked based on the provided options
        const checked = this.options.checked;
        if (checked === true && this.length === 1) {
            Utils.toggleCheckStatus(ele, true);
        }
        else if ((typeof checked === 'string' && ele.value === checked) || (typeof checked === 'number' && index === checked)) {
            Utils.toggleCheckStatus(ele, true);
        }
        else if (Array.isArray(checked) && (checked.includes(ele.name) || checked.includes(ele.id))) {
            Utils.toggleCheckStatus(ele, true);
        }
    }
    updateSwitchboxDisabledStatus(ele, index) {
        // Logic to determine if a switchbox should be disabled based on the provided options
        const disabled = this.options.disabled;
        if (disabled === true && this.length === 1) {
            Utils.toggleDisableStatus(ele, true);
        }
        else if ((typeof disabled === 'string' && ele.value === disabled) || (typeof disabled === 'number' && index === disabled)) {
            Utils.toggleDisableStatus(ele, true);
        }
        else if (Array.isArray(disabled) && (disabled.includes(ele.name) || disabled.includes(ele.id))) {
            Utils.toggleDisableStatus(ele, true);
        }
    }
    switchBoxChange(target) {
        this.onChangeCallback?.(target, target.checked);
        Utils.toggleCheckStatus(target, target.checked);
        if (target.checked) {
            this.onCheckedCallback?.(target);
        }
        else {
            this.onUncheckedCallback?.(target);
        }
    }
    destroy() {
        // Reset firstLoad flag
        SwitchBox.firstLoad = false;
        // Remove event listeners from all elements
        this.allElement.forEach(element => {
            Utils.restoreElement(element);
        });
        // Reset instance variables
        this.length = 0;
        this.options = defaults;
        this.allElement = [];
        // Remove any injected stylesheets
        Utils.removeStylesheet(this.id.toString());
        // Update the static instances array, removing this instance
        const index = SwitchBox.instances.indexOf(this);
        if (index !== -1) {
            SwitchBox.instances.splice(index, 1);
        }
    }
    // Methods for external use
    set onChange(callback) {
        this.onChangeCallback = callback;
    }
    set onChecked(callback) {
        this.onCheckedCallback = callback;
    }
    set onUnchecked(callback) {
        this.onUncheckedCallback = callback;
    }
    /**
     * Get all switch box elements
     * @return {SwitchInputElement[]} All switch box elements
     */
    get elements() {
        return this.allElement;
    }
    static destroyAll() {
        // Call destroy on all instances
        while (SwitchBox.instances.length) {
            const instance = SwitchBox.instances[0];
            instance.destroy();
        }
    }
}

export { SwitchBox as default };
