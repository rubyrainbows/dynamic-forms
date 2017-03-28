'use strict';

class DynamicForms {

    constructor() {
        this.dynamic_elements = {};
        this.elements = {};
        this.templates = {};
    }

    automaticallySetupForm() {
        $("[data-dynamic-form] [data-dynamic-form-template]").each(function (key, value) {
            let element = $(value);
            let parent = element.parent();
            this.setupForm(parent, element);
        }.bind(this));
    }

    setupForm(parent, element) {
        element.detach();
        let fillData = element.data('dynamic-form-fill');

        if (fillData === undefined) {
            this.createNewRow(parent, element);
        } else if (typeof fillData !== 'string') {
            for (let prop in fillData) {
                if (fillData.hasOwnProperty(prop)) {
                    this.createNewRow(parent, element, prop, fillData[prop]);
                }
            }
            this.createNewRow(parent, element);
        } else {
            this.createNewRow(parent, element);
        }

        DynamicForms.disableBottomRemoveButton(parent);
    }

    createNewRow(parent, element, index = undefined, value = undefined) {
        let cloned = element.clone();
        let templateId = element.data('dynamic-form-template');

        if (this.templates[templateId] === undefined) {
            this.templates[templateId] = 0;
        } else {
            this.templates[templateId]++;
        }

        let templateIdNumber = this.templates[templateId];

        cloned.removeAttr('data-dynamic-form-template');
        cloned.removeAttr('data-dynamic-form-fill');

        let isFirst;
        cloned.find("[data-dynamic-form-input-id-template]").each(function (inputKey, inputValue) {
            let inputElement = $(inputValue);
            let name = inputElement.attr('name');
            isFirst = (this.dynamic_elements[name] === undefined);
            let id = inputElement.data('dynamic-form-input-id-template');

            if (value !== undefined) {
                let dynamicName = inputElement.data('dynamic-form-input-name');
                if (typeof value === 'string') {
                    inputElement.val(value);
                } else if (typeof value === 'object' && value.hasOwnProperty(dynamicName)) {
                    inputElement.val(value[dynamicName]);
                }
            }

            let inputName;
            if (index === undefined) {
                if (this.dynamic_elements[name] === undefined) {
                    this.dynamic_elements[name] = 0;
                } else {
                    this.dynamic_elements[name]++;
                }

                inputName = name.replace(id, DynamicForms.numToChar(this.dynamic_elements[name]));
            } else if (index !== undefined) {
                if (this.elements[name] === undefined) {
                    this.elements[name] = 0;
                } else {
                    this.elements[name]++;
                }

                inputName = name.replace(id, this.elements[name]);
            }

            inputElement.attr('name', inputName);

        }.bind(this));

        cloned.find('[data-dynamic-form-add]').each(function (addKey, addValue) {
            let button = $(addValue);
            button.attr('data-dynamic-form-add', DynamicForms.getDataTagForButton(templateId, 'add', templateIdNumber));
            button.click(function () {
                this.createNewRow(parent, element);
                DynamicForms.disableBottomRemoveButton(parent);
            }.bind(this));
        }.bind(this));

        cloned.find('[data-dynamic-form-remove]').each(function (addKey, addValue) {
            let button = $(addValue);
            button.attr('data-dynamic-form-remove', DynamicForms.getDataTagForButton(templateId, 'remove', templateIdNumber));
            button.click(function () {
                cloned.remove();
                DynamicForms.disableBottomRemoveButton(parent);
                DynamicForms.updateRemoveField(parent, templateId, index);
            }.bind(this));
        }.bind(this));

        cloned.show();
        cloned.appendTo(parent);
    }

    static updateRemoveField(parent, templateId, index) {
        if (!isNaN(parseInt(index)) && isFinite(index)) {
            if (parent.find("input[type='hidden']").length === 0) {
                parent.prepend('<input type="hidden" name="remove_' + templateId + '" value="' + index + '" />');
            } else {
                let removeField = $(parent.find("input[type='hidden']")[0]);
                let value = removeField.val();
                removeField.val(value + "," + index);
            }
        }
    }

    static getDataTagForButton(templateId, type, templateIdNumber) {
        return templateId + '-' + type + '-' + templateIdNumber;
    }

    static disableBottomRemoveButton(parent) {
        parent.find('[data-dynamic-form-remove]').each(function (key, value) {
            $(value).show();
        });
        parent.find('[data-dynamic-form-remove]').last().hide();
    }

    static numToChar(i) {
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let string = '';

        i++;
        while (i > 0) {
            i--;
            let remainder = i % letters.length;

            string = letters[remainder] + string;

            i = (i - remainder) / letters.length;
        }

        return string;
    }
}

window.DynamicForms = DynamicForms;
