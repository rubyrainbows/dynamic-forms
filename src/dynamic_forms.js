'use strict';

class DynamicFormObserver {
    rowWasCreated(element) {
    }

    rowWasRemoved(element) {
    }
}

class DynamicForms {

    constructor() {
        this.dynamic_elements = {};
        this.elements = {};
        this.templates = {};
        this.observers = [];
    }

    /**
     * Adds an observer.
     *
     * The observer should have the following functions:
     * * rowWasCreated
     * * rowWasRemoved
     *
     * @param observer
     */
    addObserver(observer) {
        this.observers.push(observer);
    }

    /**
     * Used to notify the observers that a row was removed.
     *
     * @param element The element that was removed.
     */
    rowWasRemoved(element) {
        for (let i in this.observers) {
            let observer = this.observers[i];
            if (observer.rowWasRemoved !== undefined && typeof observer.rowWasRemoved === 'function') {
                observer.rowWasRemoved(element);
            } else {
                console.log('[-] DynamicForms: observer function missing "rowWasRemoved"');
            }
        }
    }

    /**
     * Used to notify the observers that a row was created.
     *
     * @param element The element that was created.
     */
    rowWasCreated(element) {
        for (let i in this.observers) {
            let observer = this.observers[i];
            if (observer.rowWasCreated !== undefined && typeof observer.rowWasCreated === 'function') {
                observer.rowWasCreated(element);
            } else {
                console.log('[-] DynamicForms: observer function missing "rowWasCreated"');
            }
        }
    }

    /**
     * Automatically sets-up a form, searching the dom for any compatible divs.
     */
    automaticallySetupForm() {
        $("[data-dynamic-form] [data-dynamic-form-template]").each(function (key, value) {
            let element = $(value);
            let parent = element.parent();
            this.setupForm(parent, element);
        }.bind(this));
    }

    /**
     * Sets up a form to be made dynamic.
     *
     * @param parent The parent div.
     * @param element The form div.
     */
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

    /**
     * Creates a new row in the form.
     *
     * @param parent The parent div.
     * @param element The template element.
     * @param index The index of the new element (used for fill).
     * @param value The value of the new element (used for fill).
     */
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
                this.rowWasRemoved(cloned);
            }.bind(this));
        }.bind(this));

        cloned.show();
        cloned.appendTo(parent);
        this.rowWasCreated(cloned);
    }

    /**
     * Makes a hidden field of any removed row, meant to keep track of elements already added to the database.
     *
     * @param parent The parent div.
     * @param templateId The id of the template
     * @param index The index of the element.
     */
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

    /**
     * Generates the data tag string to be used for buttons.
     *
     * @param templateId The template id.
     * @param type The type of button.
     * @param templateIdNumber The index of the element within a template.
     *
     * @returns {string}
     */
    static getDataTagForButton(templateId, type, templateIdNumber) {
        return templateId + '-' + type + '-' + templateIdNumber;
    }

    /**
     * Hides the bottom remove button, to ensure that there is always a row.
     *
     * @param parent
     */
    static disableBottomRemoveButton(parent) {
        parent.find('[data-dynamic-form-remove]').each(function (key, value) {
            $(value).show();
        });
        parent.find('[data-dynamic-form-remove]').last().hide();
    }

    /**
     * Returns an index converted to base 26 letters.
     *
     * Examples:
     * * DynamicForms.numToChar(0) == 'a'
     * * DynamicForms.numToChar(1) == 'b'
     * * DynamicForms.numToChar(25) == 'z'
     * * DynamicForms.numToChar(26) == 'aa'
     * * DynamicForms.numToChar(702) == 'aaaa'
     *
     * @param i The number to convert.
     *
     * @returns {string}
     */
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
window.DynamicFormObserver = DynamicFormObserver;
