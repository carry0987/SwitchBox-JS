import { SwitchBoxOption } from '../interface/interfaces';

export const defaults: SwitchBoxOption = {
    title: null,
    bindLabel: true,
    checked: false,
    checkedByValue: null,
    disabled: false,
    disabledByValue: null,
    styles: {},
    theme: 'blue',
    onLoad: undefined,
    onChecked: undefined,
    onUnchecked: undefined,
    onChange: undefined
};
