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
    removeStylesheet
} from '@carry0987/utils';
import { SwitchboxTitleDetail, SwitchboxTemplate, SwitchInputElement } from '@/interface/interfaces';

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
            <div class="switch switch-${theme}">
                <span class="switch-style switch-trigger"></span>
            </div>
            <label class="switch-title"></label>
        </div>
        `;

        return template;
    };

    static handleSwitchboxTitle(ele: HTMLInputElement, labelSibling: HTMLElement | null): SwitchboxTitleDetail {
        let title: string | null = ele.title || ele.dataset.switchboxTitle || null;
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
            if (!isValidLabel && !isEmpty(ele.name)) {
                isValidLabel = !isEmpty(dataSwitchFor) && dataSwitchFor === ele.name;
            }
            if (!isEmpty(dataSwitchId) && dataSwitchFor === dataSwitchId) {
                randomID = isEmpty(ele.id) && isEmpty(htmlFor) ? 'switch-' + generateRandom(6) : null;
                isValidLabel = true;
            }
            if (isValidLabel || remainLabel) {
                labelToRestore = labelSibling.cloneNode(true) as HTMLLabelElement;
                // Prefer the explicitly set title, fall back to text from the label.
                title = title || labelSibling.textContent;
                labelSibling.parentNode?.removeChild(labelSibling);
            }
        }

        return { title, remainLabel, randomID, labelToRestore };
    }

    static insertSwitchbox(
        id: string,
        theme: string,
        ele: HTMLInputElement,
        randomID: string | null,
        remainLabel: boolean
    ): SwitchboxTemplate {
        let template = Utils.getTemplate(id, theme);
        let templateNode = createElem('div');
        templateNode.innerHTML = template.trim();
        let switchNode = getElem<HTMLDivElement>('.switch', templateNode) as HTMLDivElement;
        let switchTriggerNode = getElem<HTMLSpanElement>('.switch-trigger', templateNode) as HTMLSpanElement;
        let labelNode = getElem<HTMLLabelElement>('label', templateNode) as HTMLLabelElement;
        let cloneEle = ele.cloneNode(true) as SwitchInputElement;
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
        ele.parentNode!.replaceChild(templateNode.firstElementChild || templateNode, ele);

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
                labelNode.classList.add('switch-box-labeled');
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

    static toggleDisableStatus(ele: HTMLInputElement, disabled: boolean): void {
        if (disabled) {
            ele.disabled = true;
            ele.setAttribute('disabled', 'disabled');
        } else {
            ele.disabled = false;
            ele.removeAttribute('disabled');
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
        if (element.parentNode && element.parentNode.parentNode) {
            let parentElement = element.parentNode as HTMLElement;
            parentElement = parentElement.parentNode as HTMLElement;
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
