'use strict';

var expect = chai.expect;

function createTemplate(fill = undefined) {
    var el = document.createElement('div');
    el.setAttribute('data-dynamic-form', '');

    $(el).html($(`<div data-dynamic-form-template="foo">
            <label>
                <input type="text" name="foo[ID][bar]" data-dynamic-form-input="ID" />
                <button type="button" data-dynamic-form-add>Add</button>
                <button type="button" data-dynamic-form-remove>Remove</button>
            </label>
        </div>`));
    document.body.appendChild(el);

    if (fill !== undefined) {
        $(el).find('[data-dynamic-form-template]').each(function (key, value) {
            $(value).attr('data-dynamic-form-fill', fill);
        });
    }

    return $(el);
}

function cleanupTemplate(el) {
    el.remove();
}

function dynamicForm() {
    var dynamicForm = new DynamicForms();
    dynamicForm.automaticallySetupForm();
}

describe('#dynamic forms', function () {
    it('should convert number to character', function () {
        expect(DynamicForms.numToChar(0)).to.equal('a');
        expect(DynamicForms.numToChar(1)).to.equal('b');
        expect(DynamicForms.numToChar(25)).to.equal('z');
        expect(DynamicForms.numToChar(26)).to.equal('aa');
        expect(DynamicForms.numToChar(702)).to.equal('aaa');
    });

    it('should use template to create new row', function () {
        var template = createTemplate();
        expect($("input[name='foo[a][bar]']").length).to.eq(0);
        var dynamicForms = dynamicForm();
        expect($("input[name='foo[a][bar]']").length).to.eq(1);
        cleanupTemplate(template);
    });

    it('should allow for addition of row', function () {
        var template = createTemplate();
        var dynamicForms = dynamicForm();
        expect($("input[name='foo[a][bar]']").length).to.eq(1);
        expect($("input[name='foo[b][bar]']").length).to.eq(0);
        $("button[data-dynamic-form-add='foo-add-0']")[0].click();
        expect($("input[name='foo[b][bar]']").length).to.eq(1);
        cleanupTemplate(template);
    });

    it('should allow for removal of row', function () {
        var template = createTemplate();
        var dynamicForms = dynamicForm();
        expect($("input[name='foo[a][bar]']").length).to.eq(1);
        expect($("input[name='foo[b][bar]']").length).to.eq(0);
        $("button[data-dynamic-form-add='foo-add-0']")[0].click();
        expect($("input[name='foo[b][bar]']").length).to.eq(1);
        $("button[data-dynamic-form-remove='foo-remove-1']")[0].click();
        expect($("input[name='foo[b][bar]']").length).to.eq(0);
        cleanupTemplate(template);
    });

    it('should allow for fill', function () {
        var template = createTemplate({0: "foo", 1: "bar"});
        var dynamicForms = dynamicForm();
        expect($("input[name='foo[0][bar]']").length).to.eq(1);
        expect($("input[name='foo[1][bar]']").length).to.eq(1);
        expect($("input[name='foo[a][bar]']").length).to.eq(0);
        cleanupTemplate(template);
    });
});
