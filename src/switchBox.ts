import Utils from './module/utils-ext';
import { OnLoadCallback, OnCheckedCallback, OnUnCheckedCallback, OnChangeCallback, SwitchBoxOption, SwitchInputElement } from './interface/interfaces';
import reportInfo from './module/report';
import { defaults } from './module/config';
import './style/switchBox.css';

class SwitchBox {
    private static instances: SwitchBox[] = [];
    private static version: string = '__version__';
    private static firstLoad: boolean = true;
    private element: string | HTMLInputElement | null = null;
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
        this.id = id;
        this.element = elements;
        this.options = Utils.deepMerge({}, defaults, option);

        // Inject stylesheet
        this.injectStyles();

        // Handle callback events
        this.setupCallbacks();

        // Process each radiobox element
        elem.forEach((ele, index) => this.processSwitchbox(ele, index));

        // Handle radio loaded event
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

    private destroy(): void {
        // Reset firstLoad flag
        SwitchBox.firstLoad = false;
        // Remove event listeners from all elements
        this.allElement.forEach(element => {
            Utils.restoreElement(element);
        });

        // Reset instance variables
        this.element = null;
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

    static destroyAll(): void {
        // Call destroy on all instances
        while (SwitchBox.instances.length) {
            const instance = SwitchBox.instances[0];
            instance.destroy();
        }
    }
}

export default SwitchBox;
