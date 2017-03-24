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
        } else {
            for (let prop in fillData) {
                if ( fillData.hasOwnProperty(prop)) {
                    console.log(prop);
                    this.createNewRow(parent, element, prop, fillData[prop]);
                }
            }
        }

        DynamicForms.disableTopRemoveButton(parent);
    }

    createNewRow(parent, element, index = undefined, value = undefined) {
        let cloned = element.clone();
        let templateId = element.data('dynamic-form-template');
        if (this.templates[templateId] === undefined) {
            this.templates[templateId] = 0;
        } else {
            this.templates[templateId]++;
        }
        cloned.removeAttr('data-dynamic-form-template');
        cloned.removeAttr('data-dynamic-form-fill');

        let isFirst;
        cloned.find("[data-dynamic-form-input]").each(function (inputKey, inputValue) {
            let inputElement = $(inputValue);
            let name = inputElement.attr('name');
            isFirst = (this.dynamic_elements[name] === undefined);
            let id = inputElement.data('dynamic-form-input');

            if (value !== undefined) {
                inputElement.val(value);
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
            button.attr('data-dynamic-form-add', this.getDataTagForButton(templateId, 'add'));
            button.click(function () {
                this.createNewRow(parent, element);
            }.bind(this));
        }.bind(this));

        cloned.find('[data-dynamic-form-remove]').each(function (addKey, addValue) {
            let button = $(addValue);
            button.attr('data-dynamic-form-remove', this.getDataTagForButton(templateId, 'remove'));
            button.click(function () {
                cloned.remove();
                DynamicForms.disableTopRemoveButton(parent);
            }.bind(this));
        }.bind(this));

        cloned.show();
        cloned.appendTo(parent);
    }

    getDataTagForButton(templateId, type) {
        return templateId + '-' + type + '-' + this.templates[templateId];
    }

    static disableTopRemoveButton(parent) {
        parent.find('[data-dynamic-form-remove]').first().hide();
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
