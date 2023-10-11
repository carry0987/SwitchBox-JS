import Util from './util';
import throwError from './error';
import reportInfo from './report';
import './switchBox.css';

class SwitchBox {
    constructor(elem, option = {}) {
        if (!(this instanceof SwitchBox)) return new SwitchBox(elem, option);
        this.init(elem, option, SwitchBox.instance.length);
        SwitchBox.instance.push(this);

        if (SwitchBox.instance.length === 1) reportInfo('SwitchBox is loaded, version:' + SwitchBox.version);
    }

    /**
     * Initializes the plugin
     */
    init(elem, option, id) {
        let element = Util.getElem(elem, 'all');
        if (element.length < 1) throwError('Elements not found');
        this.element = element;
        this.id = id;
        this.option = Util.deepMerge({}, SwitchBox.defaultOption, option);
        // Inject stylesheet
        if (this.option?.styles && Object.keys(this.option.styles).length > 0) {
            let styles = Util.deepMerge({}, this.option.styles);
            Util.injectStylesheet(styles, id);
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
            let labeled = this.option.labeled;
            if (labelSibling && labelSibling.tagName === 'LABEL') {
                title = (() => { // using IIFE
                    if (!Util.isEmpty(ele.name)) {
                        if (labelSibling.dataset.switchFor === ele.name || labelSibling.htmlFor === ele.name) {
                            return true;
                        }
                    }
                    if (!Util.isEmpty(ele.id)) {
                        if (labelSibling.htmlFor === ele.id) {
                            labeled = true;
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
                title = ele.getAttribute('title') ? ele.getAttribute('title') : this.option.title;
            }

            // Handle switch checked
            if (ele.checked) {
                ele.setAttribute('checked', 'checked');
            } else {
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

            // Insert switch box
            const uuid = Util.createUniqueID(6);
            let template = Util.getTemplate(uuid, this.option.theme);
            let templateNode = document.createElement('div');
            templateNode.innerHTML = template.trim();
            let labelNode = Util.getElem('label', templateNode);
            let cloneEle = ele.cloneNode(true);
            labelNode.insertBefore(cloneEle, labelNode.firstChild);
            ele.parentNode.replaceChild(templateNode.firstElementChild, ele);

            // Insert switch title
            let switchTitleNode = Util.getElem(`div.switch-box-${uuid} .switch-title`);
            if (title === null) {
                switchTitleNode.parentNode.removeChild(switchTitleNode);
            } else {
                let switchTitleSpan = Util.getElem('span', switchTitleNode);
                switchTitleSpan.textContent = title;
                if (labeled) {
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
                e.target.setAttribute('checked', isChecked ? 'checked' : '');
                this.onToggled(e, e.target);
                isChecked ? this.onChecked(e, e.target) : this.onUnchecked(e, e.target);
            });
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
        Util.removeStylesheet(this.id);
        SwitchBox.instance.splice(this.id, 1);

        return this;
    }
}

SwitchBox.version = '1.2.2';
SwitchBox.instance = [];
SwitchBox.defaultOption = {
    title: null,
    labeled: true,
    checked: false,
    styles: {},
    theme: 'blue'
};
SwitchBox.destroyAll = () => {
    SwitchBox.instance.forEach((item, index) => {
        item.destroy();
    });
    SwitchBox.instance = [];
};

export default SwitchBox;
