import Util from './util';
import throwError from './error';
import reportInfo from './report';
import './switchBox.css';

class SwitchBox {
    constructor(elem, option = {}) {
        if (!(this instanceof SwitchBox)) return new SwitchBox(elem, option);
        this.init(elem, option, SwitchBox.instance.length);
        this.onChecked = (e) => {if (this.option.onChecked) this.option.onChecked(e)};
        this.onUnchecked = (e) => {if (this.option.onUnchecked) this.option.onUnchecked(e)};
        this.onToggled = (e) => {if (this.option.onToggled) this.option.onToggled(e)};
        SwitchBox.instance.push(this);

        if (SwitchBox.instance.length === 1) reportInfo('SwitchBox is loaded, version:' + SwitchBox.version);
    }

    /**
     * Initializes the plugin
     */
    init(elem, option, id) {
        let ele = Util.getElem(elem);
        if (!ele) throwError('Element not found');
        if (ele.type !== 'checkbox') throwError('Element must be checkbox');
        if (ele.hasAttribute('data-switchbox')) return this;
        ele.setAttribute('data-switchbox', 'true');
        this.ele = ele;
        this.id = id;
        this.option = Util.deepMerge({}, SwitchBox.defaultOption, option);
        if (this.ele.checked) {
            this.ele.setAttribute('checked', 'checked');
        } else {
            if (this.option.checked) {
                this.ele.checked = true;
                this.ele.setAttribute('checked', 'checked');
            }
        }

        // Inject stylesheet
        if (this.option?.styles && Object.keys(this.option.styles).length > 0) {
            let styles = Util.deepMerge({}, this.option.styles);
            Util.injectStylesheet(styles, id);
        }

        // Insert switch box
        let template = Util.getTemplate(id, this.option.theme);
        let templateNode = document.createElement('div');
        templateNode.innerHTML = template.trim();
        let labelNode = Util.getElem('label', templateNode);
        labelNode.insertBefore(this.ele.cloneNode(true), labelNode.firstChild);
        this.ele.parentNode.replaceChild(templateNode.firstChild, this.ele);
        // Handle switch title
        let switchTitleNode = Util.getElem(`div.switch-box-${id} .switch-title`);
        if (this.option.title === null) {
            switchTitleNode.parentNode.removeChild(switchTitleNode);
        } else {
            let switchTitleSpan = Util.getElem('span', switchTitleNode);
            switchTitleSpan.textContent = this.option.title;
        }
        // Reselect new switch
        this.ele = Util.getElem(elem);
        this.ele.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            e.target.setAttribute('checked', isChecked ? 'checked' : '');
            this.onToggled(e, isChecked);
            isChecked ? this.onChecked(e) : this.onUnchecked(e);
        });

        return this;
    }

    /**
     * Destroys the plugin
     */
    destroy() {
        this.ele.parentNode.removeChild(this.ele);
        Util.removeStylesheet(this.id);
        SwitchBox.instance.splice(this.id, 1);
        return this;
    }
}

SwitchBox.version = '1.1.0';
SwitchBox.instance = [];
SwitchBox.defaultOption = {
    title: null,
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
