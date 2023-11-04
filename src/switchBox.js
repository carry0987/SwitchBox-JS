import Utils from './utils-ext';
import throwError from './error';
import reportInfo from './report';
import './switchBox.css';

class SwitchBox {
    constructor(elem, option = {}) {
        this.init(elem, option, SwitchBox.instance.length);
        SwitchBox.instance.push(this);

        if (SwitchBox.instance.length === 1) reportInfo('SwitchBox is loaded, version:' + SwitchBox.version);
    }

    /**
     * Initializes the plugin
     */
    init(elem, option, id) {
        let element = Utils.getElem(elem, 'all');
        if (element.length < 1) throwError('Elements not found');
        this.element = element;
        this.id = id;
        this.option = Utils.deepMerge({}, SwitchBox.defaultOption, option);
        // Inject stylesheet
        if (this.option?.styles && Object.keys(this.option.styles).length > 0) {
            let styles = Utils.deepMerge({}, this.option.styles);
            Utils.injectStylesheet(styles, id);
        }
        // Handle Event Listener
        this.onChecked = (e, target) => {if (this.option.onChecked) this.option.onChecked(e, target)};
        this.onUnchecked = (e, target) => {if (this.option.onUnchecked) this.option.onUnchecked(e, target)};
        this.onToggled = (e, target) => {if (this.option.onToggled) this.option.onToggled(e, target)};
        // Handle switch box
        element.forEach((ele, index) => {
            if (ele.type !== 'checkbox') throwError('Element must be checkbox');
            if (ele.hasAttribute('data-switchbox')) return;
            ele.setAttribute('data-switchbox', 'true');

            // Handle switch title
            let labelSibling = ele.nextElementSibling;
            let title = null;
            let bindLabel = this.option.bindLabel;
            if (labelSibling && labelSibling.tagName === 'LABEL') {
                title = (() => { // using IIFE
                    if (!Utils.isEmpty(ele.name)) {
                        if (labelSibling.dataset.switchFor === ele.name || labelSibling.htmlFor === ele.name) {
                            return true;
                        }
                    }
                    if (!Utils.isEmpty(ele.id)) {
                        if (labelSibling.htmlFor === ele.id) {
                            bindLabel = true;
                        }
                        if (labelSibling.dataset.switchFor === ele.id || labelSibling.htmlFor === ele.id) {
                            return true;
                        }
                    }
                    return null;
                })();
                if (title === true) {
                    title = labelSibling.textContent;
                    labelSibling.parentNode.removeChild(labelSibling);
                }
            }
            if (title === null) {
                title = (element.length === 1) ? this.option.title : null;
                if (!title && ele.title) {
                    title = ele.title;
                    ele.removeAttribute('title');
                }
            }

            // Handle switch checked
            if (ele.checked) {
                ele.setAttribute('checked', 'checked');
            } else {
                if (this.option.checkedByValue) {
                    if (Array.isArray(this.option.checkedByValue)) {
                        if (this.option.checkedByValue.includes(ele.value)) {
                            ele.checked = true;
                            ele.setAttribute('checked', 'checked');
                        }
                    }
                }
                if (this.option.checked) {
                    if (typeof this.option.checked === 'boolean' && element.length === 1) {
                        ele.checked = true;
                        ele.setAttribute('checked', 'checked');
                    }
                    if (typeof this.option.checked === 'string') {
                        this.option.checked = [this.option.checked];
                    }
                    if (Array.isArray(this.option.checked)) {
                        if (this.option.checked.includes(ele.name) || this.option.checked.includes(ele.id)) {
                            ele.checked = true;
                            ele.setAttribute('checked', 'checked');
                        }
                    }
                }
            }

            // Handle switch disabled
            if (ele.disabled) {
                ele.setAttribute('disabled', 'disabled');
            } else {
                if (this.option.disabled) {
                    if (typeof this.option.disabled === 'boolean' && element.length === 1) {
                        ele.disabled = true;
                        ele.setAttribute('disabled', 'disabled');
                    }
                    if (typeof this.option.disabled === 'string') {
                        this.option.disabled = [this.option.disabled];
                    }
                    if (Array.isArray(this.option.disabled)) {
                        if (this.option.disabled.includes(ele.name) || this.option.disabled.includes(ele.id)) {
                            ele.disabled = true;
                            ele.setAttribute('disabled', 'disabled');
                        }
                    }
                }
            }

            // Insert switch box
            const uuid = Utils.generateRandom(6);
            let template = Utils.getTemplate(this.id, this.option.theme);
            let templateNode = document.createElement('div');
            templateNode.innerHTML = template.trim();
            let labelNode = Utils.getElem('label', templateNode);
            let cloneEle = ele.cloneNode(true);
            cloneEle.dataset.uuid = uuid;
            labelNode.insertBefore(cloneEle, labelNode.firstChild);
            ele.parentNode.replaceChild(templateNode.firstElementChild, ele);

            // Insert switch title
            let switchTitleNode = Utils.getElem(`div.switch-box-${this.id} .switch-title`, labelNode.parentNode);
            if (title === null) {
                switchTitleNode.parentNode.removeChild(switchTitleNode);
            } else {
                let switchTitleSpan = Utils.getElem('span', switchTitleNode);
                switchTitleSpan.textContent = title;
                if (bindLabel) {
                    switchTitleNode.classList.add('switch-box-labeled');
                    switchTitleNode.addEventListener('click', (e) => {
                        e.preventDefault();
                        cloneEle.click();
                    });
                }
            }

            // Reselect new switch
            cloneEle.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                if (isChecked) {
                    e.target.setAttribute('checked', 'checked');
                } else {
                    e.target.removeAttribute('checked');
                }
                this.onToggled(e, cloneEle);
                isChecked ? this.onChecked(e, e.target) : this.onUnchecked(e, e.target);
            });

            // Handle switch loaded
            if (this.option.loaded) this.option.loaded(cloneEle)
        });

        return this;
    }

    /**
     * Destroys the plugin
     */
    destroy() {
        this.element.forEach((ele, index) => {
            ele.removeAttribute('data-switchbox');
            ele.removeAttribute('checked');
            ele.removeEventListener('change', this.onChecked);
            ele.removeEventListener('change', this.onUnchecked);
            ele.removeEventListener('change', this.onToggled);
            let switchBoxNode = ele.parentNode;
            switchBoxNode.parentNode.replaceChild(ele, switchBoxNode);
        });
        Utils.removeStylesheet(this.id);
        SwitchBox.instance.splice(this.id, 1);

        return this;
    }
}

SwitchBox.version = '__version__';
SwitchBox.instance = [];
SwitchBox.defaultOption = {
    title: null,
    bindLabel: true,
    checked: false,
    checkedByValue: false,
    disabled: false,
    styles: {},
    theme: 'blue',
    loaded: null,
    onChecked: null,
    onUnchecked: null,
    onToggled: null
};
SwitchBox.destroyAll = () => {
    SwitchBox.instance.forEach((item, index) => {
        item.destroy();
    });
    SwitchBox.instance = [];
};

export default SwitchBox;
