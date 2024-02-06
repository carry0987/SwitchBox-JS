import {
    getElem,
    createElem,
    throwError,
    setStylesheetId,
    setReplaceRule,
    isEmpty,
    deepMerge,
    generateRandom,
    injectStylesheet,
    removeStylesheet,
} from '@carry0987/utils';
import {
    SwitchboxTitleDetail,
    SwitchboxTemplate,
    SwitchInputElement,
} from '../interface/interfaces';

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

    static getTemplate = function (id: number | string, theme: string): string {
        id = id.toString();
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
    };

    static handleSwitchboxTitle(
        ele: HTMLElement,
        labelSibling: HTMLElement | null
    ): SwitchboxTitleDetail {
        let title: string | null =
            ele.title || ele.dataset.switchboxTitle || null;
        let remainLabel: boolean = false;
        let randomID: string | null = null;
        let isValidLabel: boolean = false;
        let labelToRestore: HTMLLabelElement | undefined;

        if (labelSibling instanceof HTMLLabelElement) {
            const htmlFor = labelSibling.htmlFor;
            const dataSwitchFor = labelSibling.dataset.switchFor;
            const dataSwitchId = ele.dataset.switchId;
            remainLabel = !isEmpty(ele.id) && htmlFor === ele.id;
            isValidLabel = !isEmpty(ele.id) && dataSwitchFor === ele.id;
            if (!isEmpty(dataSwitchId) && dataSwitchFor === dataSwitchId) {
                randomID = isEmpty(ele.id) && isEmpty(htmlFor) ? 'switch-' + generateRandom(6) : null;
                isValidLabel = true;
            }
            if (isValidLabel || remainLabel) {
                labelToRestore = labelSibling.cloneNode(true) as HTMLLabelElement;
                // Prefer the explicitly set title, fall back to text from the label.
                title = title || labelSibling.textContent;
            }
        }

        return { title, remainLabel, randomID, labelToRestore };
    }

    static insertSwitchbox(
        id: string,
        ele: HTMLInputElement,
        randomID: string | null,
        remainLabel: boolean
    ): SwitchboxTemplate {
        let template = Utils.getTemplate(id);
        let templateNode = createElem('div');
        templateNode.innerHTML = template.trim();
        let labelNode = getElem<HTMLLabelElement>(
            'label',
            templateNode
        ) as HTMLLabelElement;
        let cloneEle = ele.cloneNode(true) as SwitchInputElement;
        cloneEle.withID = true;
        if (randomID) {
            cloneEle.id = randomID;
            cloneEle.withID = false;
        }
        if (remainLabel === true) {
            labelNode.htmlFor = cloneEle.id;
        }
        if (labelNode.parentNode) {
            labelNode.parentNode.insertBefore(cloneEle, labelNode);
        }

        return { cloneEle, templateNode, labelNode };
    }

    static insertSwitchboxTitle(
        title: string | null,
        bindLabel: boolean,
        labelNode: HTMLLabelElement,
        cloneEle: HTMLInputElement
    ): void {
        if (!title) {
            labelNode.parentNode!.removeChild(labelNode);
        } else {
            labelNode.textContent = title;
            if (bindLabel === true) {
                labelNode.classList.add('switch-labeled');
                labelNode.addEventListener('click', (e) => {
                    e.preventDefault();
                    cloneEle.click();
                });
            }
        }
    }

    static toggleCheckStatus(ele: HTMLInputElement, checked: boolean): void {
        if (checked) {
            ele.checked = true;
            ele.setAttribute('checked', 'checked');
        } else {
            ele.checked = false;
            ele.removeAttribute('checked');
        }
    }

    static restoreElement(element: SwitchInputElement): void {
        if (typeof element.switchBoxChange === 'function') {
            element.removeEventListener('change', element.switchBoxChange);
        }
        if (element.withID === false) {
            element.removeAttribute('id');
        }
        element.switchBoxChange = undefined;
        element.removeAttribute('data-switchbox');
        if (element.parentNode) {
            let parentElement = element.parentNode as HTMLElement;
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

export default Utils;
