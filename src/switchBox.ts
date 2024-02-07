import Utils from './module/utils-ext';
import { OnLoadCallback, OnCheckedCallback, OnUnCheckedCallback, OnChangeCallback, SwitchBoxOption, SwitchInputElement } from './interface/interfaces';
import reportInfo from './module/report';
import { defaults } from './module/config';
import './style/switchBox.css';

class SwitchBox {
    private static instances: SwitchBox[] = [];
    private static version: string = '__version__';
    private static firstLoad: boolean = true;
    private length: number = 0;
    private options!: SwitchBoxOption;
    private id: number = 0;
    private allElement: SwitchInputElement[] = [];

    // Methods for external use
    private onLoadCallback?: OnLoadCallback;
    private onCheckedCallback?: OnCheckedCallback;
    private onUncheckedCallback?: OnUnCheckedCallback;
    private onChangeCallback?: OnChangeCallback;

    constructor(element: string | HTMLInputElement, option: SwitchBoxOption = {}) {
        this.init(element, option, SwitchBox.instances.length);
        SwitchBox.instances.push(this);

        if (SwitchBox.instances.length === 1 && SwitchBox.firstLoad === true) {
            reportInfo(`SwitchBox is loaded, version: ${SwitchBox.version}`);
        }

        // Set firstLoad flag to false
        SwitchBox.firstLoad = false;
    }

    private init(elements: string | HTMLInputElement, option: SwitchBoxOption, id: number) {
        let elem = Utils.getElem<HTMLInputElement>(elements, 'all');
        if (!elem || elem.length < 1) Utils.throwError('Cannot find elements : ' + elements);
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

    private injectStyles(): void {
        // Inject stylesheet
        let styles = {};
        if (this.options?.styles && Object.keys(this.options.styles).length > 0) {
            styles = Utils.deepMerge({}, this.options.styles, styles);
        }
        styles && Utils.injectStylesheet(styles, this.id.toString());
    }

    private setupCallbacks(): void {
        // Handle onChange event
        this.onChange = (target, checked) => {if (this.options?.onChange) this.options.onChange(target, checked)};
        // Handle onChecked event
        this.onChecked = (target) => {if (this.options?.onChecked) this.options.onChecked(target)};
        // Handle onUnchecked event
        this.onUnchecked = (target) => {if (this.options?.onUnchecked) this.options.onUnchecked(target)};
        // Handle onLoad event
        this.onLoadCallback = this.options?.onLoad;
    }

    private processSwitchbox(ele: HTMLInputElement, index: number): void {
        if (ele.type !== 'checkbox') return;
        if (ele.hasAttribute('data-switchbox')) return;
        ele.setAttribute('data-switchbox', 'true');

        // Handle switchbox title
        let labelSibling = ele.nextElementSibling as HTMLElement;
        let bindLabel = this.options.bindLabel ?? false;
        let { title, remainLabel, randomID, labelToRestore } = Utils.handleSwitchboxTitle(ele, labelSibling);
        bindLabel = remainLabel ? true : bindLabel;
        if (this.length === 1) {
            title = title || this.options.title || null;
        }

        // Handle switchbox checked status
        if (ele.checked) {
            Utils.toggleCheckStatus(ele, true);
        } else {
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
        } else {
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
        let { cloneEle, labelNode } = Utils.insertSwitchbox(this.id.toString(), this.options.theme as string, ele, randomID, remainLabel);

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

    private updateSwitchboxCheckedStatus(ele: HTMLInputElement, index: number): void {
        // Logic to determine if a switchbox should be checked based on the provided options
        const checked = this.options.checked;
        if (checked === true && this.length === 1) {
            Utils.toggleCheckStatus(ele, true);
        } else if ((typeof checked === 'string' && ele.value === checked) || (typeof checked === 'number' && index === checked)) {
            Utils.toggleCheckStatus(ele, true);
        } else if (Array.isArray(checked) && (checked.includes(ele.name) || checked.includes(ele.id))) {
            Utils.toggleCheckStatus(ele, true);
        }
    }

    private updateSwitchboxDisabledStatus(ele: HTMLInputElement, index: number): void {
        // Logic to determine if a switchbox should be disabled based on the provided options
        const disabled = this.options.disabled;
        if (disabled === true && this.length === 1) {
            Utils.toggleDisableStatus(ele, true);
        } else if ((typeof disabled === 'string' && ele.value === disabled) || (typeof disabled === 'number' && index === disabled)) {
            Utils.toggleDisableStatus(ele, true);
        } else if (Array.isArray(disabled) && (disabled.includes(ele.name) || disabled.includes(ele.id))) {
            Utils.toggleDisableStatus(ele, true);
        }
    }

    private switchBoxChange(target: SwitchInputElement): void {
        this.onChangeCallback?.(target, target.checked);
        Utils.toggleCheckStatus(target, target.checked);
        if (target.checked) {
            this.onCheckedCallback?.(target);
        } else {
            this.onUncheckedCallback?.(target);
        }
    }

    private destroy(): void {
        // Reset firstLoad flag
        SwitchBox.firstLoad = false;
        // Remove event listeners from all elements
        this.allElement.forEach(element => {
            Utils.restoreElement(element);
        });

        // Reset instance variables
        this.length = 0;
        this.options = {};
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
    public set onChange(callback: OnChangeCallback) {
        this.onChangeCallback = callback;
    }

    public set onChecked(callback: OnCheckedCallback) {
        this.onCheckedCallback = callback;
    }

    public set onUnchecked(callback: OnUnCheckedCallback) {
        this.onUncheckedCallback = callback;
    }

    /**
     * Get all switch box elements
     * @return {SwitchInputElement[]} All switch box elements
     */
    public get elements(): SwitchInputElement[] {
        return this.allElement;
    }

    static destroyAll(): void {
        // Call destroy on all instances
        while (SwitchBox.instances.length) {
            const instance = SwitchBox.instances[0];
            instance.destroy();
        }
    }
}

export default SwitchBox;
