'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DynamicForms = function () {
    function DynamicForms() {
        _classCallCheck(this, DynamicForms);

        this.dynamic_elements = {};
        this.elements = {};
        this.templates = {};
    }

    _createClass(DynamicForms, [{
        key: 'automaticallySetupForm',
        value: function automaticallySetupForm() {
            $("[data-dynamic-form] [data-dynamic-form-template]").each(function (key, value) {
                var element = $(value);
                var parent = element.parent();
                this.setupForm(parent, element);
            }.bind(this));
        }
    }, {
        key: 'setupForm',
        value: function setupForm(parent, element) {
            element.detach();
            var fillData = element.data('dynamic-form-fill');

            if (fillData === undefined) {
                this.createNewRow(parent, element);
            } else {
                for (var prop in fillData) {
                    if (fillData.hasOwnProperty(prop)) {
                        this.createNewRow(parent, element, prop, fillData[prop]);
                    }
                }
                this.createNewRow(parent, element);
            }

            DynamicForms.disableBottomRemoveButton(parent);
        }
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
            cloned.find("[data-dynamic-form-input]").each(function (inputKey, inputValue) {
                var inputElement = $(inputValue);
                var name = inputElement.attr('name');
                isFirst = this.dynamic_elements[name] === undefined;
                var id = inputElement.data('dynamic-form-input');

                if (value !== undefined) {
                    inputElement.val(value);
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
                }.bind(this));
            }.bind(this));

            cloned.show();
            cloned.appendTo(parent);
        }
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
    }, {
        key: 'getDataTagForButton',
        value: function getDataTagForButton(templateId, type, templateIdNumber) {
            return templateId + '-' + type + '-' + templateIdNumber;
        }
    }, {
        key: 'disableBottomRemoveButton',
        value: function disableBottomRemoveButton(parent) {
            parent.find('[data-dynamic-form-remove]').each(function (key, value) {
                $(value).show();
            });
            parent.find('[data-dynamic-form-remove]').last().hide();
        }
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