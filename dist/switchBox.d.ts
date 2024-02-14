interface OnLoadCallback {
    (switchBox: any): void;
}
interface OnCheckedCallback {
    (target: HTMLInputElement | null): void;
}
interface OnUnCheckedCallback {
    (target: HTMLInputElement | null): void;
}
interface OnChangeCallback {
    (target: HTMLInputElement | null, checked: boolean): void;
}
interface SwitchBoxOption {
    title: string | null;
    bindLabel: boolean;
    checked: boolean | string | number | Array<string | number>;
    checkedByValue: Array<string | number> | null;
    disabled: boolean | string | number | Array<string | number>;
    disabledByValue: Array<string | number> | null;
    styles: object;
    theme: string;
    onLoad?: OnLoadCallback;
    onChecked?: OnCheckedCallback;
    onUnchecked?: OnUnCheckedCallback;
    onChange?: OnChangeCallback;
}
interface SwitchInputElement extends HTMLInputElement {
    withID: boolean;
    switchBoxChange?: EventListener;
    labelToRestore?: HTMLLabelElement;
}

declare class SwitchBox {
    private static instances;
    private static version;
    private static firstLoad;
    private length;
    private options;
    private id;
    private allElement;
    private onLoadCallback?;
    private onCheckedCallback?;
    private onUncheckedCallback?;
    private onChangeCallback?;
    constructor(element: string | HTMLInputElement, option: Partial<SwitchBoxOption>);
    private init;
    private injectStyles;
    private setupCallbacks;
    private processSwitchbox;
    private updateSwitchboxCheckedStatus;
    private updateSwitchboxDisabledStatus;
    private switchBoxChange;
    private destroy;
    set onChange(callback: OnChangeCallback);
    set onChecked(callback: OnCheckedCallback);
    set onUnchecked(callback: OnUnCheckedCallback);
    /**
     * Get all switch box elements
     * @return {SwitchInputElement[]} All switch box elements
     */
    get elements(): SwitchInputElement[];
    static destroyAll(): void;
}

export { SwitchBox as default };
