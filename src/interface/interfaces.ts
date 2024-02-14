export interface OnLoadCallback {
    (switchBox: any): void;
}

export interface OnCheckedCallback {
    (target: HTMLInputElement): void;
}

export interface OnUnCheckedCallback {
    (target: HTMLInputElement): void;
}

export interface OnChangeCallback {
    (target: HTMLInputElement, checked: boolean): void;
}

export interface SwitchBoxOption {
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

export interface SwitchboxTitleDetail {
    title: string | null;
    remainLabel: boolean;
    randomID: string | null;
    labelToRestore?: HTMLLabelElement;
}

export interface SwitchboxTemplate {
    cloneEle: SwitchInputElement;
    templateNode: HTMLDivElement;
    labelNode: HTMLLabelElement;
}

export interface SwitchInputElement extends HTMLInputElement {
    withID: boolean;
    switchBoxChange?: EventListener;
    labelToRestore?: HTMLLabelElement;
}
