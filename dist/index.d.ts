interface OnLoadCallback {
    (switchBox: SwitchBox): void;
}
interface OnCheckedCallback {
    (target: HTMLInputElement): void;
}
interface OnUnCheckedCallback {
    (target: HTMLInputElement): void;
}
interface OnChangeCallback {
    (target: HTMLInputElement, checked: boolean): void;
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
interface SwitchboxTitleDetail {
    title: string | null;
    remainLabel: boolean;
    randomID: string | null;
    labelToRestore?: HTMLLabelElement;
}
interface SwitchboxTemplate {
    cloneEle: SwitchInputElement;
    templateNode: HTMLDivElement;
    labelNode: HTMLLabelElement;
}
interface SwitchInputElement extends HTMLInputElement {
    withID: boolean;
    switchBoxChange?: EventListener;
    labelToRestore?: HTMLLabelElement;
}

type interfaces_OnChangeCallback = OnChangeCallback;
type interfaces_OnCheckedCallback = OnCheckedCallback;
type interfaces_OnLoadCallback = OnLoadCallback;
type interfaces_OnUnCheckedCallback = OnUnCheckedCallback;
type interfaces_SwitchBoxOption = SwitchBoxOption;
type interfaces_SwitchInputElement = SwitchInputElement;
type interfaces_SwitchboxTemplate = SwitchboxTemplate;
type interfaces_SwitchboxTitleDetail = SwitchboxTitleDetail;
declare namespace interfaces {
  export type { interfaces_OnChangeCallback as OnChangeCallback, interfaces_OnCheckedCallback as OnCheckedCallback, interfaces_OnLoadCallback as OnLoadCallback, interfaces_OnUnCheckedCallback as OnUnCheckedCallback, interfaces_SwitchBoxOption as SwitchBoxOption, interfaces_SwitchInputElement as SwitchInputElement, interfaces_SwitchboxTemplate as SwitchboxTemplate, interfaces_SwitchboxTitleDetail as SwitchboxTitleDetail };
}

type InputElement = string | HTMLInputElement | Array<HTMLInputElement> | NodeListOf<HTMLInputElement> | null;

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
    constructor(element: InputElement, option: Partial<SwitchBoxOption>);
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

export { SwitchBox, interfaces as SwitchBoxInterface };
