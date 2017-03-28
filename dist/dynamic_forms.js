'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DynamicFormObserver = function () {
    function DynamicFormObserver() {
        _classCallCheck(this, DynamicFormObserver);
    }

    _createClass(DynamicFormObserver, [{
        key: 'rowWasCreated',
        value: function rowWasCreated(element) {}
    }, {
        key: 'rowWasRemoved',
        value: function rowWasRemoved(element) {}
    }]);

    return DynamicFormObserver;
}();

var DynamicForms = function () {
    function DynamicForms() {
        _classCallCheck(this, DynamicForms);

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


    _createClass(DynamicForms, [{
        key: 'addObserver',
        value: function addObserver(observer) {
            this.observers.push(observer);
        }

        /**
         * Used to notify the observers that a row was removed.
         *
         * @param element The element that was removed.
         */

    }, {
        key: 'rowWasRemoved',
        value: function rowWasRemoved(element) {
            for (var i in this.observers) {
                var observer = this.observers[i];
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

    }, {
        key: 'rowWasCreated',
        value: function rowWasCreated(element) {
            for (var i in this.observers) {
                var observer = this.observers[i];
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

    }, {
        key: 'automaticallySetupForm',
        value: function automaticallySetupForm() {
            $("[data-dynamic-form] [data-dynamic-form-template]").each(function (key, value) {
                var element = $(value);
                var parent = element.parent();
                this.setupForm(parent, element);
            }.bind(this));
        }

        /**
         * Sets up a form to be made dynamic.
         *
         * @param parent The parent div.
         * @param element The form div.
         */

    }, {
        key: 'setupForm',
        value: function setupForm(parent, element) {
            element.detach();
            var fillData = element.data('dynamic-form-fill');

            if (fillData === undefined) {
                this.createNewRow(parent, element);
            } else if (typeof fillData !== 'string') {
                for (var prop in fillData) {
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

    }, {
        key: 'createNewRow',
        value: function createNewRow(parent, element) {
            var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

            var cloned = element.clone();
            var templateId = element.data('dynamic-form-template');

            if (this.templates[templateId] === undefined) {
                this.templates[templateId] = 0;
            } else {
                this.templates[templateId]++;
            }

            var templateIdNumber = this.templates[templateId];

            cloned.removeAttr('data-dynamic-form-template');
            cloned.removeAttr('data-dynamic-form-fill');

            var isFirst = void 0;
            cloned.find("[data-dynamic-form-input-id-template]").each(function (inputKey, inputValue) {
                var inputElement = $(inputValue);
                var name = inputElement.attr('name');
                isFirst = this.dynamic_elements[name] === undefined;
                var id = inputElement.data('dynamic-form-input-id-template');

                if (value !== undefined) {
                    var dynamicName = inputElement.data('dynamic-form-input-name');
                    if (typeof value === 'string') {
                        inputElement.val(value);
                    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.hasOwnProperty(dynamicName)) {
                        inputElement.val(value[dynamicName]);
                    }
                }

                var inputName = void 0;
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
                var button = $(addValue);
                button.attr('data-dynamic-form-add', DynamicForms.getDataTagForButton(templateId, 'add', templateIdNumber));
                button.click(function () {
                    this.createNewRow(parent, element);
                    DynamicForms.disableBottomRemoveButton(parent);
                }.bind(this));
            }.bind(this));

            cloned.find('[data-dynamic-form-remove]').each(function (addKey, addValue) {
                var button = $(addValue);
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

    }], [{
        key: 'updateRemoveField',
        value: function updateRemoveField(parent, templateId, index) {
            if (!isNaN(parseInt(index)) && isFinite(index)) {
                if (parent.find("input[type='hidden']").length === 0) {
                    parent.prepend('<input type="hidden" name="remove_' + templateId + '" value="' + index + '" />');
                } else {
                    var removeField = $(parent.find("input[type='hidden']")[0]);
                    var value = removeField.val();
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

    }, {
        key: 'getDataTagForButton',
        value: function getDataTagForButton(templateId, type, templateIdNumber) {
            return templateId + '-' + type + '-' + templateIdNumber;
        }

        /**
         * Hides the bottom remove button, to ensure that there is always a row.
         *
         * @param parent
         */

    }, {
        key: 'disableBottomRemoveButton',
        value: function disableBottomRemoveButton(parent) {
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

    }, {
        key: 'numToChar',
        value: function numToChar(i) {
            var letters = 'abcdefghijklmnopqrstuvwxyz';
            var string = '';

            i++;
            while (i > 0) {
                i--;
                var remainder = i % letters.length;

                string = letters[remainder] + string;

                i = (i - remainder) / letters.length;
            }

            return string;
        }
    }]);

    return DynamicForms;
}();

window.DynamicForms = DynamicForms;
window.DynamicFormObserver = DynamicFormObserver;