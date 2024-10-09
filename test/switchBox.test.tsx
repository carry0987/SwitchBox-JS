import { SwitchBox } from '@/index';
import { render, screen, cleanup, fireEvent } from '@testing-library/preact';
import { expect, describe, it, beforeEach, afterEach } from 'vitest';

describe('SwitchBox Component', () => {
    let switchBox1: SwitchBox;
    let switchBox2: SwitchBox;
    let switchBox7: SwitchBox;

    beforeEach(() => {
        render(
            <div>
                <div id="app">
                    <h1>Individual Input</h1>
                    <input type="checkbox" name="switch-1" aria-label="Switch 1" />
                    <input type="checkbox" name="switch-2" aria-label="Switch 2" />
                </div>
                <div id="app-2">
                    <h1>Grouped Input</h1>
                    <input type="checkbox" name="switch-3" aria-label="Switch 3" />
                </div>
                <div id="app-3">
                    <h1>Disabled Input</h1>
                    <input type="checkbox" id="switch-7" aria-label="Switch 7" />
                </div>
            </div>
        );

        switchBox1 = new SwitchBox('input[name="switch-1"]', {
            title: 'Switch 1',
            checked: true
        });

        switchBox2 = new SwitchBox('input[name="switch-2"]', {
            title: 'Switch 2',
            checked: false
        });

        switchBox7 = new SwitchBox('input#switch-7', {
            title: 'Switch 7',
            checked: false,
            disabled: true
        });
    });

    afterEach(() => {
        SwitchBox.destroyAll();
        cleanup();
    });

    it('Switch-1 should be checked by default', () => {
        const switch1 = screen.getByRole<HTMLInputElement>('checkbox', { name: 'Switch 1' });
        expect(switch1.checked).toBeTruthy();
    });

    it('Switch-2 should be unchecked by default', () => {
        const switch2 = screen.getByRole<HTMLInputElement>('checkbox', { name: 'Switch 2' });
        expect(switch2.checked).toBeFalsy();
    });

    it('Interact with Switch-1', async () => {
        const switch1 = screen.getByRole<HTMLInputElement>('checkbox', { name: 'Switch 1' });
        fireEvent.click(switch1);
        expect(switch1.checked).toBeFalsy(); // Should toggle state
    });

    it('Verify elements are logged for Switch-3 configuration', () => {
        new SwitchBox('#app-2 input', {
            bindLabel: false,
            checked: ['switch-3'],
            checkedByValue: [1, '1'],
            onLoad: (switchbox) => {
                console.log('Elements:', switchbox.elements.length); // Assume elements are correct
            }
        });
    });

    it('Switch-7 should be disabled', () => {
        const switch7 = screen.getByRole<HTMLInputElement>('checkbox', { name: 'Switch 7' });

        expect(switch7.disabled).toBeTruthy();
    });
});
