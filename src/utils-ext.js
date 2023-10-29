import Utils from '@carry0987/utils';

Utils.setStylesheetId = 'switchbox-style';
Utils.setReplaceRule('.switch-box', '.switch-box-');

Utils.getTemplate = function(id, theme) {
    let template = `
    <div class="switch-box switch-box-${id}">
        <label class="switch switch-${theme}">
            <span class="switch-style"></span>
        </label>
        <div class="switch-title">
            <span></span>
        </div>
    </div>
    `;
    return template;
}

Utils.getChecked = function() {
    return this.ele.checked;
}

export default Utils;
