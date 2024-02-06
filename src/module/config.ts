import { SwitchBoxOption } from '../interface/interfaces';

export const defaults: SwitchBoxOption = {
    title: null,
    bindLabel: true,
    checked: false,
    checkedByValue: undefined,
    disabled: false,
    disabledByValue: undefined,
    styles: {},
    theme: 'blue',
    onLoad: undefined,
    onChecked: undefined,
    onUnchecked: undefined,
    onChange: undefined
};
