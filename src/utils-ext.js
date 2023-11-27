import { domUtils, errorUtils, setStylesheetId, setReplaceRule, isEmpty, deepMerge, generateRandom, injectStylesheet, removeStylesheet } from '@carry0987/utils';

class Utils {
    static setStylesheetId = setStylesheetId;
    static setReplaceRule = setReplaceRule;
    static isEmpty = isEmpty;
    static deepMerge = deepMerge;
    static generateRandom = generateRandom;
    static injectStylesheet = injectStylesheet;
    static removeStylesheet = removeStylesheet;
    static getElem = domUtils.getElem;
    static throwError = errorUtils.throwError;

    static getTemplate = function(id, theme) {
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
    
    static getChecked = function() {
        return this.ele.checked;
    }
}

Utils.setStylesheetId('switchbox-style');
Utils.setReplaceRule('.switch-box', '.switch-box-');

export default Utils;
