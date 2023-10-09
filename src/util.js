/* Util */
const Util = {
    getElem(ele, mode, parent) {
        if (typeof ele === 'object') {
            return ele;
        } else if (mode === undefined && parent === undefined) {
            return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele);
        } else if (mode === 'all' || mode === null) {
            return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
        } else if (typeof mode === 'object' && parent === undefined) {
            return mode.querySelector(ele);
        }
    },
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },
    deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (Util.isObject(target) && Util.isObject(source)) {
            for (const key in source) {
                if (Util.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    Util.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return Util.deepMerge(target, ...sources);
    },
    injectStylesheet(stylesObject, id) {
        let style = document.createElement('style');
        style.id = 'switchbox-style' + id;
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);

        let stylesheet = document.styleSheets[document.styleSheets.length - 1];

        for (let selector in stylesObject) {
            if (stylesObject.hasOwnProperty(selector)) {
                Util.compatInsertRule(stylesheet, selector, Util.buildRules(stylesObject[selector]), id);
            }
        }
    },
    buildRules(ruleObject) {
        let ruleSet = '';
        for (let property in ruleObject) {
            if (ruleObject.hasOwnProperty(property)) {
                ruleSet += property + ':' + ruleObject[property] + ';';
            }
        }
        return ruleSet;
    },
    compatInsertRule(stylesheet, selector, cssText, id) {
        let modifiedSelector = selector.replace('.switch-box', '.switch-box-' + id);
        stylesheet.insertRule(modifiedSelector + '{' + cssText + '}', 0);
    },
    removeStylesheet: function(id) {
        let styleElement = Util.getElem('#switchbox-style' + id);
        if (styleElement) {
            styleElement.parentNode.removeChild(styleElement);
        }
    },
    getTemplate: function(id, theme) {
        let template = `
        <div class="switch-box switch-box-${id}">
            <label class="switch switch-${theme}">
                <span class="switch-style"></span>
            </label>
            <div class="switch-title">
                <span></span>
            </div>
        </div>
        `;
        return template;
    }
};

export default Util;
